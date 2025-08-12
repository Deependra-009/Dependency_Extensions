// Use global fetch (available in Node.js 18+ and VS Code extensions)
// If you need to support older Node.js versions, uncomment the node-fetch import below
// import fetch from 'node-fetch';

export interface TaskMetadata {
  language: string;
  loc: number;
  file: string;
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  optimistic_hours: number;
  average_hours: number;
  pessimistic_hours: number;
}

export interface TimeEstimate {
  task: string;
  metadata: TaskMetadata;
  subtasks: Subtask[];
  total: {
    optimistic: number;
    average: number;
    pessimistic: number;
  };
}

interface OpenAIResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
    text?: string;
  }>;
}

export async function estimateTask(selection: string, metadata: TaskMetadata, apiKey: string): Promise<TimeEstimate> {
  const prompt = buildPrompt(selection, metadata);

  // Call the AI provider (OpenAI-compatible)
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { 
          role: 'system', 
          content: 'You are a helpful software engineering assistant that answers strictly in valid JSON according to the schema provided. Return only JSON, no extra commentary or markdown formatting.' 
        },
        { 
          role: 'user', 
          content: prompt 
        }
      ],
      temperature: 0.15,
      max_tokens: 1200
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`AI request failed: ${res.status} ${res.statusText} - ${errorText}`);
  }

  const json = await res.json() as OpenAIResponse;
  const text = json.choices?.[0]?.message?.content ?? json.choices?.[0]?.text ?? '';

  const extracted = extractJSON(text);
  if (!extracted) {
    throw new Error('Failed to extract JSON from AI response. Raw response: ' + text.slice(0, 500));
  }

  // Parse and validate the response
  const parsed = JSON.parse(extracted);

  // Basic sanity checks and fill missing totals
  if (!parsed.total || !parsed.subtasks) {
    parsed.total = computeTotals(parsed.subtasks || []);
  }

  // Ensure all required fields are present
  if (!parsed.task) {
    parsed.task = selection.slice(0, 100) + (selection.length > 100 ? '...' : '');
  }

  if (!parsed.metadata) {
    parsed.metadata = metadata;
  }

  return parsed as TimeEstimate;
}

function buildPrompt(selection: string, metadata: TaskMetadata): string {
  return `Please break the following task or code selection into subtasks and estimate the time for each subtask in hours.

Respond ONLY with JSON that follows this exact schema:
{
  "task": "Brief summary of the task",
  "metadata": {
    "language": "Programming language",
    "loc": number,
    "file": "filename"
  },
  "subtasks": [
    {
      "id": "1",
      "title": "Subtask title",
      "description": "Detailed description of what needs to be done",
      "optimistic_hours": 0.25,
      "average_hours": 0.5,
      "pessimistic_hours": 1.0
    }
  ],
  "total": {
    "optimistic": 0.25,
    "average": 0.5,
    "pessimistic": 1.0
  }
}

Selection to estimate:
${selection}

Metadata:
${JSON.stringify(metadata, null, 2)}

Strict rules:
1) Return only valid JSON, no extra commentary, markdown, or text outside the JSON.
2) Each subtask must have id, title, description, optimistic_hours, average_hours, pessimistic_hours.
3) Include a total object with optimistic, average, pessimistic sums.
4) Use realistic time estimates based on the complexity and scope of the work.
5) Break down complex tasks into smaller, manageable subtasks.
6) Consider the programming language and context when estimating.`;
}

function extractJSON(text: string): string | null {
  // Remove any markdown code blocks
  const jsonFence = /```(?:json)?\s*([\s\S]*?)```/i.exec(text);
  let candidate = jsonFence ? jsonFence[1] : text;
  
  // Try to find the first { ... } block if model added text
  const firstBrace = candidate.indexOf('{');
  if (firstBrace >= 0) {
    candidate = candidate.slice(firstBrace);
  }

  // Now try to get balanced braces
  let depth = 0;
  let end = -1;
  for (let i = 0; i < candidate.length; i++) {
    if (candidate[i] === '{') {
      depth++;
    } else if (candidate[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i;
        break;
      }
    }
  }
  
  if (end === -1) {
    return null;
  }
  
  const jsonStr = candidate.slice(0, end + 1);
  try {
    JSON.parse(jsonStr);
    return jsonStr;
  } catch (e) {
    return null;
  }
}

function computeTotals(subtasks: Subtask[]): { optimistic: number; average: number; pessimistic: number } {
  const totals = { optimistic: 0, average: 0, pessimistic: 0 };
  
  for (const subtask of subtasks) {
    totals.optimistic += Number(subtask.optimistic_hours || 0);
    totals.average += Number(subtask.average_hours || 0);
    totals.pessimistic += Number(subtask.pessimistic_hours || 0);
  }
  
  // Round to 2 decimal places
  totals.optimistic = Math.round((totals.optimistic + Number.EPSILON) * 100) / 100;
  totals.average = Math.round((totals.average + Number.EPSILON) * 100) / 100;
  totals.pessimistic = Math.round((totals.pessimistic + Number.EPSILON) * 100) / 100;
  
  return totals;
}
