const OPENROUTER_BASE = 'https://openrouter.ai/api/v1/chat/completions';

async function chat(messages, model = 'google/gemini-2.5-flash') {
  try {
    const key = process.env.OPENROUTER_API_KEY;
    if (!key) throw new Error('OPENROUTER_API_KEY not configured');

    const response = await fetch(OPENROUTER_BASE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': process.env.CLIENT_URL || 'http://localhost:5173',
        'X-Title': 'SentinelOps Security Platform',
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'OpenRouter API error');
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || '';
  } catch (err) {
    console.error('OpenRouter API error:', err.message);
    throw err;
  }
}

module.exports = { chat };
