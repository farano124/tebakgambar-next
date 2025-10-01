'use client'

import { useTheme } from '@/lib/theme'
import { Button } from '@/components/ui/Button'
import { Sun, Moon, Monitor } from 'lucide-react'
import { memo } from 'react'

export const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="w-4 h-4" />
      case 'dark':
        return <Moon className="w-4 h-4" />
      case 'system':
        return <Monitor className="w-4 h-4" />
      default:
        return <Sun className="w-4 h-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Tema Terang'
      case 'dark':
        return 'Tema Gelap'
      case 'system':
        return 'Tema Sistem'
      default:
        return 'Tema'
    }
  }

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
      title={`Ganti tema - ${getLabel()}`}
    >
      {getIcon()}
      <span className="sr-only">{getLabel()}</span>
    </Button>
  )
})