import Anthropic from '@anthropic-ai/sdk';

const SYSTEM_PROMPT = `You are a civic water infrastructure analyst for Hyderabad's water authority.
Analyze the citizen's complaint (text + optional image) and return ONLY a JSON object.
No preamble. No markdown. Just raw JSON.

Return this exact structure:
{
  "category": "PIPE_LEAK | NO_WATER_SUPPLY | DIRTY_WATER | WATER_WASTAGE | OTHER",
  "severity": "LOW | MEDIUM | HIGH | CRITICAL",
  "priority": "ROUTINE | MODERATE | IMMEDIATE | EMERGENCY",
  "summary": "One-sentence clear summary of the issue for authorities",
  "suggestedDepartment": "Water Board | HMWSSB | GHMC | Municipal Engineering",
  "confidence": 0.01.0,
  "keyFactors": ["factor1", "factor2"]
}

Severity guide:
- CRITICAL: Major burst mains, raw sewage mixing, complete colony outage
- HIGH: Continuous leak, dirty supply affecting many houses
- MEDIUM: Partial supply, isolated quality issue
- LOW: Minor drip, single household complaint`;

function stripJsonFences(rawText) {
  return rawText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
}

function heuristicAnalysis({ issueType, description }) {
  const text = `${issueType} ${description}`.toLowerCase();

  if (text.includes('no water') || text.includes('outage')) {
    return {
      category: 'NO_WATER_SUPPLY',
      severity: 'HIGH',
      priority: 'IMMEDIATE',
      summary: 'Citizen reports a disruption in water supply that may affect multiple households.',
      suggestedDepartment: 'HMWSSB',
      confidence: 0.62,
      keyFactors: ['water outage keywords', 'supply disruption description']
    };
  }

  if (text.includes('dirty') || text.includes('brown')) {
    return {
      category: 'DIRTY_WATER',
      severity: 'HIGH',
      priority: 'IMMEDIATE',
      summary: 'Citizen reports visible water quality contamination requiring inspection.',
      suggestedDepartment: 'Water Board',
      confidence: 0.66,
      keyFactors: ['water quality keywords', 'health risk indicators']
    };
  }

  return {
    category: issueType,
    severity: 'MEDIUM',
    priority: 'MODERATE',
    summary: 'Citizen submitted a water infrastructure issue that should be reviewed by the authority.',
    suggestedDepartment: 'Municipal Engineering',
    confidence: 0.51,
    keyFactors: ['reported issue type', 'citizen description']
  };
}

export async function analyzeComplaint({ issueType, description, imageBase64 }) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return heuristicAnalysis({ issueType, description });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const content = [{ type: 'text', text: `Issue type: ${issueType}\nDescription: ${description}` }];

  if (imageBase64) {
    const [prefix, data] = imageBase64.split(',');
    const mediaType = prefix.match(/data:(.*);base64/)?.[1] || 'image/jpeg';
    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: mediaType,
        data
      }
    });
  }

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content }]
    });

    const rawText = response.content.find((item) => item.type === 'text')?.text ?? '{}';
    return JSON.parse(stripJsonFences(rawText));
  } catch {
    return {
      ...heuristicAnalysis({ issueType, description }),
      aiStatus: 'PENDING_ANALYSIS'
    };
  }
}
