"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; 


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

export async function callLyzrChatAgentRoadmap(userMessage) {
    const url = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
    const apiKey = process.env.LYZR_API_KEY || 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf';
    const payload = {
        user_id: "katewamukul@gmail.com",
        agent_id: "684c1a1de5203d8a7b64cd82",
        session_id: "684c1a1de5203d8a7b64cd82-ngg7yos3uzq",
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

export default function Roadmap({ analysisData }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!analysisData?.message?.trim()) return;

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                const result = await callLyzrChatAgentRoadmap(analysisData.message);
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

    // Assuming 'analysis' is your JSON data object
// const analysis = { ... };

return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        AI Transformation Roadmap Analysis
      </h1>
  
      {/* Profile Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Organization Profile</CardTitle>
          <CardDescription>Overview of the company's current state and AI readiness.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 text-gray-700">
          <div>
            <p className="font-semibold text-gray-800">Industry:</p>
            <p>{analysis?.organization_profile?.industry}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Size:</p>
            <p>{analysis?.organization_profile?.size}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">AI Maturity:</p>
            <p>{analysis?.organization_profile?.ai_maturity} (Some Pilot Projects)</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Budget:</p>
            <p>${analysis?.organization_profile?.budget?.toLocaleString()}</p>
          </div>
          <div>
            <p className="font-semibold text-gray-800">Location Considerations:</p>
            <p>{analysis?.organization_profile?.location || "Not specified, but data protection compliance indicates likely adherence to GDPR or similar regulations."}</p>
          </div>
          <div className="md:col-span-2 lg:col-span-1">
            <p className="font-semibold text-gray-800">Primary Goal:</p>
            <p>{analysis?.organization_profile?.goal}</p>
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Executive Summary Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Executive Summary</CardTitle>
          <CardDescription>Key recommendations, timeline, and investment overview.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Recommendations</h3>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {analysis?.executive_summary?.recommendations?.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Timeline Phases</h3>
              <div className="space-y-2 text-gray-700">
                {Object.entries(analysis?.executive_summary?.timeline || {}).map(([phase, description], index) => (
                  <p key={index}>
                    <strong className="capitalize">{phase.replace('_', ' ')}:</strong> {description}
                  </p>
                ))}
              </div>
            </div>
            <div className="col-span-1">
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Investment Summary</h3>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Total:</strong> ${analysis?.executive_summary?.investment?.total?.toLocaleString()}
                </p>
                <p>
                  <strong>Capex:</strong> ${analysis?.executive_summary?.investment?.capex?.toLocaleString()}
                </p>
                <p>
                  <strong>Opex:</strong> ${analysis?.executive_summary?.investment?.opex?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Team Structure Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Team Structure</CardTitle>
          <CardDescription>Key roles and hiring plan for the AI initiative.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {analysis?.team_structure?.roles?.map((role, index) => (
              <Card key={index} className="border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-semibold">{role.name}</CardTitle>
                  <CardDescription>Headcount: {role.headcount}</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-gray-700">
                  <p className="mb-2">
                    <span className="font-medium">Credentials:</span> {role.credentials}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Hiring Timeline:</span> {role.hiring_timeline}
                  </p>
                  <p className="mb-2">
                    <span className="font-medium">Sourcing:</span> {role.sourcing}
                  </p>
                  <p>
                    <span className="font-medium">Salary Range:</span>{" "}
                    ${role.salary_range[0]?.toLocaleString()} - ${role.salary_range[1]?.toLocaleString()} (INR)
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md text-blue-800 text-sm">
            <p className="font-semibold">Diversity Goal:</p>
            <p>{analysis?.team_structure?.diversity_goal}</p>
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Budget Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Project Budget Breakdown</CardTitle>
          <CardDescription>Detailed allocation of funds for personnel, technology, and contingency.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Personnel (AI/ML Engineer)</TableCell>
                <TableCell className="text-right">${analysis?.budget?.personnel?.aimlengineer?.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Personnel (Data Scientist)</TableCell>
                <TableCell className="text-right">${analysis?.budget?.personnel?.data_scientist?.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Personnel (Product Manager AI Focus)</TableCell>
                <TableCell className="text-right">${analysis?.budget?.personnel?.productmanagerai_focus?.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Technology (Cloud AI Services)</TableCell>
                <TableCell className="text-right">${analysis?.budget?.technology?.cloudaiservices?.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Contingency</TableCell>
                <TableCell className="text-right">${analysis?.budget?.contingency?.toLocaleString()}</TableCell>
              </TableRow>
              <TableRow className="bg-gray-100 font-bold">
                <TableCell>Total Project Budget</TableCell>
                <TableCell className="text-right">
                  ${(
                    (analysis?.budget?.personnel?.aimlengineer || 0) +
                    (analysis?.budget?.personnel?.data_scientist || 0) +
                    (analysis?.budget?.personnel?.productmanagerai_focus || 0) +
                    (analysis?.budget?.technology?.cloudaiservices || 0) +
                    (analysis?.budget?.contingency || 0)
                  )?.toLocaleString()}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Timeline Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Project Timeline & Milestones</CardTitle>
          <CardDescription>Key phases and deliverables with dependencies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analysis?.timeline?.milestones?.map((milestone, index) => (
              <Card key={index} className="flex flex-col md:flex-row items-start md:items-center p-4">
                <div className="flex-shrink-0 mr-4 text-blue-600 font-bold text-xl">
                  Month {milestone.month}
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800">{milestone.name}</h3>
                  <p className="text-sm text-gray-600">
                    Dependencies:{" "}
                    {/* <span className="font-medium">
                      {milestone.dependencies.join(", ") || "None"}
                    </span> */}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Risk Register Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Risk Register</CardTitle>
          <CardDescription>Identified risks, their impact, and mitigation strategies.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {analysis?.risk_register?.map((risk, index) => (
              <Card key={index} className="p-4 border border-red-200 bg-red-50">
                <CardTitle className="text-xl font-semibold mb-2 text-red-800">{risk.name}</CardTitle>
                <div className="flex items-center space-x-2 mb-2">
                  <Badge variant={risk.probability === "High" ? "destructive" : "secondary"}>
                    Probability: {risk.probability}
                  </Badge>
                  <Badge variant={risk.impact === "Critical" ? "destructive" : "secondary"}>
                    Impact: {risk.impact}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-medium">Mitigation:</span> {risk.mitigation}
                </p>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Mitigation Budget:</span>{" "}
                  ${risk.mitigation_budget?.toLocaleString()}
                </p>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Success Metrics Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Success Metrics</CardTitle>
          <CardDescription>Key performance indicators for technical and business objectives.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Technical Metrics</h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              {analysis?.success_metrics?.technical?.map((metric, index) => (
                <li key={index}>{metric}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Business Metrics</h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              {analysis?.success_metrics?.business?.map((metric, index) => (
                <li key={index}>{metric}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Change Management Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Change Management</CardTitle>
          <CardDescription>Strategies for stakeholder engagement and training.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Stakeholder Engagement</h3>
            <p className="mb-2 text-gray-700">
              <span className="font-medium">Champions:</span>{" "}
              <Badge variant="outline">{analysis?.change_management?.stakeholders?.champions.join(", ")}</Badge>
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Potential Resistors:</span>{" "}
              <Badge variant="secondary">{analysis?.change_management?.stakeholders?.resistors?.group}</Badge>
            </p>
            <p className="text-sm text-gray-600 mt-1">
              Strategy: {analysis?.change_management?.stakeholders?.resistors?.strategy}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Training & Development</h3>
            <p className="mb-2 text-gray-700">
              <span className="font-medium">Plan:</span> {analysis?.change_management?.training?.plan}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Budget:</span> ${analysis?.change_management?.training?.budget?.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Technology Roadmap Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Technology Roadmap</CardTitle>
          <CardDescription>Evolution of AI capabilities and infrastructure.</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Short Term Initiatives</h3>
            <ul className="list-disc ml-5 space-y-1 text-gray-700">
              {analysis?.technology_roadmap?.short_term?.tools?.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Budget:</span> ${analysis?.technology_roadmap?.short_term?.budget?.toLocaleString()}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Long Term Vision (Year {analysis?.technology_roadmap?.long_term?.year})</h3>
            <p className="text-gray-700 mb-2">
              <span className="font-medium">Goal:</span> {analysis?.technology_roadmap?.long_term?.goal}
            </p>
            <p className="text-gray-700">
              <span className="font-medium">Budget:</span> ${analysis?.technology_roadmap?.long_term?.budget?.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Governance Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Governance & Oversight</CardTitle>
          <CardDescription>Decision-making authority and reporting structure.</CardDescription>
        </CardHeader>
        <CardContent className="text-gray-700">
          <p className="mb-2">
            <span className="font-medium">Key Approvers:</span>{" "}
            <Badge>{analysis?.governance?.approvers.join(", ")}</Badge>
          </p>
          <p>
            <span className="font-medium">Reporting:</span> {analysis?.governance?.reporting}
          </p>
        </CardContent>
      </Card>
  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Long Term Strategy Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Long-Term Strategy & Scaling</CardTitle>
          <CardDescription>Future growth and innovation plans for AI.</CardDescription>
        </CardHeader>
        <CardContent className="text-gray-700">
          <p className="mb-2">
            <span className="font-medium">Scaling Trigger:</span> {analysis?.longtermstrategy?.scaling_trigger}
          </p>
          <p>
            <span className="font-medium">Innovation Pipeline:</span> {analysis?.longtermstrategy?.innovation_pipeline}
          </p>
        </CardContent>
      </Card>
    </div>
  );

}