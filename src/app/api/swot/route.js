import { NextResponse } from 'next/server';
import axios from 'axios';

// Helper function to remove markdown from text
function removeMarkdown(text) {
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
        .replace(/\$\$([^\$]+)\]\$\$[^)]+\$\$/g, '$1')      // Links
        .replace(/!\$\$([^\$]*)\]\$\$[^)]+\$\$/g, '$1')     // Images
        .replace(/^\s*[-*+]\s+/gm, '')                       // Unordered list
        .replace(/^\s*\d+\.\s+/gm, '')                      // Ordered list
        .replace(/\n{3,}/g, '\n\n')                         // Excess newlines
        .trim();
}

// Function to call the LYZR chat agent for SWOT analysis
async function callLyzrChatAgentSWOT(userMessage) {
    // Debug logging
    console.log('Attempting to call LYZR API with message:', userMessage.substring(0, 100) + '...');
    
    const url = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/';
    const apiKey = 'sk-default-H0RDPuvT95RpWUepisEbn0NVZEs0hBEf';
    const payload = {
        user_id: "katewamukul@gmail.com",
        agent_id: "684816b0b67a5a754564eb0d",
        session_id: "684816b0b67a5a754564eb0d-fkd42ftan7m",
        message: userMessage
    };

    try {
        console.log('Sending request to:', url);
        console.log('Payload size:', JSON.stringify(payload).length, 'bytes');

        // Create axios instance with timeout and retry
        const axiosInstance = axios.create({
            timeout: 10000, // 10 second timeout
            retry: 3, // Number of retries
            retryDelay: 1000 // Delay between retries
        });

        const response = await axiosInstance.post(url, payload, {
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            }
        });

        return response.data;
    } catch (error) {
        console.error('API Request Error:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            throw new Error('Unable to connect to API server. Please check your network connection.');
        }

        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('API Response Error:', {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            });
            throw new Error(`HTTP error! Status: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            throw new Error('No response received from server');
        } else {
            // Something happened in setting up the request that triggered an Error
            throw error;
        }
    }

    const result = await response.json();
    let cleanResponse = removeMarkdown(result.response);
    
    try {
        const parsedData = JSON.parse(cleanResponse);
        return parsedData;
    } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error("Invalid response format from API");
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        
        // Validate input
        if (!body.message) {
            return NextResponse.json(
                { error: 'Please provide a message for SWOT analysis' },
                { status: 400 }
            );
        }

        // Call the SWOT analysis API
        const swotAnalysis = await callLyzrChatAgentSWOT(body.message);
        
        return NextResponse.json(
            { 
                success: true,
                data: swotAnalysis
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing SWOT analysis:', error);
        return NextResponse.json(
            { 
                error: error.message || 'Failed to process SWOT analysis',
                details: error.stack 
            },
            { status: 500 }
        );
    }
}