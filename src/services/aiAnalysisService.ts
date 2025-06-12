
interface APIConfig {
  endpoint: string;
  apiKey: string;
  agentId: string;
}

const AI_RECOMMENDATION_CONFIG: APIConfig = {
  endpoint: "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
  apiKey: "sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf",
  agentId: "6846d65762d8a0cca7618622"
};

const COST_ANALYSIS_CONFIG: APIConfig = {
  endpoint: "https://agent-prod.studio.lyzr.ai/v3/inference/chat/",
  apiKey: "sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf", 
  agentId: "68481c3db67a5a754564ec0b"
};

export const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export const formatFormDataForAPI = (formData: any): string => {
  const totalCosts = formData.laborCosts + formData.toolsCosts + formData.infrastructureCosts + formData.otherCosts;
  
  return `Business Analysis Request:
    Business Type: ${formData.businessType}
    Employee Count: ${formData.employees}
    Pain Points: ${formData.painPoints.join(', ')}${formData.customPainPoint ? `, ${formData.customPainPoint}` : ''}
    Time Spent on Identified Tasks: ${formData.taskTime}
    Current Monthly Costs:
      - Labor: $${formData.laborCosts}
      - Tools & Software: $${formData.toolsCosts}
      - Infrastructure: $${formData.infrastructureCosts}
      - Other: $${formData.otherCosts}
      - Total: $${totalCosts}
    AI Budget: ${formData.aiBudget}
    Implementation Timeline: ${formData.timeline}
    Target Savings: ${formData.targetSavings}
    Expected ROI: ${formData.expectedROI}
    Business Priorities: ${formData.priorities.join(', ')}${formData.customPriority ? `, ${formData.customPriority}` : ''}
  `;
};

export const callAIRecommendationAPI = async (formData: any): Promise<any> => {
  const sessionId = generateSessionId();
  const message = formatFormDataForAPI(formData);

  const requestBody = {
    user_id: "user@example.com", // This should be dynamically populated
    agent_id: AI_RECOMMENDATION_CONFIG.agentId,
    session_id: sessionId,
    message: message
  };

  const response = await fetch(AI_RECOMMENDATION_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': AI_RECOMMENDATION_CONFIG.apiKey
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`AI Recommendation API failed: ${response.statusText}`);
  }

  return await response.json();
};

export const callCostAnalysisAPI = async (formData: any): Promise<any> => {
  const sessionId = generateSessionId();
  const message = formatFormDataForAPI(formData);

  const requestBody = {
    user_id: "user@example.com", // This should be dynamically populated  
    agent_id: COST_ANALYSIS_CONFIG.agentId,
    session_id: sessionId,
    message: message
  };

  const response = await fetch(COST_ANALYSIS_CONFIG.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': COST_ANALYSIS_CONFIG.apiKey
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    throw new Error(`Cost Analysis API failed: ${response.statusText}`);
  }

  return await response.json();
};

export const performBusinessAnalysis = async (formData: any): Promise<any> => {
  try {
    // Call both APIs simultaneously
    const [aiRecommendations, costAnalysis] = await Promise.all([
      callAIRecommendationAPI(formData),
      callCostAnalysisAPI(formData)
    ]);

    // Combine the results into a unified response
    return {
      ai_recommendations: aiRecommendations,
      cost_analysis: costAnalysis,
      analysis_timestamp: new Date().toISOString(),
      form_data: formData
    };
  } catch (error) {
    console.error('Business analysis failed:', error);
    throw error;
  }
};
