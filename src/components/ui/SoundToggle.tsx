'use client'

import { useSound } from '@/lib/sound'
import { Button } from '@/components/ui/Button'
import { Volume2, VolumeX } from 'lucide-react'
import { memo } from 'react'

export const SoundToggle = memo(function SoundToggle() {
  const { soundEnabled, toggleSound } = useSound()

  return (
    <Button
      onClick={toggleSound}
      variant="outline"
      size="sm"
      className="bg-white/10 border-white/20 text-white hover:bg-white/20 transition-colors"
      title={`${soundEnabled ? 'Matikan' : 'Nyalakan'} suara`}
    >
      {soundEnabled ? (
        <Volume2 className="w-4 h-4" />
      ) : (
        <VolumeX className="w-4 h-4" />
      )}
      <span className="sr-only">
        {soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
      </span>
    </Button>
  )
})