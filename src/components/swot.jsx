"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, CheckCircle2, Bolt , ShieldAlert} from "lucide-react";

const message = "This medium-sized logistics and last-mile delivery service, with a total monthly expenditure of ₹15,00,000, currently utilizes cloud-based AI for route optimization (saving 15% on fuel) and a website chatbot for customer service (handling 40% of inquiries), spending ₹1,20,000 monthly on these tools. While route optimization is highly effective, chatbot integration with their on-premise order system has faced some challenges; they are exploring AI for predictive vehicle maintenance, with two IT staff managing AI subscriptions and strictly adhering to Indian data protection laws for customer data.";

export function removeMarkdown(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }
    return text
        .replace(/^#{1,6}\s+/gm, '')                          // Headers
        .replace(/(\*\*|__)(.*?)\1/g, '$2')                   // Bold
        .replace(/(\*|_)(.*?)\1/g, '$2')                      // Italic
        .replace(/~~(.*?)~~/g, '$1')                          // Strikethrough
        .replace(/`+([^`]+)`+/g, '$1')                        // Inline code
        .replace(/```[\w]*\n([\s\S]*?)```/g, '$1')            // Code blocks
        .replace(/^>\s+/gm, '')                               // Blockquotes
        .replace(/^[-*]{3,}$/gm, '')                          // Horizontal rules
        .replace(/\$\$([^\$]+)\]\$\$[^)]+\$\$/g, '$1')        // Links
        .replace(/!\$\$([^\$]*)\]\$\$[^)]+\$\$/g, '$1')       // Images
        .replace(/^\s*[-*+]\s+/gm, '')                        // Unordered list
        .replace(/^\s*\d+\.\s+/gm, '')                        // Ordered list
        .replace(/\n{3,}/g, '\n\n')                           // Excess newlines
        .trim();
}

export async function callLyzrChatAgentAnaly(userMessage) {
    const url = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
    const apiKey = process.env.LYZR_API_KEY || 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf';
    const payload = {
        user_id: "katewamukul@gmail.com",
        agent_id: "6846d65762d8a0cca7618622",
        session_id: "6846d65762d8a0cca7618622-gshylpfkf0n",
        message: userMessage
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    let cleanResponse = removeMarkdown(result.response);
    if (cleanResponse.startsWith('json')) {
        cleanResponse = cleanResponse.replace(/^json\s*/i, '').trim();
    }
    return JSON.parse(cleanResponse);
}

export default function SWOT({ analysisData }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!analysisData?.message?.trim()) return;

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const result = await callLyzrChatAgentAnaly(analysisData.message);
                console.log(result)
                setAnalysis(result);
                setError(null);
            } catch (err) {
                setError(err.message);
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [analysisData]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading analysis...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[200px]">
                <div className="text-red-500 text-center">
                    <p>Error: {error}</p>
                </div>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div className="text-gray-500 text-center p-4">
                No analysis available
            </div>
        );
    }

    return (
        <div className="mb-8">
            <h2 className="text-lg font-semibold mb-2">Opporutnity Analysis</h2>
            
            <section className="bg-gradient-to-tr from-sky-900 via-blue-900 to-slate-900 p-8 rounded-2xl shadow-2xl border border-blue-800 mb-10">
  <h2 className="text-3xl font-extrabold mb-8 bg-gradient-to-r from-blue-300 to-sky-400 bg-clip-text text-transparent tracking-tight">
    Key Opportunities
  </h2>
  <div className="space-y-6">
    {analysis["Key Opportunities"]?.map((opportunity, index) => (
      <div
        key={index}
        className="p-6 rounded-2xl shadow-lg border-0 bg-gradient-to-br from-sky-100 via-white to-blue-50 dark:from-blue-900/60 dark:via-slate-900 dark:to-blue-900 transition"
      >
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-6 h-6 text-sky-500 dark:text-sky-300" />
          <h3 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-sky-400 dark:from-sky-300 dark:to-blue-400 bg-clip-text text-transparent">
            Opportunity: <span className="capitalize">{opportunity.Opportunity}</span>
          </h3>
        </div>
        <p className="text-gray-700 dark:text-blue-100 mb-2">
          <span className="font-semibold text-sky-600 dark:text-sky-300">Description:</span>{" "}
          {opportunity.Description}
        </p>
        <p className="text-green-700 dark:text-green-400 font-bold tracking-wide mt-3">
          Cost Savings: <span className="font-semibold">{opportunity.Justification}</span>
        </p>
      </div>
    ))}
  </div>
</section>
            

<section className="bg-gradient-to-tr from-emerald-900 via-gray-900 to-sky-950 p-8 rounded-2xl shadow-2xl border border-emerald-800 mb-10">
  <div className="flex items-center gap-2 mb-4">
    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
    <h2 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent">
      Recommendations
    </h2>
  </div>
  <div className="space-y-6">
    {analysis?.Recommendations?.map((data, index) => (
      <Card
        key={index}
        className="border-0 bg-gradient-to-br from-emerald-50/80 via-white/90 to-sky-50 dark:from-emerald-950/60 dark:via-gray-900 dark:to-sky-950/70 shadow-lg rounded-xl"
      >
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-emerald-700 dark:text-emerald-300">
            Action: <span className="font-normal">{data.Action}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-gray-700 dark:text-gray-200 mb-3">
            {data.Description}
          </CardDescription>
          <Badge
            variant="outline"
            className="mt-2 border-emerald-400 bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200"
          >
            💸 Cost Savings: {data["Cost Savings"]}
          </Badge>
        </CardContent>
      </Card>
    ))}
  </div>
</section>



                <section className="bg-gradient-to-tr from-slate-900 via-green-900 to-blue-900 p-8 rounded-2xl shadow-2xl space-y-8 border border-gray-800 mb-10">
                    <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-blue-300 bg-clip-text text-transparent tracking-tight">
                        Quick Wins
                    </h2>
                    <div className="grid md:grid-cols-2 gap-8">
                        {analysis["Quick Wins"]?.map((opportunity, index) => (
                        <Card key={index} className="bg-green-900/40 border-0 shadow-lg">
                            <CardHeader className="pb-2">
                            <div className="flex items-center gap-2 mb-1">
                                <Bolt className="w-6 h-6 text-green-200" /> {/* Use a "Bolt" or lightning icon */}
                                <CardTitle className="text-xl font-semibold text-green-100">
                                {opportunity.Optimization}
                                </CardTitle>
                            </div>
                            </CardHeader>
                            <CardContent>
                            <div className="space-y-4 text-green-100 text-base">
                                <div>
                                <span className="font-semibold text-green-200">Description:</span>
                                <span className="ml-2">{opportunity.Description}</span>
                                </div>
                                <div>
                                <span className="inline-block mr-4">
                                    <Badge variant="outline" className="text-green-200 border-green-500 bg-green-800/60">
                                    Timeline: {opportunity.Timeline}
                                    </Badge>
                                </span>
                                <span>
                                    <Badge variant="outline" className="text-green-200 border-green-500 bg-green-800/60">
                                    Effort: {opportunity.Effort}
                                    </Badge>
                                </span>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        ))}
                    </div>
                    </section>



                    <section className="bg-gradient-to-tr from-slate-900 via-red-900 to-blue-900 p-8 rounded-2xl shadow-2xl space-y-8 border border-gray-800 mb-10">
  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-red-400 to-blue-300 bg-clip-text text-transparent tracking-tight">
    Sensitive Data Exposure
  </h2>
  <div className="grid md:grid-cols-2 gap-8">
    {analysis["Sensitive Data Exposure"]?.map((opportunity, index) => (
      <Card key={index} className="bg-red-900/40 border-0 shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <ShieldAlert className="w-6 h-6 text-red-200" />
            <CardTitle className="text-xl font-semibold text-red-100">
              Category: {opportunity.Category}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-red-100 text-base">
            <div>
              <span className="font-semibold text-red-200">Description:</span>
              <span className="ml-2">{opportunity.Description}</span>
            </div>
            <div>
              <span className="inline-block mr-4">
                <Badge variant="outline" className="text-red-200 border-red-500 bg-red-800/60">
                  Risk Level: {opportunity["Risk Level"]}
                </Badge>
              </span>
              <span>
                <Badge variant="outline" className="text-blue-200 border-blue-400 bg-blue-800/60">
                  Protection Measures: {opportunity["Protection Measures"]}
                </Badge>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</section>


        </div>
    );
};