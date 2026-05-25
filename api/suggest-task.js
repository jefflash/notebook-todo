module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { tasks, today } = req.body || {};
  if (!tasks || !tasks.length) return res.status(400).json({ error: 'No tasks provided' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API key not configured' });

  const taskList = tasks.map(t => {
    const stars = t.priority === 3 ? '★★★' : t.priority === 2 ? '★★' : t.priority === 1 ? '★' : '';
    const parts = [stars, t.dueLabel].filter(Boolean).join(', ');
    let line = `- [${parts || 'no priority or date'}] ${t.text}`;
    if (t.notes) line += ` (${t.notes})`;
    return line;
  }).join('\n');

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
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: `You are a calm, direct productivity coach. The user is overwhelmed and doesn't know where to begin. Today is ${today}.

Their tasks:
${taskList}

Pick the single most important task to start with right now. Weigh: overdue items, today's due dates, priority stars, and quick wins that clear mental space.

Respond with ONLY valid JSON — no extra text:
{"task": "exact task text from the list above", "reason": "2-3 direct, human sentences explaining why this task right now"}`,
        }],
      }),
    });

    if (!response.ok) return res.status(500).json({ error: 'Claude API error' });

    const data = await response.json();
    const text = data.content[0].text.trim().replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
    const parsed = JSON.parse(text);

    res.json({ task: parsed.task || '', reason: parsed.reason || '' });
  } catch (e) {
    console.error('suggest-task error:', e);
    res.status(500).json({ error: 'Failed to get suggestion' });
  }
};
