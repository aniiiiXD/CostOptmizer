"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
            <h2 className="text-lg font-semibold mb-2">SWOT Analysis</h2>
            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-2">Key Opportunities</h2>
                <div className="space-y-4 text-black">
                    {analysis["Key Opportunities"]?.map((opportunity, index) => (
                        <div key={index} className="p-4 border rounded bg-white shadow">
                            <h3 className="text-lg font-bold mb-2">Opportunity: {opportunity.Opportunity}</h3>
                            <p className="text-gray-700 mb-2">Description: {opportunity.Description}</p>
                            <p className="text-green-600 font-medium">Cost Savings: {opportunity.Justification}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="2">
                <h2 className="text-lg font-semibold mb-2">Recommendations</h2>
                <div className="space-y-4">
                    {analysis?.Recommendations?.map((data, index) => (
                        <Card key={index} className="mb-4">
                            <CardHeader>
                                <CardTitle>Action: {data.Action}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Description: {data.Description}</CardDescription>
                                <Badge variant="outline" className="mt-2">Cost Savings: {data["Cost Savings"]}</Badge>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="3">
                <h2 className="text-lg font-semibold mb-2">Quick Wins</h2>
                <div className="space-y-4">
                    {analysis["Quick Wins"]?.map((opportunity, index) => (
                        <Card key={index} className="mb-4">
                            <CardHeader>
                                <CardTitle>Optimization: {opportunity.Optimization}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Description: {opportunity.Description}</CardDescription>
                                <div className="mt-2 space-y-2">
                                    <Badge variant="outline" className="text-green-600">Timeline: {opportunity.Timeline}</Badge>
                                    <Badge variant="outline" className="text-green-600">Effort: {opportunity.Effort}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="4">
                <h2 className="text-lg font-semibold mb-2">Sensitive Data Exposure</h2>
                <div className="space-y-4">
                    {analysis["Sensitive Data Exposure"]?.map((opportunity, index) => (
                        <Card key={index} className="mb-4">
                            <CardHeader>
                                <CardTitle>Category: {opportunity.Category}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Description: {opportunity.Description}</CardDescription>
                                <div className="mt-2 space-y-2">
                                    <Badge variant="outline" className="text-green-600">Risk Level: {opportunity["Risk Level"]}</Badge>
                                    <Badge variant="outline" className="text-green-600">Protection Measures: {opportunity["Protection Measures"]}</Badge>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>


        </div>
    );
};