import { ButtonHTMLAttributes, ReactNode, memo, useCallback } from 'react'
import { useSound } from '@/lib/sound'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
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
  const baseClasses = 'rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-blue-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
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