'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  FileText, 
  Link as LinkIcon, 
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Eye,
  ExternalLink,
  Copy,
  MoreHorizontal,
  Filter
} from 'lucide-react';
import { formatCurrency, formatDate, formatRelativeTime } from '@/utils/helpers';

// Mock data - replace with actual data from API
const mockStats = {
  total_forms: 12,
  active_links: 8,
  expired_links: 4,
  total_submissions: 156,
  total_revenue: 40000,
};

const mockForms = [
  {
    id: '1',
    title: 'Form Pendaftaran Event',
    description: 'Form untuk pendaftaran acara workshop',
    created_at: '2024-01-15T10:00:00Z',
    status: 'active',
    submissions: 24,
    views: 89,
    link: 'https://formgen.ai/f/event-registration-2024',
    expires_at: '2024-01-22T10:00:00Z'
  },
  {
    id: '2',
    title: 'Survei Kepuasan Pelanggan',
    description: 'Survei untuk mengukur kepuasan pelanggan',
    created_at: '2024-01-14T15:30:00Z',
    status: 'draft',
    submissions: 0,
    views: 0,
    link: null,
    expires_at: null
  },
  {
    id: '3',
    title: 'Form Lamaran Kerja',
    description: 'Form untuk penerimaan karyawan baru',
    created_at: '2024-01-13T09:15:00Z',
    status: 'expired',
    submissions: 18,
    views: 45,
    link: 'https://formgen.ai/f/job-application-dev',
    expires_at: '2024-01-20T09:15:00Z'
  },
];

export default function DashboardPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'expired'>('all');

  const filteredForms = mockForms.filter(form => 
    filterStatus === 'all' || form.status === filterStatus
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif';
      case 'draft': return 'Draft';
      case 'expired': return 'Expired';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600">Kelola form dan pantau performa Anda</p>
            </div>
            <Button asChild>
              <Link href="/builder">
                <Plus className="w-4 h-4 mr-2" />
                Buat Form Baru
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Form</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.total_forms}</div>
              <p className="text-xs text-muted-foreground">
                +2 dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Link Aktif</CardTitle>
              <LinkIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{mockStats.active_links}</div>
              <p className="text-xs text-muted-foreground">
                {mockStats.expired_links} expired
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Submisi</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockStats.total_submissions}</div>
              <p className="text-xs text-muted-foreground">
                +12% dari minggu lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(mockStats.total_revenue)}
              </div>
              <p className="text-xs text-muted-foreground">
                +{formatCurrency(5000)} bulan ini
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">68%</div>
              <p className="text-xs text-muted-foreground">
                +5% dari minggu lalu
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2 text-blue-600" />
                Buat Form Baru
              </CardTitle>
              <CardDescription>
                Mulai membuat form dengan bantuan AI
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 text-green-600" />
                Template Form
              </CardTitle>
              <CardDescription>
                Gunakan template siap pakai
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-600" />
                Lihat Analytics
              </CardTitle>
              <CardDescription>
                Analisis performa form Anda
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Recent Forms */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Form Terbaru</CardTitle>
                <CardDescription>
                  Kelola dan pantau form Anda
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <div className="flex rounded-md border">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterStatus('all')}
                    className="rounded-r-none"
                  >
                    Semua
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterStatus('active')}
                    className="rounded-none"
                  >
                    Aktif
                  </Button>
                  <Button
                    variant={filterStatus === 'draft' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterStatus('draft')}
                    className="rounded-none"
                  >
                    Draft
                  </Button>
                  <Button
                    variant={filterStatus === 'expired' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setFilterStatus('expired')}
                    className="rounded-l-none"
                  >
                    Expired
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredForms.map((form) => (
                <div key={form.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{form.title}</h3>
                      <Badge className={getStatusColor(form.status)}>
                        {getStatusLabel(form.status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{form.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatRelativeTime(form.created_at)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {form.views} views
                      </span>
                      <span className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {form.submissions} submissions
                      </span>
                      {form.expires_at && (
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          Expires {formatDate(form.expires_at)}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {form.link && (
                      <>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4 mr-2" />
                          Copy Link
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Buka
                        </Button>
                      </>
                    )}
                    {form.status === 'draft' && (
                      <Button size="sm">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Aktifkan (Rp 5.000)
                      </Button>
                    )}
                    {form.status === 'expired' && (
                      <Button size="sm" variant="outline">
                        <LinkIcon className="w-4 h-4 mr-2" />
                        Perpanjang (Rp 5.000)
                      </Button>
                    )}
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 