
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BusinessForm } from "@/components/BusinessForm";
import { Brain, TrendingUp, Zap } from "lucide-react";
import { FormData } from "@/types/formTypes";

const Index = () => {
  const [formData, setFormData] = useState<FormData>({
    businessType: "",
    employees: "",
    businessDescription: "",
    painPoints: [],
    taskTime: "",
    laborCosts: 0,
    toolsCosts: 0,
    infrastructureCosts: 0,
    otherCosts: 0,
    aiBudget: "",
    timeline: "",
    targetSavings: "",
    expectedROI: "",
    priorities: [],
    customPainPoint: "",
    customPriority: ""
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = async (data: FormData) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate API calls - in real implementation, this would call the actual APIs
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Store form data and navigate to report
      localStorage.setItem('analysisData', JSON.stringify(data));
      navigate('/report');
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-primary to-primary/70 rounded-xl shadow-lg">
              <Brain className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Aetherius AI Optimization Planner</h1>
              <p className="text-sm text-muted-foreground">Business Profile & Analysis</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Transform Your Business with AI
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Help us understand your business to provide tailored AI recommendations that drive efficiency, 
            reduce costs, and accelerate growth.
          </p>
        </div>

        {/* Benefits Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Cost Optimization</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Identify opportunities to reduce operational costs by up to 50% through intelligent automation
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Efficiency Boost</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Streamline workflows and eliminate repetitive tasks to focus on high-value activities
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-all duration-300">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Smart Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Get data-driven recommendations tailored to your specific business needs and goals
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Main Form */}
        <div className="max-w-4xl mx-auto">
          <BusinessForm 
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleFormSubmit}
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <Card className="w-96 p-8 text-center">
            <div className="animate-spin w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold mb-2">Analyzing Your Business</h3>
            <p className="text-muted-foreground">
              Our AI is processing your information to generate personalized recommendations...
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;
