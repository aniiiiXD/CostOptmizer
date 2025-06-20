"use client"
import React, { useState, useEffect } from 'react';
import { CheckCircle, CircleDollarSign, Cpu, Sparkles, BadgeDollarSign,  PiggyBank, PieChart as PieChartIcon, BarChart4 , Timer, ListChecks, Info , AlertTriangle, BookCheck} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Pie, PieChart, Cell, Legend } from "recharts";

const formatCurrency = (amount, currencySymbol) => {
    if (typeof amount !== 'number') {
        return `${currencySymbol}${amount}`; // Handle cases where amount might not be a number but a string like "1,95,000"
    }
 
    return `${currencySymbol}${new Intl.NumberFormat('en-IN').format(amount)}`;
};


export function removeMarkdown(text) {
    if (!text || typeof text !== 'string') {
        return text;
    }
    return text
        .replace(/^#{1,6}\s+/gm, '')             // Headers
        .replace(/(\*\*|__)(.*?)\1/g, '$2')      // Bold
        .replace(/(\*|_)(.*?)\1/g, '$2')         // Italic
        .replace(/~~(.*?)~~/g, '$1')             // Strikethrough
        .replace(/`+([^`]+)`+/g, '$1')           // Inline code
        .replace(/```[\w]*\n([\s\S]*?)```/g, '$1') // Code blocks
        .replace(/^>\s+/gm, '')                 // Blockquotes
        .replace(/^[-*]{3,}$/gm, '')             // Horizontal rules
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Links (simplified to remove url, keep text)
        .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '$1') // Images (simplified to remove url, keep alt text)
        .replace(/^\s*[-*+]\s+/gm, '')           // Unordered list
        .replace(/^\s*\d+\.\s+/gm, '')           // Ordered list
        .replace(/\n{3,}/g, '\n\n')              // Excess newlines
        .trim();
}

/**
 * Calls the Lyzr Chat Agent API to get cost analysis.
 * @param {string} userMessage - The message to send to the AI agent.
 * @returns {Promise<Object>} The parsed JSON response from the agent.
 * @throws {Error} If the API call fails.
 */
export async function callLyzrChatAgentCost(userMessage, retryCount = 0) {
    const MAX_RETRIES = 3;
    const url = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
    const apiKey = process.env.LYZR_API_KEY || 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf';
    const payload = {
        user_id: "katewamukul@gmail.com",
        agent_id: "68481c3db67a5a754564ec0b",
        session_id: "68481c3db67a5a754564ec0b-ra0os4w0nir",
        message: userMessage
    };

    try {
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
        let cleanResponse = result.response;
        
        cleanResponse = removeMarkdown(cleanResponse);
        if (cleanResponse.startsWith('json')) {
            cleanResponse = cleanResponse.replace(/^json\s*/i, '').trim();
        }
        
        return JSON.parse(cleanResponse);
    } catch (err) {
        console.error(`Attempt ${retryCount + 1}: Error in callLyzrChatAgentCost:`, err);
        
        // Only retry if we haven't exceeded max retries
        if (retryCount < MAX_RETRIES) {
            // Implement exponential backoff
            const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s, etc.
            await new Promise(resolve => setTimeout(resolve, delay));
            return callLyzrChatAgentCost(userMessage, retryCount + 1);
        }
        
        throw err;
    }
}


export default function COST({ analysisData }) {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!analysisData?.message?.trim()) {
            setAnalysis(null);
            setError(null);
            return;
        }

        const fetchAnalysis = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await callLyzrChatAgentCost(analysisData.message);
                setAnalysis(result);
            } catch (err) {
                // Only show error if we've exhausted all retries
                if (err.message.includes('Attempt')) {
                    setError("Failed to fetch analysis after multiple attempts. Please try again later.");
                } else {
                    setError(err.message || "An unknown error occurred during API call.");
                }
                console.error('Error fetching analysis:', err);            } finally {
                setLoading(false);
            }
        };

        fetchAnalysis();
    }, [analysisData]);

    if (loading) {
        return (
            <div>
                <p>Loading analysis...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <p>Error: {error}</p>
            </div>
        );
    }

    if (!analysis) {
        return (
            <div>
                <p>No analysis available</p>
            </div>
        );
    }

    const {
        currency,
        title,
        executive_summary,
        currentstatecost_analysis,
        aioptimizedstate,
        implementationinvestmentcosts,
        financial_analysis,
        implementation_timeline,
        keyrecommendationsand_considerations
    } = analysis;

    return (
        <div className="w-full max-w-[1700px] mx-auto px-3 sm:px-8 py-8 space-y-12">

        <div>
        <h2 className="scroll-m-20 text-3xl font-bold tracking-tight mb-2">{title}</h2>
        <p className="text-slate-400 mb-8">All costs are in {currency}</p>
        </div>

        
  
    {/* Executive Summary */}
    {executive_summary && (
      <Card className="mb-10 bg-gradient-to-r from-indigo-900 via-blue-900 to-purple-900 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-green-400 w-7 h-7" />
            <CardTitle className="text-2xl font-bold text-white">
              {executive_summary.title}
            </CardTitle>
          </div>
          <CardDescription className="mt-2 text-slate-200 text-base">
            {executive_summary.content}
          </CardDescription>
        </CardHeader>
      </Card>
    )}

    {/* Current State Cost Analysis */}
    {currentstatecost_analysis && (
      <Card className="mb-10 bg-gradient-to-tr from-gray-900 via-slate-800 to-slate-900 border-0 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CircleDollarSign className="text-teal-300 w-7 h-7" />
            <CardTitle className="text-2xl font-bold text-teal-200">
              {currentstatecost_analysis.title}
            </CardTitle>
          </div>
          <CardDescription className="mt-2 text-slate-300 text-base">
            {currentstatecost_analysis.introduction}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          {currentstatecost_analysis.sections.map((section, index) => (
            <div key={index} className="p-5 rounded-lg bg-slate-800/60 border border-slate-700">
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-indigo-700/80 text-white px-2 py-0.5 rounded uppercase text-xs font-semibold tracking-widest">{`Section ${index + 1}`}</span>
                <h4 className="text-lg font-semibold text-indigo-200">{section.heading}</h4>
              </div>
              <p className="text-slate-300 mb-2">{section.content}</p>
              <ul className="space-y-2 mt-2">
                {section.details.map((detail, detIndex) => (
                  <li key={detIndex} className="flex items-start gap-2 text-slate-200">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-1" />
                    <div>
                      <span className="font-medium text-white">{detail.item}</span>
                      {": "}
                      <span className="text-green-300">{formatCurrency(detail.cost, detail.currency)}</span>
                      <span className="text-slate-400 ml-2">- {detail.description}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>
    )}
  


  {aioptimizedstate && (
  <Card className="mb-10 bg-gradient-to-tr from-[#0f172a] via-fuchsia-900 to-slate-900 border-0 shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Sparkles className="text-pink-400 w-7 h-7" />
        <CardTitle className="text-2xl font-bold text-white">
          {aioptimizedstate.title}
        </CardTitle>
      </div>
      <CardDescription className="mt-2 text-fuchsia-200 text-base">
        {aioptimizedstate.introduction}
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-8">
      {aioptimizedstate.sections.map((section, index) => (
        <div
          key={index}
          className="p-5 rounded-lg bg-fuchsia-900/20 border border-fuchsia-700"
        >
          <div className="flex items-center gap-2 mb-1">
            {section.heading === "Recommended AI Models & Platforms" && (
              <Cpu className="w-5 h-5 text-cyan-300" />
            )}
            {section.heading === "Expected Efficiencies and Savings" && (
              <BadgeDollarSign className="w-5 h-5 text-green-300" />
            )}
            <h4 className="text-lg font-semibold text-fuchsia-100">
              {section.heading}
            </h4>
          </div>
          <p className="text-fuchsia-200 mb-2">{section.content}</p>

          {/* Recommended AI Models & Platforms */}
          {section.heading === "Recommended AI Models & Platforms" && (
            <ul className="space-y-2 mt-2">
              {section.details.map((detail, detIndex) => (
                <li
                  key={detIndex}
                  className="border-l-4 border-cyan-400 pl-4 bg-cyan-900/20 rounded text-cyan-100 py-2"
                >
                  <span className="font-bold">{detail.model}</span>
                  {" "}
                  <span className="bg-fuchsia-700/70 text-white px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wide ml-1">{detail.use_case}</span>
                  : {detail.description}.
                  <span className="ml-3 text-cyan-200">
                    <strong>Cost:</strong> {detail.cost_estimate !== undefined ? formatCurrency(detail.cost_estimate, detail.currency) : "N/A"}
                  </span>
                  {detail.cost_note && (
                    <span className="text-slate-400 ml-1">({detail.cost_note})</span>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* Expected Efficiencies and Savings */}
          {section.heading === "Expected Efficiencies and Savings" && (
            <ul className="space-y-2 mt-2">
              {section.details.map((detail, detIndex) => (
                <li
                  key={detIndex}
                  className="border-l-4 border-green-400 pl-4 bg-green-900/10 rounded text-green-100 py-2"
                >
                  <span className="font-bold">{detail.area}</span>:
                  <span className="text-green-300 ml-2">Before</span> {detail.before},{" "}
                  <span className="text-green-300">After</span> {detail.after}.
                  {" "}
                  <span>
                    <strong className="text-green-200">Saved:</strong> {formatCurrency(detail.saved_cost, detail.currency)}.
                  </span>
                  <span className="text-slate-400 ml-2">{detail.description}</span>
                </li>
              ))}
            </ul>
          )}

          {/* Optional summary below any section */}
          {section.summary && (
            <p className="mt-3 text-slate-300 italic border-l-4 border-fuchsia-300 pl-3">
              {section.summary}
            </p>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
)}



        {/* Implementation Investment Costs */}
{implementationinvestmentcosts && (
  <Card className="mb-10 bg-gradient-to-tr from-rose-950 via-zinc-900 to-gray-900 border-0 shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <PiggyBank className="text-rose-300 w-7 h-7" />
        <CardTitle className="text-2xl font-bold text-white">
          {implementationinvestmentcosts.title}
        </CardTitle>
      </div>
      <CardDescription className="mt-2 text-rose-200 text-base">
        {implementationinvestmentcosts.introduction}
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-8">
      {implementationinvestmentcosts.sections.map((section, index) => {
        // Chart data, if recognizable as cost structure
        const chartData = section.details.map(detail => ({
          name: detail.item,
          value: detail.cost
        }));
        // Assign colors for pie slices
        const colors = ["#f43f5e", "#818cf8", "#22d3ee", "#fbbf24", "#22c55e", "#e879f9"];
        return (
          <div
            key={index}
            className="p-5 rounded-lg bg-rose-900/20 border border-rose-700"
          >
            <div className="flex items-center gap-2 mb-1">
              <BarChart4 className="w-5 h-5 text-rose-100" />
              <h4 className="text-lg font-semibold text-rose-100">{section.heading}</h4>
            </div>
            <div className="space-y-6">
              <div>
                <ul className="space-y-2 mt-2">
                  {section.details.map((detail, detIndex) => (
                    <li
                      key={detIndex}
                      className="border-l-4 border-rose-400 pl-4 bg-rose-900/10 rounded text-rose-100 py-2"
                    >
                      <span className="font-bold">{detail.item}</span>:
                      <span className="text-rose-200 ml-2">{formatCurrency(detail.cost, detail.currency)}</span>
                      <span className="text-slate-400 ml-2">- {detail.description}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {/* Responsive Pie Chart (Cost Distribution) */}
              <div className="mt-6 flex flex-col items-center justify-center space-y-4 w-full">
                <div className="w-full flex justify-center">
                  <ResponsiveContainer width={320} height={320} minWidth={240} minHeight={240}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {chartData.map((entry, i) => (
                          <Cell key={entry.name} fill={colors[i % colors.length]} />
                        ))}
                      </Pie>
                      <Legend
                        verticalAlign="bottom"
                        height={56}
                        iconType="circle"
                        align="center"
                        formatter={(val) => <span className="text-xs text-rose-200">{val}</span>}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <span className="text-xs text-rose-200 mt-2">Cost Breakdown</span>
              </div>
            </div>
          </div>
        );
      })}
    </CardContent>
  </Card>
)}



{/* Financial Analysis */}
{financial_analysis && (
  <Card className="mb-10 bg-gradient-to-tr from-slate-900 via-indigo-900 to-neutral-900 border-0 shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <PieChartIcon className="text-indigo-300 w-7 h-7" />
        <CardTitle className="text-2xl font-bold text-white">
          {financial_analysis.title}
        </CardTitle>
      </div>
      <CardDescription className="mt-2 text-indigo-200 text-base">
        {financial_analysis.introduction}
      </CardDescription>
    </CardHeader>

    <CardContent className="space-y-8">
      {/* Metrics Bar Chart */}
      {financial_analysis.metrics && (
        <div className="bg-slate-900/70 border border-indigo-700 rounded-lg px-2 py-5 mb-6">
          <h4 className="text-xl font-semibold text-indigo-100 mb-2 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-indigo-300" />
            Metrics
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <ul className="mb-3 space-y-2">
              {financial_analysis.metrics.map((metric, index) => (
                <li key={index} className="text-indigo-200">
                  <span className="font-semibold">{metric.metric}:</span>{" "}
                  <span className="text-indigo-400">{metric.value} {metric.currency}</span>
                  {metric.note && (
                    <span className="text-slate-400 ml-2">({metric.note})</span>
                  )}
                </li>
              ))}
            </ul>
            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height={120}>
              <BarChart
                data={financial_analysis.metrics.map(item => ({
                  name: item.metric,
                  Value: parseFloat(item.value),
                }))}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#a5b4fc" fontSize={11} />
                <YAxis stroke="#a5b4fc" fontSize={11} />
                <Tooltip />
                <Bar dataKey="Value" fill="#818cf8" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {financial_analysis.sections.map((section, index) => (
        <div
          key={index}
          className="p-5 rounded-lg bg-indigo-900/30 border border-indigo-700"
        >
          <h4 className="text-lg font-semibold text-indigo-100 mb-1">
            {section.heading}
          </h4>
          {section.content && <p className="text-indigo-200 mb-2">{section.content}</p>}
          {/* Scenarios */}
          {section.scenarios && (
            <ul className="space-y-2 mt-2">
              {section.scenarios.map((scenario, scenIndex) => (
                <li key={scenIndex} className="border-l-4 border-indigo-400 pl-4 bg-indigo-900/20 rounded text-indigo-100 py-2">
                  <span className="font-semibold">{scenario.scenario} Scenario:</span>{" "}
                  Monthly Savings{" "}
                  <span className="text-indigo-200 font-bold">
                    {formatCurrency(scenario.monthly_savings, scenario.currency)}
                  </span>
                  , Payback Period{" "}
                  <span className="font-bold text-indigo-300">{scenario.paybackperiodmonths}</span> months.
                </li>
              ))}
            </ul>
          )}
          {/* Metrics Improved */}
          {section.metrics_improved && (
            <ul className="space-y-2 mt-2">
              {section.metrics_improved.map((metric, metImpIndex) => (
                <li
                  key={metImpIndex}
                  className="border-l-4 border-fuchsia-400 pl-4 bg-fuchsia-900/15 rounded text-fuchsia-100 py-2"
                >
                  <span className="font-bold">{metric.metric}</span>:{" "}
                  <span className="text-fuchsia-200">Before</span> {metric.before},{" "}
                  <span className="text-fuchsia-300">After</span> {metric.after}
                  {metric.note && (
                    <span className="text-slate-400 ml-2">({metric.note})</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
)}



        {/* Financial Analysis */}
{financial_analysis && (
  <Card className="mb-10 bg-gradient-to-tr from-slate-900 via-indigo-900 to-neutral-900 border-0 shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <BarChart4 className="text-indigo-300 w-7 h-7" />
        <CardTitle className="text-2xl font-bold text-white">{financial_analysis.title}</CardTitle>
      </div>
      <CardDescription className="mt-2 text-indigo-200 text-base">
        {financial_analysis.introduction}
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Metrics Chart */}
      {financial_analysis.metrics && (
        <div className="bg-slate-900/70 border border-indigo-700 rounded-lg px-4 py-8 mb-8">
          <h4 className="text-xl font-semibold text-indigo-100 mb-3 flex items-center gap-2">
            <BarChart4 className="w-5 h-5 text-indigo-300" />
            Metrics Overview
          </h4>
          <ul className="mt-4 mb-2 w-full max-w-xl space-y-2">
            {financial_analysis.metrics.map((metric, index) => (
              <li key={index} className="text-indigo-200">
                <span className="font-semibold">{metric.metric}:</span>{" "}
                <span className="text-indigo-400">{metric.value} {metric.currency}</span>
                {metric.note && (
                  <span className="text-slate-400 ml-2">({metric.note})</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
)}

{financial_analysis && (
  <div className="space-y-6">
    {financial_analysis.sections.map((section, index) => (
      <div key={index} className="p-5 rounded-lg mt-3 bg-indigo-900/30 border border-indigo-700 mb-8">
        <h4 className="text-lg font-semibold text-indigo-100 mb-1">
          {section.heading}
        </h4>
        {section.content && <p className="text-indigo-200 mb-2">{section.content}</p>}
        {/* Scenarios */}
        {section.scenarios && (
          <ul className="space-y-2 mt-2">
            {section.scenarios.map((scenario, scenIndex) => (
              <li key={scenIndex} className="border-l-4 border-indigo-400 pl-4 bg-indigo-900/20 rounded text-indigo-100 py-2">
                <span className="font-semibold">{scenario.scenario} Scenario:</span>{" "}
                Monthly Savings{" "}
                <span className="text-indigo-200 font-bold">
                  {formatCurrency(scenario.monthly_savings, scenario.currency)}
                </span>
                , Payback Period{" "}
                <span className="font-bold text-indigo-300">{scenario.paybackperiodmonths}</span> months.
              </li>
            ))}
          </ul>
        )}
        {/* Metrics Improved */}
        {section.metrics_improved && (
          <ul className="space-y-2 mt-2">
            {section.metrics_improved.map((metric, metImpIndex) => (
              <li
                key={metImpIndex}
                className="border-l-4 border-fuchsia-400 pl-4 bg-fuchsia-900/15 rounded text-fuchsia-100 py-2"
              >
                <span className="font-bold">{metric.metric}</span>:{" "}
                <span className="text-fuchsia-200">Before</span> {metric.before},{" "}
                <span className="text-fuchsia-300">After</span> {metric.after}
                {metric.note && (
                  <span className="text-slate-400 ml-2">({metric.note})</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    ))}
  </div>
)}

{/* Implementation Timeline */}
{implementation_timeline && (
  <Card className="mb-10 bg-gradient-to-tr from-indigo-900 via-fuchsia-950 to-slate-900 border-0 shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <Timer className="text-fuchsia-300 w-7 h-7" />
        <CardTitle className="text-2xl font-bold text-white">{implementation_timeline.title}</CardTitle>
      </div>
      <CardDescription className="mt-2 text-fuchsia-100 text-base">
        {implementation_timeline.introduction}
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Timeline Phases */}
      <div className="flex flex-col items-center pb-4">
        <ul className="w-full max-w-2xl space-y-7 my-4">
          {implementation_timeline.phases.map((phase, index) => (
            <li key={index} className="relative pl-8">
              <div className={`absolute left-0 top-2 w-4 h-4 rounded-full ${index === 0 ? 'bg-fuchsia-500' : 'bg-indigo-500'} border border-fuchsia-200`} />
              <div className="text-lg font-semibold text-fuchsia-200">{phase.name}</div>
              <div className="text-fuchsia-100 ml-1">⏱ {phase.duration},{" "}
                <span className="text-fuchsia-400">Cost:</span> {formatCurrency(phase.cost, phase.currency)}
              </div>
              <div className="text-slate-400 text-sm ml-1">{phase.description}</div>
            </li>
          ))}
        </ul>
        <p className="text-fuchsia-200 mt-2 text-base">
          <span className="font-semibold">Total Implementation Time:</span> {implementation_timeline.total_time}
        </p>
      </div>
    </CardContent>
  </Card>
)}


{keyrecommendationsand_considerations && (
  <Card className="mb-10 bg-gradient-to-tr from-emerald-950 via-slate-900 to-teal-900 border-0 shadow-xl">
    <CardHeader>
      <div className="flex items-center gap-3">
        <BookCheck className="w-7 h-7 text-emerald-300" />
        <CardTitle className="text-2xl font-bold text-white">
          {keyrecommendationsand_considerations.title}
        </CardTitle>
      </div>
    </CardHeader>
    <CardContent className="space-y-6">
      {/* Recommended Stack */}
      {keyrecommendationsand_considerations.recommended_stack && (
        <div className="bg-emerald-900/40 border border-emerald-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <ListChecks className="w-5 h-5 text-emerald-400" />
            <h4 className="text-lg font-semibold text-emerald-100">
              {keyrecommendationsand_considerations.recommended_stack.heading}
            </h4>
          </div>
          <ul className="list-disc list-inside ml-4 space-y-1 text-emerald-50">
            {keyrecommendationsand_considerations.recommended_stack.items.map((item, index) => (
              <li key={index} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Assumptions */}
      {keyrecommendationsand_considerations.assumptions && (
        <div className="bg-slate-900/40 border border-teal-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-5 h-5 text-teal-300" />
            <h4 className="text-lg font-semibold text-teal-100">
              {keyrecommendationsand_considerations.assumptions.heading}
            </h4>
          </div>
          <ul className="list-disc list-inside ml-4 space-y-1 text-teal-50">
            {keyrecommendationsand_considerations.assumptions.items.map((item, index) => (
              <li key={index} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Caveats */}
      {keyrecommendationsand_considerations.caveats && (
        <div className="bg-fuchsia-900/30 border border-fuchsia-700 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-5 h-5 text-fuchsia-400" />
            <h4 className="text-lg font-semibold text-fuchsia-100">
              {keyrecommendationsand_considerations.caveats.heading}
            </h4>
          </div>
          <ul className="list-disc list-inside ml-4 space-y-1 text-fuchsia-50">
            {keyrecommendationsand_considerations.caveats.items.map((item, index) => (
              <li key={index} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Conclusion */}
      {keyrecommendationsand_considerations.conclusion && (
        <div className="pt-2 px-1">
          <p className="text-slate-300 italic border-l-4 border-emerald-400 pl-4">
            {keyrecommendationsand_considerations.conclusion}
          </p>
        </div>
      )}
    </CardContent>
  </Card>
)}
        </div>
    );
}

