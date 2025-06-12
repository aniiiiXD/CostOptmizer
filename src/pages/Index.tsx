
import React, { useState } from 'react';
import BusinessProfileForm from '@/components/BusinessProfileForm';
import AnalysisResults from '@/components/AnalysisResults';
import ReportGeneration from '@/components/ReportGeneration';
import { toast } from 'sonner';

interface FormData {
  businessType: string;
  employeeCount: string;
  painPoints: string[];
  otherPainPoint: string;
  timeSpent: string;
  laborCosts: string;
  toolsCosts: string;
  infrastructureCosts: string;
  otherCosts: string;
  aiBudget: string;
  timeline: string;
  targetSavings: string;
  expectedROI: string;
  priorities: string[];
  otherPriority: string;
}

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'form' | 'analysis' | 'report'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [costData, setCostData] = useState<any>(null);

  const formatFormDataForAPI = (formData: FormData) => {
    const painPoints = [...formData.painPoints];
    if (formData.otherPainPoint) {
      painPoints.push(`Other: ${formData.otherPainPoint}`);
    }

    const priorities = [...formData.priorities];
    if (formData.otherPriority) {
      priorities.push(`Other: ${formData.otherPriority}`);
    }

    const totalCosts = (
      parseFloat(formData.laborCosts || '0') +
      parseFloat(formData.toolsCosts || '0') +
      parseFloat(formData.infrastructureCosts || '0') +
      parseFloat(formData.otherCosts || '0')
    );

    return `Business Profile Analysis Request:

Company Information:
- Business Type: ${formData.businessType}
- Employee Count: ${formData.employeeCount}

Current Challenges:
- Pain Points: ${painPoints.join(', ')}
- Time Spent on Tasks: ${formData.timeSpent}

Financial Information:
- Labor Costs: $${formData.laborCosts}/month
- Tools & Software: $${formData.toolsCosts}/month
- Infrastructure: $${formData.infrastructureCosts}/month
- Other Costs: $${formData.otherCosts}/month
- Total Monthly Costs: $${totalCosts}

AI Implementation Planning:
- AI Budget: ${formData.aiBudget}
- Implementation Timeline: ${formData.timeline}
- Target Savings: ${formData.targetSavings}
- Expected ROI: ${formData.expectedROI}

Goals & Priorities:
- Primary Priorities: ${priorities.join(', ')}

Please provide AI optimization recommendations based on this business profile.`;
  };

  const callLyzrAPI = async (endpoint: string, message: string) => {
    const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf'
      },
      body: JSON.stringify({
        user_id: 'katewamukul@gmail.com',
        agent_id: endpoint,
        session_id: `${endpoint}-${Date.now()}`,
        message: message
      })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.statusText}`);
    }

    return await response.json();
  };

  const handleAnalyzeBusiness = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const formattedMessage = formatFormDataForAPI(formData);
      
      // Call both APIs in parallel
      const [analysisResponse, costResponse] = await Promise.all([
        callLyzrAPI('6846d65762d8a0cca7618622', formattedMessage),
        callLyzrAPI('68481c3db67a5a754564ec0b', formattedMessage)
      ]);

      console.log('Analysis Response:', analysisResponse);
      console.log('Cost Response:', costResponse);

      // Mock data structure based on your specifications - replace with actual API response parsing
      const mockAnalysisData = {
        ai_opportunity_assessment: {
          opportunity_score: {
            description: "Potential impact areas identified in your workflow",
            areas: [
              { name: "Customer Query Processing", score: 92, unit: "percentage" },
              { name: "Document Classification", score: 87, unit: "percentage" },
              { name: "Data Entry Automation", score: 74, unit: "percentage" }
            ]
          },
          ai_recommendations: {
            description: "Specific AI implementations ranked by impact and feasibility",
            implementations: [
              {
                name: "Customer Query Classification",
                description: "Automatically categorize incoming support tickets",
                technology: "GPT-4 + Custom Training",
                confidence: 94,
                cost_per_month: 3200,
                currency: "USD",
                impact: "High",
                risk: "Low",
                priority: 1
              },
              {
                name: "Response Generation",
                description: "Generate initial responses for common queries",
                technology: "Claude-3 + RAG System",
                confidence: 87,
                cost_per_month: 5800,
                currency: "USD",
                impact: "High",
                risk: "Medium",
                priority: 2
              },
              {
                name: "Sentiment Analysis",
                description: "Detect customer sentiment for priority routing",
                technology: "Specialized NLP Model",
                confidence: 91,
                cost_per_month: 1500,
                currency: "USD",
                impact: "Medium",
                risk: "Low",
                priority: 3
              }
            ]
          },
          risk_assessment: {
            description: "Potential risks and mitigation strategies",
            risks: [
              {
                severity: "Medium",
                name: "API Dependency",
                details: "External API reliability may impact performance"
              },
              {
                severity: "High",
                name: "Data Privacy",
                details: "PII processing requires enhanced security measures"
              }
            ]
          },
          metadata: {
            generated_date: new Date().toISOString().split('T')[0],
            version: "1.0",
            total_recommendations: 3,
            total_monthly_cost: 10500,
            currency: "USD"
          }
        }
      };

      const mockCostData = {
        current_state: {
          monthly_operational_cost: parseFloat(formData.laborCosts || '0') + parseFloat(formData.toolsCosts || '0') + parseFloat(formData.infrastructureCosts || '0') + parseFloat(formData.otherCosts || '0'),
          manual_processing: "75%",
          response_time: "45%",
          accuracy: "87%"
        },
        optimized_state: {
          monthly_ai_cost: 6900,
          cost_reduction_percentage: "72.4%",
          automated_processing: "85%",
          response_time: "92%",
          accuracy: "94%"
        },
        cost_breakdown: {
          monthly_total: 6900,
          annual_total: 82800,
          categories: [
            { category: "GPT-4 API Calls", monthly_cost: 2400, percentage: "35%" },
            { category: "Claude-3 Processing", monthly_cost: 1800, percentage: "26%" },
            { category: "Custom Model Training", monthly_cost: 1200, percentage: "17%" },
            { category: "Vector Database", monthly_cost: 800, percentage: "12%" },
            { category: "Infrastructure", monthly_cost: 700, percentage: "10%" }
          ]
        },
        cost_vs_quality_analysis: {
          financial_impact: {
            annual_cost_savings: 217200,
            implementation_investment: 75000,
            break_even_period_months: 4.2
          },
          quality_improvements: {
            response_accuracy: { before: "87%", after: "94%", change: "+7%" },
            processing_speed: { before: "45%", after: "78%", change: "+33%" },
            customer_satisfaction: { before: "82%", after: "91%", change: "+9%" },
            error_rate: { before: "12%", after: "4%", change: "-8%" }
          }
        }
      };

      setAnalysisData(mockAnalysisData);
      setCostData(mockCostData);
      setCurrentStep('analysis');
      toast.success('Analysis completed successfully!');
    } catch (error) {
      console.error('Error analyzing business:', error);
      toast.error('Failed to analyze business. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReport = () => {
    setCurrentStep('report');
  };

  const handleStartOver = () => {
    setCurrentStep('form');
    setAnalysisData(null);
    setCostData(null);
  };

  const handleBackToAnalysis = () => {
    setCurrentStep('analysis');
  };

  if (currentStep === 'form') {
    return (
      <BusinessProfileForm 
        onAnalyze={handleAnalyzeBusiness}
        isLoading={isLoading}
      />
    );
  }

  if (currentStep === 'analysis') {
    return (
      <AnalysisResults
        analysisData={analysisData}
        costData={costData}
        onGenerateReport={handleGenerateReport}
        onStartOver={handleStartOver}
      />
    );
  }

  if (currentStep === 'report') {
    return (
      <ReportGeneration
        analysisData={analysisData}
        costData={costData}
        onBack={handleBackToAnalysis}
      />
    );
  }

  return null;
};

export default Index;
