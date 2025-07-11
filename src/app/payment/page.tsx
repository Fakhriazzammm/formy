'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, CreditCard, Wallet, QrCode, AlertCircle, ChevronRight, Lock, Shield } from 'lucide-react';
import { formatCurrency } from '@/utils/helpers';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/badge';

// Mencegah pre-rendering
export const dynamic = 'force-dynamic';
export const dynamicParams = true;

function PaymentPageContent() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'qris' | 'va' | 'ewallet'>('qris');
  const [amount] = useState(5000);
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  // Animation for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (!customer.name.trim()) {
      toast.error('Nama harus diisi');
      return false;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      toast.error('Email tidak valid');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handlePay = async () => {
    if (!validateStep1()) return;
    
    setLoading(true);
    try {
      const res = await fetch('/api/payment/mayar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          method: paymentMethod,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone || undefined
          }
        })
      });
      
      const data = await res.json();
      
      if (res.ok && data.payment_url) {
        toast.success('Redirecting to payment gateway');
        router.push(data.payment_url);
      } else {
        toast.error(data.error || 'Failed to initiate payment');
        setLoading(false);
      }
    } catch {
      toast.error('Failed to process request');
      setLoading(false);
    }
  };

  // Add transaction history mock data and tab
  const mockTransactions = [
    { id: 'TX001', date: '2024-01-15', amount: 5000, status: 'success', method: 'QRIS' },
    { id: 'TX002', date: '2024-01-10', amount: 10000, status: 'pending', method: 'VA' },
    { id: 'TX003', date: '2024-01-05', amount: 2000, status: 'failed', method: 'E-Wallet' },
  ];

  return (
    <div className={`max-w-3xl mx-auto transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-cal text-foreground">Payment</h1>
        <p className="text-muted-foreground font-inter">Aktifkan link form Anda dengan cepat dan mudah</p>
      </div>

      <Tabs defaultValue="pay">
        <TabsList className="bg-muted mb-4">
          <TabsTrigger value="pay" className="data-[state=active]:bg-background font-inter">Make Payment</TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-background font-inter">Transaction History</TabsTrigger>
        </TabsList>

        <TabsContent value="pay">
          <div className="relative mb-8">
            <div className="flex justify-between items-center relative z-10">
              {[1, 2].map((s) => (
                <div
                  key={s}
                  className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                    s <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                  } ${s < step ? 'transition-all duration-500' : ''}`}
                >
                  {s < step ? (
                    <Check size={18} />
                  ) : (
                    <span>{s}</span>
                  )}
                  <div className="absolute -bottom-6 w-max text-center left-1/2 transform -translate-x-1/2 text-sm whitespace-nowrap">
                    <span className={`${s <= step ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                      {s === 1 ? 'Customer Info' : 'Payment'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute top-5 left-[25%] right-[25%] h-0.5 bg-gray-200 -z-0">
              <div
                className="h-full bg-blue-600 transition-all duration-700"
                style={{ width: step === 1 ? '0%' : '100%' }}
              ></div>
            </div>
          </div>

          <Card className="shadow-md border-0">
            {step === 1 && (
              <div className="animate-fadeIn">
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>Masukkan informasi untuk pembayaran Anda</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      placeholder="Masukkan nama lengkap" 
                      value={customer.name} 
                      onChange={handleInputChange} 
                      autoComplete="name"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      placeholder="Masukkan email" 
                      value={customer.email} 
                      onChange={handleInputChange}
                      autoComplete="email"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      type="tel" 
                      placeholder="Contoh: 08123456789" 
                      value={customer.phone} 
                      onChange={handleInputChange}
                      autoComplete="tel"
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-6">
                  <div>
                    <p className="text-sm text-gray-500">
                      <Lock size={14} className="inline mr-1" />
                      Data Anda aman dan terenkripsi
                    </p>
                  </div>
                  <Button 
                    onClick={handleNext}
                    className="group flex items-center gap-1 bg-blue-600 hover:bg-blue-700"
                  >
                    Lanjutkan
                    <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fadeIn">
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                  <CardDescription>Pilih metode pembayaran yang Anda inginkan</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium">Form Link Activation</h3>
                        <p className="text-sm text-gray-600">Aktif selama 7 hari</p>
                      </div>
                      <div className="text-right">
                        <span className="text-blue-600 font-bold">{formatCurrency(amount)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-3 block">Pilih Metode Pembayaran</Label>
                    <Tabs defaultValue="qris" onValueChange={(v) => setPaymentMethod(v as 'qris' | 'va' | 'ewallet')}>
                      <TabsList className="grid grid-cols-3 mb-4">
                        <TabsTrigger value="qris" className="flex items-center gap-2">
                          <QrCode size={16} /> QRIS
                        </TabsTrigger>
                        <TabsTrigger value="va" className="flex items-center gap-2">
                          <CreditCard size={16} /> Virtual Account
                        </TabsTrigger>
                        <TabsTrigger value="ewallet" className="flex items-center gap-2">
                          <Wallet size={16} /> E-Wallet
                        </TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="qris">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-3 mb-2">
                            <Image src="https://via.placeholder.com/40" alt="QRIS" className="w-10 h-10 object-contain" width={40} height={40} />
                            <div>
                              <h4 className="font-medium">QRIS</h4>
                              <p className="text-sm text-gray-500">Scan untuk pembayaran instan</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-2">
                            Mendukung semua aplikasi dengan logo QRIS: GoPay, OVO, Dana, LinkAja, dll.
                          </p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="va">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                          <div className="flex items-center gap-3">
                            <Image src="https://via.placeholder.com/40" alt="BCA" className="w-10 h-10 object-contain" width={40} height={40} />
                            <div>
                              <h4 className="font-medium">BCA Virtual Account</h4>
                              <p className="text-sm text-gray-500">Transfer ke nomor VA yang akan diberikan</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Image src="https://via.placeholder.com/40" alt="Mandiri" className="w-10 h-10 object-contain" width={40} height={40} />
                            <div>
                              <h4 className="font-medium">Mandiri Virtual Account</h4>
                              <p className="text-sm text-gray-500">Transfer ke nomor VA yang akan diberikan</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Image src="https://via.placeholder.com/40" alt="BNI" className="w-10 h-10 object-contain" width={40} height={40} />
                            <div>
                              <h4 className="font-medium">BNI Virtual Account</h4>
                              <p className="text-sm text-gray-500">Transfer ke nomor VA yang akan diberikan</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="ewallet">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                          <div className="flex items-center gap-3">
                            <Image src="https://via.placeholder.com/40" alt="GoPay" className="w-10 h-10 object-contain" width={40} height={40} />
                            <div>
                              <h4 className="font-medium">GoPay</h4>
                              <p className="text-sm text-gray-500">Pembayaran melalui aplikasi Gojek</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Image src="https://via.placeholder.com/40" alt="OVO" className="w-10 h-10 object-contain" width={40} height={40} />
                            <div>
                              <h4 className="font-medium">OVO</h4>
                              <p className="text-sm text-gray-500">Pembayaran melalui aplikasi OVO</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <Image src="https://via.placeholder.com/40" alt="DANA" className="w-10 h-10 object-contain" width={40} height={40} />
                            <div>
                              <h4 className="font-medium">DANA</h4>
                              <p className="text-sm text-gray-500">Pembayaran melalui aplikasi DANA</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex items-start gap-2">
                      <AlertCircle size={18} className="text-blue-600 mt-1 flex-shrink-0" />
                      <div className="text-sm text-gray-600">
                        <p className="mb-1">Link form Anda akan aktif segera setelah pembayaran berhasil diverifikasi.</p>
                        <p>Cek email <span className="font-medium">{customer.email}</span> untuk instruksi selanjutnya.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-4 sm:justify-between border-t pt-6">
                  <Button 
                    variant="outline" 
                    onClick={handleBack}
                    className="order-2 sm:order-1 w-full sm:w-auto"
                  >
                    Kembali
                  </Button>
                  
                  <Button 
                    onClick={handlePay} 
                    disabled={loading}
                    className="order-1 sm:order-2 w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <Lock size={16} />
                        <span>Bayar {formatCurrency(amount)}</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="font-cal text-foreground">Transaction History</CardTitle>
              <CardDescription className="font-inter text-muted-foreground">Your recent payments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTransactions.map(tx => (
                  <div key={tx.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium font-inter">{tx.id}</p>
                      <p className="text-sm text-muted-foreground font-inter">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium font-jetbrains">{formatCurrency(tx.amount)}</p>
                      <Badge variant={tx.status === 'success' ? 'default' : 'destructive'} className="font-inter">
                        {tx.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Security indicators */}
      <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-6 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <Shield size={16} />
          <span>Pembayaran Aman</span>
        </div>
        <div className="flex items-center gap-2">
          <Lock size={16} />
          <span>Terenkripsi SSL</span>
        </div>
        <div className="flex items-center gap-2">
          <Image src="https://via.placeholder.com/16" alt="Midtrans" className="w-4 h-4" width={16} height={16} />
          <span>Powered by Mayar</span>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <PaymentPageContent />
    </div>
  );
} 