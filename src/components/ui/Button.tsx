import { ButtonHTMLAttributes, ReactNode, memo, useCallback } from 'react'
import { useSound } from '@/lib/sound'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'warning' | 'gradient' | 'glass' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = memo<ButtonProps>(function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  ...props
}) {
  const { playSound } = useSound()

  const handleClick = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    playSound('buttonClick')
    onClick?.(event)
  }, [onClick, playSound])
  const baseClasses = 'flex items-center rounded-xl font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl'

  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500',
    secondary: 'bg-gradient-to-r from-teal-400 to-cyan-500 text-white hover:from-teal-500 hover:to-cyan-600 focus:ring-teal-500',
    outline: 'border-2 border-white/30 text-white bg-white/10 hover:bg-white/20 focus:ring-white/50 backdrop-blur-sm',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 focus:ring-green-500',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 focus:ring-yellow-500',
    gradient: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white hover:from-pink-600 hover:via-purple-600 hover:to-indigo-600 focus:ring-purple-500 animated-gradient',
    glass: 'bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 focus:ring-white/50',
    info: 'bg-gradient-to-r from-sky-400 to-blue-500 text-white hover:from-sky-500 hover:to-blue-600 focus:ring-sky-500',
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  return (
    <button
      className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})