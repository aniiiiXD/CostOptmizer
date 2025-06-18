"use client";

import { useState } from "react";
import Analyze from "../components/analyze";
import COST from "../components/cost";
import Roadmap from "../components/roadmap";
import SWOT from "../components/swot";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Rocket } from "lucide-react";
import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Home() {
  const [userMessage, setUserMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);
  const [selectedTab, setSelectedTab] = useState("analyze");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userMessage.trim()) {
      setError("Please enter a business description");
      return;
    }
    setError(null);
    setLoading(true);
    setTimeout(() => {
      setAnalysisData({ message: userMessage });
      setLoading(false);
    }, 1000);
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-[#101219] via-[#191b22] to-[#262838] text-white font-sans">
      
      {/* NAV BAR */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-gray-900/80 to-gray-800/70 shadow-lg border border-gray-700/30 rounded-full px-8 py-3 flex items-center justify-between min-w-[340px] w-max max-w-3xl backdrop-blur-lg">
        {/* Brand section on the left */}
        <div className="flex items-center gap-3">
          <Rocket className="h-6 w-6 text-gray-300" />
          <span className="font-bold tracking-widest text-xl text-gray-100">Aetherius</span>
          <span className="ml-3 text-sm text-gray-400 hidden md:block italic">AI Business Copilot</span>
        </div>
        {/* Auth buttons/user button on the right */}
        <div className="flex items-center gap-2 ml-6">
          <SignedOut>
            <SignInButton>
              <button className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-sm font-medium transition focus:outline-none">
                Sign in
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-2 py-1 bg-indigo-100 hover:bg-indigo-300 text-indigo-900 rounded-md text-sm font-medium transition ml-1 focus:outline-none">
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "ring-2 ring-indigo-500",
                }
              }}
              afterSignOutUrl="/"
            />
          </SignedIn>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="pt-32 pb-16 w-full flex flex-col items-center min-h-screen">
        <div className="w-full max-w-7xl flex flex-col items-center">

          {/* HERO Section */}
          <div className="mb-10 text-center">
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight leading-tight bg-gradient-to-r from-slate-100 via-purple-200 to-blue-100 bg-clip-text text-transparent drop-shadow-2xl">
              Aetherius
            </h1>
            <p className="text-lg mt-6 text-slate-300 max-w-2xl mx-auto font-medium">
              Get deep, actionable business insights with your personal AI copilot. 
              Describe your business idea and receive instant strategic analysis.
            </p>
          </div>

          {/* Form Card */}
          <Card className="w-full max-w-3xl shadow-xl rounded-2xl bg-gradient-to-br from-[#181927] via-[#212234] to-[#24243e] border-0">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-2xl">Describe Your Business</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  className="text-base bg-[#20212b] text-slate-200 border border-slate-700 rounded-lg shadow-inner focus:border-indigo-400 focus:ring-indigo-800 transition placeholder:text-slate-500"
                  placeholder="e.g. A SaaS platform for remote team culture management..."
                  disabled={loading}
                />
                {error && (
                  <p className="text-sm text-red-400 text-left">{error}</p>
                )}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full text-lg rounded-lg bg-gradient-to-r from-indigo-500 via-purple-600 to-blue-400 hover:from-indigo-400 hover:to-purple-500 transition-shadow font-bold shadow-lg"
                  size="lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Business'
                  )}
                </Button>
              </form>
            </CardContent>
            <div className="flex items-start gap-2 bg-[#23253b] border-l-4 border-indigo-500 rounded-md p-4 relative">

                <div className="flex-1">

                  <span className="block text-xs text-indigo-400 font-semibold mb-1">Example Prompt</span>

                  <span className="block text-sm text-slate-300">

                    This medium-sized logistics and last-mile delivery service, with a total monthly expenditure of ₹15,00,000, currently utilizes cloud-based AI for route optimization (saving 15% on fuel) and a website chatbot for customer service (handling 40% of inquiries), spending ₹1,20,000 monthly on these tools. While route optimization is highly effective, chatbot integration with their on-premise order system has faced some challenges; they are exploring AI for predictive vehicle maintenance, with two IT staff managing AI subscriptions and strictly adhering to Indian data protection laws for customer data.

                  </span>

                </div>
              </div>
          </Card>

          {/* Loading */}
          {loading && (
            <div className="w-full mt-8 flex items-center justify-center gap-4 animate-pulse">
              <Loader2 className="h-6 w-6 text-slate-400 animate-spin" />
              <span className="text-slate-300">Processing your idea...</span>
            </div>
          )}

          {/* Tabs + Results */}
          {analysisData && !loading && (
            <div className="w-full mt-12 px-1 sm:px-4">
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 bg-[#222635] rounded-lg overflow-hidden shadow-lg border-0 mx-auto max-w-7xl">
                  <TabsTrigger className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-300 font-semibold" value="analyze">
                    Analysis
                  </TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-300 font-semibold" value="cost">
                    Cost
                  </TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-300 font-semibold" value="roadmap">
                    Roadmap
                  </TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-300 font-semibold" value="swot">
                    SWOT
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="analyze" className="mt-6 w-full">
                  <div className="text-left text-slate-100 font-medium w-full min-h-[60vh]">
                    <Analyze analysisData={analysisData} />
                  </div>
                </TabsContent>
                <TabsContent value="cost" className="mt-6 w-full">
                  <div className="text-left text-slate-100 font-medium w-full min-h-[60vh]">
                    <COST analysisData={analysisData} />
                  </div>
                </TabsContent>
                <TabsContent value="roadmap" className="mt-6 w-full">
                  <div className="text-left text-slate-100 font-medium w-full min-h-[60vh]">
                    <Roadmap analysisData={analysisData} />
                  </div>
                </TabsContent>
                <TabsContent value="swot" className="mt-6 w-full">
                  <div className="text-left text-slate-100 font-medium w-full min-h-[60vh]">
                    <SWOT analysisData={analysisData} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
                  </div>
      </div>
    </main>
  );
}