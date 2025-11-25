"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navbar({ onNavigateToAuth }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="bg-[#F7F4ED] border-b border-[#242424]">
      <div className="w-full px-6 md:px-12 py-4">
        <div className="flex items-center justify-between mx-[100px]">
          {/* Logo */}
          <a href="/" className="font-serif text-[35px] font-bold tracking-tight text-[#242424]">
            Nota
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a
              href="#our-story"
              className="font-semibold text-[15px] text-[#242424] hover:text-[#242424]/70 transition-colors"
            >
              Overview
            </a>

            <button
              onClick={onNavigateToAuth}
              className="font-semibold text-[15px] text-[#242424] hover:text-[#242424]/70 transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={onNavigateToAuth}
              className="font-semibold text-sm px-4 py-2 bg-[#1A8917] text-white rounded-full hover:bg-[#1A8917]/90 transition-colors"
            >
              Get started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#242424]" />
            ) : (
              <Menu className="w-6 h-6 text-[#242424]" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-[#242424]/10 mt-4">
            <div className="flex flex-col gap-4">
              <a
                href="#our-story"
                className="font-sans text-sm text-[#242424] hover:text-[#242424]/70 transition-colors"
              >
                Overview
              </a>

              <button
                onClick={onNavigateToAuth}
                className="font-sans text-sm text-[#242424] hover:text-[#242424]/70 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={onNavigateToAuth}
                className="font-sans text-sm px-4 py-2 bg-[#1A8917] text-white rounded-full hover:bg-[#1A8917]/90 transition-colors text-center w-fit"
              >
                Get started
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
