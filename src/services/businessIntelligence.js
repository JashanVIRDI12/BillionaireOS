// AI Analysis Service using OpenRouter API with DeepSeek model
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY ;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat-v3.1:free';

// Helper function to make API calls with better error handling
const makeOpenRouterCall = async (prompt, maxTokens = 1500) => {
  try {
    console.log('Making OpenRouter API call with prompt length:', prompt.length);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://billionaire-os.netlify.app',
        'X-Title': 'Billionaire OS Business Intelligence'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    console.log('OpenRouter API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error response:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenRouter API response data:', data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response structure from OpenRouter API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
};

// Market Trend Analysis
export const analyzeMarketTrends = async (industry, timeframe = '2024-2025', locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `${locationPrompt}Analyze the ${industry} industry for ${timeframe}. Respond with valid JSON only:

{
  "industry": "${industry}",
  "marketSize": "Market size and growth rate for ${industry}",
  "keyTrends": [
    "Major trend 1 in ${industry}",
    "Major trend 2 in ${industry}",
    "Major trend 3 in ${industry}",
    "Major trend 4 in ${industry}",
    "Major trend 5 in ${industry}"
  ],
  "opportunities": [
    "Business opportunity 1 in ${industry}",
    "Business opportunity 2 in ${industry}",
    "Business opportunity 3 in ${industry}",
    "Business opportunity 4 in ${industry}"
  ],
  "threats": [
    "Threat 1 to ${industry}",
    "Threat 2 to ${industry}",
    "Threat 3 to ${industry}"
  ],
  "growthDrivers": [
    "Growth driver 1",
    "Growth driver 2",
    "Growth driver 3"
  ],
  "targetCustomers": [
    "Customer segment 1",
    "Customer segment 2",
    "Customer segment 3"
  ],
  "investmentHotspots": [
    "Investment area 1",
    "Investment area 2",
    "Investment area 3"
  ],
  "timeToMarket": "Time estimate to enter ${industry}",
  "capitalRequirement": "Capital needed for ${industry}",
  "successFactors": [
    "Success factor 1",
    "Success factor 2",
    "Success factor 3"
  ]
}`;

    const aiResponse = await makeOpenRouterCall(prompt, 1500);
    
    try {
      // Try to find JSON in the response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return { success: true, analysis };
      } else {
        // If no JSON found, create a structured response from the text
        console.log('No JSON found, creating fallback response from:', aiResponse);
        return {
          success: true,
          analysis: {
            industry: industry,
            marketSize: "Market analysis provided by AI",
            keyTrends: aiResponse.split('\n').filter(line => line.trim().length > 0).slice(0, 5),
            opportunities: ["AI-generated market opportunities based on current trends"],
            threats: ["Market challenges identified by AI analysis"],
            growthDrivers: ["Key growth factors in the industry"],
            targetCustomers: ["Primary customer segments"],
            investmentHotspots: ["Areas of high investment activity"],
            timeToMarket: "3-6 months typical",
            capitalRequirement: "Varies by business model",
            successFactors: ["Market timing", "Product-market fit", "Strong execution"]
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing market analysis:', parseError);
      console.log('Raw AI response:', aiResponse);
      
      // Provide a meaningful fallback response
      return {
        success: true,
        analysis: {
          industry: industry,
          marketSize: "Analysis in progress - please try again",
          keyTrends: [
            "Digital transformation accelerating across industries",
            "AI and automation becoming mainstream",
            "Remote work changing business models",
            "Sustainability becoming a key differentiator",
            "Consumer behavior shifting towards digital-first experiences"
          ],
          opportunities: [
            "Underserved niche markets in " + industry,
            "Technology gaps that need solutions",
            "Emerging customer needs post-pandemic",
            "Automation opportunities for traditional processes"
          ],
          threats: [
            "Increased competition from new entrants",
            "Regulatory changes affecting the industry",
            "Economic uncertainty impacting spending"
          ],
          growthDrivers: [
            "Technology adoption",
            "Changing consumer preferences",
            "Market consolidation opportunities"
          ],
          targetCustomers: [
            "Early adopters seeking innovation",
            "Businesses looking for efficiency gains",
            "Consumers demanding better experiences"
          ],
          investmentHotspots: [
            "AI and machine learning applications",
            "Sustainable business solutions",
            "Digital transformation tools"
          ],
          timeToMarket: "3-12 months depending on complexity",
          capitalRequirement: "$10K - $100K+ depending on business model",
          successFactors: [
            "Strong market research and validation",
            "Experienced team with domain expertise",
            "Sufficient capital for growth",
            "Clear value proposition and differentiation"
          ]
        }
      };
    }

  } catch (error) {
    console.error('Market Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Competitor Research and Gap Analysis
export const analyzeCompetitors = async (businessIdea, targetMarket, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a competitive intelligence expert. ${locationPrompt}Analyze the competitive landscape for this business idea: "${businessIdea}" targeting "${targetMarket}".

Provide analysis in this exact JSON format:
{
  "businessIdea": "${businessIdea}",
  "targetMarket": "${targetMarket}",
  "directCompetitors": [
    {
      "name": "Competitor name",
      "description": "What they do",
      "strengths": ["Key strengths"],
      "weaknesses": ["Key weaknesses"],
      "marketShare": "Estimated market share",
      "funding": "Funding status/amount if known"
    }
  ],
  "indirectCompetitors": [
    {
      "name": "Alternative solution provider",
      "description": "How they solve similar problems",
      "threat": "Level of threat (High/Medium/Low)"
    }
  ],
  "marketGaps": [
    "Specific unmet needs in the market",
    "Underserved customer segments",
    "Technology or service gaps"
  ],
  "competitiveAdvantages": [
    "Potential advantages your idea could have",
    "Unique value propositions to consider"
  ],
  "barrierToEntry": {
    "level": "High/Medium/Low",
    "factors": ["Key barriers new entrants face"]
  },
  "marketPosition": "Recommended positioning strategy",
  "differentiationOpportunities": [
    "Ways to differentiate from existing players"
  ],
  "competitiveRisks": [
    "Risks from established competitors"
  ]
}

Focus on actionable insights and specific opportunities for differentiation.`;

    const aiResponse = await makeOpenRouterCall(prompt, 1500);
    
    try {
      // Try to find JSON in the response
      let jsonString = aiResponse;
      
      // Remove any markdown code blocks
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find the JSON object
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cleanJson = jsonMatch[0];
        const analysis = JSON.parse(cleanJson);
        return { success: true, analysis };
      } else {
        // Fallback response for competitor analysis
        return {
          success: true,
          analysis: {
            businessIdea: businessIdea,
            targetMarket: targetMarket,
            directCompetitors: [
              {
                name: "Market Leader",
                description: "Established player in the space",
                strengths: ["Brand recognition", "Market share", "Resources"],
                weaknesses: ["Legacy systems", "Slow innovation", "High prices"],
                marketShare: "25-40%",
                funding: "Well-funded"
              }
            ],
            indirectCompetitors: [
              {
                name: "Alternative Solutions",
                description: "Different approaches to solving similar problems",
                threat: "Medium"
              }
            ],
            marketGaps: [
              "Underserved customer segments",
              "Technology gaps in current solutions",
              "Price-sensitive market segments",
              "Geographic markets with limited coverage"
            ],
            competitiveAdvantages: [
              "Modern technology stack",
              "Better user experience",
              "More affordable pricing",
              "Faster implementation"
            ],
            barrierToEntry: {
              level: "Medium",
              factors: ["Capital requirements", "Technical expertise", "Market education"]
            },
            marketPosition: "Focus on underserved segments with superior technology",
            differentiationOpportunities: [
              "Superior user experience",
              "More affordable pricing model",
              "Better customer support",
              "Faster time to value"
            ],
            competitiveRisks: [
              "Established players may copy features",
              "Price wars with competitors",
              "Market consolidation"
            ]
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing competitor analysis:', parseError);
      console.error('Raw AI response:', aiResponse);
      
      // Return fallback response instead of error
      return {
        success: true,
        analysis: {
          businessIdea: businessIdea,
          targetMarket: targetMarket,
          directCompetitors: [
            {
              name: "Market Leader",
              description: "Established player in the space",
              strengths: ["Brand recognition", "Market share", "Resources"],
              weaknesses: ["Legacy systems", "Slow innovation", "High prices"],
              marketShare: "25-40%",
              funding: "Well-funded"
            }
          ],
          indirectCompetitors: [
            {
              name: "Alternative Solutions",
              description: "Different approaches to solving similar problems",
              threat: "Medium"
            }
          ],
          marketGaps: [
            "Better user experience",
            "More affordable pricing",
            "Faster implementation"
          ],
          competitiveAdvantages: [
            "Modern technology stack",
            "Better customer service",
            "More flexible pricing"
          ],
          barrierToEntry: {
            level: "Medium",
            factors: ["Capital requirements", "Technical expertise", "Market education"]
          },
          marketPosition: "Focus on underserved segments with superior technology",
          differentiationOpportunities: [
            "Superior user experience",
            "More affordable pricing model",
            "Better customer support"
          ],
          competitiveRisks: [
            "Established players may copy features",
            "Price wars with competitors"
          ]
        }
      };
    }

  } catch (error) {
    console.error('Competitor Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Revenue Model Suggestions
export const suggestRevenueModels = async (businessIdea, targetCustomers, industry, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a business model expert and startup advisor. ${locationPrompt}Suggest optimal revenue models for this business: "${businessIdea}" targeting "${targetCustomers}" in the "${industry}" industry.

Provide suggestions in this exact JSON format:
{
  "businessIdea": "${businessIdea}",
  "targetCustomers": "${targetCustomers}",
  "industry": "${industry}",
  "primaryRevenueModels": [
    {
      "model": "Revenue model name (e.g., SaaS, Marketplace, Freemium)",
      "description": "How this model works for your business",
      "pros": ["Key advantages"],
      "cons": ["Potential challenges"],
      "timeToRevenue": "How quickly you can start generating revenue",
      "scalability": "High/Medium/Low scalability potential",
      "capitalRequirement": "Capital needed to implement",
      "examples": ["Successful companies using this model"]
    }
  ],
  "hybridApproaches": [
    {
      "combination": "Combined revenue streams",
      "description": "How to combine multiple models",
      "benefits": ["Why this combination works"]
    }
  ],
  "pricingStrategies": [
    {
      "strategy": "Pricing approach",
      "description": "How to price your offering",
      "targetPrice": "Suggested price range"
    }
  ],
  "monetizationTimeline": {
    "month1-3": "Initial monetization approach",
    "month6-12": "Growth phase monetization",
    "year2+": "Scale phase monetization"
  },
  "keyMetrics": [
    "Important metrics to track for each revenue model"
  ],
  "riskFactors": [
    "Revenue-related risks to consider"
  ]
}

Focus on proven, scalable revenue models with clear paths to profitability.`;

    const aiResponse = await makeOpenRouterCall(prompt, 1500);
    
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return { success: true, analysis };
      }
    } catch (parseError) {
      console.error('Error parsing revenue model analysis:', parseError);
    }

    return {
      success: false,
      error: 'Failed to parse revenue model analysis'
    };

  } catch (error) {
    console.error('Revenue Model Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// MVP Validation Framework
export const createMVPValidationPlan = async (businessIdea, targetCustomers, budget, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a lean startup expert and MVP validation specialist. ${locationPrompt}Create a comprehensive validation framework for this business idea: "${businessIdea}" targeting "${targetCustomers}" with a budget of "${budget}".

Provide a detailed plan in this exact JSON format:
{
  "businessIdea": "${businessIdea}",
  "targetCustomers": "${targetCustomers}",
  "budget": "${budget}",
  "validationHypotheses": [
    {
      "hypothesis": "Key assumption to test",
      "riskLevel": "High/Medium/Low",
      "testMethod": "How to test this assumption"
    }
  ],
  "mvpApproaches": [
    {
      "type": "MVP type (Landing Page, Prototype, Concierge, etc.)",
      "description": "What this MVP involves",
      "timeToCreate": "Time needed to build",
      "cost": "Estimated cost",
      "validationGoals": ["What you'll learn from this MVP"]
    }
  ],
  "validationMethods": [
    {
      "method": "Validation technique",
      "description": "How to execute this method",
      "cost": "Estimated cost",
      "timeframe": "How long it takes",
      "successMetrics": ["What indicates success"]
    }
  ],
  "customerInterviews": {
    "targetNumber": "Number of interviews needed",
    "keyQuestions": ["Critical questions to ask"],
    "successCriteria": "What responses indicate validation"
  },
  "experimentPlan": [
    {
      "week": "Week number",
      "activities": ["Specific activities for this week"],
      "deliverables": ["What you should have by end of week"],
      "budget": "Budget allocation for this week"
    }
  ],
  "successMetrics": [
    {
      "metric": "Key metric to track",
      "target": "Target value",
      "measurement": "How to measure"
    }
  ],
  "pivotTriggers": [
    "Signals that indicate need to pivot or abandon idea"
  ],
  "nextSteps": [
    "Actions to take based on validation results"
  ]
}

Focus on lean, cost-effective validation methods that provide maximum learning with minimum investment.`;

    const aiResponse = await makeOpenRouterCall(prompt, 1800);
    
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return { success: true, analysis };
      }
    } catch (parseError) {
      console.error('Error parsing MVP validation plan:', parseError);
    }

    return {
      success: false,
      error: 'Failed to parse MVP validation plan'
    };

  } catch (error) {
    console.error('MVP Validation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Business Idea Generator
export const generateBusinessIdeas = async (interests, skills, budget, timeCommitment, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a successful entrepreneur and business idea generator. ${locationPrompt}Based on these inputs, generate innovative business ideas:
- Interests: ${interests}
- Skills: ${skills}
- Budget: ${budget}
- Time Commitment: ${timeCommitment}

Generate ideas in this exact JSON format:
{
  "userProfile": {
    "interests": "${interests}",
    "skills": "${skills}",
    "budget": "${budget}",
    "timeCommitment": "${timeCommitment}"
  },
  "businessIdeas": [
    {
      "title": "Business idea name",
      "description": "Detailed description of the business",
      "industry": "Primary industry",
      "targetMarket": "Target customer segment",
      "revenueModel": "Primary revenue model",
      "startupCost": "Estimated startup cost",
      "timeToMarket": "Time to launch",
      "profitPotential": "High/Medium/Low",
      "skillMatch": "How well it matches user's skills (1-10)",
      "marketDemand": "Current market demand level",
      "competitionLevel": "High/Medium/Low",
      "keyAdvantages": ["Unique advantages of this idea"],
      "firstSteps": ["Immediate actions to take"],
      "successExamples": ["Similar successful businesses"]
    }
  ],
  "trendingOpportunities": [
    {
      "trend": "Current market trend",
      "opportunity": "Business opportunity from this trend",
      "whyNow": "Why this is the right time"
    }
  ],
  "quickWins": [
    "Low-effort, high-impact business ideas for immediate income"
  ],
  "longTermPlays": [
    "High-potential ideas that require more time/investment"
  ]
}

Focus on realistic, actionable ideas that match the user's profile and current market opportunities.`;

    const aiResponse = await makeOpenRouterCall(prompt, 2000);
    
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        return { success: true, analysis };
      }
    } catch (parseError) {
      console.error('Error parsing business ideas:', parseError);
    }

    return {
      success: false,
      error: 'Failed to parse business ideas'
    };

  } catch (error) {
    console.error('Business Ideas error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
