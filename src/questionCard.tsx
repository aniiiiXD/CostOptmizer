import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

interface Question {
  id: string;
  question: string;
  placeholder: string;
  inputType?: 'text' | 'textarea' | 'select';
  options?: string[];
}

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string) => void;
}

export default function QuestionCard({ question, onAnswer }: QuestionCardProps) {
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAnswer(answer);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto my-6 shadow-lg border border-gray-200 rounded-xl overflow-hidden">
      <CardHeader className="bg-gray-50 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">{question.question}</h3>
          <div className="text-2xl">🌟</div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {question.inputType === 'select' && question.options && (
            <select
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
            >
              <option value="">Select an option</option>
              {question.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          )}
          {question.inputType === 'textarea' && (
            <Textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={question.placeholder}
              className="w-full min-h-[120px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
              rows={4}
            />
          )}
          {question.inputType === 'text' && (
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={question.placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-all"
            />
          )}
        </form>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t border-gray-200 flex justify-end p-4">
        <Button 
          type="submit" 
          onClick={handleSubmit}
          className="bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
}