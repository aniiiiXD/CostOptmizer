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
import Navbar from "../components/navbar";
import {Info} from "lucide-react"

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
      <Navbar />
      
      {/* MAIN CONTENT */}
      <div className="pt-32 pb-16 w-full flex flex-col items-center min-h-screen">
        <div className="w-full px-10 flex flex-col items-center">

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
          <Card className="w-full max-w-7xl shadow-xl rounded-2xl bg-gradient-to-br from-[#181927] via-[#212234] to-[#24243e] border-0">
            <CardHeader>
              <CardTitle className="text-white font-semibold text-3xl text-center">Describe Your Business</CardTitle>
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

                  <span className="block text-xs text-indigo-400 font-semibold mb-1">How to Write a Great AI Business Evaluation Prompt</span>

                  <ol className="pl-4 mt-4 space-y-5 text-slate-300">
                    <li>
                      <span className="font-bold text-indigo-400">Start with scale and context:</span>{" "}
                      State <b>employee count</b>, <b>total spend</b>, <b>AI budget</b>, and any relevant cost ratios.
                    </li>
                    <li>
                      <span className="font-bold text-indigo-400">Clearly explain how much you are ready to spend on AI operations (this is a must):</span>{" "}
                      This will give us a fair idea to give recommendations.
                    </li>
                    <li>
                      <span className="font-bold text-indigo-400">Clearly list key AI use cases and tools:</span>{" "}
                      Name main AI applications, integration points, and platform types (generative, automation, analytics, etc).
                    </li>
                    <li>
                      <span className="font-bold text-indigo-400">Include outcome details:</span>{" "}
                      Share both <b>positive business impacts</b> <span className="italic text-indigo-300">(e.g., time/cost saved, efficiency gained)</span> <b>and</b>{" "}
                      <b>real challenges</b> or pain points.
                    </li>
                    <li>
                      <span className="font-bold text-indigo-400">Describe technology + people:</span>{" "}
                      Summarize <b>tech stack</b>, <b>infra</b> (cloud/on-prem), <b>team handling AI</b>, and <b>compliance/security</b>.
                    </li>
                    <li>
                      <span className="font-bold text-indigo-400">Be precise and data-driven:</span>{" "}
                      Use <b>specific numbers & timeframes</b>, not vague ranges or only positive claims.
                    </li>
                  </ol>
                  <div className="mt-6">
                    <p className="text-indigo-300 text-base font-semibold mb-2">Example:</p>
                    <div className="bg-gradient-to-r from-indigo-800/50 via-purple-900/40 to-blue-900/40 border-l-4 border-indigo-400 py-3 px-6 text-slate-300 text-sm rounded-lg shadow-inner">
                      With <b>60 employees</b> and a total monthly expenditure of <b>INR 11,00,000</b>, this agency spends <b>INR 1,00,000 per month</b> on cloud-based AI. They use AI for initial resume screening and matching candidates to job descriptions, significantly accelerating the hiring process. Additionally, a chatbot handles basic candidate FAQs about application status. While resume matching has proven highly efficient, the generative AI for drafting personalized candidate outreach emails sometimes requires significant editing. Their systems are a mix of on-premise CRM and cloud AI tools with a small team of <b>3</b> dedicated to managing their AI platforms, ensuring compliance with data protection laws for sensitive candidate personal and professional data.
                    </div>
                  </div>
                  <ul className="mt-7 pl-4 space-y-2 text-indigo-300 text-xs list-disc">
                    <li>✅ Always use specific employee count, spending, & team info</li>
                    <li>✅ Include at least 2 AI use cases + a challenge</li>
                    <li>✅ Add tech stack details (cloud/on-prem/hybrid, integrations)</li>
                    <li>✅ Mention quantifiable impact or improvement</li>
                  </ul>
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
                    SWOT
                  </TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-300 font-semibold" value="cost">
                    Cost
                  </TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-300 font-semibold" value="roadmap">
                    Roadmap
                  </TabsTrigger>
                  <TabsTrigger className="data-[state=active]:bg-indigo-700 data-[state=active]:text-white text-slate-300 font-semibold" value="swot">
                    Analysis
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
