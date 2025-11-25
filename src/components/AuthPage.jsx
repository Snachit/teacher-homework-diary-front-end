"use client"

import { ArrowLeft } from "lucide-react"
import AuthForm from "./AuthForm"
import ImageCarousel from "./ImageCarousel"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2600&auto=format&fit=crop",
    title: "Enhancing Classroom Efficiency",
    text: "Design an engaging and well-organized classroom for maximum effectiveness."
  },
  {
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2600&auto=format&fit=crop",
    title: "Streamlined Academic Tracking",
    text: "Keep a precise history of every session, module, and student progress."
  },
  {
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2600&auto=format&fit=crop",
    title: "Insightful Progress Reports",
    text: "Visualize teaching patterns and ensure curriculum compliance effortlessly."
  }
]

export default function AuthPage({ onBackToHome, onLoginSuccess }) {
  return (
    <div className="min-h-screen bg-[#F7F4ED] flex items-center justify-center p-4 relative">
      {/* Back Button */}
      <button
        onClick={onBackToHome}
        className="absolute top-8 left-8 flex items-center gap-2 text-[#242424] hover:text-[#1A8917] transition-colors z-10"
      >
        <ArrowLeft size={20} />
        <span className="font-semibold">Back to Home</span>
      </button>

      <div className="bg-[#F7F4ED] rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full grid grid-cols-1 md:grid-cols-5 min-h-[600px]">
        {/* Left Side - Form (40%) */}
        <div className="md:col-span-2">
          <AuthForm onLoginSuccess={onLoginSuccess} />
        </div>

        {/* Right Side - Carousel (60%) */}
        <div className="md:col-span-3 hidden md:block">
          <ImageCarousel slides={slides} />
        </div>
      </div>
    </div>
  )
}
