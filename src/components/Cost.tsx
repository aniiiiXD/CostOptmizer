"use client"
import { useState, useEffect } from "react";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CostProps {
  message: string;
  onBack: () => void;
}

export default function Cost({ message: propMessage, onBack }: CostProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (propMessage) {
      handleFetchData();
    }
  }, [propMessage]);

  const handleFetchData = async () => {
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
          "agent_id": "68481c3db67a5a754564ec0b",
          "session_id": "68481c3db67a5a754564ec0b-lnwuolwkkzr",
          "message": propMessage
        })
      });
      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to fetch cost analysis data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Logo component using tailwind
  const CostLogo = () => (
    <div className="flex items-center space-x-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-emerald-500 rounded-full opacity-70"></div>
        <div className="absolute inset-1 bg-emerald-700 rounded-full"></div>
        <div className="absolute inset-3 bg-white rounded-full"></div>
        <div className="absolute inset-4 bg-emerald-500 rounded-full opacity-30"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-400 text-transparent bg-clip-text">
        Aetherius
      </span>
    </div>
  );

  // Parse the response if available
  const parsedResponse = data?.response ? JSON.parse(data.response) : null;

  return (
    <div className="min-h-screen bg-emerald-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100 sticky top-0 z-10">
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
            <CostLogo />
          </div>
          <h1 className="text-lg font-semibold text-emerald-700">AI Cost Optimization Analysis</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">
        {loading && (
          <div className="flex justify-center my-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-emerald-600 mx-auto" />
              <p className="mt-4 text-emerald-700">Analyzing cost data...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {parsedResponse && (
          <Card>
            <CardHeader className="bg-emerald-50">
              <CardTitle className="text-emerald-800">Full JSON Response</CardTitle>
            </CardHeader>
            <CardContent className="pt-5">
              <div className="bg-white p-4 rounded-lg border border-emerald-100 shadow-sm overflow-auto">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap break-words">
                  {JSON.stringify(parsedResponse, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}