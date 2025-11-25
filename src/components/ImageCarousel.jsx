"use client"

import { useState, useEffect } from "react"

export default function ImageCarousel({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [slides.length])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Image Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Background Image */}
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />

          {/* Forest Green Overlay */}
          <div className="absolute inset-0 bg-[#1A8917]/80 mix-blend-multiply" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-12 text-white">
            <h2 className="text-4xl font-bold mb-4 transition-all duration-700">
              {slide.title}
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-md transition-all duration-700">
              {slide.text}
            </p>

            {/* Dots Navigation */}
            <div className="flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full bg-white transition-all duration-500 ease-in-out ${
                    index === currentSlide ? "w-8" : "w-2 opacity-50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
