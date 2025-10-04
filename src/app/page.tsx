'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { Target, Heart, AlertTriangle, BarChart3, PlayCircle } from 'lucide-react'

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
    <div className="min-vh-100">
      {/* Nav Menu */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
        <div className="container">
          <Link className="navbar-brand fw-bold text-primary" href="/">
            Acrux
          </Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" href="/auth/signin">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="btn btn-primary ms-2" href="/auth/signup">Sign Up</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-5 mt-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Connect Team Well-being to Business Success
              </h1>
              <p className="lead mb-4">
                Acrux bridges the gap between team health and business objectives through real-time pulse checks, proactive blocker management, and data-driven insights that drive measurable results.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link href="/auth/signup" className="btn btn-light btn-lg">
                  Start Free Trial
                </Link>
                <Link href="#features" className="btn btn-outline-light btn-lg">
                  Learn More
                </Link>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <div className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center shadow" style={{ width: '250px', height: '250px' }}>
                  <Target size={120} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solution Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <h2 className="h1 mb-4 text-dark">The Challenge: Invisible Blockers Hurt Business Goals</h2>
              <div className="mb-3">
                <h5 className="text-dark">❌ Teams struggle with unidentified blockers</h5>
                <p className="text-muted">Without visibility into team health, critical issues go unnoticed until they impact deadlines and objectives.</p>
              </div>
              <div className="mb-3">
                <h5 className="text-dark">❌ Reactive rather than proactive management</h5>
                <p className="text-muted">Traditional tools focus on tasks, not the human factors that determine success.</p>
              </div>
              <div className="mb-3">
                <h5 className="text-dark">❌ Disconnected well-being and business metrics</h5>
                <p className="text-muted">Team health data isn't leveraged to predict and prevent objective failures.</p>
              </div>
            </div>
            <div className="col-lg-6">
              <h2 className="h1 mb-4 text-dark">The Solution: Acrux Connects Well-being to Success</h2>
              <div className="mb-3">
                <h5 className="text-dark">✅ Real-time pulse checks for early detection</h5>
                <p className="text-muted">Regular, anonymous health assessments identify issues before they escalate.</p>
              </div>
              <div className="mb-3">
                <h5 className="text-dark">✅ Structured blocker management workflows</h5>
                <p className="text-muted">Clear processes for reporting, assigning, and resolving obstacles quickly.</p>
              </div>
              <div className="mb-3">
                <h5 className="text-dark">✅ Health scoring tied to business outcomes</h5>
                <p className="text-muted">Predict objective success and allocate resources based on team health data.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 mb-3">Core Capabilities</h2>
            <p className="lead text-muted">Everything you need to align team well-being with business objectives</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <div className="mb-3">
                      <Target size={64} className="text-primary" />
                    </div>
                  <h5 className="card-title">Objective Tracking</h5>
                  <p className="card-text text-muted">
                    Monitor progress on key business objectives with real-time health correlations.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <div className="mb-3">
                      <Heart size={64} className="text-danger" />
                    </div>
                  <h5 className="card-title">Team Pulse Checks</h5>
                  <p className="card-text text-muted">
                    Regular, anonymous surveys to gauge team morale and identify emerging issues.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <div className="mb-3">
                      <AlertTriangle size={64} className="text-warning" />
                    </div>
                  <h5 className="card-title">Blocker Management</h5>
                  <p className="card-text text-muted">
                    Streamlined workflows for reporting and resolving obstacles with clear ownership.
                  </p>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-lg-3">
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <div className="mb-3">
                      <BarChart3 size={64} className="text-success" />
                    </div>
                  <h5 className="card-title">Health Scoring</h5>
                  <p className="card-text text-muted">
                    Predictive analytics that correlate team health with objective success rates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-5 bg-light">
        <div className="container text-center">
          <h2 className="h1 mb-4 text-dark">See Acrux in Action</h2>
          <p className="lead text-muted mb-4">Watch how teams transform their productivity with connected well-being insights</p>
          <div className="ratio ratio-16x9 bg-dark rounded shadow" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="d-flex align-items-center justify-content-center text-white">
              <div>
                <PlayCircle size={100} className="text-white mb-3" />
                <p>Demo Video Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="h1 mb-3">Trusted by Teams Worldwide</h2>
            <p className="lead text-muted">See what leaders say about Acrux</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3">
                    <span className="text-warning">★★★★★</span>
                  </div>
                  <p className="card-text">"Acrux helped us identify blockers before they derailed our quarterly objectives. The pulse checks gave us early warning signals we never had before."</p>
                  <div className="d-flex align-items-center">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                      S
                    </div>
                    <div>
                      <strong>Sarah Chen</strong>
                      <br />
                      <small className="text-muted">VP Engineering, TechCorp</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3">
                    <span className="text-warning">★★★★★</span>
                  </div>
                  <p className="card-text">"The health scoring feature is a game-changer. We can now predict objective success and reallocate resources proactively."</p>
                  <div className="d-flex align-items-center">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                      M
                    </div>
                    <div>
                      <strong>Mike Rodriguez</strong>
                      <br />
                      <small className="text-muted">Product Manager, InnovateLabs</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card border-0 shadow-sm">
                <div className="card-body">
                  <div className="mb-3">
                    <span className="text-warning">★★★★★</span>
                  </div>
                  <p className="card-text">"Blocker management used to be chaotic. Acrux brought structure and accountability, improving our team's velocity by 30%."</p>
                  <div className="d-flex align-items-center">
                    <div className="bg-info rounded-circle d-flex align-items-center justify-content-center text-white fw-bold me-3" style={{ width: '40px', height: '40px' }}>
                      A
                    </div>
                    <div>
                      <strong>Alex Thompson</strong>
                      <br />
                      <small className="text-muted">Team Lead, StartupXYZ</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reiteration CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h2 className="h1 mb-4">Ready to Connect Well-being to Business Success?</h2>
          <p className="lead mb-4">Join thousands of teams using Acrux to achieve their objectives through healthier, more engaged teams.</p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link href="/auth/signup" className="btn btn-light btn-lg">
              Start Your Free Trial
            </Link>
            <Link href="/auth/signin" className="btn btn-outline-light btn-lg">
              Sign In to Dashboard
            </Link>
          </div>
          <p className="mt-3 text-primary-50">No credit card required • 14-day free trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-3">Acrux</h5>
              <p className="text-muted">Connecting team well-being to business success through intelligent pulse checks and blocker management.</p>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-3">Product</h5>
              <ul className="list-unstyled">
                <li><Link href="#features" className="text-muted text-decoration-none">Features</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Pricing</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Security</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Integrations</Link></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-3">Company</h5>
              <ul className="list-unstyled">
                <li><Link href="#" className="text-muted text-decoration-none">About</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Blog</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Careers</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Contact</Link></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6">
              <h5 className="mb-3">Support</h5>
              <ul className="list-unstyled">
                <li><Link href="#" className="text-muted text-decoration-none">Help Center</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Documentation</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Community</Link></li>
                <li><Link href="#" className="text-muted text-decoration-none">Status</Link></li>
              </ul>
            </div>
          </div>
          <hr className="my-4" />
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="mb-0 text-muted">&copy; 2025 Acrux. All rights reserved.</p>
            </div>
            <div className="col-md-6 text-md-end">
              <Link href="#" className="text-muted text-decoration-none me-3">Privacy Policy</Link>
              <Link href="#" className="text-muted text-decoration-none me-3">Terms of Service</Link>
              <Link href="#" className="text-muted text-decoration-none">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
