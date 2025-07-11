'use client';

import React, { useState, useEffect } from "react";

import ExpiryCountdown from "@/components/links/ExpiryCountdown";
import { LinkItem } from "@/components/links/LinkList";

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function LinksPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [selectedAnalytics, setSelectedAnalytics] = useState({ views: 0, submissions: 0 });
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    fetch("/api/links")
      .then((res) => res.json())
      .then((data) => {
        setLinks(data);
        if (data.length > 0) setSelectedLinkId(data[0].id);
      });
  }, []);

  useEffect(() => {
    if (selectedLinkId) {
      fetch(`/api/links/${selectedLinkId}/analytics`)
        .then((res) => res.json())
        .then((data) => setSelectedAnalytics(data));
    }
  }, [selectedLinkId]);

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Link disalin!");
  };

  const handleExtend = async (id: string) => {
    if (!confirm('Perpanjang link ini 7 hari?')) return;
    setIsExtending(true);
    try {
      const res = await fetch(`/api/links/${id}/extend`, { method: 'POST' });
      if (!res.ok) throw new Error('Gagal extend');
      const updatedLink = await res.json();
      setLinks(links.map(link => link.id === id ? updatedLink : link));
      alert('Link diperpanjang!');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan tidak diketahui';
      alert('Error: ' + errorMessage);
    } finally {
      setIsExtending(false);
    }
  };

  const handleDelete = (id: string) => {
    // Placeholder: Hapus link di backend
    setLinks(links.filter((link) => link.id !== id));
    if (selectedLinkId === id) setSelectedLinkId(null);
    alert(`Link ${id} dihapus!`);
  };

  return (
    <main className="container mx-auto py-8 px-4 font-inter">
      <h1 className="text-2xl font-bold mb-2 font-cal text-foreground">Manajemen Link</h1>
      <p className="mb-6 text-muted-foreground max-w-xl">
        Kelola link aktif, pantau analytics, dan lakukan aksi seperti copy, perpanjang, atau hapus link. Semua link yang Anda buat untuk form akan muncul di sini.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Panel Daftar Link */}
        <Card className="md:col-span-2 shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-cal">Daftar Link Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            {links.map(link => (
              <Card key={link.id} className="mb-4 p-4 cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLinkId(link.id)}>
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium font-inter">Link {link.id}</h3>
                    <p className="text-sm text-muted-foreground font-jetbrains">{link.url}</p>
                  </div>
                  <Badge variant={link.status === 'active' ? 'default' : 'destructive'} className="font-inter">
                    {link.status.toUpperCase()}
                  </Badge>
                </div>
                {link.status === 'active' && <ExpiryCountdown expiresAt={link.expiresAt} />}
              </Card>
            ))}
          </CardContent>
        </Card>
        
        {/* Panel Analytics & Aksi */}
        <Card className="shadow-sm border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-cal">Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Views</p>
                <Progress value={(selectedAnalytics.views / 1000) * 100} className="h-2" />
                <p className="text-right text-sm font-jetbrains">{selectedAnalytics.views}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Submissions</p>
                <Progress value={(selectedAnalytics.submissions / 100) * 100} className="h-2" />
                <p className="text-right text-sm font-jetbrains">{selectedAnalytics.submissions}</p>
              </div>
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle className="text-lg font-cal">Aksi</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedLinkId && (
              <div className="space-y-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button onClick={() => handleCopy(links.find(l => l.id === selectedLinkId)?.url || '')} className="w-full font-inter">
                        Copy Link
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Copy to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button onClick={() => handleExtend(selectedLinkId)} disabled={isExtending} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-inter">
                  {isExtending ? 'Extending...' : 'Renew (Rp 5,000)'}
                </Button>
                <Button onClick={() => handleDelete(selectedLinkId)} variant="destructive" className="w-full font-inter">
                  Delete
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 