'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      if (session.user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (status === 'authenticated') {
    return null // Will redirect
  }

  return (
    <div className="min-vh-100 bg-light">
      {/* Hero Section */}
      <div className="container-fluid bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Acrux
              </h1>
              <p className="lead mb-4">
                Strategic Objectives Dashboard that connects your team's well-being to business goals through real-time pulse checks and proactive blocker management. {/* eslint-disable-line react/no-unescaped-entities */}
              </p>
              <div className="d-flex gap-3">
                <Link href="/auth/signup" className="btn btn-light btn-lg">
                  Get Started
                </Link>
                <Link href="/auth/signin" className="btn btn-outline-light btn-lg">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: '200px', height: '200px' }}>
                  <span className="display-1 text-primary">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span className="display-4">💓</span>
                </div>
                <h5 className="card-title">Team Well-being</h5>
                <p className="card-text text-muted">
                  Monitor team health through regular pulse checks and identify issues before they impact objectives.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span className="display-4">🚫</span>
                </div>
                <h5 className="card-title">Blocker Management</h5>
                <p className="card-text text-muted">
                  Report and resolve obstacles quickly with structured workflows and clear ownership.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div className="mb-3">
                  <span className="display-4">📊</span>
                </div>
                <h5 className="card-title">Health Scoring</h5>
                <p className="card-text text-muted">
                  Real-time health scores help predict objective success and guide resource allocation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-dark text-white py-4">
        <div className="container text-center">
          <p className="mb-0">&copy; 2025 Acrux. Connecting teams to success.</p>
        </div>
      </footer>
    </div>
  )
}
