import { User } from '@/lib/types'

interface UserAvatarProps {
  user: User
  size?: 'small' | 'medium' | 'large'
  showTooltip?: boolean
  className?: string
}

export default function UserAvatar({
  user,
  size = 'medium',
  showTooltip = false,
  className = ''
}: UserAvatarProps) {
  // Generate initials from name or email
  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    }
    return email.slice(0, 2).toUpperCase()
  }

  // Generate color based on user ID for consistency
  const getColorFromId = (id: string) => {
    const colors = [
      'bg-primary',
      'bg-success',
      'bg-info',
      'bg-warning',
      'bg-danger',
      'bg-secondary'
    ]
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length
    return colors[index]
  }

  const initials = getInitials(user.name, user.email)
  const bgColor = getColorFromId(user.id)

  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-lg'
  }

  const avatar = (
    <div
      className={`rounded-circle d-flex align-items-center justify-content-center text-white fw-bold ${bgColor} ${sizeClasses[size]} ${className}`}
      {...(showTooltip && {
        'data-bs-toggle': 'tooltip',
        'data-bs-placement': 'top',
        title: user.name || user.email
      })}
    >
      {initials}
    </div>
  )

  if (showTooltip) {
    // Initialize tooltip when component mounts (would need useEffect in real implementation)
    return avatar
  }

  return avatar
}