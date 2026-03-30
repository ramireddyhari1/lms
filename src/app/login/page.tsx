'use client'

import { useActionState } from 'react'
import { login } from './actions'
import { useState } from 'react'

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  
  async function handleSubmit(formData: FormData) {
    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 font-sans">
      {/* Premium Light Background: Mesh Gradient / Blurred Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-teal-400/15 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[420px] px-4 relative z-10 flex flex-col items-center">
        
        {/* Logo and Brand */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/20">
              <span className="text-white font-extrabold text-2xl tracking-tighter">F</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: '#1e293b' }}>Flippedlearn</h1>
          </div>
          <p className="font-medium tracking-wide" style={{ color: '#64748b' }}>Empower. Educate. Employ.</p>
        </div>

        {/* Glassmorphic Login Card */}
        <div className="w-full bg-white/60 backdrop-blur-xl rounded-[32px] p-8 md:p-10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.1)] border border-white/80 relative overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {/* Subtle inner top highlight */}
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white to-transparent opacity-80"></div>

          <h2 className="text-2xl font-bold mb-8 text-center" style={{ color: '#1e293b' }}>Welcome Back</h2>
          
          {error && (
            <div className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm text-red-600 rounded-2xl text-sm border border-red-100 flex items-center gap-3">
              <i className="fas fa-exclamation-circle text-red-500"></i>
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="far fa-user text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                </div>
                <input 
                  type="text" 
                  name="username"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/60 bg-white/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400 transition-all font-medium shadow-sm shadow-slate-200/20"
                  placeholder="Enter 'admin' or any user"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="far fa-eye-slash text-slate-400 group-focus-within:text-blue-500 transition-colors"></i>
                </div>
                <input 
                  type="password" 
                  name="password"
                  className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-white/60 bg-white/50 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-blue-400 transition-all font-medium shadow-sm shadow-slate-200/20"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm px-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input type="checkbox" className="peer w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/30 transition-shadow cursor-pointer border-2" />
                </div>
                <span className="text-slate-600 font-medium group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              <a href="#" className="flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors mt-0">
                Forgot Password?
              </a>
            </div>

            <button 
              type="submit" 
              className="w-full pt-4 relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
              <div className="relative w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                Sign In
                <i className="fas fa-arrow-right text-sm"></i>
              </div>
            </button>
          </form>

        </div>

        {/* Footer info text */}
        <div className="mt-8 text-center text-sm font-medium text-slate-500 bg-white/40 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/50 shadow-sm animate-in fade-in duration-1000 delay-300">
          <p className="flex items-center justify-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Admin Login: Use username <span className="font-bold text-slate-700 px-1.5 py-0.5 bg-white rounded-md border border-slate-200">admin</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span>
            User Login: Use any other username
          </p>
        </div>

      </div>
    </div>
  )
}
