
export interface FormData {
  businessType: string;
  employees: string;
  businessDescription?: string;
  painPoints: string[];
  taskTime: string;
  laborCosts: number;
  toolsCosts: number;
  infrastructureCosts: number;
  otherCosts: number;
  aiBudget: string;
  timeline: string;
  targetSavings: string;
  expectedROI: string;
  priorities: string[];
  customPainPoint: string;
  customPriority: string;
}

export interface AIRecommendation {
  name: string;
  description: string;
  technology: string;
  confidence: number;
  monthly_cost: number;
  impact: "Low" | "Medium" | "High";
  risk: "Low" | "Medium" | "High";
  priority: number;
}

export interface RiskAssessment {
  severity: "Low" | "Medium" | "High";
  name: string;
  details: string;
}

export interface AIAnalysisResponse {
  ai_opportunity_assessment: Record<string, { score: number; unit: string }>;
  ai_recommendations: AIRecommendation[];
  risk_assessment: RiskAssessment[];
  metadata: {
    generated_date: string;
    version: string;
    total_recommendations: number;
    total_monthly_cost: number;
  };
}

export interface CostAnalysisResponse {
  current_state: {
    monthly_operational_cost: number;
    manual_processing_percentage: number;
    average_response_time: string;
    current_accuracy_rate: number;
  };
  optimized_state: {
    monthly_ai_cost: number;
    automated_processing_percentage: number;
    improved_response_time: string;
    enhanced_accuracy_rate: number;
  };
  cost_breakdown: Record<string, { cost: number; percentage: number }>;
  financial_impact: {
    annual_cost_savings: number;
    estimated_implementation_investment: number;
    breakeven_period_months: number;
  };
  quality_improvements: Array<{
    metric: string;
    before: string;
    after: string;
    improvement: string;
  }>;
  cost_vs_quality_analysis: string;
}
