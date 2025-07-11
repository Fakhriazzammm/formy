'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  FileText, 
  Link as LinkIcon, 
  TrendingUp,
  Users,
  BarChart3,
  Eye,
  ExternalLink,
  Copy,
  Search,
  ArrowUp,
  ArrowDown,
  Settings,
  MoreVertical,
  Activity,
  RefreshCw,
  Download
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/utils/helpers';

// Mock data - replace with actual data from API
const mockStats = {
  total_forms: 12,
  active_links: 8,
  expired_links: 4,
  total_submissions: 156,
  total_revenue: 40000,
  conversion_rate: 68,
  change: {
    forms: '+2',
    links: '+3',
    submissions: '+12%',
    revenue: '+5000',
    conversion: '+5%'
  }
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
  {
    id: '4',
    title: 'Pendaftaran Webinar',
    description: 'Form pendaftaran webinar digital marketing',
    created_at: '2024-01-12T14:20:00Z',
    status: 'active',
    submissions: 42,
    views: 130,
    link: 'https://formgen.ai/f/webinar-digital-marketing',
    expires_at: '2024-01-19T14:20:00Z'
  },
  {
    id: '5',
    title: 'Form Feedback Product',
    description: 'Form untuk mengumpulkan feedback produk baru',
    created_at: '2024-01-10T08:45:00Z',
    status: 'active',
    submissions: 36,
    views: 78,
    link: 'https://formgen.ai/f/product-feedback',
    expires_at: '2024-01-17T08:45:00Z'
  },
];

// Recent activity mock data
const recentActivities = [
  { type: 'submission', form_id: '1', form_name: 'Form Pendaftaran Event', timestamp: '2024-01-16T14:30:00Z' },
  { type: 'view', form_id: '4', form_name: 'Pendaftaran Webinar', timestamp: '2024-01-16T13:45:00Z' },
  { type: 'payment', form_id: '5', form_name: 'Form Feedback Product', amount: 5000, timestamp: '2024-01-16T11:20:00Z' },
  { type: 'submission', form_id: '4', form_name: 'Pendaftaran Webinar', timestamp: '2024-01-16T10:15:00Z' },
  { type: 'view', form_id: '1', form_name: 'Form Pendaftaran Event', timestamp: '2024-01-16T09:30:00Z' },
];

export default function DashboardPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'draft' | 'expired'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState('forms');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort forms
  const filteredForms = mockForms
    .filter(form => 
      (filterStatus === 'all' || form.status === filterStatus) &&
      (searchTerm === '' || 
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortField === 'created_at') {
        return sortDirection === 'desc'
          ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'submissions') {
        return sortDirection === 'desc'
          ? b.submissions - a.submissions
          : a.submissions - b.submissions;
      } else if (sortField === 'views') {
        return sortDirection === 'desc'
          ? b.views - a.views
          : a.views - b.views;
      }
      return 0;
    });

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

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission':
        return <FileText size={16} className="text-blue-500" />;
      case 'view':
        return <Eye size={16} className="text-green-500" />;
      case 'payment':
        return <TrendingUp size={16} className="text-purple-500" />;
      default:
        return <Activity size={16} />;
    }
  };

  return (
    <div className={`min-h-screen bg-background transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      {/* Header */}
      <div className="bg-background border-b sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground font-cal">Dashboard</h1>
              <p className="text-muted-foreground font-inter">Kelola form dan pantau performa Anda</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button asChild>
                <Link href="/builder" className="flex items-center gap-2">
                  <Plus size={16} />
                  <span className="hidden sm:inline">Buat Form</span>
                </Link>
              </Button>
            </div>
          </div>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
            <TabsList className="bg-muted">
              <TabsTrigger value="forms" className="data-[state=active]:bg-background font-inter">
                Forms
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-background font-inter">
                Analytics
              </TabsTrigger>
              <TabsTrigger value="activity" className="data-[state=active]:bg-background font-inter">
                Activity
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-background font-inter">
                Payments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forms" className="mt-0 animate-fadeIn">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                <Card className="overflow-hidden hover:shadow-md transition-all border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Total Form</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <FileText size={16} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockStats.total_forms}</div>
                    <p className="text-xs flex items-center text-green-600 mt-1">
                      <ArrowUp size={12} className="mr-1" />
                      {mockStats.change.forms} dari bulan lalu
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-md transition-all border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Link Aktif</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <LinkIcon size={16} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{mockStats.active_links}</div>
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-xs flex items-center text-green-600">
                        <ArrowUp size={12} className="mr-1" />
                        {mockStats.change.links}
                      </p>
                      <span className="text-xs text-gray-500">
                        {mockStats.expired_links} expired
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-md transition-all border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Total Submisi</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <Users size={16} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockStats.total_submissions}</div>
                    <p className="text-xs flex items-center text-green-600 mt-1">
                      <ArrowUp size={12} className="mr-1" />
                      {mockStats.change.submissions} dari minggu lalu
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-md transition-all border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Revenue</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <TrendingUp size={16} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(mockStats.total_revenue)}
                    </div>
                    <p className="text-xs flex items-center text-green-600 mt-1">
                      <ArrowUp size={12} className="mr-1" />
                      {formatCurrency(parseInt(mockStats.change.revenue))} bulan ini
                    </p>
                  </CardContent>
                </Card>

                <Card className="overflow-hidden hover:shadow-md transition-all border-border">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-foreground">Conversion Rate</CardTitle>
                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                      <BarChart3 size={16} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{mockStats.conversion_rate}%</div>
                    <p className="text-xs flex items-center text-green-600 mt-1">
                      <ArrowUp size={12} className="mr-1" />
                      {mockStats.change.conversion} dari minggu lalu
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/builder">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group border-blue-100 hover:border-blue-300">
                    <CardHeader>
                      <CardTitle className="flex items-center group-hover:text-blue-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3 group-hover:scale-110 transition-transform">
                          <Plus size={20} />
                        </div>
                        Buat Form Baru
                      </CardTitle>
                      <CardDescription>
                        Mulai membuat form dengan bantuan AI
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/templates">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group border-green-100 hover:border-green-300">
                    <CardHeader>
                      <CardTitle className="flex items-center group-hover:text-green-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 group-hover:scale-110 transition-transform">
                          <FileText size={20} />
                        </div>
                        Template Form
                      </CardTitle>
                      <CardDescription>
                        Gunakan template siap pakai
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                <Link href="/analytics">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group border-purple-100 hover:border-purple-300">
                    <CardHeader>
                      <CardTitle className="flex items-center group-hover:text-purple-600 transition-colors">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-3 group-hover:scale-110 transition-transform">
                          <BarChart3 size={20} />
                        </div>
                        Lihat Analytics
                      </CardTitle>
                      <CardDescription>
                        Analisis performa form Anda
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>
              </div>

              {/* Form List */}
              <Card className="border border-border shadow-sm">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl font-cal text-foreground">Daftar Form</CardTitle>
                    <CardDescription className="text-muted-foreground font-inter">Kelola dan pantau form Anda</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Cari form..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 border border-border rounded-md w-full md:w-64 bg-background text-foreground font-inter"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={e => setFilterStatus(e.target.value as typeof filterStatus)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-foreground font-inter"
                    >
                      <option value="all">Semua Status</option>
                      <option value="active">Aktif</option>
                      <option value="draft">Draft</option>
                      <option value="expired">Expired</option>
                    </select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left font-medium text-gray-500 py-3 px-4">Form</th>
                          <th 
                            className="text-left font-medium text-gray-500 py-3 px-4 cursor-pointer"
                            onClick={() => handleSort('created_at')}
                          >
                            <div className="flex items-center">
                              <span>Tanggal Dibuat</span>
                              {sortField === 'created_at' && (
                                sortDirection === 'asc' 
                                  ? <ArrowUp size={14} className="ml-1" /> 
                                  : <ArrowDown size={14} className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-center font-medium text-gray-500 py-3 px-4 cursor-pointer"
                            onClick={() => handleSort('views')}
                          >
                            <div className="flex items-center justify-center">
                              <span>Views</span>
                              {sortField === 'views' && (
                                sortDirection === 'asc' 
                                  ? <ArrowUp size={14} className="ml-1" /> 
                                  : <ArrowDown size={14} className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th 
                            className="text-center font-medium text-gray-500 py-3 px-4 cursor-pointer"
                            onClick={() => handleSort('submissions')}
                          >
                            <div className="flex items-center justify-center">
                              <span>Submisi</span>
                              {sortField === 'submissions' && (
                                sortDirection === 'asc' 
                                  ? <ArrowUp size={14} className="ml-1" /> 
                                  : <ArrowDown size={14} className="ml-1" />
                              )}
                            </div>
                          </th>
                          <th className="text-center font-medium text-gray-500 py-3 px-4">Status</th>
                          <th className="text-right font-medium text-gray-500 py-3 px-4">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredForms.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-8 text-gray-500">
                              {searchTerm ? 'Tidak ada form yang cocok dengan pencarian Anda' : 'Tidak ada form yang tersedia'}
                            </td>
                          </tr>
                        ) : (
                          filteredForms.map((form) => (
                            <tr 
                              key={form.id} 
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                            >
                              <td className="py-4 px-4">
                                <div>
                                  <div className="font-medium text-gray-900">{form.title}</div>
                                  <div className="text-xs text-gray-500 mt-1">{form.description}</div>
                                </div>
                              </td>
                              <td className="py-4 px-4 whitespace-nowrap">
                                {formatRelativeTime(form.created_at)}
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Eye size={14} className="text-gray-400 mr-1" />
                                  {form.views}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <div className="flex items-center justify-center">
                                  <Users size={14} className="text-gray-400 mr-1" />
                                  {form.submissions}
                                </div>
                              </td>
                              <td className="py-4 px-4 text-center">
                                <Badge className={getStatusColor(form.status)}>
                                  {getStatusLabel(form.status)}
                                </Badge>
                              </td>
                              <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  {form.link && (
                                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                                      <Copy size={14} />
                                      <span className="hidden md:inline">Copy</span>
                                    </Button>
                                  )}
                                  
                                  <Link href={`/builder?edit=${form.id}`}>
                                    <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs">
                                      <Eye size={14} />
                                      <span className="hidden md:inline">Edit</span>
                                    </Button>
                                  </Link>
                                  
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical size={14} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0 animate-fadeIn">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics Overview</CardTitle>
                  <CardDescription>Performa form Anda dalam 30 hari terakhir</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <BarChart3 size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">Analytics Detail Coming Soon</h3>
                    <p className="text-gray-500 mb-6">Fitur analytics sedang dalam pengembangan</p>
                    <Button variant="outline">Check Back Later</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity" className="mt-0 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Aktivitas terbaru pada form Anda</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {recentActivities.map((activity, index) => (
                          <div key={index} className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-medium">
                                    {activity.type === 'submission' && 'New submission on '}
                                    {activity.type === 'view' && 'Form viewed: '}
                                    {activity.type === 'payment' && 'Payment received for '}
                                    <span className="text-blue-600">{activity.form_name}</span>
                                  </p>
                                  {activity.type === 'payment' && (
                                    <p className="text-sm text-green-600 mt-1">
                                      {formatCurrency(activity.amount || 0)}
                                    </p>
                                  )}
                                  <p className="text-xs text-gray-500 mt-1">
                                    {formatRelativeTime(activity.timestamp)}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink size={14} />
                                </Button>
                              </div>
                              {index < recentActivities.length - 1 && (
                                <div className="border-l-2 border-dashed border-gray-200 h-6 ml-5 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div>
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Tools to manage your forms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Button variant="outline" className="w-full justify-start">
                          <RefreshCw size={16} className="mr-2" />
                          Refresh Analytics
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Download size={16} className="mr-2" />
                          Download Reports
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Settings size={16} className="mr-2" />
                          Notification Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="payments" className="mt-0 animate-fadeIn">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Riwayat pembayaran link form Anda</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] flex items-center justify-center">
                  <div className="text-center p-6">
                    <TrendingUp size={64} className="mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium text-gray-600">Payment History Coming Soon</h3>
                    <p className="text-gray-500 mb-6">Fitur payment history sedang dalam pengembangan</p>
                    <Button variant="outline">Check Back Later</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 