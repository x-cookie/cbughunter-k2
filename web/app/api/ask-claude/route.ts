import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const { question, context } = await req.json() as { question: string; context: string };

  if (!question?.trim()) {
    return Response.json({ error: "Question is required" }, { status: 400 });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "API key not configured" }, { status: 500 });
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type":  "application/json",
      "Authorization": `Bearer ${apiKey}`,
      "HTTP-Referer":  "https://cbug.vercel.app",
      "X-Title":       "cbug — Claude Bug Hunter Skills",
    },
    body: JSON.stringify({
      model: "anthropic/claude-haiku-4-5",
      max_tokens: 320,
      messages: [
        {
          role: "system",
          content:
            `You are a concise expert assistant for cbug — a library of Claude AI skills built for bug bounty and security research. ` +
            `Answer clearly and briefly (under 200 words). Skip pleasantries. If the question is off-topic, redirect politely. ` +
            `Skill context: ${context}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    return Response.json({ error: `OpenRouter error: ${res.status} — ${err}` }, { status: 502 });
  }

  const data = await res.json() as {
    choices?: { message?: { content?: string } }[];
  };
  const answer = data.choices?.[0]?.message?.content?.trim() ?? "No response.";

  return Response.json({ answer });
}
