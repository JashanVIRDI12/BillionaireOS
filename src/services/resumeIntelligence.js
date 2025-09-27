// AI Resume Analysis Service using OpenRouter, mirroring the profession intelligence pattern
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'mistralai/mistral-small-3.2-24b-instruct:free';

const callOpenRouter = async (prompt, maxTokens = 1600) => {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://billionaire-os.netlify.app',
      'X-Title': 'Billionaire OS Resume Intelligence'
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: maxTokens
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter error: ${response.status} ${text}`);
  }
  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

export const analyzeResume = async (resumeText, jobDescription = '', locationContext = '') => {
  try {
    const loc = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are an expert resume analyst, ATS optimizer, and career coach. ${loc}
Analyze the following resume and (optionally) a target job description. Provide actionable, concise improvements and ATS insights.

RESUME:
"""
${resumeText}
"""

JOB DESCRIPTION (optional):
"""
${jobDescription}
"""

Return JSON only in this exact structure:
{
  "summary": "1-2 paragraph overview of the candidate",
  "ats": {
    "readability": "A-F grade or % score",
    "keywordCoverage": "% coverage vs job description (or N/A)",
    "jobMatch": "% match vs job description (or N/A)"
  },
  "strengths": ["bullet"],
  "gaps": ["bullet"],
  "improvements": ["bullet"],
  "rewrittenBullets": ["Improved bullet statements focusing on outcomes"]
}

Keep content professional, clear, and tailored to the input context.`;

    const raw = await callOpenRouter(prompt, 1600);
    let jsonString = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = jsonString.match(/\{[\s\S]*\}/);
    if (match) {
      return { success: true, analysis: JSON.parse(match[0]) };
    }

    // Fallback minimal structure
    return {
      success: true,
      analysis: {
        summary: 'Analysis in progress. We could not parse a full response.',
        ats: { readability: 'N/A', keywordCoverage: 'N/A', jobMatch: 'N/A' },
        strengths: [],
        gaps: [],
        improvements: [],
        rewrittenBullets: []
      }
    };
  } catch (err) {
    console.error('Resume analysis error:', err);
    return { success: false, error: err.message };
  }
};
