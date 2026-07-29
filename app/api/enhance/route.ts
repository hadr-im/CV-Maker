import { generateText } from 'ai'
import { groq } from '@ai-sdk/groq'

export async function POST(request: Request) {
  try {
    const { title, company, description } = await request.json()

    if (!description || !title || !company) {
      return Response.json(
        { error: 'Missing required fields: title, company, description' },
        { status: 400 }
      )
    }

    if (!process.env.GROQ_API_KEY) {
      return Response.json(
        { error: 'AI enhancement is not configured yet — GROQ_API_KEY is missing on the server.' },
        { status: 503 }
      )
    }

    const systemPrompt = `You are an expert resume/CV writer with experience across all industries — technology, marketing, finance, design, sales, operations, and more. You transform a person's raw, informal notes about their work into concise, professional CV bullet points, in whatever field they describe. You never invent facts, numbers, tools, or outcomes that are not present or clearly implied in the person's notes. Follow the user's formatting instructions exactly. Return only what is asked for — no preamble, no explanation, no closing remarks.

Rewrite the following raw notes into exactly 3 concise, professional CV bullet points.

Context:
- Title: ${title}
- Organization: ${company}
- Raw notes (in the person's own words): ${description}

Rules:
- Each bullet starts with a strong, varied action verb appropriate to the actual work described — do not default to technical verbs if the work isn't technical (e.g., use verbs like "Led," "Negotiated," "Analyzed," "Designed," "Coordinated," "Increased," "Streamlined" as fits the content).
- Each bullet is one line, maximum 20 words.
- Use past tense.
- Only include tools, numbers, or results that are explicitly stated or directly implied in the raw notes — never fabricate metrics or outcomes.
- If the raw notes are too short or vague to produce 3 distinct, meaningful bullets, produce fewer rather than pad with invented content — but never fewer than 1.
- Match the language of the raw notes (respond in the same language the person wrote in).
- Each bullet starts with "• ".
- Return ONLY the bullet points, nothing else — no preamble, no headers, no explanation.`

    const { text } = await generateText({
      model: groq('llama-3.3-70b-versatile'),
      system: systemPrompt,
      prompt: `Generate professional CV bullet points for this job experience.`,
      temperature: 0.7,
      maxOutputTokens: 300,
    })

    // Parse the response to extract bullet points
    const bullets = text
      .split('\n')
      .filter((line) => line.trim().startsWith('•'))
      .map((line) => line.trim())

    return Response.json({ bullets: bullets.length > 0 ? bullets : [text.trim()] })
  } catch (error) {
    console.error('[v0] Error in enhance API:', error)
    return Response.json(
      { error: 'Failed to generate bullets' },
      { status: 500 }
    )
  }
}
