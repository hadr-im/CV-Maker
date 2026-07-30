import { toCanvas } from 'html-to-image'
import { jsPDF } from 'jspdf'

const A4_WIDTH_MM = 210
const A4_HEIGHT_MM = 297

/**
 * Rasterizes `element` and assembles it into a real, multi-page A4 PDF —
 * entirely in JavaScript, without ever calling `window.print()`.
 *
 * The previous implementation relied on the browser's native print pipeline
 * (`window.print()` + `@media print` CSS). That works on desktop, but Android
 * Chrome hands printing off to the OS's own print service rather than
 * rendering it itself, and that pipeline does not reliably apply page CSS —
 * it ignored the `@page` size and produced a blank PDF. Rendering the page to
 * a canvas ourselves and paginating it manually sidesteps that pipeline
 * altogether, so the output is identical on every device.
 */
export async function exportElementToPdf(element: HTMLElement, filename: string) {
  // Mirrors what the old `@media print` block did to this element — flat
  // corners, no drop shadow, exact print margins — but toggled by a class
  // instead of an actual print context, since there no longer is one.
  element.classList.add('pdf-exporting')
  // One frame so the class's style changes are committed before capture.
  await new Promise((resolve) => requestAnimationFrame(resolve))

  try {
    const canvas = await toCanvas(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })

    const pageHeightPx = (canvas.width * A4_HEIGHT_MM) / A4_WIDTH_MM
    const pageCount = Math.max(1, Math.ceil(canvas.height / pageHeightPx))

    const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' })
    const sliceCanvas = document.createElement('canvas')
    sliceCanvas.width = canvas.width
    const sliceCtx = sliceCanvas.getContext('2d')

    for (let page = 0; page < pageCount; page += 1) {
      if (page > 0) pdf.addPage()

      const sourceY = page * pageHeightPx
      const sliceHeightPx = Math.min(pageHeightPx, canvas.height - sourceY)
      sliceCanvas.height = sliceHeightPx

      if (sliceCtx) {
        sliceCtx.fillStyle = '#ffffff'
        sliceCtx.fillRect(0, 0, sliceCanvas.width, sliceHeightPx)
        sliceCtx.drawImage(
          canvas,
          0,
          sourceY,
          canvas.width,
          sliceHeightPx,
          0,
          0,
          canvas.width,
          sliceHeightPx,
        )
      }

      const sliceHeightMm = (sliceHeightPx * A4_WIDTH_MM) / canvas.width
      pdf.addImage(sliceCanvas.toDataURL('image/png'), 'PNG', 0, 0, A4_WIDTH_MM, sliceHeightMm)
    }

    pdf.save(filename)
  } finally {
    element.classList.remove('pdf-exporting')
  }
}
