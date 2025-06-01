"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  X,
  Plus,
  Search,
  Home,
  Settings,
  RefreshCw,
  Paperclip,
  ImageIcon,
  Send,
  User,
  Mail,
  FileText,
  Cpu,
} from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface BusinessAssessment {
  businessType: string
  teamSize: string
  timeConsumingProcesses: string
  currentTools: string
  budget: string
  goals: string
  specificAreas: string
}

const businessQuestions = [
  {
    id: "businessType",
    question:
      "Hi! I'm your Workflow Optimization Strategist. Let's get started! 🌟 What type of business do you run, and what are your core services or products?",
    placeholder: "e.g., E-commerce store selling handmade jewelry, Digital marketing agency, SaaS company...",
  },
  {
    id: "teamSize",
    question: "Great! How many employees or team members are in your organization?",
    placeholder: "e.g., Just me, 2-5 people, 10-20 employees, 50+ team members...",
  },
  {
    id: "timeConsumingProcesses",
    question:
      "Which processes or departments feel the most time-consuming or costly for you right now? (e.g., HR, Customer Support, Sales)",
    placeholder: "e.g., Customer support takes too long, Manual data entry, Inventory management...",
  },
  {
    id: "currentTools",
    question: "Do you currently use any AI tools or automation solutions? If so, which ones?",
    placeholder: "e.g., ChatGPT for content, Zapier for automation, CRM with AI features, None yet...",
  },
  {
    id: "budget",
    question:
      "What's your approximate monthly or annual budget for improving operations? (You can give a rough estimate.)",
    placeholder: "e.g., $500/month, $5,000/year, $10,000+ annually, Still exploring options...",
  },
  {
    id: "goals",
    question:
      "What are your top 2–3 goals for workflow improvement? (e.g., reduce costs, speed up tasks, improve customer experience)",
    placeholder: "e.g., Cut operational costs by 30%, Respond to customers faster, Automate repetitive tasks...",
  },
  {
    id: "specificAreas",
    question:
      "Lastly, are there specific areas where you'd like AI recommendations? (e.g., task automation, forecasting, resource allocation)",
    placeholder: "e.g., Automate email responses, Predict sales trends, Optimize staff scheduling...",
  },
]

const suggestionCards = [
  {
    title: "Start my workflow optimization assessment",
    description: "Get a custom AI-powered plan for your business",
    icon: User,
  },
  {
    title: "Calculate potential savings with AI",
    description: "See how much time and money you could save",
    icon: FileText,
  },
  {
    title: "Review my current workflow efficiency",
    description: "Get expert analysis of your existing processes",
    icon: Mail,
  },
  {
    title: "Design my AI automation strategy",
    description: "Create a roadmap for intelligent workflow optimization",
    icon: Cpu,
  },
]

export default function AgentOrchestratorChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isAssessing, setIsAssessing] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [assessment, setAssessment] = useState<Partial<BusinessAssessment>>({})
  const [showSuggestions, setShowSuggestions] = useState(true)

  const addMessage = (content: string, type: "user" | "assistant") => {
    const newMessage: Message = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
  }

  const startBusinessAssessment = () => {
    setIsAssessing(true)
    setShowSuggestions(false)
    setCurrentQuestionIndex(0)
    addMessage("I'd like to assess my business for AI agents", "user")
    addMessage(
      "Perfect! I'll help you create a custom AI-powered workflow plan. Let me ask you 7 key questions to understand your business and provide personalized recommendations. This will take just a few minutes! 🚀",
      "assistant",
    )

    setTimeout(() => {
      addMessage(businessQuestions[0].question, "assistant")
    }, 1000)
  }

  const handleAssessmentAnswer = (answer: string) => {
    const currentQuestion = businessQuestions[currentQuestionIndex]

    // Save the answer
    setAssessment((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }))

    addMessage(answer, "user")

    if (currentQuestionIndex < businessQuestions.length - 1) {
      // Move to next question
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)

      setTimeout(() => {
        addMessage(businessQuestions[nextIndex].question, "assistant")
      }, 1000)
    } else {
      // Assessment complete
      setIsAssessing(false)
      setTimeout(() => {
        generateAssessmentReport()
      }, 1000)
    }
  }

  const generateAssessmentReport = () => {
    const report = `Thanks for sharing that! 🎉 I'm preparing a custom AI-powered workflow plan for you. It'll include tool suggestions, potential savings, and automation opportunities.

## 📊 Your Custom Workflow Optimization Plan

### 🏢 Business Overview
**Business Type**: ${assessment.businessType}
**Team Size**: ${assessment.teamSize}
**Current Tools**: ${assessment.currentTools}

### 🎯 Key Opportunities Identified

**Most Time-Consuming Areas**: ${assessment.timeConsumingProcesses}
**Improvement Goals**: ${assessment.goals}
**Focus Areas for AI**: ${assessment.specificAreas}
**Budget Range**: ${assessment.budget}

### 🤖 AI-Powered Solutions Recommended

1. **Workflow Automation**: Based on your ${assessment.timeConsumingProcesses} challenges, I recommend implementing automated workflows that could save 15-25 hours per week.

2. **AI Tool Stack**: Perfect tools for your ${assessment.businessType} business:
   - Process automation for ${assessment.timeConsumingProcesses}
   - AI solutions targeting ${assessment.specificAreas}
   - Integration with your current ${assessment.currentTools} setup

3. **ROI Projection**: With your ${assessment.budget} budget, you could achieve:
   - 30-50% reduction in manual work
   - 2-4x faster task completion
   - $${Math.floor(Math.random() * 5000 + 2000)}/month in operational savings

### 📈 Implementation Roadmap

**Phase 1 (Week 1-2)**: Quick wins with ${assessment.specificAreas}
**Phase 2 (Week 3-6)**: Core automation for ${assessment.timeConsumingProcesses}
**Phase 3 (Month 2-3)**: Advanced AI integration and optimization

### 🎯 Next Steps

Ready to see the detailed implementation plan? I can provide:
- Specific tool recommendations
- Step-by-step setup guides
- Cost-benefit analysis
- Custom automation blueprints

Would you like me to dive deeper into any specific area? 🚀`

    addMessage(report, "assistant")
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion.includes("Assess my business") || suggestion.includes("Start my workflow optimization assessment")) {
      startBusinessAssessment()
    } else {
      addMessage(suggestion, "user")
      setShowSuggestions(false)

      // Generate appropriate response based on suggestion
      setTimeout(() => {
        if (suggestion.includes("ROI") || suggestion.includes("savings")) {
          addMessage(
            "I'd be happy to help calculate the ROI for agent implementation. To provide accurate projections, I'll need to understand your current operational costs and efficiency metrics. Would you like to start with a business assessment first?",
            "assistant",
          )
        } else if (suggestion.includes("Review") || suggestion.includes("workflow efficiency")) {
          addMessage(
            "I can review your current agent policies and provide recommendations for optimization. Please share your existing policies or describe your current AI agent setup, and I'll provide detailed feedback.",
            "assistant",
          )
        } else if (suggestion.includes("Design") || suggestion.includes("automation strategy")) {
          addMessage(
            "Let's design a comprehensive agent orchestration strategy for your business. This will involve analyzing your workflows, identifying automation opportunities, and creating a technical implementation roadmap. Shall we start with understanding your business requirements?",
            "assistant",
          )
        }
      }, 1000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    if (isAssessing) {
      handleAssessmentAnswer(input)
    } else {
      addMessage(input, "user")
      setShowSuggestions(false)

      // Simple response logic
      setTimeout(() => {
        addMessage(
          "I understand you're interested in agent orchestration. Let me help you with that. Would you like to start with a business assessment to get personalized recommendations?",
          "assistant",
        )
      }, 1000)
    }

    setInput("")
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-4">
        <Button variant="ghost" size="icon" className="rounded-full">
          <X className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Plus className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Search className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Home className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>

        <div className="flex-1" />

        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <span className="text-white text-sm font-medium">J</span>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.length === 0 && showSuggestions ? (
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-semibold text-gray-900 mb-2">
                  Hi there, <span className="text-purple-600">John</span>
                </h1>
                <h2 className="text-4xl font-semibold text-gray-900 mb-4">
                  What would <span className="text-purple-600">like to know?</span>
                </h2>
                <p className="text-gray-500 mb-8">
                  Use one of the most common prompts
                  <br />
                  below or use your own to begin
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {suggestionCards.map((card, index) => (
                  <Card
                    key={index}
                    className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                    onClick={() => handleSuggestionClick(card.title)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          <card.icon className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900 mb-1">{card.title}</h3>
                          <p className="text-sm text-gray-500">{card.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-center">
                <Button variant="ghost" className="text-gray-500 hover:text-gray-700">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Prompts
                </Button>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-3xl p-4 rounded-lg ${
                      message.type === "user" ? "bg-purple-600 text-white" : "bg-white border border-gray-200"
                    }`}
                  >
                    {message.content.includes("##") ? (
                      <div className="prose prose-sm max-w-none">
                        {message.content.split("\n").map((line, index) => {
                          if (line.startsWith("## ")) {
                            return (
                              <h2 key={index} className="text-lg font-semibold mt-4 mb-2">
                                {line.replace("## ", "")}
                              </h2>
                            )
                          } else if (line.startsWith("**") && line.endsWith("**")) {
                            return (
                              <p key={index} className="font-semibold mt-2">
                                {line.replace(/\*\*/g, "")}
                              </p>
                            )
                          } else if (line.startsWith("### ")) {
                            return (
                              <h3 key={index} className="text-md font-semibold mt-3 mb-1">
                                {line.replace("### ", "")}
                              </h3>
                            )
                          } else if (line.trim().match(/^\d+\./)) {
                            return (
                              <p key={index} className="ml-4 mt-1">
                                {line}
                              </p>
                            )
                          } else if (line.trim().startsWith("- ")) {
                            return (
                              <p key={index} className="ml-6 mt-1">
                                {line}
                              </p>
                            )
                          } else if (line.trim()) {
                            return (
                              <p key={index} className="mt-1">
                                {line}
                              </p>
                            )
                          }
                          return <br key={index} />
                        })}
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
              <div className="flex items-center space-x-2 mb-4">
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <Paperclip className="h-4 w-4 mr-2" />
                  Add Attachment
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500">
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Use Image
                </Button>
                <div className="flex-1" />
                <span className="text-sm text-gray-400">0/1000</span>
              </div>

              <div className="relative">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isAssessing
                      ? businessQuestions[currentQuestionIndex]?.placeholder || "Type your answer..."
                      : "Ask whatever you want..."
                  }
                  className="pr-12 py-3 text-base border-gray-300 rounded-lg"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-purple-600 hover:bg-purple-700"
                  disabled={!input.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
