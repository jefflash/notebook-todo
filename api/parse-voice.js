module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { transcript, today } = req.body || {};
  if (!transcript) return res.status(400).json({ error: 'No transcript provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const todayStr = today || new Date().toISOString().split('T')[0];

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 256,
        messages: [{
          role: 'user',
          content: `Today is ${todayStr}. Extract task details from this voice input and return ONLY valid JSON.

Voice input: "${transcript}"

Return a JSON object with exactly these fields:
- "task": the main task description (string, required)
- "notes": additional context or details (string, empty string if none)
- "dueDate": due date as YYYY-MM-DD (string or null). Resolve relative dates like "tomorrow", "next Friday" relative to today.
- "priority": 0=none, 1=low, 2=medium, 3=high. Words like "urgent"/"critical"=3, "important"/"soon"=2, "low priority"=1.

Return only the JSON object, nothing else.`,
        }],
      }),
    });

    if (!response.ok) return res.status(500).json({ error: 'Claude API error' });

    const data = await response.json();
    const text = data.content[0].text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(text);

    res.json({
      task: parsed.task || '',
      notes: parsed.notes || '',
      dueDate: parsed.dueDate || null,
      priority: typeof parsed.priority === 'number' ? Math.max(0, Math.min(3, parsed.priority)) : 0,
    });
  } catch (e) {
    console.error('parse-voice error:', e);
    res.status(500).json({ error: 'Failed to process voice input' });
  }
};
