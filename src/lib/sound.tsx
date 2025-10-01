'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export type SoundType =
  | 'correct'
  | 'incorrect'
  | 'levelComplete'
  | 'buttonClick'
  | 'levelUp'
  | 'notification'
  | 'backgroundMusic'

interface SoundContextType {
  soundEnabled: boolean
  toggleSound: () => void
  playSound: (sound: SoundType) => void
  stopAllSounds: () => void
}

const SoundContext = createContext<SoundContextType | undefined>(undefined)

export function useSound() {
  const context = useContext(SoundContext)
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider')
  }
  return context
}

// Sound file paths
const SOUND_FILES: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  levelComplete: '/sounds/level-complete.mp3',
  buttonClick: '/sounds/button-click.mp3',
  levelUp: '/sounds/level-up.mp3',
  notification: '/sounds/notification.mp3',
  backgroundMusic: '/sounds/background-music.mp3'
}

// Audio instances cache for better performance
const audioCache = new Map<string, HTMLAudioElement>()

interface SoundProviderProps {
  children: ReactNode
}

export function SoundProvider({ children }: SoundProviderProps) {
  const [soundEnabled, setSoundEnabled] = useState(false)

  // Initialize and load user preferences
  useEffect(() => {
    // Check if user has sound preference saved
    const savedSoundPreference = localStorage.getItem('tebakgambar-sound-enabled')
    if (savedSoundPreference !== null) {
      setSoundEnabled(savedSoundPreference === 'true')
    }
  }, [])

  const toggleSound = useCallback(() => {
    const newState = !soundEnabled
    setSoundEnabled(newState)
    localStorage.setItem('tebakgambar-sound-enabled', newState.toString())
  }, [soundEnabled])

  const playSound = useCallback(async (sound: SoundType) => {
    if (!soundEnabled) return

    try {
      const soundPath = SOUND_FILES[sound]
      if (!soundPath) {
        console.warn(`Sound file not found for: ${sound}`)
        return
      }

      // Get or create audio instance
      let audio = audioCache.get(soundPath)
      if (!audio) {
        audio = new Audio(soundPath)
        audio.preload = 'auto'
        audio.volume = getVolumeForSound(sound)
        audioCache.set(soundPath, audio)
      }

      // Reset audio to beginning and play
      audio.currentTime = 0
      audio.volume = getVolumeForSound(sound)

      const playPromise = audio.play()

      if (playPromise !== undefined) {
        playPromise.catch(error => {
          // Silently handle autoplay policy violations
          if (error.name === 'NotAllowedError') {
            console.info('Audio autoplay blocked by browser policy')
          } else {
            console.warn('Audio playback error:', error)
          }
        })
      }
    } catch (error) {
      console.warn('Error playing sound:', error)
    }
  }, [soundEnabled])

  const stopAllSounds = useCallback(() => {
    audioCache.forEach(audio => {
      try {
        audio.pause()
        audio.currentTime = 0
      } catch (error) {
        console.warn('Error stopping audio:', error)
      }
    })
  }, [])

  const value: SoundContextType = {
    soundEnabled,
    toggleSound,
    playSound,
    stopAllSounds,
  }

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  )
}

// Helper function to get appropriate volume for different sound types
function getVolumeForSound(sound: SoundType): number {
  switch (sound) {
    case 'correct':
    case 'incorrect':
    case 'levelComplete':
      return 0.6 // Game feedback sounds
    case 'buttonClick':
      return 0.3 // UI sounds
    case 'levelUp':
      return 0.5 // Achievement sounds
    case 'notification':
      return 0.4 // Notification sounds
    case 'backgroundMusic':
      return 0.2 // Background music (lower volume)
    default:
      return 0.4
  }
}

// Preload critical sounds for better UX
export function preloadSounds() {
  const criticalSounds: SoundType[] = ['correct', 'incorrect', 'buttonClick']

  criticalSounds.forEach(sound => {
    const soundPath = SOUND_FILES[sound]
    if (soundPath) {
      const audio = new Audio(soundPath)
      audio.preload = 'auto'
      audio.volume = 0.01 // Very low volume for preloading
      audioCache.set(soundPath, audio)
    }
  })
}