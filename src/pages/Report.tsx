
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Brain, ArrowLeft, Download, TrendingUp, DollarSign, Clock, Target } from "lucide-react";
import { FormData, APIResponse } from "@/types/formTypes";

const Report = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [reportData, setReportData] = useState<APIResponse | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    if (!storedData) {
      navigate('/');
      return;
    }

    const data = JSON.parse(storedData);
    setFormData(data);

    // Generate mock report data - in real implementation, this would come from API
    generateMockReportData(data);
  }, [navigate]);

  const generateMockReportData = (data: FormData) => {
    // Mock data generation based on form inputs
    const mockData: APIResponse = {
      ai_opportunity_assessment: [
        { name: "Customer Query Processing", score: 92, unit: "%" },
        { name: "Document Classification", score: 87, unit: "%" },
        { name: "Data Entry Automation", score: 78, unit: "%" },
        { name: "Financial Analysis", score: 84, unit: "%" }
      ],
      ai_recommendations: [
        {
          name: "Customer Query Classification",
          description: "Implement AI-powered customer support automation using natural language processing to categorize and route customer inquiries.",
          technology: "GPT-4 + Custom Training",
          confidence: 94,
          cost_per_month: 3200,
          impact: "High",
          risk: "Low",
          priority: 1
        },
        {
          name: "Document Processing Automation", 
          description: "Automate document classification and data extraction using OCR and machine learning models.",
          technology: "Computer Vision + NLP",
          confidence: 89,
          cost_per_month: 2400,
          impact: "High",
          risk: "Medium",
          priority: 2
        },
        {
          name: "Predictive Analytics Dashboard",
          description: "Deploy predictive models for business forecasting and trend analysis.",
          technology: "Machine Learning Pipeline",
          confidence: 82,
          cost_per_month: 1300,
          impact: "Medium",
          risk: "Low", 
          priority: 3
        }
      ],
      risk_assessment: [
        {
          severity: "Medium",
          name: "API Dependency",
          details: "Reliance on third-party AI services may create operational dependencies and potential service disruptions."
        },
        {
          severity: "Low",
          name: "Data Privacy",
          details: "Ensure compliance with data protection regulations when processing customer information."
        },
        {
          severity: "Low",
          name: "Training Requirements",
          details: "Staff will need training on new AI-powered tools and workflows."
        }
      ],
      current_state: {
        monthly_operational_cost: 25000,
        manual_processing_percentage: 85,
        average_response_time: 4.5,
        current_accuracy: 87
      },
      optimized_state: {
        monthly_ai_cost: 6900,
        automated_processing_percentage: 78,
        improved_response_time: 1.2,
        enhanced_accuracy: 94
      },
      quality_improvements: [
        { metric: "Response Accuracy", before: 87, after: 94, improvement: 7, unit: "%" },
        { metric: "Processing Speed", before: 4.5, after: 1.2, improvement: 73, unit: "hours" },
        { metric: "Customer Satisfaction", before: 78, after: 91, improvement: 13, unit: "%" },
        { metric: "Error Rate", before: 13, after: 6, improvement: -7, unit: "%" }
      ],
      financial_impact: {
        annual_cost_savings: 217200,
        implementation_investment: 75000,
        breakeven_period_months: 4.2
      },
      cost_breakdown: [
        { category: "AI Platform Licensing", monthly_cost: 3200, percentage: 46 },
        { category: "Cloud Infrastructure", monthly_cost: 1800, percentage: 26 },
        { category: "Custom Development", monthly_cost: 1200, percentage: 17 },
        { category: "Support & Maintenance", monthly_cost: 700, percentage: 11 }
      ]
    };

    setReportData(mockData);
  };

  const getRiskColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-purple-100 text-purple-800'; 
      case 'high': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!formData || !reportData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">AI Optimization Report</h1>
                <p className="text-sm text-muted-foreground">Comprehensive Analysis & Recommendations</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Form
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Overall Summary</TabsTrigger>
            <TabsTrigger value="technical">Technical Report</TabsTrigger>
            <TabsTrigger value="business">Business Impact</TabsTrigger>
          </TabsList>

          {/* Overall Summary */}
          <TabsContent value="summary" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly AI Cost</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${reportData.optimized_state.monthly_ai_cost.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Estimated investment</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cost Reduction</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">72.4%</div>
                  <p className="text-xs text-muted-foreground">In operational costs</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">ROI Timeline</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{reportData.financial_impact.breakeven_period_months} mo</div>
                  <p className="text-xs text-muted-foreground">Break-even period</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Annual Savings</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${reportData.financial_impact.annual_cost_savings.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Projected annually</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Top Opportunity Areas</CardTitle>
                <CardDescription>AI implementation potential across your business processes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.ai_opportunity_assessment.map((area, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{area.name}</span>
                      <span>{area.score}%</span>
                    </div>
                    <Progress value={area.score} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Improvements Expected</CardTitle>
                <CardDescription>Performance enhancements from AI implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {reportData.quality_improvements.map((improvement, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{improvement.metric}</span>
                        <Badge variant="secondary" className={improvement.improvement > 0 ? "text-green-700" : "text-red-700"}>
                          {improvement.improvement > 0 ? "+" : ""}{improvement.improvement}{improvement.unit}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {improvement.before}{improvement.unit} → {improvement.after}{improvement.unit}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Technical Report */}
          <TabsContent value="technical" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Recommendations</CardTitle>
                <CardDescription>Specific AI implementations ranked by impact and feasibility</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {reportData.ai_recommendations.map((rec, index) => (
                  <div key={index} className="border rounded-lg p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold">{rec.name}</h3>
                        <p className="text-sm text-muted-foreground">{rec.technology}</p>
                      </div>
                      <Badge className="text-xs">Priority {rec.priority}</Badge>
                    </div>
                    
                    <p className="text-sm">{rec.description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Confidence:</span>
                        <div className="font-medium">{rec.confidence}%</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Monthly Cost:</span>
                        <div className="font-medium">${rec.cost_per_month.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Impact:</span>
                        <Badge className={getImpactColor(rec.impact)}>{rec.impact}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Risk:</span>
                        <Badge className={getRiskColor(rec.risk)}>{rec.risk}</Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Risk Assessment</CardTitle>
                <CardDescription>Potential risks and mitigation strategies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {reportData.risk_assessment.map((risk, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{risk.name}</h3>
                      <Badge className={getRiskColor(risk.severity)}>{risk.severity}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{risk.details}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Business Impact */}
          <TabsContent value="business" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Current vs. Optimized State</CardTitle>
                <CardDescription>Comparison of operational metrics before and after AI implementation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Current State</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monthly Operational Cost</span>
                        <span className="font-medium">${reportData.current_state.monthly_operational_cost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Manual Processing</span>
                        <span className="font-medium">{reportData.current_state.manual_processing_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Response Time</span>
                        <span className="font-medium">{reportData.current_state.average_response_time} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy Rate</span>
                        <span className="font-medium">{reportData.current_state.current_accuracy}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Optimized State</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Monthly AI Cost</span>
                        <span className="font-medium text-green-600">${reportData.optimized_state.monthly_ai_cost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Automated Processing</span>
                        <span className="font-medium text-green-600">{reportData.optimized_state.automated_processing_percentage}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Average Response Time</span>
                        <span className="font-medium text-green-600">{reportData.optimized_state.improved_response_time} hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Accuracy Rate</span>
                        <span className="font-medium text-green-600">{reportData.optimized_state.enhanced_accuracy}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Impact</CardTitle>
                <CardDescription>Investment requirements and return projections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      ${reportData.financial_impact.annual_cost_savings.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Annual Cost Savings</div>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      ${reportData.financial_impact.implementation_investment.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Implementation Investment</div>
                  </div>
                  <div className="text-center p-6 border rounded-lg">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {reportData.financial_impact.breakeven_period_months} months
                    </div>
                    <div className="text-sm text-muted-foreground">Break-even Period</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Cost Breakdown</CardTitle>
                <CardDescription>Monthly AI investment allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reportData.cost_breakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{item.category}</span>
                          <span>${item.monthly_cost.toLocaleString()} ({item.percentage}%)</span>
                        </div>
                        <Progress value={item.percentage} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        {/* Download Section */}
        <Card>
          <CardHeader>
            <CardTitle>Download Your Report</CardTitle>
            <CardDescription>Choose your preferred report format</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Full Report (PDF)</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Technical Report (PDF)</span>
              </Button>
              <Button variant="outline" className="flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Download Executive Summary (PDF)</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Report;
