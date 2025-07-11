import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FormGen AI - Buat Form Kustom dengan AI',
  description: 'Platform SaaS untuk membuat form kustom dengan bantuan AI, terintegrasi dengan spreadsheet. Bayar hanya Rp 5.000 per link aktif 7 hari.',
  keywords: 'form builder, AI form, custom form, spreadsheet integration, Indonesia',
  authors: [{ name: 'Zantara Technology' }],
  creator: 'Zantara Technology',
  publisher: 'FormGen AI',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://formgen.ai'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Formy AI - Buat Form Kustom dengan AI',
    description: 'Platform SaaS untuk membuat form kustom dengan bantuan AI, terintegrasi dengan spreadsheet.',
    url: 'https://formy.com',
    siteName: 'Formy AI',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Formy AI - AI-Powered Form Builder',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Formy AI - Buat Form Kustom dengan AI',
    description: 'Platform SaaS untuk membuat form kustom dengan bantuan AI, terintegrasi dengan spreadsheet.',
    images: ['/og-image.png'],
    creator: '@formgenai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.className} scroll-smooth`}>
      <body className="antialiased min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
        <Navbar showUserMenu={false} />
        <div className="pt-16">
          {children}
        </div>
        <Toaster position="bottom-right" />
        
        {/* Cursor effect for better UX */}
        <div id="cursor-fx" className="hidden md:block">
          <script dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('DOMContentLoaded', function() {
                const cursor = document.createElement('div');
                cursor.classList.add('cursor-fx');
                document.body.appendChild(cursor);
                
                document.addEventListener('mousemove', function(e) {
                  cursor.style.cssText = 'transform: translate3d(' + e.clientX + 'px, ' + e.clientY + 'px, 0) scale(1);';
                });
                
                document.addEventListener('mousedown', function() {
                  cursor.classList.add('cursor-fx-active');
                });
                
                document.addEventListener('mouseup', function() {
                  cursor.classList.remove('cursor-fx-active');
                });
                
                // Detect hoverable elements
                document.querySelectorAll('a, button, input, select, textarea, [role="button"]').forEach(el => {
                  el.addEventListener('mouseenter', function() {
                    cursor.classList.add('cursor-fx-hover');
                  });
                  
                  el.addEventListener('mouseleave', function() {
                    cursor.classList.remove('cursor-fx-hover');
                  });
                });
                
                // Hide cursor when leaving window
                document.addEventListener('mouseleave', function() {
                  cursor.style.opacity = '0';
                });
                
                document.addEventListener('mouseenter', function() {
                  cursor.style.opacity = '1';
                });
                
                // Use rAF for smooth animation
                let requestId;
                function loop() {
                  const targetX = window.mouseX || 0;
                  const targetY = window.mouseY || 0;
                  requestId = requestAnimationFrame(loop);
                }
                requestId = requestAnimationFrame(loop);
                
                // Cleanup function
                return function() {
                  cancelAnimationFrame(requestId);
                  document.body.removeChild(cursor);
                }
              });
            `
          }} />
        </div>
      </body>
    </html>
  );
}
