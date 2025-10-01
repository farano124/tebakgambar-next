'use client'

import { useEffect, useCallback, useRef } from 'react'

export type KeyboardShortcut = {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  preventDefault?: boolean
  stopPropagation?: boolean
}

export type KeyboardHandler = (event: KeyboardEvent) => void

interface KeyboardShortcutsOptions {
  enabled?: boolean
  ignoreInputElements?: boolean
}

export function useKeyboardShortcuts(
  shortcuts: Array<{
    shortcut: KeyboardShortcut | string
    handler: KeyboardHandler
  }>,
  options: KeyboardShortcutsOptions = {}
) {
  const { enabled = true, ignoreInputElements = true } = options
  const shortcutsRef = useRef(shortcuts)

  // Update shortcuts ref when shortcuts change
  useEffect(() => {
    shortcutsRef.current = shortcuts
  }, [shortcuts])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    // Ignore if focused on input elements
    if (ignoreInputElements) {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.contentEditable === 'true'
      ) {
        // Allow Enter key for form submission in inputs
        if (event.key !== 'Enter') {
          return
        }
      }
    }

    // Find matching shortcut
    for (const { shortcut, handler } of shortcutsRef.current) {
      const shortcutConfig = typeof shortcut === 'string'
        ? { key: shortcut }
        : shortcut

      const keyMatches = event.key.toLowerCase() === shortcutConfig.key.toLowerCase()
      const ctrlMatches = !!event.ctrlKey === !!shortcutConfig.ctrlKey
      const altMatches = !!event.altKey === !!shortcutConfig.altKey
      const shiftMatches = !!event.shiftKey === !!shortcutConfig.shiftKey
      const metaMatches = !!event.metaKey === !!shortcutConfig.metaKey

      if (keyMatches && ctrlMatches && altMatches && shiftMatches && metaMatches) {
        if (shortcutConfig.preventDefault !== false) {
          event.preventDefault()
        }
        if (shortcutConfig.stopPropagation !== false) {
          event.stopPropagation()
        }

        handler(event)
        break // Only handle first matching shortcut
      }
    }
  }, [enabled, ignoreInputElements])

  useEffect(() => {
    if (!enabled) return

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown, enabled])

  return {
    enabled,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setEnabled: (_newEnabled: boolean) => {
      // This would need to be handled by parent component
      // since we can't modify the options directly
    }
  }
}

// Specialized hook for game keyboard shortcuts
export function useGameKeyboardShortcuts(
  handlers: {
    onHint?: () => void
    onSubmit?: () => void
    onNextLevel?: () => void
    onPreviousLevel?: () => void
  },
  enabled: boolean = true
) {
  const shortcuts = [
    {
      shortcut: ' ',
      handler: (event: KeyboardEvent) => {
        event.preventDefault()
        handlers.onHint?.()
      }
    },
    {
      shortcut: 'Enter',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handler: (_event: KeyboardEvent) => {
        handlers.onSubmit?.()
      }
    },
    {
      shortcut: 'ArrowRight',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handler: (_event: KeyboardEvent) => {
        handlers.onNextLevel?.()
      }
    },
    {
      shortcut: 'ArrowLeft',
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      handler: (_event: KeyboardEvent) => {
        handlers.onPreviousLevel?.()
      }
    }
  ].filter(({ handler }) => handler !== undefined)

  return useKeyboardShortcuts(shortcuts, {
    enabled,
    ignoreInputElements: true
  })
}

// Utility function to format shortcut for display
export function formatShortcut(shortcut: KeyboardShortcut | string): string {
  const config = typeof shortcut === 'string'
    ? { key: shortcut }
    : shortcut

  const parts: string[] = []

  if (config.ctrlKey) parts.push('Ctrl')
  if (config.altKey) parts.push('Alt')
  if (config.shiftKey) parts.push('Shift')
  if (config.metaKey) parts.push('Cmd')

  const keyDisplay = config.key === ' '
    ? 'Space'
    : config.key.length === 1
    ? config.key.toUpperCase()
    : config.key

  parts.push(keyDisplay)

  return parts.join(' + ')
}