import puppeteer from 'puppeteer-core'

import type { CVData, TemplateType, Typography } from '@/lib/types'

export const runtime = 'nodejs'
// Cold-starting Chromium plus rendering can run past the default 10s.
export const maxDuration = 60

interface ExportRequestBody {
  cvData: CVData
  template: TemplateType
  typography: Typography
}

/**
 * Generates a real, vector PDF — selectable text, working hyperlinks — by
 * driving a headless Chromium against /print (see that page for why the CV
 * has to be rendered there rather than in this route directly) and calling
 * page.pdf() against it.
 *
 * This replaced two prior approaches, in order:
 *  1. `window.print()` in the visitor's own browser. Worked on desktop, but
 *     Android hands printing off to the OS's own print service rather than
 *     rendering it itself, and that service did not reliably apply this
 *     page's CSS — it ignored the declared A4 size and exported a blank PDF.
 *  2. Rasterizing the preview to a canvas client-side and assembling that
 *     into a PDF image-by-image. That sidestepped the OS print service, but
 *     produces a PDF with no real text or clickable links — just a picture
 *     of the CV, which breaks both ATS parsing and every href on the page.
 * Rendering with a real, controlled browser on the server avoids both: one
 * engine, not each visitor's, and genuine HTML output, not a screenshot.
 */
export async function POST(request: Request) {
  let body: ExportRequestBody
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body?.cvData || !body.template) {
    return Response.json({ error: 'Missing cvData or template' }, { status: 400 })
  }

  const payload = Buffer.from(
    JSON.stringify({ cvData: body.cvData, template: body.template, typography: body.typography }),
    'utf-8',
  ).toString('base64url')

  const printUrl = new URL(`/print?data=${payload}`, request.url)

  const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_VERSION
  const { executablePath, args, headless } = await resolveChromium(isServerless)

  const browser = await puppeteer.launch({
    executablePath,
    args,
    headless,
  })

  try {
    const page = await browser.newPage()
    await page.goto(printUrl.toString(), { waitUntil: 'networkidle0' })
    await page.emulateMediaType('print')

    const pdfBuffer = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
    })

    const name = body.cvData.personalInfo?.fullName?.trim() || 'CV'
    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${name.replace(/[^\w\- ]+/g, '')}.pdf"`,
      },
    })
  } catch (error) {
    console.error('[export-pdf]', error)
    return Response.json({ error: 'Failed to generate PDF' }, { status: 500 })
  } finally {
    await browser.close()
  }
}

/**
 * Production (Vercel/Lambda) needs @sparticuz/chromium's trimmed, serverless-
 * compatible binary — the full `puppeteer` package's bundled Chromium is far
 * too large to ship in a serverless function. Locally, the reverse: that
 * trimmed binary is a Linux/Lambda build and does not run on a dev machine,
 * so local dev uses full `puppeteer`'s own bundled browser instead. The
 * dynamic import keeps `puppeteer` (a devDependency) out of the production
 * bundle — it's only ever reached when `isServerless` is false.
 *
 * @sparticuz/chromium's binary is specifically a `headless_shell` build (see
 * its README) — it does not support Puppeteer's "new" headless mode, which
 * `headless: true` requests on recent Puppeteer versions. `headless: 'shell'`
 * plus `puppeteer.defaultArgs` merging in chromium.args is that package's own
 * documented usage. The full local `puppeteer` build has no such constraint.
 */
async function resolveChromium(isServerless: boolean) {
  if (isServerless) {
    const chromium = (await import('@sparticuz/chromium')).default
    return {
      executablePath: await chromium.executablePath(),
      args: await puppeteer.defaultArgs({ args: chromium.args, headless: 'shell' }),
      headless: 'shell' as const,
    }
  }
  const puppeteerFull = await import('puppeteer')
  return {
    executablePath: await puppeteerFull.default.executablePath(),
    args: [] as string[],
    headless: true as const,
  }
}
