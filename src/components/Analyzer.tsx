"use client"
import { useDeferredValue, useEffect, useState } from "react";
import { Send, Loader2, AlertTriangle, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalyzerProps {
  message: string;
  onBack: () => void;
}

export default function Analyzer({ message: propMessage, onBack }: AnalyzerProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewDetails, setViewDetails] = useState({});

  useEffect(() => {
    fetchData();
  }, [propMessage]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf'
        },
        body: JSON.stringify({
          "user_id": "katewamukul@gmail.com",
          "agent_id": "6846d65762d8a0cca7618622",
          "session_id": "68481c3db67a5a754564ec0b-f2vxydssx5p",
          "message": propMessage
        })
      });
      
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch analysis data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logo component using tailwind
  const AnalyzerLogo = () => (
    <div className="flex items-center space-x-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-blue-500 rounded-full opacity-70"></div>
        <div className="absolute inset-1 bg-blue-700 rounded-full"></div>
        <div className="absolute inset-3 bg-white rounded-full"></div>
        <div className="absolute inset-4 bg-blue-500 rounded-full opacity-30"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 text-transparent bg-clip-text">
        FinOptima
      </span>
    </div>
  );

  // Parse the response if available
  const parsedResponse = data?.response ? JSON.parse(data.response) : null;

  const toggleDetails = (id) => {
    setViewDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Generic Card component
  const AnalysisCard = ({ title, description, additionalInfo, badge, id }) => (
    <Card className="mb-4">
      <CardHeader className="bg-blue-50 pb-3">
        <CardTitle className="text-blue-800 text-lg flex items-center">
          {title}
          {badge && <span className="ml-3">{badge}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div>
          <p className="text-gray-600">
            {viewDetails[id] ? description : description.substring(0, 100) + (description.length > 100 ? "..." : "")}
          </p>
          {description.length > 100 && (
            <Button 
              variant="link" 
              className="p-0 h-auto text-blue-600" 
              onClick={() => toggleDetails(id)}
            >
              {viewDetails[id] ? "View Less" : "View More"}
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
        {additionalInfo && viewDetails[id] && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            {Object.entries(additionalInfo).map(([key, value]) => (
              <div key={key} className="mb-2">
                <p className="font-semibold text-gray-700">{key}:</p>
                <p className="text-gray-600">{value}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  // Helper function to generate badges
  const getBadge = (type, value) => {
    const colors = {
      "Low": "bg-green-100 text-green-800",
      "Medium": "bg-yellow-100 text-yellow-800",
      "High": "bg-red-100 text-red-800"
    };
    
    return <Badge className={colors[value] || "bg-gray-100 text-gray-800"}>{value}</Badge>;
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100 sticky top-0 z-10">
        <div className="container mx-auto py-3 px-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Button 
              onClick={onBack}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <AnalyzerLogo />
          </div>
          <h1 className="text-lg font-semibold text-blue-700">AI Financial Optimization Analysis</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">

        {loading && (
          <div className="flex justify-center my-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
              <p className="mt-4 text-blue-700">Analyzing financial data...</p>
            </div>
          </div>
        )}

        {parsedResponse && (
          <div className="space-y-6">
            {/* Key Opportunities Section */}
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-4">Key Opportunities</h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {parsedResponse["Key Opportunities"]?.map((item, index) => (
                  <AnalysisCard
                    key={index}
                    id={`opp-${index}`}
                    title={item.Opportunity}
                    description={item.Description}
                    additionalInfo={{ "Justification": item.Justification }}
                  />
                ))}
              </div>
            </div>
            
            {/* Recommendations Section */}
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-4">Recommendations</h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {parsedResponse["Recommendations"]?.map((item, index) => (
                  <AnalysisCard
                    key={index}
                    id={`rec-${index}`}
                    title={item.Action}
                    description={item.Description}
                    additionalInfo={{ "Cost Savings": item["Cost Savings"] }}
                  />
                ))}
              </div>
            </div>
            
            {/* Quick Wins Section */}
            <div>
              <h2 className="text-xl font-bold text-blue-800 mb-4">Quick Wins</h2>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {parsedResponse["Quick Wins"]?.map((item, index) => (
                  <AnalysisCard
                    key={index}
                    id={`qw-${index}`}
                    title={item.Optimization}
                    description={item.Description}
                    additionalInfo={{ 
                      "Timeline": item.Timeline,
                      "Effort": item.Effort 
                    }}
                    badge={getBadge("effort", item.Effort)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}