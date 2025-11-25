"use client"

import { BookOpen, PenTool, GraduationCap } from "lucide-react"

export default function Hero({ onNavigateToAuth }) {
  return (
    <section className="bg-[#F7F4ED] flex-1 flex items-center ml-10 overflow-hidden">
      <div className="w-full px-6 md:px-12 lg:px-24">
        <div className="flex items-center justify-between">
          {/* Left Side - Typography */}
          <div className="space-y-6 max-w-2xl">
            <h1 className="font-serif text-[80px] md:text-[106px] font-normal tracking-[-0.03em] text-[#242424] leading-[0.9]">
              Teacher
              <br />
              stories <span className="italic">&</span> ideas
            </h1>

            <p className="font-sans text-xl md:text-[22px] text-[#242424]/50 leading-relaxed">
              Plan. Teach. Track. The digital home for your academic journey
            </p>

            <button
              onClick={onNavigateToAuth}
              className="font-sans text-xl px-12 py-3 bg-[#1A8917] text-white rounded-full hover:bg-[#1A8917]/90 transition-colors inline-block"
            >
              Start planing
            </button>
          </div>

          {/* Right Side - Illustration (pushed to right edge) */}
          <div className="hidden lg:block relative">
            {/* Main Green Shape - Organic blob */}
            <div className="relative w-80 h-80">
              {/* Background organic shape */}
              <div className="absolute inset-0 bg-[#1A8917] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] transform rotate-12" />

              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-[#D4A373] rounded-full opacity-80" />
              <div className="absolute bottom-8 -left-6 w-12 h-12 bg-[#D4A373] rounded-full opacity-60" />
              <div className="absolute top-1/4 -left-8 w-8 h-8 bg-[#242424] rounded-full" />

              {/* Central icon composition */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Main book icon */}
                  <div className="bg-[#F7F4ED] p-6 rounded-2xl shadow-lg transform -rotate-6">
                    <BookOpen className="w-16 h-16 text-[#242424]" strokeWidth={1.5} />
                  </div>

                  {/* Floating pen */}
                  <div className="absolute -top-8 -right-8 bg-white p-3 rounded-xl shadow-md transform rotate-12">
                    <PenTool className="w-8 h-8 text-[#1A8917]" strokeWidth={1.5} />
                  </div>

                  {/* Floating graduation cap */}
                  <div className="absolute -bottom-6 -left-6 bg-white p-3 rounded-xl shadow-md transform -rotate-6">
                    <GraduationCap className="w-8 h-8 text-[#242424]" strokeWidth={1.5} />
                  </div>
                </div>
              </div>

              {/* Additional decorative lines */}
              <div className="absolute top-4 right-1/4 w-16 h-0.5 bg-[#242424]/20 transform rotate-45" />
              <div className="absolute bottom-1/4 right-4 w-12 h-0.5 bg-[#242424]/20 transform -rotate-12" />

              {/* Small dots pattern */}
              <div className="absolute top-1/3 -right-2 flex flex-col gap-2">
                <div className="w-2 h-2 bg-[#242424]/30 rounded-full" />
                <div className="w-2 h-2 bg-[#242424]/20 rounded-full" />
                <div className="w-2 h-2 bg-[#242424]/10 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
