"use client"
import { useState, useEffect } from "react";
import { Loader2, ExternalLink, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface SwotProps {
  message: string;
  onBack: () => void;
}

export default function Swot({ message: propMessage, onBack }: SwotProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewDetails, setViewDetails] = useState({});
  
  useEffect(() => {
    if (propMessage) {
      handleFetchData();
    }
  }, [propMessage]);

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://agent-prod.studio.lyzr.ai/v3/inference/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf'
        },
        body: JSON.stringify({
          "user_id": "katewamukul@gmail.com",
          "agent_id": "684816b0b67a5a754564eb0d",
          "session_id": "684816b0b67a5a754564eb0d-3fa9ybibmwh",
          "message": propMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch SWOT analysis data.");
    } finally {
      setLoading(false);
    }
  };

  // Logo component using tailwind
  const SwotLogo = () => (
    <div className="flex items-center space-x-2">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 bg-purple-500 rounded-full opacity-70"></div>
        <div className="absolute inset-1 bg-purple-700 rounded-full"></div>
        <div className="absolute inset-3 bg-white rounded-full"></div>
        <div className="absolute inset-4 bg-purple-500 rounded-full opacity-30"></div>
      </div>
      <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-500 text-transparent bg-clip-text">
        SwotVision
      </span>
    </div>
  );

  // Parse the response if available
  const parsedResponse = data?.response ? JSON.parse(data.response) : null;
  const swotData = parsedResponse?.swot_analysis || parsedResponse;

  const toggleDetails = (id) => {
    setViewDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Enhanced SWOT Card component for detailed structure
  const DetailedSwotCard = ({ item, color, index, category }) => {
    const id = `${category}-${index}`;
    
    return (
      <Card className={`mb-4 border-l-4 ${color}`}>
        <CardHeader className={`bg-opacity-10 ${color.replace('border', 'bg')} pb-3`}>
          <CardTitle className="text-gray-800 text-lg">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div>
            <p className="text-gray-600 mb-3">
              {viewDetails[id] ? item.description : item.description.substring(0, 100) + (item.description.length > 100 ? "..." : "")}
            </p>
            {item.description.length > 100 && (
              <Button 
                variant="link" 
                className="p-0 h-auto text-purple-600 mb-3" 
                onClick={() => toggleDetails(id)}
              >
                {viewDetails[id] ? "View Less" : "View More"}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            )}
          </div>
          
          {/* Show examples if available */}
          {item.examples && item.examples.length > 0 && viewDetails[id] && (
            <div className="mt-3">
              <h4 className="font-medium text-purple-700 mb-2">Examples:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {item.examples.map((example, idx) => (
                  <li key={idx} className="text-gray-700">{example}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Show comparison if available */}
          {item.comparison && viewDetails[id] && (
            <div className="mt-3 pt-2 border-t border-gray-100">
              <h4 className="font-medium text-purple-700 mb-1">Comparison:</h4>
              <p className="text-gray-700">{item.comparison}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  // Business Profile Card
  const BusinessProfileCard = ({ profile }) => (
    <Card className="mb-6">
      <CardHeader className="bg-purple-50 pb-3">
        <CardTitle className="text-purple-800">{profile.name}</CardTitle>
        <CardDescription>
          {profile.industry} | {profile.size}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-purple-700 mb-2">Current Challenges:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {profile.current_challenges.map((challenge, idx) => (
                <li key={idx} className="text-gray-700">{challenge}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-purple-700 mb-2">Existing Infrastructure:</h3>
            <p className="text-gray-700">{profile.existing_tech_infrastructure}</p>
          </div>
          
          <div>
            <h3 className="font-medium text-purple-700 mb-2">AI Goals:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {profile.ai_goals.map((goal, idx) => (
                <li key={idx} className="text-gray-700">{goal}</li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-purple-100 sticky top-0 z-10">
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
            <SwotLogo />
          </div>
          <h1 className="text-lg font-semibold text-purple-700">SWOT Analysis Tool</h1>
        </div>
      </header>

      <div className="container mx-auto p-4 md:p-6">
        {loading && (
          <div className="flex justify-center my-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto" />
              <p className="mt-4 text-purple-700">Creating your SWOT analysis...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md flex items-center">
            <span className="mr-2">⚠️</span>
            {error}
          </div>
        )}

        {swotData && (
          <div className="space-y-6">
            {/* Show business profile if available */}
            {swotData.business_profile && (
              <BusinessProfileCard profile={swotData.business_profile} />
            )}
            
            {/* Brief description */}
            {swotData.brief && (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <p className="text-gray-700 italic">{swotData.brief}</p>
                </CardContent>
              </Card>
            )}
            
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              {/* Strengths Section */}
              {swotData.strengths && (
                <div>
                  <h2 className="text-xl font-bold text-green-700 mb-3">Strengths</h2>
                  {Array.isArray(swotData.strengths) ? (
                    swotData.strengths.map((item, index) => (
                      <DetailedSwotCard 
                        key={index}
                        item={item}
                        index={index}
                        category="strengths"
                        color="border-green-500"
                      />
                    ))
                  ) : (
                    <Card className="mb-4 border-l-4 border-green-500">
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{swotData.strengths}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Weaknesses Section */}
              {swotData.weaknesses && (
                <div>
                  <h2 className="text-xl font-bold text-red-700 mb-3">Weaknesses</h2>
                  {Array.isArray(swotData.weaknesses) ? (
                    swotData.weaknesses.map((item, index) => (
                      <DetailedSwotCard 
                        key={index}
                        item={item}
                        index={index}
                        category="weaknesses"
                        color="border-red-500"
                      />
                    ))
                  ) : (
                    <Card className="mb-4 border-l-4 border-red-500">
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{swotData.weaknesses}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Opportunities Section */}
              {swotData.opportunities && (
                <div>
                  <h2 className="text-xl font-bold text-blue-700 mb-3">Opportunities</h2>
                  {Array.isArray(swotData.opportunities) ? (
                    swotData.opportunities.map((item, index) => (
                      <DetailedSwotCard 
                        key={index}
                        item={item}
                        index={index}
                        category="opportunities"
                        color="border-blue-500"
                      />
                    ))
                  ) : (
                    <Card className="mb-4 border-l-4 border-blue-500">
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{swotData.opportunities}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}

              {/* Threats Section */}
              {swotData.threats && (
                <div>
                  <h2 className="text-xl font-bold text-amber-700 mb-3">Threats</h2>
                  {Array.isArray(swotData.threats) ? (
                    swotData.threats.map((item, index) => (
                      <DetailedSwotCard 
                        key={index}
                        item={item}
                        index={index}
                        category="threats"
                        color="border-amber-500"
                      />
                    ))
                  ) : (
                    <Card className="mb-4 border-l-4 border-amber-500">
                      <CardContent className="pt-4">
                        <p className="text-gray-700">{swotData.threats}</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}