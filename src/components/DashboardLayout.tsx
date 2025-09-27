'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Navbar from './Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireAdmin?: boolean
}

export default function DashboardLayout({
  children,
  requireAuth = true,
  requireAdmin = false
}: DashboardLayoutProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (requireAuth && status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (requireAdmin && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, requireAuth, requireAdmin, router])

  if (status === 'loading') {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  if (requireAuth && status === 'unauthenticated') {
    return null // Will redirect
  }

  if (requireAdmin && session?.user?.role !== 'ADMIN') {
    return null // Will redirect
  }

  return (
    <div className="min-vh-100 bg-light">
      <Navbar />
      <main className="container-fluid py-4">
        {children}
      </main>
    </div>
  )
}