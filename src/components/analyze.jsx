"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Building2, AlertTriangle, Target , AlertCircle, ShieldCheck, TrendingUp, Flame } from "lucide-react";


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

export async function callLyzrChatAgentSWOT(userMessage) {
    const url = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
    const apiKey = process.env.LYZR_API_KEY || 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf';
    const payload = {
        user_id: "katewamukul@gmail.com",
        agent_id: "684816b0b67a5a754564eb0d",
        session_id: "684816b0b67a5a754564eb0d-fkd42ftan7m",
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

export default function Analyze({ analysisData }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!analysisData?.message?.trim()) return;

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const result = await callLyzrChatAgentSWOT(analysisData.message);
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
            <div className="text-white text-center p-4">
                No analysis available
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6 sm:p-8 space-y-12 text-black dark:text-white">
            {/* Business Profile */}
            <section className="bg-gradient-to-tr from-slate-900 via-purple-950 to-blue-900 p-8 rounded-2xl shadow-2xl space-y-8 border border-gray-800 mb-10">
  <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-400 to-blue-300 bg-clip-text text-transparent tracking-tight">
    Business Profile Analysis
  </h2>
  <div className="grid md:grid-cols-2 gap-8">
    {/* Organization Details */}
    <Card className="bg-purple-900/40 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <Building2 className="w-6 h-6 text-purple-200" />
          <CardTitle className="text-xl font-semibold text-purple-100">
            Organization Details
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 text-purple-100 text-base">
          <li>
            <span className="font-semibold text-purple-200">Name:</span>
            <span className="ml-2">{analysis?.swot_analysis?.business_profile?.name}</span>
          </li>
          <li>
            <span className="font-semibold text-purple-200">Industry:</span>
            <span className="ml-2">{analysis?.swot_analysis?.business_profile?.industry}</span>
          </li>
          <li>
            <span className="font-semibold text-purple-200">Size:</span>
            <span className="ml-2">{analysis?.swot_analysis?.business_profile?.size}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
    {/* Challenges & Goals */}
    <Card className="bg-blue-900/40 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-6 h-6 text-blue-200" />
          <CardTitle className="text-xl font-semibold text-blue-100">
            Challenges &amp; Goals
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4 text-blue-100 text-base">
          <li>
            <span className="font-semibold text-blue-200">Current Challenges:</span>
            <span className="ml-2">{analysis?.swot_analysis?.business_profile?.current_challenges}</span>
          </li>
          <li>
            <span className="font-semibold text-blue-200">Existing Tech Infrastructure:</span>
            <span className="ml-2">{analysis?.swot_analysis?.business_profile?.existing_tech_infrastructure}</span>
          </li>
          <li>
            <span className="font-semibold text-blue-200">AI Goals:</span>
            <span className="ml-2">{analysis?.swot_analysis?.business_profile?.ai_goals}</span>
          </li>
        </ul>
      </CardContent>
    </Card>
  </div>
</section>



            {/* Brief Overview */}
            

        <section className="bg-gradient-to-tr from-green-900 via-teal-900 to-gray-900 p-8 rounded-2xl shadow-2xl border border-gray-800 mb-10">
            <h2 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-green-400 to-teal-300 bg-clip-text text-transparent tracking-tight">
                Brief Overview
            </h2>
            <div className="bg-white/10 dark:bg-gray-800 p-6 rounded-xl border-l-4 border-green-400 shadow flex flex-col gap-2">
                <div className="flex items-center gap-3 mb-1">
                <AlertCircle className="text-green-300 w-6 h-6" />
                <h3 className="text-lg font-semibold text-green-100">
                    Current Challenges &amp; Summary
                </h3>
                </div>
                <p className="text-white leading-relaxed">
                {analysis?.swot_analysis?.brief}
                </p>
            </div>
        </section>


        {['strengths', 'weaknesses', 'opportunities', 'threats'].map((type) => {
  // Color mapping for section backgrounds
  const sectionBg = {
    strengths:      "bg-green-900/40",
    weaknesses:     "bg-pink-900/40",
    opportunities:  "bg-blue-900/40",
    threats:        "bg-orange-900/40",
  }[type];

  const cardBg = {
    strengths:      "bg-green-800/70",
    weaknesses:     "bg-pink-800/70",
    opportunities:  "bg-blue-800/70",
    threats:        "bg-orange-800/70",
  }[type];

  const colorAccent = {
    strengths:    "from-green-400 to-emerald-500",
    weaknesses:   "from-pink-400 to-red-400",
    opportunities:"from-sky-400 to-blue-400",
    threats:      "from-orange-400 to-red-500",
  }[type];

  const iconMap = {
    strengths:    <ShieldCheck className="w-7 h-7 text-green-300" />,
    weaknesses:   <AlertCircle className="w-7 h-7 text-pink-300" />,
    opportunities:<TrendingUp className="w-7 h-7 text-sky-300" />,
    threats:      <Flame className="w-7 h-7 text-orange-300" />,
  }[type];

  return (
    <section
      key={type}
      className={`p-4 md:p-6 lg:p-8 rounded-2xl shadow-2xl mb-10 border-0 ${sectionBg}`}
    >
      <div className="flex items-center gap-3 mb-6">
        {iconMap}
        <h2 className={`text-2xl font-extrabold capitalize text-gradient bg-gradient-to-r ${colorAccent} bg-clip-text text-transparent tracking-tight`}>
          {type}
        </h2>
      </div>
      {(analysis?.swot_analysis?.[type] || []).map((item, index) => (
        <Card
          key={index}
          className={`mb-7 border-0 shadow-lg ${cardBg} bg-opacity-80`}
        >
          <CardHeader className="flex items-center gap-2 pb-2">
            <CardTitle className={`text-xl font-semibold`}>
              <span className={`bg-gradient-to-r ${colorAccent} bg-clip-text text-transparent`}>
                {item.title}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white">
            <CardDescription>{item.description}</CardDescription>
            <div>
              <h4 className={`text-lg font-semibold mb-1`}>Examples</h4>
              <ul className="list-disc list-inside pl-4 ml-2">
                {item.examples.map((example, i) => <li key={i}>{example}</li>)}
              </ul>
            </div>
            <div>
              <h4 className={`text-lg font-semibold mb-1`}>Comparison</h4>
              <p>{item.comparison}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </section>
  );
})}


            </div>

    );
}
