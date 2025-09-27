'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'

export default function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const { t, i18n } = useTranslation()
  const [currentLang, setCurrentLang] = useState('en')

  useEffect(() => {
    setCurrentLang(i18n.language)
  }, [i18n.language])

  const isActive = (path: string) => pathname === path

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang)
    setCurrentLang(lang)
  }

  if (!session) return null

  const isAdmin = session.user.role === 'ADMIN'

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand fw-bold" href={isAdmin ? '/admin/dashboard' : '/dashboard'}>
          Acrux
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive(isAdmin ? '/admin/dashboard' : '/dashboard') ? 'active' : ''}`}
                href={isAdmin ? '/admin/dashboard' : '/dashboard'}
              >
                {t('nav.dashboard')}
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${isActive('/objectives') ? 'active' : ''}`}
                href="/objectives"
              >
                {t('nav.objectives')}
              </Link>
            </li>
            {isAdmin && (
              <>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/admin/team') ? 'active' : ''}`}
                    href="/admin/team"
                  >
                    {t('nav.team')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className={`nav-link ${isActive('/admin/pulse') ? 'active' : ''}`}
                    href="/admin/pulse"
                  >
                    Pulse Requests
                  </Link>
                </li>
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="languageDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {currentLang === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}
              </a>
              <ul className="dropdown-menu" aria-labelledby="languageDropdown">
                <li>
                  <button
                    className={`dropdown-item ${currentLang === 'en' ? 'active' : ''}`}
                    onClick={() => changeLanguage('en')}
                  >
                    🇺🇸 English
                  </button>
                </li>
                <li>
                  <button
                    className={`dropdown-item ${currentLang === 'es' ? 'active' : ''}`}
                    onClick={() => changeLanguage('es')}
                  >
                    🇪🇸 Español
                  </button>
                </li>
              </ul>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {session.user.name || session.user.email}
              </a>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                <li>
                  <Link className="dropdown-item" href="/profile">
                    {t('nav.profile')}
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    {t('auth.signOut')}
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}