import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { FormData } from "@/types/formTypes";

interface BusinessFormProps {
  formData: FormData;
  onFormDataChange: (data: FormData) => void;
  onSubmit: (data: FormData) => void;
  isAnalyzing: boolean;
}

export const BusinessForm = ({ formData, onFormDataChange, onSubmit, isAnalyzing }: BusinessFormProps) => {
  const [showOtherBusiness, setShowOtherBusiness] = useState(false);
  const [showOtherPainPoint, setShowOtherPainPoint] = useState(false);
  const [showOtherPriority, setShowOtherPriority] = useState(false);

  const updateFormData = (updates: Partial<FormData>) => {
    onFormDataChange({ ...formData, ...updates });
  };

  const handlePainPointChange = (value: string, checked: boolean) => {
    if (value === "other") {
      setShowOtherPainPoint(checked);
      if (!checked) {
        updateFormData({ customPainPoint: "" });
      }
    }
    
    const newPainPoints = checked 
      ? [...formData.painPoints, value]
      : formData.painPoints.filter(p => p !== value);
    
    updateFormData({ painPoints: newPainPoints });
  };

  const handlePriorityChange = (value: string, checked: boolean) => {
    if (value === "other") {
      setShowOtherPriority(checked);
      if (!checked) {
        updateFormData({ customPriority: "" });
      }
    }
    
    const newPriorities = checked 
      ? [...formData.priorities, value]
      : formData.priorities.filter(p => p !== value);
    
    updateFormData({ priorities: newPriorities });
  };

  const calculateTotal = () => {
    return formData.laborCosts + formData.toolsCosts + formData.infrastructureCosts + formData.otherCosts;
  };

  const isFormValid = () => {
    return formData.businessType && 
           formData.employees && 
           formData.businessDescription &&
           formData.painPoints.length > 0 && 
           formData.taskTime &&
           formData.aiBudget && 
           formData.timeline && 
           formData.targetSavings && 
           formData.expectedROI && 
           formData.priorities.length > 0;
  };

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmit(formData);
    }
  };

  const businessTypes = [
    "E-commerce",
    "SaaS / Technology", 
    "Retail / Physical Store",
    "Manufacturing",
    "Professional Services (e.g., Consulting, Legal, Accounting)",
    "Healthcare",
    "Financial Services",
    "Education",
    "Hospitality",
    "Other"
  ];

  const employeeCounts = [
    "1-10",
    "11-50", 
    "51-200",
    "201-500",
    "501-1000",
    "1000+"
  ];

  const painPointOptions = [
    "Customer support / query handling",
    "Data entry and processing",
    "Document management and classification", 
    "Sales lead generation and qualification",
    "Marketing campaign optimization",
    "Inventory management and forecasting",
    "Supply chain optimization",
    "Financial analysis and reporting",
    "Human Resources (e.g., recruitment, onboarding)",
    "IT operations and security",
    "Quality control and assurance",
    "Other"
  ];

  const priorityOptions = [
    "Reducing operational costs",
    "Improving efficiency and productivity",
    "Enhancing customer satisfaction",
    "Accelerating innovation", 
    "Gaining competitive advantage",
    "Improving data accuracy and insights",
    "Automating routine tasks",
    "Scaling operations",
    "Mitigating risks",
    "Other"
  ];

  return (
    <div className="space-y-8">
      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
          <CardDescription>Tell us about your business structure and size</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">What type of business do you operate?</Label>
            <RadioGroup 
              value={formData.businessType} 
              onValueChange={(value) => {
                updateFormData({ businessType: value });
                setShowOtherBusiness(value === "Other");
              }}
              className="mt-3"
            >
              {businessTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <RadioGroupItem value={type} id={type} />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </RadioGroup>
            {showOtherBusiness && (
              <Input 
                placeholder="Please specify your business type"
                className="mt-3"
                value={formData.businessType === "Other" ? "" : formData.businessType}
                onChange={(e) => updateFormData({ businessType: e.target.value })}
              />
            )}
          </div>

          <div>
            <Label className="text-base font-medium">How many employees does your business have?</Label>
            <RadioGroup 
              value={formData.employees} 
              onValueChange={(value) => updateFormData({ employees: value })}
              className="mt-3"
            >
              {employeeCounts.map((count) => (
                <div key={count} className="flex items-center space-x-2">
                  <RadioGroupItem value={count} id={count} />
                  <Label htmlFor={count}>{count}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Description of Business */}
      <Card>
        <CardHeader>
          <CardTitle>Description of Business</CardTitle>
          <CardDescription>Provide a brief overview of your business operations and goals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="businessDescription" className="text-base font-medium">
              Describe your business, its main products/services, and current operational challenges
            </Label>
            <Textarea
              id="businessDescription"
              placeholder="e.g., We are a mid-sized e-commerce company specializing in sustainable fashion. We handle around 1,000 orders daily and struggle with inventory management and customer service response times..."
              className="mt-3 min-h-[120px]"
              value={formData.businessDescription || ""}
              onChange={(e) => updateFormData({ businessDescription: e.target.value })}
            />
            <p className="text-sm text-muted-foreground mt-2">
              This helps us better understand your specific context and provide more targeted AI recommendations.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Challenges */}
      <Card>
        <CardHeader>
          <CardTitle>Current Challenges</CardTitle>
          <CardDescription>Help us understand your pain points and time allocation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">What are your business's biggest pain points or time-consuming processes? (Select all that apply)</Label>
            <div className="mt-3 space-y-3">
              {painPointOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option}
                    checked={formData.painPoints.includes(option)}
                    onCheckedChange={(checked) => handlePainPointChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
            {showOtherPainPoint && (
              <Input 
                placeholder="Please describe your other pain points"
                className="mt-3"
                value={formData.customPainPoint}
                onChange={(e) => updateFormData({ customPainPoint: e.target.value })}
              />
            )}
          </div>

          <div>
            <Label className="text-base font-medium">Approximately how much time do your employees spend on these identified tasks?</Label>
            <RadioGroup 
              value={formData.taskTime} 
              onValueChange={(value) => updateFormData({ taskTime: value })}
              className="mt-3"
            >
              {["Less than 10% of work time", "10-25% of work time", "25-50% of work time", "More than 50% of work time"].map((time) => (
                <div key={time} className="flex items-center space-x-2">
                  <RadioGroupItem value={time} id={time} />
                  <Label htmlFor={time}>{time}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Financial Information */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Information</CardTitle>
          <CardDescription>Please provide your estimated current monthly costs</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="labor">Labor Costs ($/month)</Label>
              <Input 
                id="labor"
                type="number" 
                placeholder="0"
                value={formData.laborCosts || ""}
                onChange={(e) => updateFormData({ laborCosts: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="tools">Current Tools & Software ($/month)</Label>
              <Input 
                id="tools"
                type="number" 
                placeholder="0"
                value={formData.toolsCosts || ""}
                onChange={(e) => updateFormData({ toolsCosts: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="infrastructure">Infrastructure Costs ($/month)</Label>
              <Input 
                id="infrastructure"
                type="number" 
                placeholder="0"
                value={formData.infrastructureCosts || ""}
                onChange={(e) => updateFormData({ infrastructureCosts: Number(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="other">Other Operational Costs ($/month)</Label>
              <Input 
                id="other"
                type="number" 
                placeholder="0"
                value={formData.otherCosts || ""}
                onChange={(e) => updateFormData({ otherCosts: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
          
          <div className="p-4 bg-muted rounded-lg">
            <Label className="text-lg font-semibold">
              Total Current Monthly Costs: ${calculateTotal().toLocaleString()}
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* AI Implementation Planning */}
      <Card>
        <CardHeader>
          <CardTitle>AI Implementation Planning</CardTitle>
          <CardDescription>Share your AI investment preferences and expectations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">What is your estimated monthly budget for AI solutions?</Label>
            <RadioGroup 
              value={formData.aiBudget} 
              onValueChange={(value) => updateFormData({ aiBudget: value })}
              className="mt-3"
            >
              {["Less than $1,000", "$1,000 - $5,000", "$5,001 - $10,000", "$10,001 - $25,000", "$25,001 - $50,000", "More than $50,000"].map((budget) => (
                <div key={budget} className="flex items-center space-x-2">
                  <RadioGroupItem value={budget} id={budget} />
                  <Label htmlFor={budget}>{budget}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">What is your preferred implementation timeline for AI solutions?</Label>
            <RadioGroup 
              value={formData.timeline} 
              onValueChange={(value) => updateFormData({ timeline: value })}
              className="mt-3"
            >
              {["1-3 months (Rapid Pilot)", "3-6 months (Phased Approach)", "6-12 months (Strategic Rollout)", "12+ months (Long-term Vision)"].map((timeline) => (
                <div key={timeline} className="flex items-center space-x-2">
                  <RadioGroupItem value={timeline} id={timeline} />
                  <Label htmlFor={timeline}>{timeline}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">What is your target cost savings percentage from AI implementation?</Label>
            <RadioGroup 
              value={formData.targetSavings} 
              onValueChange={(value) => updateFormData({ targetSavings: value })}
              className="mt-3"
            >
              {["Less than 10%", "10-25%", "25-50%", "More than 50%"].map((savings) => (
                <div key={savings} className="flex items-center space-x-2">
                  <RadioGroupItem value={savings} id={savings} />
                  <Label htmlFor={savings}>{savings}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label className="text-base font-medium">What is your expected Return on Investment (ROI) from AI implementation?</Label>
            <RadioGroup 
              value={formData.expectedROI} 
              onValueChange={(value) => updateFormData({ expectedROI: value })}
              className="mt-3"
            >
              {["Within 6 months", "6-12 months", "1-2 years", "More than 2 years"].map((roi) => (
                <div key={roi} className="flex items-center space-x-2">
                  <RadioGroupItem value={roi} id={roi} />
                  <Label htmlFor={roi}>{roi}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Goals & Priorities */}
      <Card>
        <CardHeader>
          <CardTitle>Goals & Priorities</CardTitle>
          <CardDescription>What are your primary business priorities for AI optimization?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label className="text-base font-medium">Select all that apply:</Label>
            <div className="mt-3 space-y-3">
              {priorityOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox 
                    id={option}
                    checked={formData.priorities.includes(option)}
                    onCheckedChange={(checked) => handlePriorityChange(option, checked as boolean)}
                  />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </div>
            {showOtherPriority && (
              <Input 
                placeholder="Please describe your other priorities"
                className="mt-3"
                value={formData.customPriority}
                onChange={(e) => updateFormData({ customPriority: e.target.value })}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button 
          onClick={handleSubmit}
          disabled={!isFormValid() || isAnalyzing}
          size="lg"
          className="px-12 py-6 text-lg"
        >
          {isAnalyzing ? "Analyzing..." : "Analyze Business"}
        </Button>
      </div>
    </div>
  );
};
