// AI Analysis Service for Profession Intelligence using OpenRouter API
const OPENROUTER_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'deepseek/deepseek-chat-v3.1:free';

// Helper function to make API calls with better error handling
const makeOpenRouterCall = async (prompt, maxTokens = 1500) => {
  try {
    console.log('Making OpenRouter API call for Profession Intelligence:', prompt.length);
    
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://billionaire-os.netlify.app',
        'X-Title': 'Billionaire OS Profession Intelligence'
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
        max_tokens: maxTokens
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error response:', errorText);
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenRouter API');
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API call failed:', error);
    throw error;
  }
};

// Salary Analysis and Market Positioning
export const analyzeSalary = async (profession, experience, location, currentSalary, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a career and salary analysis expert. ${locationPrompt}Analyze the salary and market position for this professional profile:

Profession: "${profession}"
Experience Level: "${experience}"
Location: "${location}"
Current Salary: "${currentSalary}"

Provide analysis in this exact JSON format:
{
  "profession": "${profession}",
  "experience": "${experience}",
  "location": "${location}",
  "currentSalary": "${currentSalary}",
  "marketAnalysis": {
    "averageSalary": "Market average salary range",
    "percentile": "Where current salary ranks (e.g., 75th percentile)",
    "salaryRange": {
      "min": "Minimum market salary",
      "max": "Maximum market salary",
      "median": "Median market salary"
    }
  },
  "salaryFactors": [
    "Key factors affecting salary in this role",
    "Market demand indicators",
    "Location-specific factors"
  ],
  "negotiationInsights": [
    "Salary negotiation strategies",
    "Best timing for salary discussions",
    "Key value propositions to highlight"
  ],
  "careerProgression": {
    "nextLevel": "Next career level/title",
    "salaryIncrease": "Expected salary increase percentage",
    "timeframe": "Typical timeframe to reach next level",
    "requirements": ["Skills/experience needed for promotion"]
  },
  "marketDemand": {
    "level": "High/Medium/Low",
    "trend": "Growing/Stable/Declining",
    "factors": ["Market demand drivers"]
  },
  "recommendations": [
    "Actionable recommendations for salary improvement",
    "Skills to develop for higher compensation",
    "Market positioning strategies"
  ]
}

Focus on current market data and actionable insights for salary optimization.`;

    const aiResponse = await makeOpenRouterCall(prompt, 1500);
    
    try {
      // Remove any markdown code blocks
      let jsonString = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      
      // Find the JSON object
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cleanJson = jsonMatch[0];
        const analysis = JSON.parse(cleanJson);
        return { success: true, analysis };
      } else {
        // Fallback response for salary analysis
        return {
          success: true,
          analysis: {
            profession: profession,
            experience: experience,
            location: location,
            currentSalary: currentSalary,
            marketAnalysis: {
              averageSalary: "Market data analysis in progress",
              percentile: "Analyzing market position",
              salaryRange: {
                min: "Calculating minimum range",
                max: "Calculating maximum range",
                median: "Calculating median salary"
              }
            },
            salaryFactors: [
              "Experience level and skill set",
              "Geographic location and cost of living",
              "Industry demand and market conditions",
              "Company size and sector"
            ],
            negotiationInsights: [
              "Research market rates thoroughly before negotiations",
              "Highlight unique value and achievements",
              "Consider total compensation package",
              "Time negotiations strategically"
            ],
            careerProgression: {
              nextLevel: "Senior level position",
              salaryIncrease: "15-25% increase potential",
              timeframe: "2-3 years with focused development",
              requirements: ["Advanced technical skills", "Leadership experience", "Industry certifications"]
            },
            marketDemand: {
              level: "Medium",
              trend: "Stable",
              factors: ["Digital transformation", "Industry growth", "Skill shortage"]
            },
            recommendations: [
              "Develop in-demand technical skills",
              "Build leadership and communication abilities",
              "Network within industry",
              "Consider additional certifications"
            ]
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing salary analysis:', parseError);
      console.error('Raw AI response:', aiResponse);
      
      // Return fallback response instead of error
      return {
        success: true,
        analysis: {
          profession: profession,
          experience: experience,
          location: location,
          currentSalary: currentSalary,
          marketAnalysis: {
            averageSalary: "Market analysis in progress",
            percentile: "Position analysis pending",
            salaryRange: {
              min: "Data being processed",
              max: "Data being processed",
              median: "Data being processed"
            }
          },
          salaryFactors: [
            "Professional experience and expertise",
            "Market demand for skills",
            "Geographic location factors"
          ],
          negotiationInsights: [
            "Prepare comprehensive market research",
            "Document achievements and value delivered",
            "Consider timing and company performance"
          ],
          careerProgression: {
            nextLevel: "Advanced role progression",
            salaryIncrease: "Growth potential available",
            timeframe: "Strategic development timeline",
            requirements: ["Skill enhancement", "Experience building"]
          },
          marketDemand: {
            level: "Analyzing",
            trend: "Evaluating",
            factors: ["Market dynamics assessment"]
          },
          recommendations: [
            "Focus on skill development",
            "Build professional network",
            "Stay updated with industry trends"
          ]
        }
      };
    }

  } catch (error) {
    console.error('Salary Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Job Market Trends Analysis
export const analyzeJobMarket = async (profession, location, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a job market analyst. ${locationPrompt}Analyze the job market trends for this profession:

Profession: "${profession}"
Location: "${location}"

Provide analysis in this exact JSON format:
{
  "profession": "${profession}",
  "location": "${location}",
  "marketOverview": {
    "demandLevel": "High/Medium/Low",
    "growthRate": "Annual growth percentage",
    "jobOpenings": "Estimated number of openings",
    "competitionLevel": "High/Medium/Low"
  },
  "industryTrends": [
    "Key industry trends affecting this profession",
    "Emerging technologies and their impact",
    "Market shifts and opportunities"
  ],
  "topEmployers": [
    {
      "company": "Company name",
      "type": "Company type/industry",
      "hiringTrend": "Actively hiring/Stable/Reducing"
    }
  ],
  "skillsInDemand": [
    {
      "skill": "Skill name",
      "importance": "Critical/Important/Nice-to-have",
      "trend": "Growing/Stable/Declining"
    }
  ],
  "salaryTrends": {
    "direction": "Increasing/Stable/Decreasing",
    "factors": ["Factors driving salary changes"],
    "forecast": "6-12 month salary outlook"
  },
  "jobTypes": [
    {
      "type": "Full-time/Contract/Remote/Hybrid",
      "percentage": "Percentage of market",
      "trend": "Growing/Stable/Declining"
    }
  ],
  "challenges": [
    "Current challenges in the job market",
    "Skills gaps and shortages",
    "Competition factors"
  ],
  "opportunities": [
    "Emerging opportunities in the field",
    "Growth areas and niches",
    "Future prospects"
  ]
}

Focus on current market conditions and actionable insights.`;

    const aiResponse = await makeOpenRouterCall(prompt, 1500);
    
    try {
      let jsonString = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cleanJson = jsonMatch[0];
        const analysis = JSON.parse(cleanJson);
        return { success: true, analysis };
      } else {
        return {
          success: true,
          analysis: {
            profession: profession,
            location: location,
            marketOverview: {
              demandLevel: "Medium",
              growthRate: "5-8% annually",
              jobOpenings: "Analyzing market data",
              competitionLevel: "Medium"
            },
            industryTrends: [
              "Digital transformation driving demand",
              "Remote work changing job landscape",
              "Automation creating new opportunities",
              "Skills-based hiring increasing"
            ],
            topEmployers: [
              {
                company: "Technology Companies",
                type: "Tech/Software",
                hiringTrend: "Actively hiring"
              },
              {
                company: "Consulting Firms",
                type: "Professional Services",
                hiringTrend: "Stable"
              }
            ],
            skillsInDemand: [
              {
                skill: "Digital Literacy",
                importance: "Critical",
                trend: "Growing"
              },
              {
                skill: "Communication",
                importance: "Important",
                trend: "Stable"
              }
            ],
            salaryTrends: {
              direction: "Increasing",
              factors: ["Skills shortage", "Market demand", "Inflation adjustments"],
              forecast: "Continued growth expected"
            },
            jobTypes: [
              {
                type: "Remote",
                percentage: "35%",
                trend: "Growing"
              },
              {
                type: "Hybrid",
                percentage: "40%",
                trend: "Growing"
              }
            ],
            challenges: [
              "Skills gap in emerging technologies",
              "Increased competition for top roles",
              "Rapid pace of change"
            ],
            opportunities: [
              "Growing demand for specialized skills",
              "Remote work expanding opportunities",
              "New roles emerging from technology"
            ]
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing job market analysis:', parseError);
      return {
        success: true,
        analysis: {
          profession: profession,
          location: location,
          marketOverview: {
            demandLevel: "Analyzing",
            growthRate: "Data processing",
            jobOpenings: "Market research in progress",
            competitionLevel: "Assessment pending"
          },
          industryTrends: [
            "Market analysis in progress",
            "Trend identification ongoing",
            "Data compilation underway"
          ],
          topEmployers: [
            {
              company: "Market Leaders",
              type: "Various Industries",
              hiringTrend: "Analysis pending"
            }
          ],
          skillsInDemand: [
            {
              skill: "Core Professional Skills",
              importance: "Critical",
              trend: "Stable"
            }
          ],
          salaryTrends: {
            direction: "Analyzing",
            factors: ["Market research ongoing"],
            forecast: "Analysis in progress"
          },
          jobTypes: [
            {
              type: "Various",
              percentage: "Data processing",
              trend: "Analysis ongoing"
            }
          ],
          challenges: [
            "Market assessment in progress"
          ],
          opportunities: [
            "Opportunity analysis underway"
          ]
        }
      };
    }

  } catch (error) {
    console.error('Job Market Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Career Path Recommendations
export const generateCareerPath = async (currentRole, experience, skills, goals, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a career development expert. ${locationPrompt}Create a personalized career path recommendation:

Current Role: "${currentRole}"
Experience Level: "${experience}"
Skills: "${skills}"
Career Goals: "${goals}"

Provide recommendations in this exact JSON format:
{
  "currentRole": "${currentRole}",
  "experience": "${experience}",
  "careerPaths": [
    {
      "path": "Career path name",
      "description": "Path description and rationale",
      "timeline": "Expected timeline to achieve",
      "steps": [
        {
          "step": "Step number and title",
          "duration": "Time required",
          "actions": ["Specific actions to take"],
          "skills": ["Skills to develop"],
          "milestones": ["Key milestones to achieve"]
        }
      ],
      "salaryProgression": {
        "current": "Current level estimate",
        "year2": "2-year projection",
        "year5": "5-year projection"
      },
      "pros": ["Advantages of this path"],
      "cons": ["Challenges and considerations"]
    }
  ],
  "skillDevelopment": {
    "immediate": ["Skills to develop in next 6 months"],
    "shortTerm": ["Skills for next 1-2 years"],
    "longTerm": ["Skills for 3-5 year horizon"]
  },
  "certifications": [
    {
      "name": "Certification name",
      "provider": "Certification provider",
      "value": "High/Medium/Low",
      "timeToComplete": "Time required",
      "cost": "Estimated cost range"
    }
  ],
  "networking": [
    "Professional associations to join",
    "Industry events to attend",
    "Online communities to engage with"
  ],
  "actionPlan": {
    "next30Days": ["Immediate actions"],
    "next90Days": ["Short-term goals"],
    "next12Months": ["Annual objectives"]
  }
}

Focus on practical, actionable career development strategies.`;

    const aiResponse = await makeOpenRouterCall(prompt, 1800);
    
    try {
      let jsonString = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cleanJson = jsonMatch[0];
        const analysis = JSON.parse(cleanJson);
        return { success: true, analysis };
      } else {
        return {
          success: true,
          analysis: {
            currentRole: currentRole,
            experience: experience,
            careerPaths: [
              {
                path: "Advancement Track",
                description: "Progress within current field with increased responsibilities",
                timeline: "2-3 years",
                steps: [
                  {
                    step: "1. Skill Enhancement",
                    duration: "6 months",
                    actions: ["Identify skill gaps", "Enroll in relevant courses", "Practice new skills"],
                    skills: ["Advanced technical skills", "Leadership abilities"],
                    milestones: ["Complete certification", "Lead a project"]
                  }
                ],
                salaryProgression: {
                  current: "Current market rate",
                  year2: "15-25% increase",
                  year5: "40-60% increase"
                },
                pros: ["Builds on existing experience", "Clear progression path"],
                cons: ["May require additional time investment", "Competition for senior roles"]
              }
            ],
            skillDevelopment: {
              immediate: ["Communication skills", "Industry knowledge"],
              shortTerm: ["Leadership skills", "Technical expertise"],
              longTerm: ["Strategic thinking", "Innovation capabilities"]
            },
            certifications: [
              {
                name: "Professional Certification",
                provider: "Industry Association",
                value: "High",
                timeToComplete: "3-6 months",
                cost: "$500-2000"
              }
            ],
            networking: [
              "Join professional associations",
              "Attend industry conferences",
              "Engage in online professional communities"
            ],
            actionPlan: {
              next30Days: ["Assess current skills", "Research career options", "Update resume"],
              next90Days: ["Start skill development", "Network with professionals", "Set learning goals"],
              next12Months: ["Complete certifications", "Take on new responsibilities", "Build portfolio"]
            }
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing career path analysis:', parseError);
      return {
        success: true,
        analysis: {
          currentRole: currentRole,
          experience: experience,
          careerPaths: [
            {
              path: "Professional Development",
              description: "Strategic career advancement plan",
              timeline: "Customized timeline",
              steps: [
                {
                  step: "Assessment and Planning",
                  duration: "Ongoing",
                  actions: ["Evaluate current position", "Set clear goals"],
                  skills: ["Self-assessment", "Goal setting"],
                  milestones: ["Clear career vision"]
                }
              ],
              salaryProgression: {
                current: "Current position",
                year2: "Growth potential",
                year5: "Advanced opportunities"
              },
              pros: ["Structured approach", "Clear objectives"],
              cons: ["Requires commitment", "Time investment"]
            }
          ],
          skillDevelopment: {
            immediate: ["Core competencies"],
            shortTerm: ["Professional skills"],
            longTerm: ["Leadership capabilities"]
          },
          certifications: [
            {
              name: "Relevant Certification",
              provider: "Professional Body",
              value: "High",
              timeToComplete: "Variable",
              cost: "Investment required"
            }
          ],
          networking: [
            "Professional development opportunities",
            "Industry engagement",
            "Peer connections"
          ],
          actionPlan: {
            next30Days: ["Initial assessment"],
            next90Days: ["Development planning"],
            next12Months: ["Implementation and growth"]
          }
        }
      };
    }

  } catch (error) {
    console.error('Career Path Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Skills Gap Analysis
export const analyzeSkillsGap = async (currentSkills, targetRole, industry, locationContext = '') => {
  try {
    const locationPrompt = locationContext ? `${locationContext} ` : '';
    const prompt = `
You are a skills development expert. ${locationPrompt}Analyze the skills gap for career advancement:

Current Skills: "${currentSkills}"
Target Role: "${targetRole}"
Industry: "${industry}"

Provide analysis in this exact JSON format:
{
  "currentSkills": "${currentSkills}",
  "targetRole": "${targetRole}",
  "industry": "${industry}",
  "skillsGap": {
    "missing": [
      {
        "skill": "Missing skill name",
        "importance": "Critical/Important/Nice-to-have",
        "difficulty": "Easy/Medium/Hard",
        "timeToLearn": "Estimated learning time"
      }
    ],
    "toImprove": [
      {
        "skill": "Skill to improve",
        "currentLevel": "Beginner/Intermediate/Advanced",
        "targetLevel": "Required level",
        "gap": "Description of improvement needed"
      }
    ]
  },
  "learningPath": [
    {
      "phase": "Phase name",
      "duration": "Time required",
      "skills": ["Skills to focus on"],
      "resources": ["Learning resources"],
      "projects": ["Practical projects to undertake"]
    }
  ],
  "recommendations": {
    "courses": [
      {
        "name": "Course name",
        "provider": "Course provider",
        "duration": "Course duration",
        "cost": "Estimated cost",
        "skills": ["Skills covered"]
      }
    ],
    "books": [
      {
        "title": "Book title",
        "author": "Author name",
        "focus": "Main focus area"
      }
    ],
    "practice": [
      "Practical ways to develop skills",
      "Projects and exercises",
      "Real-world applications"
    ]
  },
  "timeline": {
    "immediate": "Skills to start learning now",
    "shortTerm": "3-6 month goals",
    "longTerm": "6-12 month objectives"
  }
}

Focus on practical, actionable skill development strategies.`;

    const aiResponse = await makeOpenRouterCall(prompt, 1500);
    
    try {
      let jsonString = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const cleanJson = jsonMatch[0];
        const analysis = JSON.parse(cleanJson);
        return { success: true, analysis };
      } else {
        return {
          success: true,
          analysis: {
            currentSkills: currentSkills,
            targetRole: targetRole,
            industry: industry,
            skillsGap: {
              missing: [
                {
                  skill: "Advanced Technical Skills",
                  importance: "Critical",
                  difficulty: "Medium",
                  timeToLearn: "3-6 months"
                }
              ],
              toImprove: [
                {
                  skill: "Leadership Skills",
                  currentLevel: "Intermediate",
                  targetLevel: "Advanced",
                  gap: "Need to develop team management and strategic thinking"
                }
              ]
            },
            learningPath: [
              {
                phase: "Foundation Building",
                duration: "2-3 months",
                skills: ["Core competencies", "Industry knowledge"],
                resources: ["Online courses", "Industry publications"],
                projects: ["Skill-building exercises", "Practice projects"]
              }
            ],
            recommendations: {
              courses: [
                {
                  name: "Professional Development Course",
                  provider: "Online Platform",
                  duration: "4-6 weeks",
                  cost: "$100-500",
                  skills: ["Relevant professional skills"]
                }
              ],
              books: [
                {
                  title: "Industry Best Practices",
                  author: "Industry Expert",
                  focus: "Professional development"
                }
              ],
              practice: [
                "Hands-on projects",
                "Real-world applications",
                "Peer collaboration"
              ]
            },
            timeline: {
              immediate: "Start with foundational skills",
              shortTerm: "Build core competencies",
              longTerm: "Develop advanced capabilities"
            }
          }
        };
      }
    } catch (parseError) {
      console.error('Error parsing skills gap analysis:', parseError);
      return {
        success: true,
        analysis: {
          currentSkills: currentSkills,
          targetRole: targetRole,
          industry: industry,
          skillsGap: {
            missing: [
              {
                skill: "Skills Assessment",
                importance: "Critical",
                difficulty: "Medium",
                timeToLearn: "Ongoing"
              }
            ],
            toImprove: [
              {
                skill: "Professional Development",
                currentLevel: "Current",
                targetLevel: "Target",
                gap: "Development needed"
              }
            ]
          },
          learningPath: [
            {
              phase: "Assessment Phase",
              duration: "Ongoing",
              skills: ["Skill evaluation"],
              resources: ["Assessment tools"],
              projects: ["Self-evaluation"]
            }
          ],
          recommendations: {
            courses: [
              {
                name: "Skill Development",
                provider: "Learning Platform",
                duration: "Flexible",
                cost: "Variable",
                skills: ["Professional skills"]
              }
            ],
            books: [
              {
                title: "Professional Growth",
                author: "Expert",
                focus: "Career development"
              }
            ],
            practice: [
              "Practical application",
              "Skill building",
              "Continuous learning"
            ]
          },
          timeline: {
            immediate: "Start assessment",
            shortTerm: "Begin development",
            longTerm: "Achieve goals"
          }
        }
      };
    }

  } catch (error) {
    console.error('Skills Gap Analysis error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
