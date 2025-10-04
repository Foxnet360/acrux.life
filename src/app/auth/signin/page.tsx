'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        // Redirect to dashboard (default for RESEARCHER role)
        router.push('/dashboard')
      }
    } catch (error) { // eslint-disable-line @typescript-eslint/no-unused-vars
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow" style={{ width: '400px', maxWidth: '90%' }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <h2 className="h4 mb-2">Welcome to Acrux</h2>
            <p className="text-muted">Sign in to your account</p>
          </div>

          <ErrorBoundary>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </ErrorBoundary>

          <div className="text-center mt-3">
            <p className="mb-0">
              Don't have an account?{' '} {/* eslint-disable-line react/no-unescaped-entities */}
              <Link href="/auth/signup" className="text-decoration-none">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}