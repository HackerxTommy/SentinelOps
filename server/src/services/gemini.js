const { GoogleGenerativeAI } = require('@google/generative-ai');

let genAI = null;

function getClient() {
  if (!genAI) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) throw new Error('GEMINI_API_KEY not configured');
    genAI = new GoogleGenerativeAI(key);
  }
  return genAI;
}

async function generateContent(prompt, model = 'gemini-2.5-flash') {
  try {
    const client = getClient();
    const genModel = client.getGenerativeModel({ model });
    const result = await genModel.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error('Gemini API error:', err.message);
    throw err;
  }
}

module.exports = { generateContent };
