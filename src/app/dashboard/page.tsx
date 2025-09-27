'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import DashboardLayout from '@/components/DashboardLayout'
import ObjectiveCard from '@/components/ObjectiveCard'
import { Objective, User, ObjectiveAssignment, HealthMetrics } from '@/lib/types'

type ObjectiveWithDetails = Objective & {
  assignments: (ObjectiveAssignment & { user: User })[]
  creator: User
}

export default function Dashboard() {
  const { data: session } = useSession()
  const { t } = useTranslation()
  const [objectives, setObjectives] = useState<ObjectiveWithDetails[]>([])
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch objectives
      const objectivesResponse = await fetch('/api/objectives/my')
      const objectivesData = await objectivesResponse.json()

      if (objectivesData.success) {
        setObjectives(objectivesData.data)
      } else {
        setError(objectivesData.message)
      }

      // Fetch metrics
      const metricsResponse = await fetch('/api/dashboard/metrics')
      const metricsData = await metricsResponse.json()

      if (metricsData.success) {
        setMetrics(metricsData.data)
      }
    } catch (error) {
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (id: string) => {
    // TODO: Implement edit functionality
    console.log('Edit objective:', id)
  }

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete objective:', id)
  }

  const handleSendPulse = (id: string) => {
    // TODO: Implement send pulse functionality
    console.log('Send pulse for objective:', id)
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 mb-0">{t('nav.dashboard')}</h1>
          <p className="text-muted">{t('dashboard.welcome')}, {session?.user?.name || 'User'}!</p>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {/* Metrics Cards */}
      {metrics && (
        <div className="row mb-4 g-3">
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div className={`h2 mb-1 ${metrics.averageScore >= 80 ? 'text-success' : metrics.averageScore >= 60 ? 'text-warning' : 'text-danger'}`}>
                  {metrics.averageScore}%
                </div>
                <div className="text-muted small">Average Health Score</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="h2 mb-1 text-primary">{metrics.totalObjectives}</div>
                <div className="text-muted small">Total Objectives</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="h2 mb-1 text-success">{metrics.completedObjectives}</div>
                <div className="text-muted small">Completed</div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center">
              <div className="card-body">
                <div className="h2 mb-1 text-warning">{metrics.activePulseRequests}</div>
                <div className="text-muted small">Active Pulse Requests</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row mb-4">
        <div className="col">
          <h2 className="h5">{t('dashboard.myObjectives')}</h2>
        </div>
      </div>

      {objectives.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <span className="display-4 text-muted">🎯</span>
          </div>
          <h3 className="h5 text-muted">{t('dashboard.noObjectives')}</h3>
          <p className="text-muted">{t('dashboard.noObjectivesDesc')}</p>
        </div>
      ) : (
        <div className="row g-4">
          {objectives.map((objective) => (
            <div key={objective.id} className="col-lg-4 col-md-6">
              <ObjectiveCard
                objective={objective}
                onEdit={handleEdit}
                onSendPulse={handleSendPulse}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}