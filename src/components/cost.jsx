"use client"
import React, { useState, useEffect } from 'react';
import { H2, H3, H4, P, UL, LI } from "@/components/ui/typography";

/**
 * Utility function to format numbers as currency.
 * @param {number} amount - The numeric value to format.
 * @param {string} currencySymbol - The currency symbol (e.g., '₹', '$').
 * @returns {string} The formatted currency string.
 */
const formatCurrency = (amount, currencySymbol) => {
    if (typeof amount !== 'number') {
        return `${currencySymbol}${amount}`; // Handle cases where amount might not be a number but a string like "1,95,000"
    }
    // Using Indian numbering system for rupees, if applicable, otherwise default locale.
    return `${currencySymbol}${new Intl.NumberFormat('en-IN').format(amount)}`;
};

/**
 * Removes various Markdown syntaxes from a given text string.
 * This is primarily used to clean the API response before JSON parsing.
 * @param {string} text - The input text string potentially containing Markdown.
 * @returns {string} The text with Markdown removed.
 */
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
export async function callLyzrChatAgentCost(userMessage) {
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
        console.error('Error in callLyzrChatAgentCost:', err);
        throw err;
    }
}

/**
 * Main React component to display the cost analysis.
 * It fetches data from a Lyzr Chat Agent and renders it in a structured format.
 * @param {Object} props - The component props.
 * @param {Object} props.analysisData - Contains the message to send to the AI agent.
 */
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
                setError(err.message || "An unknown error occurred during API call.");
                console.error('Error fetching analysis:', err);
            } finally {
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
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{executive_summary.title}</h3>
            <p className="leading-7 text-slate-300">{executive_summary.content}</p>
        </div>
        )}

        {/* Current State Cost Analysis */}
        {currentstatecost_analysis && (
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{currentstatecost_analysis.title}</h3>
            <p className="text-slate-300 mb-4">{currentstatecost_analysis.introduction}</p>
            {currentstatecost_analysis.sections.map((section, index) => (
            <div key={index} className="mb-6">
                <h4 className="text-xl font-semibold mb-1">{section.heading}</h4>
                <p className="text-slate-300 mb-1">{section.content}</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                {section.details.map((detail, detIndex) => (
                    <li key={detIndex} className="text-slate-200">
                    <span className="font-medium">{detail.item}</span>: {formatCurrency(detail.cost, detail.currency)}
                    <span className="text-slate-400"> - {detail.description}</span>
                    </li>
                ))}
                </ul>
            </div>
            ))}
        </div>
        )}

        {/* AI-Optimized State */}
        {aioptimizedstate && (
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{aioptimizedstate.title}</h3>
            <p className="text-slate-300 mb-4">{aioptimizedstate.introduction}</p>
            {aioptimizedstate.sections.map((section, index) => (
            <div key={index} className="mb-6">
                <h4 className="text-xl font-semibold mb-1">{section.heading}</h4>
                <p className="text-slate-300 mb-1">{section.content}</p>
                {section.heading === "Recommended AI Models & Platforms" && (
                <ul className="list-disc list-inside ml-4 space-y-1">
                    {section.details.map((detail, detIndex) => (
                    <li key={detIndex}>
                        <span className="font-medium">{detail.model}</span> ({detail.use_case}): {detail.description}.
                        <span className="text-slate-300 ml-2">
                        Cost: {detail.cost_estimate !== undefined ? formatCurrency(detail.cost_estimate, detail.currency) : 'N/A'}
                        </span>
                        {detail.cost_note && (
                        <span className="text-slate-400"> ({detail.cost_note})</span>
                        )}
                    </li>
                    ))}
                </ul>
                )}
                {section.heading === "Expected Efficiencies and Savings" && (
                <ul className="list-disc list-inside ml-4 space-y-1">
                    {section.details.map((detail, detIndex) => (
                    <li key={detIndex}>
                        <span className="font-medium">{detail.area}</span>: Before {detail.before}, After {detail.after}.
                        Saved: {formatCurrency(detail.saved_cost, detail.currency)}.
                        <span className="text-slate-400 ml-1">{detail.description}</span>
                    </li>
                    ))}
                </ul>
                )}
                {section.summary && <p className="text-slate-400">{section.summary}</p>}
            </div>
            ))}
        </div>
        )}

        {/* Implementation Investment Costs */}
        {implementationinvestmentcosts && (
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{implementationinvestmentcosts.title}</h3>
            <p className="text-slate-300 mb-4">{implementationinvestmentcosts.introduction}</p>
            {implementationinvestmentcosts.sections.map((section, index) => (
            <div key={index} className="mb-6">
                <h4 className="text-xl font-semibold mb-1">{section.heading}</h4>
                <ul className="list-disc list-inside ml-4 space-y-1">
                {section.details.map((detail, detIndex) => (
                    <li key={detIndex} className="text-slate-200">
                    <span className="font-medium">{detail.item}</span>: {formatCurrency(detail.cost, detail.currency)}
                    <span className="text-slate-400"> - {detail.description}</span>
                    </li>
                ))}
                </ul>
            </div>
            ))}
        </div>
        )}

        {/* Financial Analysis */}
        {financial_analysis && (
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{financial_analysis.title}</h3>
            <p className="text-slate-300 mb-4">{financial_analysis.introduction}</p>
            <h4 className="text-xl font-semibold mb-1">Metrics:</h4>
            <ul className="list-disc list-inside ml-4 space-y-1 mb-3">
            {financial_analysis.metrics.map((metric, index) => (
                <li key={index}>
                <span className="font-medium">{metric.metric}</span>: {metric.value} {metric.currency} {metric.note && <span className="text-slate-400">({metric.note})</span>}
                </li>
            ))}
            </ul>
            {financial_analysis.sections.map((section, index) => (
            <div key={index} className="mb-6">
                <h4 className="text-xl font-semibold mb-1">{section.heading}</h4>
                {section.content && <p className="text-slate-300 mb-1">{section.content}</p>}
                {section.scenarios && (
                <ul className="list-disc list-inside ml-4 space-y-1">
                    {section.scenarios.map((scenario, scenIndex) => (
                    <li key={scenIndex}>
                        {scenario.scenario} Scenario: Monthly Savings {formatCurrency(scenario.monthly_savings, scenario.currency)}, Payback Period {scenario.paybackperiodmonths} months.
                    </li>
                    ))}
                </ul>
                )}
                {section.metrics_improved && (
                <ul className="list-disc list-inside ml-4 space-y-1">
                    {section.metrics_improved.map((metric, metImpIndex) => (
                    <li key={metImpIndex}>
                        <span className="font-medium">{metric.metric}</span>: Before {metric.before}, After {metric.after} {metric.note && <span className="text-slate-400">({metric.note})</span>}
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
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{implementation_timeline.title}</h3>
            <p className="text-slate-300 mb-4">{implementation_timeline.introduction}</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
            {implementation_timeline.phases.map((phase, index) => (
                <li key={index}>
                <span className="font-medium">{phase.name}</span>: {phase.duration}, Cost: {formatCurrency(phase.cost, phase.currency)}.
                <span className="text-slate-400 ml-1">{phase.description}</span>
                </li>
            ))}
            </ul>
            <p className="text-slate-300 mt-2">Total Implementation Time: <span className="font-medium">{implementation_timeline.total_time}</span></p>
        </div>
        )}

        {/* Key Recommendations and Considerations */}
        {keyrecommendationsand_considerations && (
        <div className="mb-10">
            <h3 className="text-2xl font-semibold mb-2">{keyrecommendationsand_considerations.title}</h3>
            {keyrecommendationsand_considerations.recommended_stack && (
            <div className="mb-4">
                <h4 className="text-xl font-semibold mb-1">{keyrecommendationsand_considerations.recommended_stack.heading}</h4>
                <ul className="list-disc list-inside ml-4 space-y-1">
                {keyrecommendationsand_considerations.recommended_stack.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
                </ul>
            </div>
            )}
            {keyrecommendationsand_considerations.assumptions && (
            <div className="mb-4">
                <h4 className="text-xl font-semibold mb-1">{keyrecommendationsand_considerations.assumptions.heading}</h4>
                <ul className="list-disc list-inside ml-4 space-y-1">
                {keyrecommendationsand_considerations.assumptions.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
                </ul>
            </div>
            )}
            {keyrecommendationsand_considerations.caveats && (
            <div className="mb-4">
                <h4 className="text-xl font-semibold mb-1">{keyrecommendationsand_considerations.caveats.heading}</h4>
                <ul className="list-disc list-inside ml-4 space-y-1">
                {keyrecommendationsand_considerations.caveats.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
                </ul>
            </div>
            )}
            {keyrecommendationsand_considerations.conclusion && (
            <p className="text-slate-300">{keyrecommendationsand_considerations.conclusion}</p>
            )}
        </div>
        )}
        </div>
    );
}

