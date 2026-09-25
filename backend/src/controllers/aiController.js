
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
  timeout: 30000
});

export const generateDescription = async (req, res) => {
  try {
    const { title, category, condition, price } = req.body;

    if (!title || !category || !condition) {
      return res.status(400).json({
        message: "Title, category and condition are required"
      });
    }

    const prompt = `
      You are an AI assistant for Campus Cart,
      a second-hand marketplace for college students.

      Generate an attractive, accurate product description
      using the following information:

      Product: ${title}
      Category: ${category}
      Condition: ${condition}
      Price: ${price || "Not specified"}

      Requirements:
      - Write 3 to 4 sentences.
      - Use simple English.
      - Make the description suitable for college students.
      - Do not invent specifications or features.
      - Return only the product description.
    `;


const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [
    {
      role: "system",
      content:
        "You write short, attractive product descriptions " +
        "for a student marketplace. Return plain text only."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  temperature: 0.5
});

const description =
  response.choices[0]?.message?.content?.trim();

if (!description) {
  throw new Error("Groq returned an empty description.");
}

return res.status(200).json({
  description: description
});

  } catch (error) {
    console.error("Gemini API error:", error);

    res.status(500).json({
      message: "Failed to generate AI description"
    });
  }
};



export const suggestPrice = async (req, res) => {
  try {
    const { title, category, condition, description } = req.body;

    if (!title || !category || !condition) {
      return res.status(400).json({
        message: "Title, category and condition are required"
      });
    }

    const prompt = `
You are a second-hand product pricing assistant
for an Indian college marketplace.

Product: ${title}
Category: ${category}
Condition: ${condition}
Description: ${description || "Not provided"}

Suggest an estimated resale price in Indian rupees.

Return ONLY valid JSON in this format:
{
  "minPrice": 1000,
  "maxPrice": 1500,
  "reason": "Short explanation"
}

Do not invent specific product specifications.
If information is insufficient, explain the uncertainty.
`;

    

const response = await groq.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [
    {
      role: "system",
      content:
        "You estimate second-hand product prices in Indian rupees. " +
        "Return only valid JSON with minPrice, maxPrice and reason."
    },
    {
      role: "user",
      content: prompt
    }
  ],
  response_format: {
    type: "json_object"
  },
  reasoning_effort: "low",
  reasoning_format: "hidden"
});

const result = JSON.parse(
  response.choices[0].message.content
);

return res.json({
  minPrice: result.minPrice,
  maxPrice: result.maxPrice,
  reason: result.reason
});
}
 catch (error) {
    console.error("Price suggestion error:", error);

    res.status(500).json({
      message: "Failed to suggest price"
    });
  }
};