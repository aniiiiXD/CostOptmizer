"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedOut, SignedIn, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: "Analyze", href: "#" },
    { label: "Cost Analysis", href: "#" },
    { label: "Roadmap", href: "#" },
    { label: "SWOT", href: "#" },
  ];

  return (
    <nav className="bg-gradient-to-r from-[#171b25] via-[#232642] to-[#31316a] text-white sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="font-extrabold text-transparent text-2xl sm:text-3xl bg-gradient-to-r from-indigo-400 via-emerald-400 to-fuchsia-400 bg-clip-text select-none tracking-wide drop-shadow-[0_2px_8px_rgba(99,102,241,0.15)]">
                Aetherius Labs
              </span>
            </div>
            {/* Desktop Menu */}
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {menuItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative px-3 py-1.5 rounded text-md font-medium transition-colors text-slate-200 hover:text-emerald-400"
                >
                  <span>{item.label}</span>
                  <span className="absolute left-2 right-2 -bottom-1 h-0.5 rounded bg-gradient-to-r from-emerald-400 via-fuchsia-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-x-0 group-hover:scale-x-100"></span>
                </a>
              ))}
            </div>
          </div>
          {/* Auth/User buttons */}
          <div className="hidden sm:flex sm:items-center gap-2">
            <SignedIn>
              <div className="bg-slate-900/60 px-2 py-2 rounded-2xl shadow">
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="border-emerald-300 hover:bg-emerald-400/10 text-emerald-300 hover:text-emerald-300 font-semibold">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="border-fuchsia-300 hover:bg-fuchsia-400/10 text-fuchsia-300 hover:text-fuchsia-300 font-semibold ml-2">
                  Sign Up
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
          {/* Mobile Menu Button */}
          <div className="sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-emerald-300"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>
      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="sm:hidden bg-[#1d2236] border-t border-slate-700 shadow-2xl z-40">
          <div className="px-4 pt-4 pb-6 space-y-2 animate-in fade-in">
            {menuItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-left text-slate-200 hover:text-emerald-400 py-2 rounded transition"
              >
                {item.label}
              </a>
            ))}
            <div className="flex gap-2 pt-3">
              <SignedIn>
                <div className="bg-slate-900/60 px-2 py-2 rounded-2xl shadow">
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="outline" className="border-emerald-300 hover:bg-emerald-400/10 text-emerald-300 hover:text-emerald-300 font-semibold w-full">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <Button variant="outline" className="border-fuchsia-300 hover:bg-fuchsia-400/10 text-fuchsia-300 hover:text-fuchsia-300 font-semibold w-full ml-2">
                    Sign Up
                  </Button>
                </SignUpButton>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
