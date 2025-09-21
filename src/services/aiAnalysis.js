// AI Analysis Service using OpenRouter API with DeepSeek model
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY || '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';
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat-v3.1:free';

export const analyzeJournalEntry = async (entry) => {
  try {
    const prompt = `
You are an expert life coach and productivity analyst. Analyze this journal entry and provide insights in the following format:

**Journal Entry:**
- What I did: ${entry.whatDidIDo}
- Progress toward goal: ${entry.didIMoveCloser || 'Not specified'}
- Lessons learned: ${entry.lessonsLearned || 'Not specified'}
- Mood: ${entry.mood}/10
- Energy: ${entry.energy}/10
- Date: ${entry.date}

Please provide a comprehensive analysis in this exact JSON format:
{
  "strengths": ["List 2-3 specific things they did well today"],
  "improvements": ["List 2-3 specific areas for improvement"],
  "insights": ["List 2-3 key insights or patterns you notice"],
  "recommendations": ["List 2-3 actionable recommendations for tomorrow"],
  "moodEnergyAnalysis": "Brief analysis of their mood and energy levels",
  "overallScore": "A score from 1-10 rating their day",
  "motivationalMessage": "A brief, inspiring message to encourage them"
}

Be specific, actionable, and encouraging. Focus on productivity, goal achievement, and personal growth.`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://billionaire-os.netlify.app',
        'X-Title': 'Billionaire OS Journal Analysis'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    // Try to parse JSON from the response
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          analysis
        };
      } else {
        // Fallback if JSON parsing fails
        return {
          success: true,
          analysis: {
            strengths: ["You took time to reflect on your day"],
            improvements: ["Consider being more specific about your achievements"],
            insights: ["Regular journaling shows commitment to growth"],
            recommendations: ["Set specific goals for tomorrow", "Track your progress more measurably"],
            moodEnergyAnalysis: `Your mood (${entry.mood}/10) and energy (${entry.energy}/10) levels provide valuable insight into your daily patterns.`,
            overallScore: "7",
            motivationalMessage: "Every day is a step forward in your journey. Keep reflecting and growing!"
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      return {
        success: false,
        error: 'Failed to parse AI analysis'
      };
    }

  } catch (error) {
    console.error('AI Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const analyzeDailyTrends = async (recentEntries) => {
  if (!recentEntries || recentEntries.length === 0) {
    return {
      success: false,
      error: 'No entries to analyze'
    };
  }

  try {
    const entriesText = recentEntries.slice(0, 7).map(entry => 
      `Date: ${entry.date}, Mood: ${entry.mood}/10, Energy: ${entry.energy}/10, Activities: ${entry.whatDidIDo}`
    ).join('\n');

    const prompt = `
Analyze these recent journal entries for patterns and trends:

${entriesText}

Provide analysis in this JSON format:
{
  "trends": {
    "mood": "Description of mood patterns over time",
    "energy": "Description of energy patterns over time",
    "productivity": "Analysis of productivity trends"
  },
  "patterns": ["List key behavioral patterns you notice"],
  "weeklyInsights": ["List insights about their week"],
  "recommendations": ["List specific recommendations based on trends"]
}`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://billionaire-os.netlify.app',
        'X-Title': 'Billionaire OS Trend Analysis'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return {
          success: true,
          analysis
        };
      }
    } catch (parseError) {
      console.error('Error parsing trend analysis:', parseError);
    }

    return {
      success: false,
      error: 'Failed to parse trend analysis'
    };

  } catch (error) {
    console.error('Trend Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
