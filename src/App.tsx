import React, { useState } from 'react';
import { Play, Loader2, ArrowRight, ArrowLeft, Brain } from 'lucide-react';
import { submitAssessment } from './api';
import { Question } from './types';
import Navbar from './components/Navbar';

const questions: Question[] = [
  {
    id: "businessType",
    question: "What type of business do you run, and what are your core services or products?",
    placeholder: "e.g., E-commerce store selling handmade jewelry, Digital marketing agency, SaaS company...",
    inputType: 'textarea'
  },
  {
    id: "teamSize",
    question: "How many employees or team members are in your organization?",
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
    question: "Are there specific areas where you'd like AI recommendations?",
    placeholder: "e.g., Automate email responses, Predict sales trends, Optimize staff scheduling...",
    inputType: 'textarea'
  }
];

function App() {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  const handleStart = () => {
    setIsStarted(true);
  };

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
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const message = Object.entries(answers)
        .map(([id, answer]) => {
          const question = questions.find(q => q.id === id)?.question;
          return `Q: ${question}\nA: ${answer}`;
        })
        .join('\n\n');

      const response = await submitAssessment(message);
      setApiResponse(response.response || 'No recommendations available.');
    } catch (error) {
      console.error('Error:', error);
      setApiResponse('Failed to get recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!isStarted) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Optimize Your Business Workflow
              </h1>
              <p className="text-xl text-gray-600">
                Get personalized AI recommendations to streamline your operations
                and boost productivity.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-black rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900">
                        AI-Powered Assessment
                      </h3>
                      <p className="text-gray-500">
                        Answer a few questions about your business
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleStart}
                    className="w-full bg-black text-white py-4 px-6 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-800 transition-colors"
                  >
                    <Play className="w-5 h-5" />
                    <span className="text-lg font-medium">Start Assessment</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isLoading || apiResponse) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
          <div className="max-w-4xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                <Loader2 className="animate-spin h-12 w-12 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900">
                  Analyzing your responses...
                </h2>
                <p className="text-gray-600 mt-2">
                  Please wait while we generate your personalized recommendations.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  Your Personalized Recommendations
                </h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-gray-700 text-lg leading-relaxed">
                    {apiResponse}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsStarted(false);
                    setCurrentQuestionIndex(0);
                    setAnswers({});
                    setApiResponse(null);
                  }}
                  className="mt-8 bg-black text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Start New Assessment
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pt-16">
        <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  {questions[currentQuestionIndex].question}
                </h2>
                {questions[currentQuestionIndex].inputType === 'select' ? (
                  <select
                    value={answers[questions[currentQuestionIndex].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all text-lg"
                  >
                    <option value="">Select an option</option>
                    {questions[currentQuestionIndex].options?.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <textarea
                    value={answers[questions[currentQuestionIndex].id] || ''}
                    onChange={(e) => handleAnswer(e.target.value)}
                    placeholder={questions[currentQuestionIndex].placeholder}
                    className="w-full min-h-[160px] p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-black focus:border-black transition-all text-lg"
                    rows={4}
                  />
                )}
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Previous</span>
                </button>
                <div className="flex items-center space-x-2">
                  {questions.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-8 rounded-full ${
                        index === currentQuestionIndex
                          ? 'bg-black'
                          : index < currentQuestionIndex
                          ? 'bg-gray-400'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <button
                  onClick={handleNext}
                  className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <span>{currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      {renderContent()}
    </>
  );
}

export default App;