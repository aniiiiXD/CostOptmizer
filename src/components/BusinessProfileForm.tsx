import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { Building2, Users, AlertCircle, DollarSign, Brain, Target } from 'lucide-react';
import Logo from './Logo';

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

interface BusinessProfileFormProps {
  onAnalyze: (formData: FormData) => void;
  isLoading: boolean;
}

const BusinessProfileForm: React.FC<BusinessProfileFormProps> = ({ onAnalyze, isLoading }) => {
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    employeeCount: '',
    painPoints: [],
    otherPainPoint: '',
    timeSpent: '',
    laborCosts: '',
    toolsCosts: '',
    infrastructureCosts: '',
    otherCosts: '',
    aiBudget: '',
    timeline: '',
    targetSavings: '',
    expectedROI: '',
    priorities: [],
    otherPriority: ''
  });

  const [totalCosts, setTotalCosts] = useState(0);

  const businessTypes = [
    'E-commerce',
    'SaaS / Technology',
    'Retail / Physical Store',
    'Manufacturing',
    'Professional Services',
    'Healthcare',
    'Financial Services',
    'Education',
    'Hospitality',
    'Other'
  ];

  const employeeCounts = [
    '1-10',
    '11-50',
    '51-200',
    '201-500',
    '501-1000',
    '1000+'
  ];

  const painPointOptions = [
    'Customer support / query handling',
    'Data entry and processing',
    'Document management and classification',
    'Sales lead generation and qualification',
    'Marketing campaign optimization',
    'Inventory management and forecasting',
    'Supply chain optimization',
    'Financial analysis and reporting',
    'Human Resources',
    'IT operations and security',
    'Quality control and assurance'
  ];

  const timeSpentOptions = [
    'Less than 10% of work time',
    '10-25% of work time',
    '25-50% of work time',
    'More than 50% of work time'
  ];

  const budgetOptions = [
    'Less than $1,000',
    '$1,000 - $5,000',
    '$5,001 - $10,000',
    '$10,001 - $25,000',
    '$25,001 - $50,000',
    'More than $50,000'
  ];

  const timelineOptions = [
    '1-3 months (Rapid Pilot)',
    '3-6 months (Phased Approach)',
    '6-12 months (Strategic Rollout)',
    '12+ months (Long-term Vision)'
  ];

  const savingsOptions = [
    'Less than 10%',
    '10-25%',
    '25-50%',
    'More than 50%'
  ];

  const roiOptions = [
    'Within 6 months',
    '6-12 months',
    '1-2 years',
    'More than 2 years'
  ];

  const priorityOptions = [
    'Reducing operational costs',
    'Improving efficiency and productivity',
    'Enhancing customer satisfaction',
    'Accelerating innovation',
    'Gaining competitive advantage',
    'Improving data accuracy and insights',
    'Automating routine tasks',
    'Scaling operations',
    'Mitigating risks'
  ];

  useEffect(() => {
    const labor = parseFloat(formData.laborCosts) || 0;
    const tools = parseFloat(formData.toolsCosts) || 0;
    const infrastructure = parseFloat(formData.infrastructureCosts) || 0;
    const other = parseFloat(formData.otherCosts) || 0;
    setTotalCosts(labor + tools + infrastructure + other);
  }, [formData.laborCosts, formData.toolsCosts, formData.infrastructureCosts, formData.otherCosts]);

  const handlePainPointChange = (painPoint: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        painPoints: [...prev.painPoints, painPoint]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        painPoints: prev.painPoints.filter(p => p !== painPoint)
      }));
    }
  };

  const handlePriorityChange = (priority: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        priorities: [...prev.priorities, priority]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        priorities: prev.priorities.filter(p => p !== priority)
      }));
    }
  };

  const isFormValid = () => {
    return (
      formData.businessType &&
      formData.employeeCount &&
      formData.painPoints.length > 0 &&
      formData.timeSpent &&
      formData.laborCosts &&
      formData.aiBudget &&
      formData.timeline &&
      formData.targetSavings &&
      formData.expectedROI &&
      formData.priorities.length > 0
    );
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    return isNaN(num) ? '$0' : `$${num.toLocaleString()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onAnalyze(formData);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Logo className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-4">Analyzing your business...</h3>
            <Progress value={75} className="mb-4" />
            <p className="text-muted-foreground">This may take a moment.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Logo className="h-10 w-10" />
          <div>
            <h1 className="text-3xl font-bold text-green-900">Aetherius</h1>
            <p className="text-green-700">AI Optimization Planner</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Company Information Card */}
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5" />
                Company Information
              </CardTitle>
              <p className="text-green-100">Tell us about your business type and size</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label htmlFor="businessType" className="text-sm font-medium">What type of business do you operate?</Label>
                <Select value={formData.businessType} onValueChange={(value) => setFormData(prev => ({ ...prev, businessType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">How many employees does your business have?</Label>
                <RadioGroup 
                  value={formData.employeeCount} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, employeeCount: value }))}
                  className="grid grid-cols-2 gap-4"
                >
                  {employeeCounts.map(count => (
                    <div key={count} className="flex items-center space-x-2">
                      <RadioGroupItem value={count} id={count} />
                      <Label htmlFor={count} className="text-sm">{count}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Current Challenges Card */}
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <AlertCircle className="h-5 w-5" />
                Current Challenges
              </CardTitle>
              <p className="text-orange-100">Identify your business pain points and time consumption</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">What are your business's biggest pain points or time-consuming processes?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {painPointOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={option}
                        checked={formData.painPoints.includes(option)}
                        onCheckedChange={(checked) => handlePainPointChange(option, checked as boolean)}
                      />
                      <Label htmlFor={option} className="text-sm">{option}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="otherPainPoint"
                      checked={formData.otherPainPoint !== ''}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setFormData(prev => ({ ...prev, otherPainPoint: '' }));
                        }
                      }}
                    />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="otherPainPoint" className="text-sm">Other</Label>
                      <Input
                        placeholder="Specify other pain point"
                        value={formData.otherPainPoint}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherPainPoint: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">Approximately how much time do your employees spend on these identified tasks?</Label>
                <RadioGroup 
                  value={formData.timeSpent} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeSpent: value }))}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {timeSpentOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`time-${option}`} />
                      <Label htmlFor={`time-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Financial Information Card */}
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
              <p className="text-blue-100">Current operational costs and budget breakdown</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <p className="text-sm text-slate-600">Please provide your estimated current monthly costs:</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="laborCosts" className="text-sm font-medium">Labor Costs ($/month)</Label>
                  <Input
                    id="laborCosts"
                    type="number"
                    placeholder="0"
                    value={formData.laborCosts}
                    onChange={(e) => setFormData(prev => ({ ...prev, laborCosts: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="toolsCosts" className="text-sm font-medium">Current Tools & Software ($/month)</Label>
                  <Input
                    id="toolsCosts"
                    type="number"
                    placeholder="0"
                    value={formData.toolsCosts}
                    onChange={(e) => setFormData(prev => ({ ...prev, toolsCosts: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="infrastructureCosts" className="text-sm font-medium">Infrastructure Costs ($/month)</Label>
                  <Input
                    id="infrastructureCosts"
                    type="number"
                    placeholder="0"
                    value={formData.infrastructureCosts}
                    onChange={(e) => setFormData(prev => ({ ...prev, infrastructureCosts: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otherCosts" className="text-sm font-medium">Other Operational Costs ($/month)</Label>
                  <Input
                    id="otherCosts"
                    type="number"
                    placeholder="0"
                    value={formData.otherCosts}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherCosts: e.target.value }))}
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-lg font-semibold text-blue-900">
                  Total Current Monthly Costs: {formatCurrency(totalCosts.toString())}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Implementation Planning Card */}
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-purple-600 to-violet-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Brain className="h-5 w-5" />
                AI Implementation Planning
              </CardTitle>
              <p className="text-purple-100">Budget, timeline and expectations for AI solutions</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">What is your estimated monthly budget for AI solutions?</Label>
                <Select value={formData.aiBudget} onValueChange={(value) => setFormData(prev => ({ ...prev, aiBudget: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select budget range" />
                  </SelectTrigger>
                  <SelectContent>
                    {budgetOptions.map(budget => (
                      <SelectItem key={budget} value={budget}>{budget}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">What is your preferred implementation timeline for AI solutions?</Label>
                <RadioGroup 
                  value={formData.timeline} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeline: value }))}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {timelineOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`timeline-${option}`} />
                      <Label htmlFor={`timeline-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">What is your target cost savings percentage from AI implementation?</Label>
                <RadioGroup 
                  value={formData.targetSavings} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, targetSavings: value }))}
                  className="grid grid-cols-2 gap-4"
                >
                  {savingsOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`savings-${option}`} />
                      <Label htmlFor={`savings-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-medium">What is your expected Return on Investment (ROI) from AI implementation?</Label>
                <RadioGroup 
                  value={formData.expectedROI} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, expectedROI: value }))}
                  className="grid grid-cols-2 gap-4"
                >
                  {roiOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <RadioGroupItem value={option} id={`roi-${option}`} />
                      <Label htmlFor={`roi-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Goals & Priorities Card */}
          <Card className="shadow-lg border-green-200">
            <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="h-5 w-5" />
                Goals & Priorities
              </CardTitle>
              <p className="text-green-100">Define your primary business objectives for AI optimization</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">What are your primary business priorities for AI optimization?</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {priorityOptions.map(option => (
                    <div key={option} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`priority-${option}`}
                        checked={formData.priorities.includes(option)}
                        onCheckedChange={(checked) => handlePriorityChange(option, checked as boolean)}
                      />
                      <Label htmlFor={`priority-${option}`} className="text-sm">{option}</Label>
                    </div>
                  ))}
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="otherPriority"
                      checked={formData.otherPriority !== ''}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setFormData(prev => ({ ...prev, otherPriority: '' }));
                        }
                      }}
                    />
                    <div className="flex-1 space-y-2">
                      <Label htmlFor="otherPriority" className="text-sm">Other</Label>
                      <Input
                        placeholder="Specify other priority"
                        value={formData.otherPriority}
                        onChange={(e) => setFormData(prev => ({ ...prev, otherPriority: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Card className="shadow-lg border-green-200">
            <CardContent className="p-6">
              <Button 
                onClick={handleSubmit}
                size="lg" 
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-4 text-lg"
                disabled={!isFormValid()}
              >
                <Brain className="h-5 w-5 mr-2" />
                Analyze Business
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfileForm;
