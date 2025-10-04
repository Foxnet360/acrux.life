'use client'

import { useEffect } from 'react'

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // i18n and Bootstrap JS initialized here on client
    import('@/lib/i18n')
    import('bootstrap/dist/js/bootstrap.bundle.min.js')
  }, [])

  return <>{children}</>
}