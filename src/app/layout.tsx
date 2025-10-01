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
      <body className={`${poppins.variable} ${inter.variable} ${jakarta.variable} font-sans min-h-screen transition-all duration-500 relative overflow-x-hidden`}>
        <div className="particles-bg"></div>
        <ThemeProvider>
          <SoundProvider>
            <AuthProvider>
              <ErrorBoundary>
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: 'rgba(0, 0, 0, 0.8)',
                      color: '#fff',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '12px',
                    },
                    className: 'notification-slide-in',
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
