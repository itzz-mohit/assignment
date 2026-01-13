import fetch from "node-fetch";

const MODEL = "models/gemini-2.5-flash";

const SYSTEM_PROMPT = `
You are a veterinary assistant chatbot.
Answer ONLY generic veterinary-related questions such as:
- pet care
- vaccinations
- diet & nutrition
- common illnesses
- preventive care

Answer in under 30 words.

If the question is not related to veterinary topics,
politely refuse to answer.
`;

export const getAIResponse = async (message) => {
  try {
     const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("GEMINI_API_KEY is missing");
      return "AI service is not configured properly.";
    }

    const GEMINI_URL =
      `https://generativelanguage.googleapis.com/v1/${MODEL}:generateContent?key=${API_KEY}`;

    const res = await fetch(GEMINI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: SYSTEM_PROMPT },
              { text: message },
            ],
          },
        ],
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("GEMINI API ERROR:", data);
      return "Sorry, the AI service is temporarily unavailable.";
    }

    return (
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response."
    );

  } catch (err) {
    console.error("GEMINI FETCH ERROR:", err);
    return "Sorry, something went wrong while generating a response.";
  }
};
