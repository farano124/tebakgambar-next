import type { Metadata } from "next";
import { Poppins, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme";
import { SoundProvider } from "@/lib/sound";
import { ErrorBoundary } from "@/components/ErrorBoundary";

// Primary font - Poppins for excellent Indonesian readability
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Secondary font - Inter for UI elements and body text
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

// Display font - Jakarta Sans for headings and special text
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tebak Gambar - Game Tebak Gambar Interaktif",
  description: "Permainan tebak gambar yang menyenangkan untuk menguji pengetahuan Anda",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${poppins.variable} ${inter.variable} ${jakarta.variable} font-sans bg-gradient-to-br from-blue-500 to-purple-600 dark:from-gray-900 dark:to-gray-800 min-h-screen transition-colors`}>
        <ThemeProvider>
          <SoundProvider>
            <AuthProvider>
              <ErrorBoundary>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
                {children}
              </ErrorBoundary>
            </AuthProvider>
          </SoundProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
