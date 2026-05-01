export async function POST(req) {
  try {
    const { title } = await req.json();

    if (!title) {
      return Response.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini", // ✅ fast & cheap
        messages: [
          {
            role: "user",
            content: `Break this task into 5 simple actionable steps in bullet points:\n${title}`,
          },
        ],
      }),
    });

    const data = await response.json();

    console.log("AI RESPONSE:", data); // debug

    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      return Response.json(
        { error: "No AI response", full: data },
        { status: 500 }
      );
    }

    return Response.json({ result: text });

  } catch (error) {
    console.error("ERROR:", error);
    return Response.json({ error: "AI failed" }, { status: 500 });
  }
}