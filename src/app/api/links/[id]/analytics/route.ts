import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {

  await params; // Await to satisfy async type

  return NextResponse.json({

    clicks: 150,

    uniqueVisitors: 85,

    topReferrers: [

      { referrer: 'google.com', count: 45 },

      { referrer: 'twitter.com', count: 30 },

      { referrer: 'direct', count: 75 }

    ]

  });

} 