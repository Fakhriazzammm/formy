import { NextResponse, NextRequest } from 'next/server';
import { LinkItem } from '@/components/links/LinkList';

// Mock storage sementara (ganti dengan DB real)
const mockLinks: LinkItem[] = [
  // Isi sama seperti di /api/links/route.ts
  { id: 'link1', url: 'https://example.com/f/link1', status: 'active', expiresAt: new Date(Date.now() + 3*24*60*60*1000).toISOString(), views: 150, submissions: 45 },
  { id: 'link2', url: 'https://example.com/f/link2', status: 'expired', expiresAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(), views: 200, submissions: 60 },
  { id: 'link3', url: 'https://example.com/f/link3', status: 'active', expiresAt: new Date(Date.now() + 10*24*60*60*1000).toISOString(), views: 80, submissions: 20 },
];

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  const resolvedParams = await params;
  const { id } = resolvedParams;
  const index = mockLinks.findIndex(link => link.id === id);
  if (index === -1) return NextResponse.json({ error: 'Link not found' }, { status: 404 });

  const link = mockLinks[index];
  if (link.status === 'expired') return NextResponse.json({ error: 'Cannot extend expired link' }, { status: 400 });

  const newExpiry = new Date(new Date(link.expiresAt).getTime() + 7*24*60*60*1000).toISOString();
  mockLinks[index] = { ...link, expiresAt: newExpiry };

  return NextResponse.json(mockLinks[index]);
} 