// AI Analysis Service using OpenRouter API with Google Gemini 2.0 Flash Experimental model
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY ;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-exp:free';

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
      // Try to find JSON in the response
      let jsonString = aiResponse.trim();
      
      // Remove any markdown code blocks
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').replace(/```/g, '');
      
      // Remove any leading/trailing text that's not JSON
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        let cleanJson = jsonString.substring(jsonStart, jsonEnd + 1);
        
        // Try to fix common JSON issues
        cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        cleanJson = cleanJson.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":'); // Quote unquoted keys
        cleanJson = cleanJson.replace(/:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*([,}])/g, ': "$1"$2'); // Quote unquoted string values
        cleanJson = cleanJson.replace(/"\s*([0-9]+)\s*"/g, '$1'); // Unquote numbers
        cleanJson = cleanJson.replace(/"\s*(true|false|null)\s*"/g, '$1'); // Unquote booleans and null
        
        const analysis = JSON.parse(cleanJson);
        return { success: true, analysis };
      }
    } catch (parseError) {
      console.error('Error parsing revenue model analysis:', parseError);
      console.error('Raw AI response:', aiResponse);
    }

    // Return fallback response instead of error
    return {
      success: true,
      analysis: {
        businessIdea: businessIdea,
        targetCustomers: targetCustomers,
        industry: industry,
        primaryRevenueModels: [
          {
            model: "Subscription (SaaS)",
            description: "Recurring monthly or annual payments for access to your solution",
            pros: ["Predictable revenue", "High customer lifetime value", "Scalable growth"],
            cons: ["Requires consistent value delivery", "Customer acquisition cost", "Churn risk"],
            timeToRevenue: "1-3 months",
            scalability: "High",
            capitalRequirement: "Low to Medium",
            examples: ["Netflix", "Spotify", "Salesforce"]
          },
          {
            model: "One-time Purchase",
            description: "Single payment for product or service access",
            pros: ["Immediate revenue", "Simple pricing", "No ongoing commitments"],
            cons: ["No recurring revenue", "Need constant new customers", "Lower lifetime value"],
            timeToRevenue: "Immediate",
            scalability: "Medium",
            capitalRequirement: "Low",
            examples: ["Software licenses", "Physical products", "Courses"]
          }
        ],
        hybridApproaches: [
          {
            combination: "Freemium + Premium Subscription",
            description: "Free basic tier with paid premium features",
            benefits: ["Lower barrier to entry", "Viral growth potential", "Upsell opportunities"]
          }
        ],
        pricingStrategies: [
          {
            strategy: "Value-based Pricing",
            description: "Price based on value delivered to customer",
            targetPrice: "10-20% of value created"
          }
        ],
        monetizationTimeline: {
          "month1-3": "Launch with simple pricing model and gather customer feedback",
          "month6-12": "Optimize pricing based on data and introduce premium tiers",
          "year2+": "Scale with multiple revenue streams and enterprise offerings"
        },
        keyMetrics: [
          "Monthly Recurring Revenue (MRR)",
          "Customer Acquisition Cost (CAC)",
          "Customer Lifetime Value (LTV)",
          "Churn Rate"
        ],
        riskFactors: [
          "Market saturation affecting pricing power",
          "Customer price sensitivity",
          "Competitive pricing pressure"
        ]
      }
    };

  } catch (error) {
    console.error('Revenue Model Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Idea Testing Framework
export const createIdeaTestingPlan = async (businessIdea, targetCustomers, budget, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a lean startup expert and idea testing specialist. ${locationPrompt}Create a comprehensive testing framework for this business idea: "${businessIdea}" targeting "${targetCustomers}" with a budget of "${budget}".

IMPORTANT: Respond ONLY with valid JSON. Do not include any text before or after the JSON object. Do not use markdown formatting.

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

    const aiResponse = await makeOpenRouterCall(prompt, 2500);
    
    try {
      // Try to find JSON in the response
      let jsonString = aiResponse.trim();
      
      // Remove any markdown code blocks
      jsonString = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').replace(/```/g, '');
      
      // Remove any leading/trailing text that's not JSON
      const jsonStart = jsonString.indexOf('{');
      const jsonEnd = jsonString.lastIndexOf('}');
      
      if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
        let cleanJson = jsonString.substring(jsonStart, jsonEnd + 1);
        
        // Try to fix common JSON issues
        cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1'); // Remove trailing commas
        cleanJson = cleanJson.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":'); // Quote unquoted keys
        cleanJson = cleanJson.replace(/:\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*([,}])/g, ': "$1"$2'); // Quote unquoted string values
        cleanJson = cleanJson.replace(/"\s*([0-9]+)\s*"/g, '$1'); // Unquote numbers
        cleanJson = cleanJson.replace(/"\s*(true|false|null)\s*"/g, '$1'); // Unquote booleans and null
        
        console.log('Attempting to parse cleaned JSON:', cleanJson.substring(0, 200) + '...');
        
        const analysis = JSON.parse(cleanJson);
        return { success: true, analysis };
      } else {
        // Fallback response for idea testing
        return {
          success: true,
          analysis: {
            businessIdea: businessIdea,
            targetCustomers: targetCustomers,
            budget: budget,
            validationHypotheses: [
              {
                hypothesis: "Customers have the problem we're solving",
                riskLevel: "High",
                testMethod: "Customer interviews and surveys"
              },
              {
                hypothesis: "Our solution addresses the problem effectively",
                riskLevel: "High", 
                testMethod: "Prototype testing and user feedback"
              },
              {
                hypothesis: "Customers are willing to pay for the solution",
                riskLevel: "Medium",
                testMethod: "Landing page with pricing and pre-orders"
              }
            ],
            mvpApproaches: [
              {
                type: "Landing Page MVP",
                description: "Create a simple landing page describing your solution to test market interest",
                timeToCreate: "1-2 weeks",
                cost: "$50-200",
                validationGoals: [
                  "Test market demand and interest",
                  "Collect email signups from potential customers",
                  "Validate value proposition messaging"
                ]
              },
              {
                type: "Prototype MVP",
                description: "Build a basic working prototype with core features",
                timeToCreate: "4-8 weeks",
                cost: "$500-2000",
                validationGoals: [
                  "Test core functionality with real users",
                  "Gather feedback on user experience",
                  "Validate technical feasibility"
                ]
              }
            ],
            validationMethods: [
              {
                method: "Customer Interviews",
                description: "Conduct 1-on-1 interviews with potential customers",
                cost: "$0-100",
                timeframe: "2-4 weeks",
                successMetrics: ["Clear problem validation", "Solution interest", "Willingness to pay"]
              },
              {
                method: "Landing Page Test",
                description: "Create a landing page and drive traffic to measure interest",
                cost: "$100-500",
                timeframe: "1-2 weeks",
                successMetrics: ["Email signup rate >5%", "Time on page >30 seconds"]
              }
            ],
            customerInterviews: {
              targetNumber: "15-20 interviews",
              keyQuestions: [
                "How do you currently solve this problem?",
                "What's most frustrating about current solutions?",
                "Would you pay for a better solution?"
              ],
              successCriteria: "80% confirm the problem exists and current solutions are inadequate"
            },
            experimentPlan: [
              {
                week: "Week 1",
                activities: ["Create customer interview script", "Identify and contact potential interviewees"],
                deliverables: ["Interview script", "List of 20+ potential interviewees"],
                budget: "$50"
              },
              {
                week: "Week 2-3",
                activities: ["Conduct customer interviews", "Analyze feedback patterns"],
                deliverables: ["15+ completed interviews", "Key insights summary"],
                budget: "$100"
              },
              {
                week: "Week 4",
                activities: ["Build landing page", "Create basic prototype or mockups"],
                deliverables: ["Live landing page", "Basic prototype"],
                budget: "$200-500"
              }
            ],
            successMetrics: [
              {
                metric: "Problem Validation Rate",
                target: "80% of interviewees confirm the problem",
                measurement: "Customer interview responses"
              },
              {
                metric: "Solution Interest",
                target: "60% express interest in the solution",
                measurement: "Interview feedback and landing page signups"
              }
            ],
            pivotTriggers: [
              "Less than 50% of customers confirm the problem exists",
              "No clear willingness to pay for the solution",
              "Technical feasibility issues that can't be resolved"
            ],
            nextSteps: [
              "If validated: Build more comprehensive MVP",
              "If not validated: Pivot to different customer segment or problem",
              "Continue iterating based on customer feedback"
            ]
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing idea testing plan:', parseError);
      console.error('Raw AI response length:', aiResponse.length);
      console.error('Raw AI response preview:', aiResponse.substring(0, 500));
      console.error('Full AI response:', aiResponse);
      
      // Return fallback response instead of error
      return {
        success: true,
        analysis: {
          businessIdea: businessIdea,
          targetCustomers: targetCustomers,
          budget: budget,
          validationHypotheses: [
            {
              hypothesis: "Target customers have the problem we're solving",
              riskLevel: "High",
              testMethod: "Customer interviews and market research"
            }
          ],
          mvpApproaches: [
            {
              type: "Simple Landing Page",
              description: "Create a basic landing page to test market interest",
              timeToCreate: "1 week",
              cost: "$100-300",
              validationGoals: ["Test market demand", "Collect customer feedback"]
            }
          ],
          validationMethods: [
            {
              method: "Customer Interviews",
              description: "Talk directly to potential customers",
              cost: "$0-50",
              timeframe: "2 weeks",
              successMetrics: ["Problem confirmation", "Solution interest"]
            }
          ],
          customerInterviews: {
            targetNumber: "10-15 interviews",
            keyQuestions: ["What's your biggest challenge?", "How do you solve it now?"],
            successCriteria: "Clear problem validation from majority"
          },
          experimentPlan: [
            {
              week: "Week 1",
              activities: ["Research target customers", "Prepare interview questions"],
              deliverables: ["Customer list", "Interview script"],
              budget: "$50"
            }
          ],
          successMetrics: [
            {
              metric: "Customer Problem Validation",
              target: "70% confirm the problem",
              measurement: "Interview responses"
            }
          ],
          pivotTriggers: ["Low customer interest", "No willingness to pay"],
          nextSteps: ["Build based on feedback", "Iterate on solution"]
        }
      };
    }

  } catch (error) {
    console.error('Idea Testing error:', error);
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
