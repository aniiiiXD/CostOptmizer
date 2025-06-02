"use client"
import Navbar from "../../components/navbar";
import QuestionCard from "../../components/questionCard";
import { useState } from 'react';

interface Question {
  id: string;
  question: string;
  placeholder: string;
}

export default function Home() {
  const questions: Question[] = [
    {
      id: "businessType",
      question: "Hi! I'm your Workflow Optimization Strategist. Let's get started! 🌟 What type of business do you run, and what are your core services or products?",
      placeholder: "e.g., E-commerce store selling handmade jewelry, Digital marketing agency, SaaS company...",
      inputType: 'textarea'
    },
    {
      id: "teamSize",
      question: "Great! How many employees or team members are in your organization?",
      placeholder: "e.g., Just me, 2-5 people, 10-20 employees, 50+ team members...",
      inputType: 'select',
      options: ['Just me', '2-5 people', '6-20 people', '21-50 people', '50+ team members']
    },
    {
      id: "timeConsumingProcesses",
      question: "Which processes or departments feel the most time-consuming or costly for you right now?",
      placeholder: "e.g., Customer support takes too long, Manual data entry, Inventory management...",
      inputType: 'textarea'
    },
    {
      id: "currentTools",
      question: "Do you currently use any AI tools or automation solutions? If so, which ones?",
      placeholder: "e.g., ChatGPT for content, Zapier for automation, CRM with AI features, None yet...",
      inputType: 'textarea'
    },
    {
      id: "budget",
      question: "What's your approximate monthly or annual budget for improving operations?",
      placeholder: "e.g., $500/month, $5,000/year, $10,000+ annually, Still exploring options...",
      inputType: 'select',
      options: ['$500/month or less', '$1,000/month', '$5,000/year', '$10,000+ annually', 'Still exploring options']
    },
    {
      id: "goals",
      question: "What are your top 2–3 goals for workflow improvement?",
      placeholder: "e.g., Cut operational costs by 30%, Respond to customers faster, Automate repetitive tasks...",
      inputType: 'textarea'
    },
    {
      id: "specificAreas",
      question: "Lastly, are there specific areas where you'd like AI recommendations?",
      placeholder: "e.g., Automate email responses, Predict sales trends, Optimize staff scheduling...",
      inputType: 'textarea'
    },
  ];
    {
      id: "businessType",
      question: "Hi! I'm your Workflow Optimization Strategist. Let's get started! 🌟 What type of business do you run, and what are your core services or products?",
      placeholder: "e.g., E-commerce store selling handmade jewelry, Digital marketing agency, SaaS company...",
    },
    {
      id: "teamSize",
      question: "Great! How many employees or team members are in your organization?",
      placeholder: "e.g., Just me, 2-5 people, 10-20 employees, 50+ team members...",
    },
    {
      id: "timeConsumingProcesses",
      question: "Which processes or departments feel the most time-consuming or costly for you right now?",
      placeholder: "e.g., Customer support takes too long, Manual data entry, Inventory management...",
    },
    {
      id: "currentTools",
      question: "Do you currently use any AI tools or automation solutions? If so, which ones?",
      placeholder: "e.g., ChatGPT for content, Zapier for automation, CRM with AI features, None yet...",
    },
    {
      id: "budget",
      question: "What's your approximate monthly or annual budget for improving operations?",
      placeholder: "e.g., $500/month, $5,000/year, $10,000+ annually, Still exploring options...",
    },
    {
      id: "goals",
      question: "What are your top 2–3 goals for workflow improvement?",
      placeholder: "e.g., Cut operational costs by 30%, Respond to customers faster, Automate repetitive tasks...",
    },
    {
      id: "specificAreas",
      question: "Lastly, are there specific areas where you'd like AI recommendations?",
      placeholder: "e.g., Automate email responses, Predict sales trends, Optimize staff scheduling...",
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Here you can handle the submission of answers
    console.log('Answers submitted:', answers);
    setShowResults(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="mt-8">
            <QuestionCard 
              question={questions[currentQuestionIndex]}
              onAnswer={handleAnswer}
            />
          </div>
          
          {/* Navigation controls */}
          <div className="mt-6 flex justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Next
              </button>
            )}
          </div>

          {/* Progress indicator */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-1">
              {questions.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-8 rounded-full ${
                    index === currentQuestionIndex 
                      ? 'bg-blue-500' 
                      : index < currentQuestionIndex 
                        ? 'bg-blue-300' 
                        : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Show results */}
          {showResults && (
            <div className="mt-8 p-6 bg-white rounded-lg shadow">
              <h3 className="text-xl font-semibold mb-4">Your Answers:</h3>
              {Object.entries(answers).map(([id, answer]) => (
                <div key={id} className="mb-4">
                  <p className="font-medium">{questions.find(q => q.id === id)?.question}</p>
                  <p className="text-gray-600">{answer}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}