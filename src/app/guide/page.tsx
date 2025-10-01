'use client'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, BookOpen, Trophy, Users } from 'lucide-react'

export default function GuidePage() {
  return (
    <div className="min-h-screen p-4 slide-in-up">
      {/* Navigation */}
      <nav className="glass-card-enhanced p-6 mb-8 floating">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 slide-in-left">
            <Link href="/">
              <Button variant="outline" size="sm" className="btn-hover-lift">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Kembali
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold rainbow-text font-display flex items-center">
                <BookOpen className="w-10 h-10 mr-3 pulse-glow" />
                Panduan
              </h1>
              <p className="text-white/70">Pelajari cara bermain Tebak Gambar</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section 1: Cara Membaca Gambar */}
        <div className="glass-card-enhanced p-8 floating slide-in-up">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center pulse-glow mr-4">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold rainbow-text font-display">
              1. Cara Membaca Gambar
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1 */}
            <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/1.jpg"
                  alt="Panduan 1"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Penjelasan Gambar</h3>
              <p className="text-white/80 leading-relaxed">
                Gambar diatas menjelaskan bahwa huruf <strong className="text-purple-300">EJ</strong> digantikan dengan <strong className="text-green-300">AT</strong>.
                Jadi yang sebelumnya adalah <strong className="text-blue-300">MEJA</strong> menjadi <strong className="text-yellow-300">MATA</strong>.
              </p>
            </div>

            {/* Card 2 */}
            <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/2.jpg"
                  alt="Panduan 2"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Penjelasan Gambar</h3>
              <p className="text-white/80 leading-relaxed">
                Gambar diatas menjelaskan bahwa huruf <strong className="text-purple-300">NG</strong> dihilangkan dan Kata <strong className="text-blue-300">KACANG</strong> akan menjadi <strong className="text-yellow-300">KACA</strong>.
              </p>
            </div>

            {/* Card 3 */}
            <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/3.jpg"
                  alt="Panduan 3"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Penjelasan Gambar</h3>
              <p className="text-white/80 leading-relaxed">
                Gambar diatas menjelaskan bahwa huruf <strong className="text-purple-300">EJ</strong> digantikan dengan <strong className="text-green-300">AT</strong>.
                Dan ditambahkan dengan kata <strong className="text-blue-300">HATI</strong> maka akan menjadi <strong className="text-yellow-300">MATA HATI</strong>.
              </p>
            </div>

            {/* Card 4 */}
            <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/4.jpg"
                  alt="Panduan 4"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Penjelasan Gambar</h3>
              <p className="text-white/80 leading-relaxed">
                Gambar diatas menjelaskan bahwa huruf <strong className="text-blue-300">E</strong> digantikan dengan <strong className="text-green-300">A</strong> dan huruf <strong className="text-purple-300">A</strong> digantikan dengan <strong className="text-red-300">U</strong>.
                Maka kata <strong className="text-blue-300">TENDA</strong> akan menjadi <strong className="text-yellow-300">TANDU</strong>.
              </p>
            </div>

            {/* Card 5 */}
            <div className="glass-card-enhanced p-6 floating bounce-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.5s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/5.jpg"
                  alt="Panduan 5"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Penjelasan Gambar</h3>
              <p className="text-white/80 leading-relaxed">
                Gambar diatas menjelaskan bahwa simbol (<strong className="text-red-300">-</strong>) dan tanda baca (<strong className="text-red-300">,</strong>) atau (<strong className="text-red-300">.</strong>) tidak digunakan dalam jawaban.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Ranking User */}
        <div className="glass-card-enhanced p-8 floating slide-in-up">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center pulse-glow mr-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold rainbow-text font-display">
              2. Ranking User
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Ranking Overview */}
            <div className="glass-card-enhanced p-6 floating bounce-in md:col-span-2 lg:col-span-3" style={{ animationDelay: '0.1s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/rank.jpg"
                  alt="Tampilan Ranking"
                  width={400}
                  height={200}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Tampilan Ranking User</h3>
              <p className="text-white/80 leading-relaxed text-center">
                Baris yang berwarna <span className="text-green-300 font-bold">hijau</span> adalah user yang login/akun kita.
              </p>
            </div>

            {/* Rank Column */}
            <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/rank1.jpg"
                  alt="Kolom Rank"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold rainbow-text mb-3">#RANK</h3>
              <p className="text-white/80 leading-relaxed">
                Merupakan kolom urutan <strong className="text-yellow-300">Ranking User</strong> dimulai dari yang tertinggi.
              </p>
            </div>

            {/* Name Column */}
            <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/rank2.jpg"
                  alt="Kolom Nama"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold rainbow-text mb-3">NAMA</h3>
              <p className="text-white/80 leading-relaxed">
                Kolom <strong className="text-blue-300">NAMA</strong> merupakan Nama Dari <strong className="text-purple-300">User</strong>.
              </p>
            </div>

            {/* Level Column */}
            <div className="glass-card-enhanced p-6 floating bounce-in" style={{ animationDelay: '0.4s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/rank3.jpg"
                  alt="Kolom Level"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold rainbow-text mb-3">LEVEL</h3>
              <p className="text-white/80 leading-relaxed">
                Kolom <strong className="text-green-300">LEVEL</strong> merupakan capaian level yang telah dituntaskan oleh para user.
              </p>
            </div>

            {/* Wrong Answers Column */}
            <div className="glass-card-enhanced p-6 floating bounce-in md:col-span-2 lg:col-span-1" style={{ animationDelay: '0.5s' }}>
              <div className="text-center mb-4">
                <Image
                  src="/guide/rank4.jpg"
                  alt="Kolom Salah"
                  width={200}
                  height={150}
                  className="rounded-lg shadow-lg mx-auto object-contain"
                />
              </div>
              <h3 className="text-xl font-bold rainbow-text mb-3">SALAH</h3>
              <p className="text-white/80 leading-relaxed">
                Kolom <strong className="text-red-300">SALAH</strong> merupakan jumlah dari salah tebak pada setiap level yang terbuka.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center slide-in-up">
          <div className="glass-card-enhanced p-8 floating">
            <h3 className="text-2xl font-bold rainbow-text mb-4">Siap Bermain?</h3>
            <p className="text-white/80 mb-6 text-lg">
              Sekarang Anda sudah memahami cara bermain Tebak Gambar. Mari mulai petualangan Anda!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/game">
                <Button variant="gradient" size="lg" className="btn-hover-lift pulse-glow">
                  <Users className="w-5 h-5 mr-2" />
                  Mulai Bermain
                </Button>
              </Link>
              <Link href="/rankings">
                <Button variant="outline" size="lg" className="btn-hover-lift">
                  <Trophy className="w-5 h-5 mr-2" />
                  Lihat Ranking
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}