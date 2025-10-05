// AI Habit Intelligence Service using OpenRouter
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat-v3.1:free';

const callOpenRouter = async (prompt, maxTokens = 1200) => {
  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://billionaire-os.netlify.app',
      'X-Title': 'Billionaire OS Habit Intelligence'
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

export const generateHabitsForGoal = async (goal, locationContext = '') => {
  try {
    const loc = locationContext ? `Context: User is located in ${locationContext}. ` : '';
    const prompt = `
You are an expert habit coach and behavioral scientist. ${loc}
A user wants to achieve this goal: "${goal}"

Generate 5-7 specific, actionable daily habits that will help them achieve this goal. Each habit should be:
- Specific and measurable
- Achievable for a beginner
- Takes 5-30 minutes per day
- Directly contributes to the goal
- Can be tracked as done/not done

Return JSON only in this exact structure:
{
  "goal": "${goal}",
  "habits": [
    {
      "name": "Specific habit name (under 50 characters)",
      "description": "Brief explanation of why this habit helps achieve the goal",
      "timeEstimate": "5-15 minutes",
      "difficulty": "Easy/Medium/Hard",
      "category": "Health/Learning/Productivity/Finance/Mindset"
    }
  ],
  "tips": [
    "Practical tip for building these habits successfully"
  ]
}

Focus on habits that are:
- Concrete and specific (not vague like "exercise more")
- Easy to start (build momentum)
- Stackable (can be done together)
- Measurable (clear success criteria)

Goal: ${goal}`;

    const raw = await callOpenRouter(prompt, 1200);
    let jsonString = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = jsonString.match(/\{[\s\S]*\}/);
    
    if (match) {
      const parsed = JSON.parse(match[0]);
      return { 
        success: true, 
        habits: parsed.habits || [],
        tips: parsed.tips || [],
        goal: parsed.goal || goal
      };
    }

    // Fallback if parsing fails
    return {
      success: true,
      habits: [
        {
          name: "Daily goal review",
          description: "Spend 5 minutes reviewing progress toward your goal",
          timeEstimate: "5 minutes",
          difficulty: "Easy",
          category: "Mindset"
        }
      ],
      tips: ["Start small and be consistent. Track your progress daily."],
      goal: goal
    };
  } catch (err) {
    console.error('Habit generation error:', err);
    return { 
      success: false, 
      error: err.message || 'Failed to generate habits. Please try again.' 
    };
  }
};

export const analyzeExistingHabits = async (habits, goal, locationContext = '') => {
  try {
    const loc = locationContext ? `Context: User is located in ${locationContext}. ` : '';
    const habitList = habits.map(h => h.name).join(', ');
    
    const prompt = `
You are an expert habit coach. ${loc}
User's goal: "${goal}"
Current habits: ${habitList}

Analyze their existing habits and provide insights:

Return JSON only:
{
  "analysis": {
    "alignedHabits": ["habits that support the goal"],
    "missingHabits": ["key habits they should add"],
    "improvements": ["suggestions to optimize current habits"]
  },
  "recommendations": [
    {
      "name": "Specific new habit to add",
      "reason": "Why this habit is crucial for their goal",
      "priority": "High/Medium/Low"
    }
  ]
}`;

    const raw = await callOpenRouter(prompt, 800);
    let jsonString = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    const match = jsonString.match(/\{[\s\S]*\}/);
    
    if (match) {
      return { success: true, analysis: JSON.parse(match[0]) };
    }

    return { success: false, error: 'Could not analyze habits' };
  } catch (err) {
    console.error('Habit analysis error:', err);
    return { success: false, error: err.message };
  }
};
