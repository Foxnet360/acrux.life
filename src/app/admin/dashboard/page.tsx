'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import DashboardLayout from '@/components/DashboardLayout'
import ObjectiveCard from '@/components/ObjectiveCard'
import { Objective, User, ObjectiveAssignment } from '@/lib/types'

type ObjectiveWithDetails = Objective & {
  assignments: (ObjectiveAssignment & { user: User })[]
  creator: User
}

export default function AdminDashboard() {
  const { data: session } = useSession()
  const [objectives, setObjectives] = useState<ObjectiveWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchObjectives()
  }, [])

  const fetchObjectives = async () => {
    try {
      const response = await fetch('/api/objectives')
      const data = await response.json()

      if (data.success) {
        setObjectives(data.data)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Failed to load objectives')
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
      <DashboardLayout requireAdmin>
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout requireAdmin>
      <div className="row mb-4">
        <div className="col">
          <h1 className="h3 mb-0">Admin Dashboard</h1>
          <p className="text-muted">Manage team objectives and monitor progress</p>
        </div>
        <div className="col-auto">
          <button className="btn btn-primary">
            Create Objective
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row mb-4">
        <div className="col">
          <h2 className="h5">All Objectives</h2>
        </div>
      </div>

      {objectives.length === 0 ? (
        <div className="text-center py-5">
          <div className="mb-3">
            <span className="display-4 text-muted">📋</span>
          </div>
          <h3 className="h5 text-muted">No objectives yet</h3>
          <p className="text-muted">Create your first objective to get started.</p>
          <button className="btn btn-primary">Create Objective</button>
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