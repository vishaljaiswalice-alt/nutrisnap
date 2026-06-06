export const config = { runtime: 'edge' };

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: CORS });

  let body;
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: CORS });
  }

  const { imageBase64, mediaType = 'image/jpeg' } = body;
  if (!imageBase64) return new Response(JSON.stringify({ error: 'Missing imageBase64' }), { status: 400, headers: CORS });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: CORS });

  const prompt = `You are a nutrition expert. Analyse this food image and respond ONLY with a valid JSON object. No markdown, no backticks, no explanation.

{
  "name": "Specific food name (e.g. 'Masala Dosa with Sambar and Coconut Chutney')",
  "calories": <number>,
  "protein": <grams, 1 decimal>,
  "carbs": <grams, 1 decimal>,
  "fat": <grams, 1 decimal>,
  "fiber": <grams, 1 decimal>,
  "notes": "<1 sentence about portion size assumption>"
}

Be specific and realistic. If multiple foods are visible, estimate the total. Respond ONLY with the JSON object.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        messages: [{ role: 'user', content: [
          { type: 'image', source: { type: 'base64', media_type: mediaType, data: imageBase64 } },
          { type: 'text', text: prompt }
        ]}]
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Anthropic error:', err);
      return new Response(JSON.stringify({ error: 'AI service error' }), { status: 502, headers: CORS });
    }

    const data = await response.json();
    const text = data.content.map(b => b.text || '').join('').trim().replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(text);
    return new Response(JSON.stringify(parsed), { status: 200, headers: CORS });
  } catch (err) {
    console.error('Analyse error:', err);
    return new Response(JSON.stringify({ error: 'Failed to analyse image' }), { status: 500, headers: CORS });
  }
}
