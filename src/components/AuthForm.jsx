"use client"

import { useState } from "react"
import { Mail, Lock, ShieldCheck, Briefcase } from "lucide-react"
import { authAPI } from "../services/api"

export default function AuthForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "professor"
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const response = await authAPI.login(formData.email, formData.password)

      // Check if user role matches selected role
      if (response.user.role !== formData.role) {
        setError(`Invalid credentials. Please select the correct role.`)
        setIsLoading(false)
        return
      }

      // Navigate to appropriate dashboard based on role
      onLoginSuccess(response.user.role)
    } catch (err) {
      setError(err.message || "Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleRoleChange = (role) => {
    setFormData({
      ...formData,
      role
    })
  }

  return (
    <div className="p-10 md:p-12 flex flex-col justify-center h-full">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#242424] mb-2">
          Welcome back
        </h1>
        <p className="text-[#242424]/60">
          Sign in to access your dashboard
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Email */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#242424]/40">
            <Mail size={20} />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3.5 border bg-[#F7F4ED] border-gray-300 rounded-lg focus:outline-none focus:border-[#1A8917] focus:ring-1 focus:ring-[#1A8917] transition-all text-[#242424]"
            required
          />
        </div>

        {/* Password */}
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#242424]/40">
            <Lock size={20} />
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-12 pr-4 py-3.5 border bg-[#F7F4ED] border-gray-300 rounded-lg focus:outline-none focus:border-[#1A8917] focus:ring-1 focus:ring-[#1A8917] transition-all text-[#242424]"
            required
          />
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-semibold text-[#242424] mb-3">
            I am a:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleRoleChange("professor")}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-lg border-2 transition-all ${
                formData.role === "professor"
                  ? "border-[#1A8917] bg-[#1A8917]/5 text-[#1A8917]"
                  : "border-gray-300 text-[#242424]/60 hover:border-gray-400"
              }`}
            >
              <Briefcase size={20} />
              <span className="font-semibold">Professor</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleChange("admin")}
              className={`flex items-center justify-center gap-2 py-3.5 rounded-lg border-2 transition-all ${
                formData.role === "admin"
                  ? "border-[#1A8917] bg-[#1A8917]/5 text-[#1A8917]"
                  : "border-gray-300 text-[#242424]/60 hover:border-gray-400"
              }`}
            >
              <ShieldCheck size={20} />
              <span className="font-semibold">Admin</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#1A8917] text-white py-3.5 rounded-lg font-semibold hover:bg-[#1A8917]/90 transition-all shadow-lg shadow-[#1A8917]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  )
}
