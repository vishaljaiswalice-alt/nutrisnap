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

  const { messages = [], system = '' } = body;
  if (!messages.length) return new Response(JSON.stringify({ error: 'No messages' }), { status: 400, headers: CORS });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return new Response(JSON.stringify({ error: 'API key not configured' }), { status: 500, headers: CORS });

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system,
        messages: messages.slice(-12)
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Coach error:', err);
      return new Response(JSON.stringify({ error: 'AI error' }), { status: 502, headers: CORS });
    }

    const data = await response.json();
    const reply = data.content.map(b => b.text || '').join('').trim();
    return new Response(JSON.stringify({ reply }), { status: 200, headers: CORS });
  } catch (err) {
    console.error('Coach handler error:', err);
    return new Response(JSON.stringify({ error: 'Coach unavailable' }), { status: 500, headers: CORS });
  }
}
