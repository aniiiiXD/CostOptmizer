
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Download, FileText, Users, BarChart3, ArrowLeft } from 'lucide-react';
import Logo from './Logo';

interface ReportGenerationProps {
  analysisData: any;
  costData: any;
  onBack: () => void;
}

const ReportGeneration: React.FC<ReportGenerationProps> = ({ 
  analysisData, 
  costData, 
  onBack 
}) => {
  const [selectedReport, setSelectedReport] = useState<string>('technical');

  const generateReportContent = (type: string) => {
    const baseData = {
      analysisData,
      costData,
      generatedDate: new Date().toLocaleDateString(),
      reportType: type
    };

    return JSON.stringify(baseData, null, 2);
  };

  const downloadReport = (type: string) => {
    const content = generateReportContent(type);
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aetherius-${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const TechnicalReport = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Logo className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Technical Implementation Report</h2>
        <p className="text-slate-600">Detailed technical specifications and implementation roadmap</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Recommendations - Technical Details</CardTitle>
        </CardHeader>
        <CardContent>
          {analysisData?.ai_opportunity_assessment?.ai_recommendations?.implementations?.map((impl: any, index: number) => (
            <div key={index} className="mb-6 p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg">{impl.name}</h4>
                <Badge>Priority {impl.priority}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Technology Stack:</strong> {impl.technology}
                </div>
                <div>
                  <strong>Confidence Level:</strong> {impl.confidence}%
                </div>
                <div>
                  <strong>Monthly Cost:</strong> ${impl.cost_per_month?.toLocaleString()}
                </div>
                <div>
                  <strong>Implementation Risk:</strong> {impl.risk}
                </div>
              </div>
              <div className="mt-3">
                <strong>Description:</strong> {impl.description}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Technical Architecture Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Infrastructure Requirements</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Cloud-based AI service integration</li>
                <li>API management and rate limiting</li>
                <li>Data pipeline for model training</li>
                <li>Monitoring and logging systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Security Considerations</h4>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Data encryption in transit and at rest</li>
                <li>Access control and authentication</li>
                <li>Compliance with data privacy regulations</li>
                <li>Regular security audits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const NonTechnicalReport = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Logo className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Executive Summary Report</h2>
        <p className="text-slate-600">Business-focused analysis and strategic recommendations</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Benefits & ROI</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-6">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {costData?.optimized_state?.cost_reduction_percentage}
              </div>
              <div className="text-sm text-slate-600">Cost Reduction</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                ${costData?.cost_vs_quality_analysis?.financial_impact?.annual_cost_savings?.toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Annual Savings</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {costData?.cost_vs_quality_analysis?.financial_impact?.break_even_period_months} months
              </div>
              <div className="text-sm text-slate-600">Break-even Period</div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold">Strategic Advantages</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              <li>Increased operational efficiency through automation</li>
              <li>Enhanced customer satisfaction with faster response times</li>
              <li>Improved data accuracy and decision-making capabilities</li>
              <li>Competitive advantage through AI-driven insights</li>
              <li>Scalable solutions that grow with your business</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Implementation Roadmap</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysisData?.ai_opportunity_assessment?.ai_recommendations?.implementations?.map((impl: any, index: number) => (
              <div key={index} className="flex items-center space-x-4 p-3 bg-slate-50 rounded-lg">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                  {impl.priority}
                </div>
                <div className="flex-1">
                  <h5 className="font-medium">{impl.name}</h5>
                  <p className="text-sm text-slate-600">{impl.description}</p>
                </div>
                <div className="text-right">
                  <div className="font-medium">${impl.cost_per_month?.toLocaleString()}/mo</div>
                  <div className="text-sm text-slate-600">{impl.impact} Impact</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const OverallReport = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Logo className="h-16 w-16 mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Comprehensive AI Optimization Report</h2>
        <p className="text-slate-600">Complete analysis with technical and business insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Opportunity Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analysisData?.ai_opportunity_assessment?.opportunity_score?.areas?.map((area: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm">{area.name}</span>
                  <span className="font-bold">{area.score}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Current Monthly Cost:</span>
                <span className="font-medium">${costData?.current_state?.monthly_operational_cost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Optimized Monthly Cost:</span>
                <span className="font-medium text-green-600">${costData?.optimized_state?.monthly_ai_cost?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="font-medium">Monthly Savings:</span>
                <span className="font-bold text-green-600">
                  ${(costData?.current_state?.monthly_operational_cost - costData?.optimized_state?.monthly_ai_cost)?.toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysisData?.ai_opportunity_assessment?.risk_assessment?.risks?.map((risk: any, index: number) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{risk.name}</h5>
                  <Badge variant={risk.severity === 'High' ? 'destructive' : risk.severity === 'Medium' ? 'default' : 'secondary'}>
                    {risk.severity}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">{risk.details}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quality Improvements Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(costData?.cost_vs_quality_analysis?.quality_improvements || {}).map(([key, value]: [string, any]) => (
              <div key={key} className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="font-medium text-sm capitalize">{key.replace('_', ' ')}</div>
                <div className="text-xs text-slate-600 mb-1">{value.before} → {value.after}</div>
                <div className={`font-bold ${value.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {value.change}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Analysis
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Report Generation</h1>
              <p className="text-slate-600">Download your AI optimization reports</p>
            </div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Quick Downloads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => downloadReport('technical')}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4" />
                Technical Report
              </Button>
              <Button 
                onClick={() => downloadReport('non-technical')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <Users className="h-4 w-4" />
                Executive Summary
              </Button>
              <Button 
                onClick={() => downloadReport('overall')}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
              >
                <BarChart3 className="h-4 w-4" />
                Complete Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Tabs value={selectedReport} onValueChange={setSelectedReport}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="technical">Technical</TabsTrigger>
                <TabsTrigger value="non-technical">Executive</TabsTrigger>
                <TabsTrigger value="overall">Complete</TabsTrigger>
              </TabsList>
              
              <div className="p-6">
                <TabsContent value="technical">
                  <TechnicalReport />
                </TabsContent>
                
                <TabsContent value="non-technical">
                  <NonTechnicalReport />
                </TabsContent>
                
                <TabsContent value="overall">
                  <OverallReport />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportGeneration;
