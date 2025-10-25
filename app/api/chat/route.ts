import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json()

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
        temperature: 0.7,
        max_tokens: 150,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("OpenRouter error:", error)
      return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices[0].message.content

    return NextResponse.json({ content })
  } catch (error) {
    console.error("Chat error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
