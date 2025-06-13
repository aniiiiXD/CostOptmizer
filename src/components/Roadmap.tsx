"use client"
import { useState, useEffect } from "react";
import { Loader2, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RoadmapProps {
  message: string;
  onBack: () => void;
}

export default function Roadmap({ message: propMessage, onBack }: RoadmapProps) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({});
  
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
          "agent_id": "684c1a1de5203d8a7b64cd82",
          "session_id": `684c1a1de5203d8a7b64cd82-ua6zdnu88go`,
          "message": propMessage
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
      
      // Initialize expanded sections based on the structure
      if (result?.response) {
        try {
          // Try to parse if the response is JSON
          const parsedResponse = JSON.parse(result.response);
          // Initialize all top-level sections as expanded
          const initialExpandedState = {};
          if (Array.isArray(parsedResponse)) {
            parsedResponse.forEach((_, index) => {
              initialExpandedState[index] = true;
            });
          } else {
            Object.keys(parsedResponse).forEach(key => {
              initialExpandedState[key] = true;
            });
          }
          setExpandedSections(initialExpandedState);
          // Store the parsed response
          setData({...result, parsedResponse});
        } catch (e) {
          // If not valid JSON, just use the string response
          console.log("Response is not valid JSON, using as string");
        }
      }
      
      console.log(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch roadmap data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (key) => {
    setExpandedSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const renderJsonValue = (value) => {
    if (value === null) return <span className="text-gray-500">null</span>;
    if (typeof value === "boolean") return <span className="text-purple-600">{value.toString()}</span>;
    if (typeof value === "number") return <span className="text-blue-600">{value}</span>;
    if (typeof value === "string") {
      // Check if it's a URL
      if (value.startsWith("http://") || value.startsWith("https://")) {
        return <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{value}</a>;
      }
      return <span className="text-green-600">"{value}"</span>;
    }
    return null;
  };

  const renderJsonObject = (obj, level = 0) => {
    if (Array.isArray(obj)) {
      return (
        <div className="pl-4">
          {obj.map((item, index) => (
            <div key={index} className="my-1">
              {typeof item === "object" && item !== null ? (
                <div>
                  <button 
                    onClick={() => toggleSection(`${level}-${index}`)}
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                  >
                    {expandedSections[`${level}-${index}`] ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                    <span className="font-mono">[{index}]:</span>
                  </button>
                  {expandedSections[`${level}-${index}`] && (
                    renderJsonObject(item, level + 1)
                  )}
                </div>
              ) : (
                <div className="pl-4 flex items-center">
                  <span className="font-mono text-gray-500">[{index}]: </span>
                  {renderJsonValue(item)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    } else if (typeof obj === "object" && obj !== null) {
      return (
        <div className="pl-4">
          {Object.entries(obj).map(([key, value], index) => (
            <div key={key} className="my-1">
              {typeof value === "object" && value !== null ? (
                <div>
                  <button 
                    onClick={() => toggleSection(`${level}-${key}`)}
                    className="flex items-center gap-1 text-gray-700 hover:text-blue-600"
                  >
                    {expandedSections[`${level}-${key}`] ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                    <span className="font-mono text-gray-800 font-medium">{key}:</span>
                  </button>
                  {expandedSections[`${level}-${key}`] && (
                    renderJsonObject(value, level + 1)
                  )}
                </div>
              ) : (
                <div className="pl-4 flex items-start">
                  <span className="font-mono text-gray-800 font-medium mr-2">{key}:</span>
                  {renderJsonValue(value)}
                </div>
              )}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-4">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-xl font-semibold">AI Roadmap</h1>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-gray-600">Loading roadmap...</p>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200">
          Error: {error}
        </div>
      )}

      {/* Content display */}
      {data && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Roadmap Results</h2>
          
          {data.parsedResponse ? (
            <div className="bg-gray-50 p-4 rounded-md font-mono text-sm overflow-auto">
              {renderJsonObject(data.parsedResponse)}
            </div>
          ) : data.response ? (
            <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm">
              {data.response}
            </div>
          ) : (
            <p className="text-gray-500">No data to display</p>
          )}
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <details className="text-xs text-gray-500">
              <summary className="cursor-pointer hover:text-gray-700">View raw response</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto text-xs">
                {JSON.stringify(data, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}