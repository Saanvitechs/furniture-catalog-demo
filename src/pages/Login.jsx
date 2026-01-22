import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { dummyUsers, delay } from '../services/dummyData'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await delay(500)
      
      const user = dummyUsers[email]
      
      if (!user) {
        throw new Error('Invalid credentials')
      }

      sessionStorage.setItem('email', user.email)
      sessionStorage.setItem('role', user.role)

      navigate('/')
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={`min-h-screen w-full bg-gradient-to-br from-slate-50 via-[#FFE1AF]/20 to-[#E2B59A]/20`}>
      <div className="flex min-h-screen w-full flex-col lg:flex-row">

        {/* ================= VIDEO SECTION ================= */}
        <div className="relative lg:w-1/2 min-h-[40vh] lg:min-h-screen overflow-hidden">
          {/* Gradient Overlay */}
          <div className="absolute inset-0  z-10" />

          {/* Background Video */}
          <video
            src="/Screen Recording 2026-01-15 133851.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Content Overlay */}
         
        </div>

        {/* ================= LOGIN SECTION ================= */}
        <div className="lg:w-1/2 flex items-center justify-center px-6 py-12 lg:py-0">
          <div className="w-full max-w-md">

            {/* Header */}
            <div className="text-center mb-8">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 tracking-tight">
                Sign in to your account
              </h2>
              <p className="text-gray-600">
                Enter your credentials to continue
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className={`mb-6 bg-[#B77466]/10 border border-[#B77466]/30 rounded-2xl px-5 py-3.5 text-sm text-[#B77466] flex items-start gap-3`}>
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 ml-1">
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 ml-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm pt-1">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer" 
                    />
                    <span className="text-gray-700 group-hover:text-gray-900">Remember me</span>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full mt-6 rounded-xl bg-gradient-to-r from-[#B77466] to-[#957C62] text-white py-3.5 font-semibold hover:from-[#A3665A] hover:to-[#846B55] transition-all shadow-lg hover:shadow-xl disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <div className="h-5 w-5 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">New to our platform?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <Link 
                  to="/register" 
                  className="inline-flex items-center justify-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group"
                >
                  Create an account
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-8 text-center">
              <p className="text-xs text-gray-500 mb-3">Trusted by thousands of customers</p>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </main>
  )
}