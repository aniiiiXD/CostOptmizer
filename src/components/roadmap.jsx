"use client"
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator"; 
import { CheckCircle, Briefcase, Users, Cpu, Wallet, Globe, Target, Clock , DollarSign , ArrowDown} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid , ResponsiveContainer, PieChart , Pie, Cell} from 'recharts';
import { motion } from 'framer-motion';
import { RadialProgress } from './radialProgress';



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

const COLORS = ['#3b82f6', '#06b6d4', '#8b5cf6', '#10b981', '#f59e0b'];

return (
    <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        AI Transformation Roadmap Analysis
      </h1>
  
      {/* Profile Section */}
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Organization Profile</CardTitle>
          <CardDescription>Snapshot of company size, AI readiness, and strategic focus.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">

            {/* Industry */}
            <div className="flex items-start gap-3">
              <Briefcase className="w-6 h-6 text-blue-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Industry</p>
                <p>{analysis?.organization_profile?.industry}</p>
              </div>
            </div>

            {/* Company Size */}
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-purple-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Size</p>
                <p>{analysis?.organization_profile?.size}</p>
              </div>
            </div>

            {/* AI Maturity with bar */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <Cpu className="w-6 h-6 text-green-500" />
                <p className="font-semibold text-gray-800">AI Maturity</p>
              </div>
              <div className="text-sm">{analysis?.organization_profile?.ai_maturity} (Some Pilot Projects)</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: "50%" }} />
              </div>
            </div>

            {/* Budget */}
            <div className="flex items-start gap-3">
              <Wallet className="w-6 h-6 text-amber-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Budget</p>
                <p>${analysis?.organization_profile?.budget?.toLocaleString()}</p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <Globe className="w-6 h-6 text-indigo-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Location Considerations</p>
                <p>{analysis?.organization_profile?.location || "Likely GDPR-compliant"}</p>
              </div>
            </div>

            {/* Goal */}
            <div className="flex items-start gap-3 md:col-span-2 lg:col-span-1">
              <Target className="w-6 h-6 text-red-500 mt-1" />
              <div>
                <p className="font-semibold text-gray-800">Primary Goal</p>
                <p>{analysis?.organization_profile?.goal}</p>
              </div>
            </div>

          </div>
        </CardContent>
      </Card>

  
      <Separator className="my-8 bg-gray-300" />
  
      {/* Executive Summary Section */}
      <Card className="mb-8 shadow-lg">
      
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-2xl shadow-lg">
          <CardTitle className="text-2xl font-bold">Executive Summary</CardTitle>
          <CardDescription className="text-emerald-100">
            Visual summary of key recommendations, timeline, and investment
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col space-y-6 p-6">
            
            {/* Recommendations Section */}
            <motion.div 
              className="bg-white p-5 rounded-lg shadow-md border-l-4 border-green-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-4">
                <CheckCircle className="text-green-500 w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Key Recommendations</h3>
              </div>
              <ul className="space-y-3 text-gray-700">
                {analysis?.executive_summary?.recommendations?.map((rec, index) => (
                  <motion.li 
                    key={index} 
                    className="flex items-start gap-3 p-2 hover:bg-green-50 rounded-md transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <CheckCircle className="text-green-500 w-5 h-5 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Timeline Section */}
            <motion.div 
              className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <Clock className="text-blue-500 w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Implementation Timeline</h3>
              </div>
              <div className="space-y-0">
                {Object.entries(analysis?.executive_summary?.timeline || {}).map(([phase, description], index) => (
                  <motion.div 
                    key={index}
                    className="relative"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                  >
                    <div className="ml-6 pb-6 relative">
                      {index < Object.entries(analysis?.executive_summary?.timeline || {}).length - 1 && (
                        <div className="absolute top-0 left-0 ml-2.5 h-full w-0.5 bg-blue-200"></div>
                      )}
                      <div className="absolute top-0 left-0 w-5 h-5 rounded-full bg-blue-500 border-2 border-white"></div>
                      <div className="ml-8">
                        <div className="font-semibold capitalize text-gray-800 text-lg">
                          {phase.replace('_', ' ')}
                        </div>
                        <div className="text-gray-600 mt-1">{description}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Investment Section */}
            <motion.div 
              className="bg-white p-5 rounded-lg shadow-md border-l-4 border-purple-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <div className="flex items-center mb-4">
                <DollarSign className="text-purple-500 w-6 h-6 mr-2" />
                <h3 className="text-xl font-semibold text-gray-800">Investment Summary</h3>
              </div>
              <div className="flex flex-col items-center">
                <BarChart 
                  width={300} 
                  height={200} 
                  data={[
                    { name: 'Capex', value: analysis?.executive_summary?.investment?.capex || 0 },
                    { name: 'Opex', value: analysis?.executive_summary?.investment?.opex || 0 },
                  ]}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8b5cf6" />
                </BarChart>
                
                <div className="flex items-center mt-4 bg-purple-50 p-3 rounded-lg">
                  <DollarSign className="text-purple-600 w-5 h-5 mr-1" />
                  <span className="font-bold text-purple-700">Total Investment:</span>
                  <span className="ml-2 text-gray-800 font-semibold">
                    ${analysis?.executive_summary?.investment?.total?.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
            
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
      
      <Card className="mb-10 shadow-xl border border-gray-200">
  <CardHeader className="pb-4">
    <CardTitle className="text-3xl font-semibold flex items-center gap-2">
      <DollarSign className="h-6 w-6 text-green-600" />
      Project Budget Breakdown
    </CardTitle>
    <CardDescription className="text-muted-foreground">
      Visual and tabular breakdown of funds across project categories.
    </CardDescription>
  </CardHeader>

  <CardContent className="pt-0 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {analysis?.team_structure?.roles?.map((role, index) => {
            const salaryStr = role.salary_range?.[0] || "";
            const cleaned = salaryStr.replace(/[₹,]/g, "").split("-").map(s => parseInt(s.trim()));
            let avgSalary = 0;
            if (cleaned.length === 2 && !isNaN(cleaned[0]) && !isNaN(cleaned[1])) {
              avgSalary = ((cleaned[0] + cleaned[1]) / 2) * (role.headcount || 1);
            }
            return (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Personnel</Badge>
                    {role.name}
                  </div>
                </TableCell>
                <TableCell className="text-right text-green-700 font-medium">
                  ₹{avgSalary.toLocaleString()}
                </TableCell>
              </TableRow>
            );
          })}

          {analysis?.budget?.technology?.cloudaiservices && (
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Technology</Badge>
                  Cloud AI Services
                </div>
              </TableCell>
              <TableCell className="text-right text-blue-700 font-medium">
                ₹{analysis.budget.technology.cloudaiservices.toLocaleString()}
              </TableCell>
            </TableRow>
          )}

          {analysis?.budget?.contingency && (
            <TableRow>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Other</Badge>
                  Contingency
                </div>
              </TableCell>
              <TableCell className="text-right text-yellow-700 font-medium">
                ₹{analysis.budget.contingency.toLocaleString()}
              </TableCell>
            </TableRow>
          )}

          <TableRow className="bg-gray-100 font-semibold text-black">
            <TableCell>Total Project Budget</TableCell>
            <TableCell className="text-right">
              ₹{(() => {
                let total = 0;
                analysis?.team_structure?.roles?.forEach((role) => {
                  const salaryStr = role.salary_range?.[0] || "";
                  const cleaned = salaryStr.replace(/[₹,]/g, "").split("-").map(s => parseInt(s.trim()));
                  if (cleaned.length === 2 && !isNaN(cleaned[0]) && !isNaN(cleaned[1])) {
                    total += ((cleaned[0] + cleaned[1]) / 2) * (role.headcount || 1);
                  }
                });
                total += analysis?.budget?.technology?.cloudaiservices || 0;
                total += analysis?.budget?.contingency || 0;
                return total.toLocaleString();
              })()}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
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