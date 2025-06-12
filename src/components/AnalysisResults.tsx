
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, TrendingUp, DollarSign, Clock, AlertTriangle } from 'lucide-react';

interface AnalysisResultsProps {
  analysisData: any;
  costData: any;
  onGenerateReport: () => void;
  onStartOver: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ 
  analysisData, 
  costData, 
  onGenerateReport, 
  onStartOver 
}) => {
  const getRiskColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Optimization Analysis</h1>
            <p className="text-slate-600">Your personalized AI implementation strategy</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onStartOver}>
              Start Over
            </Button>
            <Button onClick={onGenerateReport} className="bg-gradient-to-r from-blue-600 to-purple-600">
              Generate Report
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Opportunity Score Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                AI Opportunity Assessment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {analysisData?.ai_opportunity_assessment?.opportunity_score?.areas?.map((area: any, index: number) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{area.name}</span>
                    <span className="text-sm font-semibold">{area.score}%</span>
                  </div>
                  <Progress value={area.score} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Cost Savings Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Cost Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">
                  {costData?.optimized_state?.cost_reduction_percentage}
                </div>
                <div className="text-sm text-slate-600">Cost Reduction</div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Current Monthly</span>
                  <span className="font-medium">${costData?.current_state?.monthly_operational_cost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Optimized Monthly</span>
                  <span className="font-medium text-green-600">${costData?.optimized_state?.monthly_ai_cost?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-medium">Annual Savings</span>
                  <span className="font-bold text-green-600">
                    ${costData?.cost_vs_quality_analysis?.financial_impact?.annual_cost_savings?.toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>AI Implementation Recommendations</CardTitle>
            <p className="text-sm text-slate-600">
              Prioritized AI solutions based on impact and feasibility
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysisData?.ai_opportunity_assessment?.ai_recommendations?.implementations?.map((impl: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{impl.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        Priority {impl.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{impl.description}</p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span>Technology:</span>
                        <span className="font-medium">{impl.technology}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monthly Cost:</span>
                        <span className="font-medium">${impl.cost_per_month?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Impact:</span>
                        <Badge className={getImpactColor(impl.impact)} variant="secondary">
                          {impl.impact}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="font-medium">{impl.confidence}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cost Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Cost Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">${costData?.cost_breakdown?.monthly_total?.toLocaleString()}</div>
                  <div className="text-sm text-slate-600">Monthly AI Costs</div>
                </div>
                {costData?.cost_breakdown?.categories?.map((category: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{category.category}</span>
                      <span className="font-medium">${category.monthly_cost?.toLocaleString()} ({category.percentage})</span>
                    </div>
                    <Progress value={parseInt(category.percentage)} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quality Improvements */}
          <Card>
            <CardHeader>
              <CardTitle>Quality Improvements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(costData?.cost_vs_quality_analysis?.quality_improvements || {}).map(([key, value]: [string, any]) => (
                  <div key={key} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <div>
                      <div className="font-medium capitalize">{key.replace('_', ' ')}</div>
                      <div className="text-sm text-slate-600">
                        {value.before} → {value.after}
                      </div>
                    </div>
                    <div className="flex items-center">
                      {value.change.startsWith('+') ? (
                        <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-600 mr-1" />
                      )}
                      <span className={`font-medium ${value.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {value.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Assessment */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Risk Assessment & Mitigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysisData?.ai_opportunity_assessment?.risk_assessment?.risks?.map((risk: any, index: number) => (
                <Card key={index} className="border-l-4 border-l-yellow-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{risk.name}</h4>
                      <div className={`w-3 h-3 rounded-full ${getRiskColor(risk.severity)}`}></div>
                    </div>
                    <Badge variant="outline" className="mb-2 text-xs">
                      {risk.severity} Risk
                    </Badge>
                    <p className="text-sm text-slate-600">{risk.details}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Financial Impact Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Financial Impact Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  ${costData?.cost_vs_quality_analysis?.financial_impact?.annual_cost_savings?.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Annual Cost Savings</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  ${costData?.cost_vs_quality_analysis?.financial_impact?.implementation_investment?.toLocaleString()}
                </div>
                <div className="text-sm text-slate-600">Implementation Investment</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {costData?.cost_vs_quality_analysis?.financial_impact?.break_even_period_months} months
                </div>
                <div className="text-sm text-slate-600">Break-even Period</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalysisResults;
