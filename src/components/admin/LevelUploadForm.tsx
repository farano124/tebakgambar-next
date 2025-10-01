'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import Image from 'next/image'
import toast from 'react-hot-toast'

interface LevelUploadFormProps {
  onLevelAdded?: () => void
}

export default function LevelUploadForm({ onLevelAdded }: LevelUploadFormProps) {
  const [file, setFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    level: '',
    jawaban: '',
    makna: '',
    peribahasa: ''
  })
  const [uploading, setUploading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()

    if (!file || !formData.jawaban || !formData.level) {
      toast.error('Harap lengkapi semua field yang diperlukan!')
      return
    }

    if (!formData.makna.trim() || !formData.peribahasa.trim()) {
      toast.error('Makna dan peribahasa harus diisi!')
      return
    }

    setUploading(true)

    try {
      // 1. Upload gambar ke Supabase Storage
      const fileName = `${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('gambar_kuis') // Nama bucket kamu
        .upload(fileName, file)

      if (uploadError) {
        throw new Error(`Upload error: ${uploadError.message}`)
      }

      // 2. Dapatkan URL publik gambar
      const { data: { publicUrl } } = supabase.storage
        .from('gambar_kuis')
        .getPublicUrl(fileName)

      // 3. Simpan data ke tabel levels
      const { error: insertError } = await supabase
        .from('levels')
        .insert([{
          level: parseInt(formData.level),
          gambar: publicUrl,
          jawaban: formData.jawaban.trim().toLowerCase(),
          makna: formData.makna.trim(),
          peribahasa: formData.peribahasa.trim()
        }])

      if (insertError) {
        throw new Error(`Database error: ${insertError.message}`)
      }

      toast.success('Level berhasil ditambahkan! 🎉')

      // Reset form
      setFile(null)
      setPreviewUrl('')
      setFormData({
        level: '',
        jawaban: '',
        makna: '',
        peribahasa: ''
      })

      onLevelAdded?.()

    } catch (error) {
      console.error('Upload error:', error)
      toast.error(error instanceof Error ? error.message : 'Terjadi kesalahan saat mengunggah')
    } finally {
      setUploading(false)
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast.error('Harap pilih file gambar!')
        return
      }
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Ukuran file maksimal 5MB!')
        return
      }

      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center rainbow-text">
        Tambah Level Baru
      </h2>

      <form onSubmit={handleUpload} className="space-y-6">
        {/* Level Number */}
        <div>
          <label htmlFor="level" className="block text-sm font-medium text-white/80 mb-2">
            Nomor Level *
          </label>
          <input
            type="number"
            id="level"
            name="level"
            value={formData.level}
            onChange={handleInputChange}
            min="1"
            max="100"
            required
            disabled={uploading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
            placeholder="Masukkan nomor level (contoh: 1, 2, 3, ...)"
          />
        </div>

        {/* File Upload */}
        <div>
          <label htmlFor="file" className="block text-sm font-medium text-white/80 mb-2">
            Gambar Level *
          </label>
          <input
            type="file"
            id="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
          />

          {/* Image Preview */}
          {previewUrl && (
            <div className="mt-4">
              <p className="text-sm text-white/70 mb-2">Preview:</p>
              <div className="relative max-w-xs mx-auto">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={300}
                  height={200}
                  className="rounded-lg shadow-lg max-h-48 object-contain border border-white/20"
                />
              </div>
            </div>
          )}
        </div>

        {/* Answer */}
        <div>
          <label htmlFor="jawaban" className="block text-sm font-medium text-white/80 mb-2">
            Jawaban (Yang Harus Ditebak) *
          </label>
          <input
            type="text"
            id="jawaban"
            name="jawaban"
            value={formData.jawaban}
            onChange={handleInputChange}
            required
            disabled={uploading}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
            placeholder="Jawaban yang harus ditebak pemain (contoh: kucing, rumah, dll)"
          />
        </div>

        {/* Meaning */}
        <div>
          <label htmlFor="makna" className="block text-sm font-medium text-white/80 mb-2">
            Makna/Penjelasan *
          </label>
          <textarea
            id="makna"
            name="makna"
            value={formData.makna}
            onChange={handleInputChange}
            required
            disabled={uploading}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
            placeholder="Penjelasan makna dari gambar ini..."
          />
        </div>

        {/* Proverb */}
        <div>
          <label htmlFor="peribahasa" className="block text-sm font-medium text-white/80 mb-2">
            Peribahasa/Pepatah *
          </label>
          <textarea
            id="peribahasa"
            name="peribahasa"
            value={formData.peribahasa}
            onChange={handleInputChange}
            required
            disabled={uploading}
            rows={2}
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all resize-none"
            placeholder="Peribahasa atau pepatah yang terkait (contoh: Bagai kucing dalam karung)"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center pt-4">
          <Button
            type="submit"
            disabled={uploading || !file || !formData.jawaban || !formData.level}
            size="lg"
            variant="gradient"
            className="px-8 py-3"
          >
            {uploading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Mengunggah...
              </>
            ) : (
              'Tambah Level'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}