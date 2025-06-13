"use client"
import Analyzer from "@/components/Analyzer";
import Cost from "@/components/Cost";
import Swot from "@/components/Swot";
import Roadmap from "@/components/Roadmap";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useState } from "react"

export default function Home() {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeComponent, setActiveComponent] = useState<"none" | "analyzer" | "cost" | "swot" | "roadmap">("none");
  const [submittedMessage, setSubmittedMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    setIsLoading(true);
    try {
      console.log("Message sent:", message);
      setSubmittedMessage(message); // Store the message
      setActiveComponent("analyzer"); // Show analyzer first
      setMessage("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setActiveComponent("none");
    setSubmittedMessage("");
  };

  const handleNextToCost = () => {
    setActiveComponent("cost");
  };

  const handleBackToAnalyzer = () => {
    setActiveComponent("analyzer");
  };

  const handleNextToSwot = () => {
    setActiveComponent("swot");
  };

  const handleBackToSwot = () => {
    setActiveComponent("swot");
  };

  const handleNextToRoadmap = () => {
    setActiveComponent("roadmap");
  };

  const handleBackToCost = () => {
    setActiveComponent("cost");
  };

  // Show Analyzer component
  if (activeComponent === "analyzer") {
    return (
      <div className="relative">
        <Analyzer message={submittedMessage} onBack={handleBack} />
        <div className="fixed bottom-4 right-4">
          <Button 
            onClick={handleNextToSwot} 
            className="bg-purple-600 hover:bg-purple-700"
          >
            Next: SWOT Analysis
          </Button>
        </div>
      </div>
    );
  }

  // Show SWOT component
  if (activeComponent === "swot") {
    return (
      <div className="relative">
        <Swot message={submittedMessage} onBack={handleBackToAnalyzer} />
        <div className="fixed bottom-4 right-4">
          <Button 
            onClick={handleNextToCost} 
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Next: Cost Analysis
          </Button>
        </div>
      </div>
    );
  }

  // Show Cost component
  if (activeComponent === "cost") {
    return (
      <div className="relative">
        <Cost message={submittedMessage} onBack={handleBackToSwot} />
        <div className="fixed bottom-4 right-4">
          <Button 
            onClick={handleNextToRoadmap} 
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Next: Implementation Roadmap
          </Button>
        </div>
      </div>
    );
  }

  // Show Roadmap component
  if (activeComponent === "roadmap") {
    return <Roadmap message={submittedMessage} onBack={handleBackToCost} />;
  }

  // Show main input page
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[--background] p-4">
      <div className="max-w-2xl w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[--text-primary]">
            Business Insights
          </h1>
          <p className="text-[--text-secondary]">
            Enter your business details to get started
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter business details..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full pr-12"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2"
              disabled={isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}