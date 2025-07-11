'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Palette, Mail } from 'lucide-react';
import { useFormStore } from '@/stores/useFormStore';

/**
 * Komponen untuk mengatur pengaturan formulir
 * Termasuk pengaturan perilaku, tampilan, dan pengaturan submission
 */
export default function FormSettings() {
  const { formSettings, updateFormSettings } = useFormStore();
  const [activeTab, setActiveTab] = useState('behavior');

  // Handler untuk mengubah pengaturan formulir
  const handleSettingChange = (section: keyof FormSettings, key: string, value: unknown) => {
    updateFormSettings({
      ...formSettings,
      [section]: {
        ...formSettings[section],
        [key]: value
      }
    });
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-slate-200/60">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 flex items-center justify-center shadow-inner">
            <Settings className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-cal font-semibold text-slate-800">Pengaturan Formulir</h3>
            <p className="text-sm text-slate-500">Konfigurasi perilaku dan tampilan formulir</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6 bg-slate-100/50 p-1 rounded-lg">
            <TabsTrigger 
              value="behavior" 
              className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm rounded-md py-2 text-slate-600"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                <span>Perilaku</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="appearance" 
              className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm rounded-md py-2 text-slate-600"
            >
              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>Tampilan</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="submission" 
              className="data-[state=active]:bg-white data-[state=active]:text-slate-800 data-[state=active]:shadow-sm rounded-md py-2 text-slate-600"
            >
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>Submission</span>
              </div>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="behavior" className="mt-0">
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Autentikasi</h4>
                    <p className="text-sm text-slate-500">Batasi akses formulir hanya untuk pengguna terautentikasi</p>
                  </div>
                  <Switch 
                    checked={formSettings.behavior.requireAuth} 
                    onCheckedChange={(checked) => handleSettingChange('behavior', 'requireAuth', checked)}
                  />
                </div>
                {formSettings.behavior.requireAuth && (
                  <div className="pl-4 border-l-2 border-blue-200 mt-4">
                    <div className="mb-4">
                      <Label htmlFor="authProvider" className="text-sm font-medium text-slate-700 mb-1.5 block">Penyedia Autentikasi</Label>
                      <Select 
                        value={formSettings.behavior.authProvider} 
                        onValueChange={(value) => handleSettingChange('behavior', 'authProvider', value)}
                      >
                        <SelectTrigger className="w-full bg-white">
                          <SelectValue placeholder="Pilih penyedia" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="google">Google</SelectItem>
                          <SelectItem value="email">Email Magic Link</SelectItem>
                          <SelectItem value="password">Email & Password</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Multiple Submissions</h4>
                    <p className="text-sm text-slate-500">Izinkan pengguna mengirimkan formulir lebih dari sekali</p>
                  </div>
                  <Switch 
                    checked={formSettings.behavior.allowMultipleSubmissions} 
                    onCheckedChange={(checked) => handleSettingChange('behavior', 'allowMultipleSubmissions', checked)}
                  />
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Koleksi Email</h4>
                    <p className="text-sm text-slate-500">Kumpulkan alamat email responden</p>
                  </div>
                  <Switch 
                    checked={formSettings.behavior.collectEmail} 
                    onCheckedChange={(checked) => handleSettingChange('behavior', 'collectEmail', checked)}
                  />
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Validasi Wajib</h4>
                    <p className="text-sm text-slate-500">Semua field wajib diisi secara default</p>
                  </div>
                  <Switch 
                    checked={formSettings.behavior.requiredByDefault} 
                    onCheckedChange={(checked) => handleSettingChange('behavior', 'requiredByDefault', checked)}
                  />
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Simpan Respons</h4>
                    <p className="text-sm text-slate-500">Simpan respons formulir di database</p>
                  </div>
                  <Switch 
                    checked={formSettings.behavior.storeResponses} 
                    onCheckedChange={(checked) => handleSettingChange('behavior', 'storeResponses', checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="appearance" className="mt-0">
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <h4 className="font-medium text-slate-800 mb-4">Lebar Formulir</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.width === 'narrow' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'width', 'narrow')}
                  >
                    <div className="w-12 h-16 bg-slate-200 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Sempit</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.width === 'medium' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'width', 'medium')}
                  >
                    <div className="w-16 h-16 bg-slate-200 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Sedang</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.width === 'wide' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'width', 'wide')}
                  >
                    <div className="w-20 h-16 bg-slate-200 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Lebar</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <h4 className="font-medium text-slate-800 mb-4">Gaya Input</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.inputStyle === 'outline' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'inputStyle', 'outline')}
                  >
                    <div className="w-full h-8 border-2 border-slate-300 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Outline</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.inputStyle === 'filled' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'inputStyle', 'filled')}
                  >
                    <div className="w-full h-8 bg-slate-100 border border-slate-200 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Filled</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-3 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.inputStyle === 'underline' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'inputStyle', 'underline')}
                  >
                    <div className="w-full h-8 border-b-2 border-slate-300 mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Underline</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <h4 className="font-medium text-slate-800 mb-4">Tema Warna</h4>
                <div className="grid grid-cols-4 gap-3">
                  <div 
                    className={`border rounded-lg p-2 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.colorTheme === 'blue' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'colorTheme', 'blue')}
                  >
                    <div className="w-full h-6 bg-blue-500 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Biru</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-2 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.colorTheme === 'purple' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'colorTheme', 'purple')}
                  >
                    <div className="w-full h-6 bg-purple-500 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Ungu</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-2 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.colorTheme === 'green' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'colorTheme', 'green')}
                  >
                    <div className="w-full h-6 bg-green-500 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Hijau</span>
                  </div>
                  <div 
                    className={`border rounded-lg p-2 flex flex-col items-center cursor-pointer transition-all ${formSettings.appearance.colorTheme === 'amber' ? 'border-blue-500 bg-blue-50/50 shadow-sm' : 'border-slate-200 hover:border-slate-300'}`}
                    onClick={() => handleSettingChange('appearance', 'colorTheme', 'amber')}
                  >
                    <div className="w-full h-6 bg-amber-500 rounded mb-2"></div>
                    <span className="text-xs font-medium text-slate-700">Amber</span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="submission" className="mt-0">
            <div className="space-y-6">
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <h4 className="font-medium text-slate-800 mb-4">Pesan Sukses</h4>
                <Textarea 
                  value={formSettings.submission.successMessage} 
                  onChange={(e) => handleSettingChange('submission', 'successMessage', e.target.value)}
                  placeholder="Terima kasih! Formulir Anda telah berhasil dikirim."
                  className="w-full bg-white"
                />
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Redirect Setelah Submit</h4>
                    <p className="text-sm text-slate-500">Arahkan pengguna ke URL tertentu setelah mengirimkan formulir</p>
                  </div>
                  <Switch 
                    checked={formSettings.submission.enableRedirect} 
                    onCheckedChange={(checked) => handleSettingChange('submission', 'enableRedirect', checked)}
                  />
                </div>
                {formSettings.submission.enableRedirect && (
                  <div className="mt-4">
                    <Label htmlFor="redirectUrl" className="text-sm font-medium text-slate-700 mb-1.5 block">URL Redirect</Label>
                    <Input 
                      id="redirectUrl"
                      value={formSettings.submission.redirectUrl} 
                      onChange={(e) => handleSettingChange('submission', 'redirectUrl', e.target.value)}
                      placeholder="https://example.com/thank-you"
                      className="w-full bg-white"
                    />
                  </div>
                )}
              </div>
              
              <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800">Notifikasi Email</h4>
                    <p className="text-sm text-slate-500">Kirim notifikasi email saat formulir dikirimkan</p>
                  </div>
                  <Switch 
                    checked={formSettings.submission.enableEmailNotification} 
                    onCheckedChange={(checked) => handleSettingChange('submission', 'enableEmailNotification', checked)}
                  />
                </div>
                {formSettings.submission.enableEmailNotification && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <Label htmlFor="notificationEmail" className="text-sm font-medium text-slate-700 mb-1.5 block">Email Penerima</Label>
                      <Input 
                        id="notificationEmail"
                        value={formSettings.submission.notificationEmail} 
                        onChange={(e) => handleSettingChange('submission', 'notificationEmail', e.target.value)}
                        placeholder="your@email.com"
                        className="w-full bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emailSubject" className="text-sm font-medium text-slate-700 mb-1.5 block">Subjek Email</Label>
                      <Input 
                        id="emailSubject"
                        value={formSettings.submission.emailSubject} 
                        onChange={(e) => handleSettingChange('submission', 'emailSubject', e.target.value)}
                        placeholder="Pengiriman Formulir Baru"
                        className="w-full bg-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}