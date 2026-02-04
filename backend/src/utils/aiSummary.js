const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});



const generateSummary = async (messages) => {
  const conversationText = messages
    .map(m => `${m.senderRole}: ${m.textContent || "Voice message"}`)
    .join("\n");

  const prompt = `
Summarize the following doctor-patient conversation.
Highlight:
- Symptoms
- Diagnosis
- Medications
- Follow-up actions

Conversation:
${conversationText}
`;


  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
  });
  return response.text;
};

module.exports = generateSummary;
