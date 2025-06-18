"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

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
            <div className="text-gray-500 text-center p-4">
                No analysis available
            </div>
        );
    }

    return (
        <div className="mb-8">
            <div className="bg-white p-8 shadow-md rounded-lg mb-8 text-black">
                <h2 className="text-2xl font-bold mb-4">Business Profile Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Organization Details</h3>
                    <div className="space-y-2">
                        <p><strong>Name:</strong> {analysis?.swot_analysis?.business_profile?.name}</p>
                        <p><strong>Industry:</strong> {analysis?.swot_analysis?.business_profile?.industry}</p>
                        <p><strong>Size:</strong> {analysis?.swot_analysis?.business_profile?.size}</p>
                    </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2">Challenges and Goals</h3>
                    <div className="space-y-2">
                        <p><strong>Current Challenges:</strong> {analysis?.swot_analysis?.business_profile?.current_challenges}</p>
                        <p><strong>Existing Tech Infrastructure:</strong> {analysis?.swot_analysis?.business_profile?.existing_tech_infrastructure}</p>
                        <p><strong>AI Goals:</strong> {analysis?.swot_analysis?.business_profile?.ai_goals}</p>
                    </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 shadow-md rounded-lg mb-8">
            <h2 className="text-2xl font-bold mb-4">Brief Overview</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Current Challenges and Summary</h3>
                <p className="text-gray-600">{analysis?.swot_analysis?.brief}</p>
            </div>
            </div>

            
            
            <div className="3 container mx-auto p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-4">Strengths</h2>
            {analysis?.swot_analysis?.strengths?.map((strength, index) => (
            <Card key={index} className="mb-4">
                <CardHeader>
                <CardTitle>{strength.title}</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>{strength.description}</CardDescription>
                <h4 className="text-lg font-bold mt-4 mb-2">Examples:</h4>
                <ul className="list-disc ml-5 text-gray-600">
                    {strength.examples.map((example, exIndex) => (
                    <li key={exIndex}>{example}</li>
                    ))}
                </ul>
                <h4 className="text-lg font-bold mt-4 mb-2">Comparison:</h4>
                <p>{strength.comparison}</p>
                </CardContent>
            </Card>
            ))}
            </div>

            
            <div className="4 container mx-auto p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-4">Weaknesses</h2>
            {analysis?.swot_analysis?.weaknesses?.map((weak, index) => (
            <Card key={index} className="mb-4">
                <CardHeader>
                <CardTitle>{weak.title}</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>{weak.description}</CardDescription>
                <h4 className="text-lg font-bold mt-4 mb-2">Examples:</h4>
                <ul className="list-disc ml-5 text-gray-600">
                    {weak.examples.map((example, exIndex) => (
                    <li key={exIndex}>{example}</li>
                    ))}
                </ul>
                <h4 className="text-lg font-bold mt-4 mb-2">Comparison:</h4>
                <p>{weak.comparison}</p>
                </CardContent>
            </Card>
            ))}
            </div>

            <div className="5 container mx-auto p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-4">Opportunities</h2>
            {analysis?.swot_analysis?.opportunities?.map((opp, index) => (
            <Card key={index} className="mb-4">
                <CardHeader>
                <CardTitle>{opp.title}</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>{opp.description}</CardDescription>
                <h4 className="text-lg font-bold mt-4 mb-2">Examples:</h4>
                <ul className="list-disc ml-5 text-gray-600">
                    {opp.examples.map((example, exIndex) => (
                    <li key={exIndex}>{example}</li>
                    ))}
                </ul>
                <h4 className="text-lg font-bold mt-4 mb-2">Comparison:</h4>
                <p>{opp.comparison}</p>
                </CardContent>
            </Card>
            ))}
            </div>

            <div className="6 container mx-auto p-4 md:p-6 lg:p-8">
            <h2 className="text-2xl font-bold mb-4">Threats</h2>
            {analysis?.swot_analysis?.threats?.map((threat, index) => (
            <Card key={index} className="mb-4">
                <CardHeader>
                <CardTitle>{threat.title}</CardTitle>
                </CardHeader>
                <CardContent>
                <CardDescription>{threat.description}</CardDescription>
                <h4 className="text-lg font-bold mt-4 mb-2">Examples:</h4>
                <ul className="list-disc ml-5 text-gray-600">
                    {threat.examples.map((example, exIndex) => (
                    <li key={exIndex}>{example}</li>
                    ))}
                </ul>
                <h4 className="text-lg font-bold mt-4 mb-2">Comparison:</h4>
                <p>{threat.comparison}</p>
                </CardContent>
            </Card>
            ))}
            </div>

        </div>
    );
}
