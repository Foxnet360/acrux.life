import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      common: {
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        create: 'Create',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success'
      },
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        objectives: 'Objectives',
        team: 'Team',
        profile: 'Profile'
      },
      // Auth
      auth: {
        signIn: 'Sign In',
        signUp: 'Sign Up',
        signOut: 'Sign Out',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        name: 'Full Name'
      },
      // Dashboard
      dashboard: {
        welcome: 'Welcome back',
        myObjectives: 'My Objectives',
        noObjectives: 'No objectives assigned',
        noObjectivesDesc: 'You don\'t have any objectives assigned to you yet.',
        allObjectives: 'All Objectives',
        noObjectivesAdmin: 'No objectives yet',
        noObjectivesAdminDesc: 'Create your first objective to get started.',
        createObjective: 'Create Objective'
      },
      // Objectives
      objectives: {
        title: 'Title',
        description: 'Description',
        priority: 'Priority',
        status: 'Status',
        progress: 'Progress',
        healthScore: 'Health Score',
        targetDate: 'Target Date',
        assignedUsers: 'Assigned Users',
        high: 'High',
        medium: 'Medium',
        low: 'Low',
        notStarted: 'Not Started',
        inProgress: 'In Progress',
        completed: 'Completed',
        blocked: 'Blocked'
      },
      // Pulse
      pulse: {
        sendPulse: 'Send Pulse',
        pulseCheck: 'Pulse Check',
        rating: 'Rating',
        feedback: 'Feedback (optional)',
        submit: 'Submit Response',
        pendingRequests: 'Pending Pulse Requests',
        noPending: 'No pending pulse requests'
      },
      // Blockers
      blockers: {
        reportBlocker: 'Report Blocker',
        blockerTitle: 'Blocker Title',
        description: 'Description',
        severity: 'Severity',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        critical: 'Critical',
        status: 'Status',
        open: 'Open',
        inProgress: 'In Progress',
        resolved: 'Resolved',
        closed: 'Closed'
      }
    }
  },
  es: {
    translation: {
      // Common
      common: {
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        create: 'Crear',
        loading: 'Cargando...',
        error: 'Error',
        success: 'Éxito'
      },
      // Navigation
      nav: {
        dashboard: 'Panel',
        objectives: 'Objetivos',
        team: 'Equipo',
        profile: 'Perfil'
      },
      // Auth
      auth: {
        signIn: 'Iniciar Sesión',
        signUp: 'Registrarse',
        signOut: 'Cerrar Sesión',
        email: 'Correo electrónico',
        password: 'Contraseña',
        confirmPassword: 'Confirmar Contraseña',
        name: 'Nombre completo'
      },
      // Dashboard
      dashboard: {
        welcome: 'Bienvenido de vuelta',
        myObjectives: 'Mis Objetivos',
        noObjectives: 'No hay objetivos asignados',
        noObjectivesDesc: 'Aún no tienes objetivos asignados.',
        allObjectives: 'Todos los Objetivos',
        noObjectivesAdmin: 'Aún no hay objetivos',
        noObjectivesAdminDesc: 'Crea tu primer objetivo para comenzar.',
        createObjective: 'Crear Objetivo'
      },
      // Objectives
      objectives: {
        title: 'Título',
        description: 'Descripción',
        priority: 'Prioridad',
        status: 'Estado',
        progress: 'Progreso',
        healthScore: 'Puntuación de Salud',
        targetDate: 'Fecha objetivo',
        assignedUsers: 'Usuarios asignados',
        high: 'Alta',
        medium: 'Media',
        low: 'Baja',
        notStarted: 'No iniciado',
        inProgress: 'En progreso',
        completed: 'Completado',
        blocked: 'Bloqueado'
      },
      // Pulse
      pulse: {
        sendPulse: 'Enviar Pulso',
        pulseCheck: 'Chequeo de Pulso',
        rating: 'Calificación',
        feedback: 'Comentarios (opcional)',
        submit: 'Enviar Respuesta',
        pendingRequests: 'Solicitudes de Pulso Pendientes',
        noPending: 'No hay solicitudes de pulso pendientes'
      },
      // Blockers
      blockers: {
        reportBlocker: 'Reportar Bloqueo',
        blockerTitle: 'Título del Bloqueo',
        description: 'Descripción',
        severity: 'Severidad',
        low: 'Baja',
        medium: 'Media',
        high: 'Alta',
        critical: 'Crítica',
        status: 'Estado',
        open: 'Abierto',
        inProgress: 'En progreso',
        resolved: 'Resuelto',
        closed: 'Cerrado'
      }
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already escapes values
    }
  })

export default i18n