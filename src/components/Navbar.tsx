import { Brain } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Brain className="h-8 w-8 text-black" />
            <span className="ml-2 text-xl font-bold">WorkflowAI</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="/about" className="text-gray-600 hover:text-black transition-colors">About</a>
            <a href="/contact" className="text-gray-600 hover:text-black transition-colors">Contact</a>
            <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
              New Assessment
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}