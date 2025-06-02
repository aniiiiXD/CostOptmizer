import React from 'react';
import Navbar from '../components/Navbar';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">About WorkflowAI</h1>
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="prose max-w-none">
            <p className="text-lg text-gray-700 mb-6">
              WorkflowAI is your intelligent business optimization partner. We help organizations of all sizes streamline their operations and boost productivity through AI-powered recommendations.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-6">
              To empower businesses with intelligent automation solutions that save time, reduce costs, and drive growth.
            </p>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">1. Assessment</h3>
                <p className="text-gray-600">Complete our intelligent business assessment to identify key areas for improvement.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">2. Analysis</h3>
                <p className="text-gray-600">Our AI analyzes your responses and generates tailored recommendations.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-xl font-semibold mb-3">3. Implementation</h3>
                <p className="text-gray-600">Receive actionable insights and guidance for implementing improvements.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}