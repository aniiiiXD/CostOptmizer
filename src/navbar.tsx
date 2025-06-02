// components/Navbar.jsx
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="fixed top-6 left-0 right-0 mx-auto max-w-5xl px-4 z-50">
      <div className="flex items-center justify-between bg-black text-white p-4 rounded-xl shadow-lg">
        <div className="text-xl font-bold">Optimize</div>
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            className="text-white hover:text-gray-300 hover:bg-black/20"
          >
            Home
          </Button>
          <Button 
            variant="default" 
            className="bg-white text-black hover:bg-gray-200"
          >
            New Chat
          </Button>
        </div>
      </div>
    </div>
  );
}