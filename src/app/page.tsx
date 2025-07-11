'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HomePage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState('');

  const handleAIGenerate = async (predefinedPrompt?: string) => {
    const promptToUse = predefinedPrompt || prompt;
    if (!promptToUse) return;

    try {
      // Redirect ke halaman builder dengan prompt sebagai parameter
      router.push(`/builder?prompt=${encodeURIComponent(promptToUse)}`);
    } catch (error) {
      console.error('Error generating form:', error);
    }
  };

  return (
    <main className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
            Buat Form Kustom dengan AI - Gratis! 📝
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-700">
            Bayar hanya Rp 5.000 ketika siap share 🚀
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-[#5A4EFF] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all">
              Mulai Buat Form Gratis
            </button>
            <button className="px-6 py-3 bg-[#E2F4A6] text-gray-900 rounded-lg font-medium hover:bg-opacity-90 transition-all">
              Lihat Demo
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Features Demo Section */}
      <section className="w-full py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Coba Fitur Utama
          </h2>

          <Tabs defaultValue="ai" className="w-full mb-16">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger 
                value="ai"
                className="text-gray-700 data-[state=active]:bg-[#5A4EFF] data-[state=active]:text-white"
              >
                🤖 Generate dengan AI
              </TabsTrigger>
              <TabsTrigger 
                value="manual"
                className="text-gray-700 data-[state=active]:bg-[#EEA0FF] data-[state=active]:text-white"
              >
                🎨 Form Builder Manual
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="ai" className="mt-0">
              <div className="rounded-3xl bg-white p-8 shadow-lg border border-[#5A4EFF]/10">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Chat dengan AI untuk Generate Form
                </h3>
                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                  <p className="text-gray-700 mb-4">Contoh prompt yang bisa Anda gunakan:</p>
                  <div className="space-y-3">
                    <div 
                      onClick={() => handleAIGenerate("Buat form pendaftaran event dengan upload foto")}
                      className="bg-white p-4 rounded-lg border border-[#5A4EFF]/20 hover:border-[#5A4EFF]/40 transition-colors cursor-pointer text-gray-800"
                    >
                      &ldquo;Buat form pendaftaran event dengan upload foto&rdquo;
                    </div>
                    <div 
                      onClick={() => handleAIGenerate("Form survei kepuasan pelanggan dengan rating dan feedback")}
                      className="bg-white p-4 rounded-lg border border-[#5A4EFF]/20 hover:border-[#5A4EFF]/40 transition-colors cursor-pointer text-gray-800"
                    >
                      &ldquo;Form survei kepuasan pelanggan dengan rating dan feedback&rdquo;
                    </div>
                    <div 
                      onClick={() => handleAIGenerate("Form lamaran kerja dengan CV upload dan data pribadi")}
                      className="bg-white p-4 rounded-lg border border-[#5A4EFF]/20 hover:border-[#5A4EFF]/40 transition-colors cursor-pointer text-gray-800"
                    >
                      &ldquo;Form lamaran kerja dengan CV upload dan data pribadi&rdquo;
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-4 mb-6">
                  <input
                    type="text"
                    placeholder="Ketik prompt Anda di sini..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#5A4EFF]"
                  />
                  <button
                    onClick={() => handleAIGenerate()}
                    className="w-full px-6 py-3 bg-[#5A4EFF] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                  >
                    Generate Form dengan AI
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/builder" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Lihat Dokumentasi
                  </Link>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="manual" className="mt-0">
              <div className="rounded-3xl bg-white p-8 shadow-lg border border-[#EEA0FF]/10">
                <h3 className="text-2xl font-bold mb-6 text-gray-900">
                  Drag & Drop Form Builder
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 mb-4">Komponen Form:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>📝</span> Text Input
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>📋</span> Text Area
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>📅</span> Date Picker
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>📎</span> File Upload
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 mb-4">Validasi & Logika:</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>✅</span> Required
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>🔄</span> Conditional
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>📏</span> Min/Max
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-[#EEA0FF]/20 hover:border-[#EEA0FF]/40 transition-colors cursor-move flex items-center gap-2 text-gray-800">
                        <span>🔍</span> Pattern
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/builder" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-[#EEA0FF] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all"
                  >
                    Buka Form Builder
                  </Link>
                  <Link 
                    href="/templates" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-all"
                  >
                    Lihat Template
                  </Link>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Additional Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Theme Generator */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                🎨 Theme Generator
              </h3>
              <div className="space-y-3 mb-6">
                <div className="h-8 bg-[#5A4EFF] rounded-lg"></div>
                <div className="h-8 bg-[#EEA0FF] rounded-lg"></div>
                <div className="h-8 bg-[#E2F4A6] rounded-lg"></div>
              </div>
              <p className="text-gray-700 mb-4">Generate tema otomatis sesuai industri dan brand Anda</p>
              <Link href="/builder" className="text-gray-900 font-medium hover:text-[#5A4EFF] transition-colors">
                Coba Theme Generator →
              </Link>
            </div>

            {/* Spreadsheet Integration */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                📊 Spreadsheet Sync
              </h3>
              <div className="space-y-3 mb-6">
                <div className="h-8 bg-green-500 rounded-lg"></div>
                <div className="h-8 bg-blue-500 rounded-lg"></div>
                <div className="h-8 bg-yellow-500 rounded-lg"></div>
              </div>
              <p className="text-gray-700 mb-4">Integrasi langsung dengan Google Sheets untuk menyimpan data</p>
              <Link href="/builder" className="text-gray-900 font-medium hover:text-[#5A4EFF] transition-colors">
                Coba Spreadsheet Sync →
              </Link>
            </div>

            {/* Pay-per-Share */}
            <div className="rounded-3xl bg-white p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-gray-900">
                💰 Pay-per-Share
              </h3>
              <div className="space-y-3 mb-6">
                <div className="h-8 bg-[#5A4EFF] rounded-lg"></div>
                <div className="h-8 bg-[#EEA0FF] rounded-lg"></div>
                <div className="h-8 bg-[#E2F4A6] rounded-lg"></div>
              </div>
              <p className="text-gray-700 mb-4">Bayar hanya Rp 5.000 per link aktif selama 7 hari</p>
              <Link href="/builder" className="text-gray-900 font-medium hover:text-[#5A4EFF] transition-colors">
                Coba Pay-per-Share →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Fitur Utama
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* AI Form Builder Card */}
            <div className="rounded-3xl bg-[#5A4EFF] p-8 text-white hover:transform hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-6">🤖</div>
              <h3 className="font-bold text-xl mb-3">AI Form Builder</h3>
              <p className="text-white/90">Buat form dengan bahasa natural melalui chat interface AI</p>
            </div>
            
            {/* Theme Generator Card */}
            <div className="rounded-3xl bg-[#E2F4A6] p-8 text-gray-900 hover:transform hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-6">🎨</div>
              <h3 className="font-bold text-xl mb-3">Theme Generator</h3>
              <p className="text-gray-800">Generate tema otomatis sesuai industri dan brand Anda</p>
            </div>

            {/* Spreadsheet Sync Card */}
            <div className="rounded-3xl bg-[#EEA0FF] p-8 text-white hover:transform hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-6">📊</div>
              <h3 className="font-bold text-xl mb-3">Spreadsheet Sync</h3>
              <p className="text-white/90">Integrasi langsung dengan Google Sheets</p>
            </div>

            {/* Pay-per-Share Card */}
            <div className="rounded-3xl bg-[#F5F5F5] p-8 text-gray-900 hover:transform hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-6">💰</div>
              <h3 className="font-bold text-xl mb-3">Pay-per-Share</h3>
              <p className="text-gray-800">Rp 5.000 per link aktif selama 7 hari</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Cara Kerja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-3xl bg-[#5A4EFF] p-8 text-white hover:transform hover:-translate-y-1 transition-all">
              <div className="inline-block px-3 py-1 rounded-lg bg-white/20 text-sm mb-6">1</div>
              <h3 className="font-bold text-xl mb-3">Buat Form</h3>
              <p className="text-white/90">Gunakan AI chat untuk mendeskripsikan form yang Anda inginkan</p>
            </div>

            {/* Step 2 */}
            <div className="rounded-3xl bg-[#E2F4A6] p-8 text-gray-900 hover:transform hover:-translate-y-1 transition-all">
              <div className="inline-block px-3 py-1 rounded-lg bg-black/10 text-sm mb-6">2</div>
              <h3 className="font-bold text-xl mb-3">Kustomisasi</h3>
              <p className="text-gray-800">Edit tema dan field sesuai kebutuhan dengan drag & drop</p>
            </div>

            {/* Step 3 */}
            <div className="rounded-3xl bg-[#EEA0FF] p-8 text-white hover:transform hover:-translate-y-1 transition-all">
              <div className="inline-block px-3 py-1 rounded-lg bg-white/20 text-sm mb-6">3</div>
              <h3 className="font-bold text-xl mb-3">Share</h3>
              <p className="text-white/90">Bayar Rp 5.000 untuk mendapatkan link aktif 7 hari</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16 text-gray-900">
            Testimoni Pengguna
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="rounded-3xl bg-[#5A4EFF] p-8 text-white">
              <div className="flex items-center gap-1 mb-4">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-400">{star}</span>
                ))}
              </div>
              <p className="italic mb-6 text-white/90">&ldquo;Form AI membantu saya bisa membuat form survey dengan cepat dan hasilnya langsung tersimpan di Google Sheets loh saya.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div>
                  <p className="font-medium">Andi Pratama</p>
                  <p className="text-sm text-white/80">Marketing Manager</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-3xl bg-[#EEA0FF] p-8 text-white">
              <div className="flex items-center gap-1 mb-4">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-400">{star}</span>
                ))}
              </div>
              <p className="italic mb-6 text-white/90">&ldquo;Fitur pay-per-link sangat cocok untuk bisnis kami yang hanya butuh form untuk event tertentu.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div>
                  <p className="font-medium">Siti Nurhailza</p>
                  <p className="text-sm text-white/80">Event Organizer</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-3xl bg-[#5A4EFF] p-8 text-white">
              <div className="flex items-center gap-1 mb-4">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-yellow-400">{star}</span>
                ))}
              </div>
              <p className="italic mb-6 text-white/90">&ldquo;UI-nya sangat mudah dipahami, dan bantuan AI membantu kami membuat form rekrutmen yang profesional.&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20"></div>
                <div>
                  <p className="font-medium">Budi Santoso</p>
                  <p className="text-sm text-white/80">HR Specialist</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">
            Siap untuk membuat form kustom Anda?
          </h2>
          <p className="text-xl mb-12 text-gray-700">
            Mulai gunakan Formy sekarang dan rasakan kemudahan membuat form dengan bantuan AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-[#5A4EFF] text-white rounded-lg font-medium hover:bg-opacity-90 transition-all">
              Mulai Gratis
            </button>
            <button className="px-6 py-3 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-all">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <h3 className="font-bold text-lg mb-4 text-gray-900">Formy AI</h3>
              <p className="text-gray-700 text-sm">
                Platform SaaS untuk membuat form kustom dengan bantuan AI, terintegrasi dengan spreadsheet.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Produk</h4>
              <ul className="space-y-2">
                <li><Link href="/builder" className="text-gray-700 hover:text-gray-900">Form Builder</Link></li>
                <li><Link href="/ai" className="text-gray-700 hover:text-gray-900">AI Assistant</Link></li>
                <li><Link href="/integration" className="text-gray-700 hover:text-gray-900">Spreadsheet Integration</Link></li>
                <li><Link href="/api" className="text-gray-700 hover:text-gray-900">API</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Perusahaan</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-700 hover:text-gray-900">Tentang Kami</Link></li>
                <li><Link href="/blog" className="text-gray-700 hover:text-gray-900">Blog</Link></li>
                <li><Link href="/careers" className="text-gray-700 hover:text-gray-900">Karir</Link></li>
                <li><Link href="/contact" className="text-gray-700 hover:text-gray-900">Hubungi Kami</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-gray-900">Bantuan</h4>
              <ul className="space-y-2">
                <li><Link href="/docs" className="text-gray-700 hover:text-gray-900">Dokumentasi</Link></li>
                <li><Link href="/tutorial" className="text-gray-700 hover:text-gray-900">Tutorial</Link></li>
                <li><Link href="/faq" className="text-gray-700 hover:text-gray-900">FAQ</Link></li>
                <li><Link href="/status" className="text-gray-700 hover:text-gray-900">Status</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-700">© 2024 Formy AI. All rights reserved.</p>
              <div className="flex gap-6 text-sm text-gray-700">
                <Link href="/privacy" className="hover:text-gray-900">Kebijakan Privasi</Link>
                <Link href="/terms" className="hover:text-gray-900">Syarat & Ketentuan</Link>
                <Link href="/cookies" className="hover:text-gray-900">Kebijakan Cookie</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
