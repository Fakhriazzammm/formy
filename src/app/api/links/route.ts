import { NextResponse } from "next/server";
import { LinkItem } from "@/components/links/LinkList"; // Import interface dari LinkList

export async function GET() {
  // Mock data sementara (ganti dengan query database nanti)
  const mockLinks: LinkItem[] = [
    {
      id: "link1",
      url: "https://example.com/f/link1",
      status: "active",
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 hari lagi
      views: 150,
      submissions: 45,
    },
    {
      id: "link2",
      url: "https://example.com/f/link2",
      status: "expired",
      expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Kemarin
      views: 200,
      submissions: 60,
    },
    {
      id: "link3",
      url: "https://example.com/f/link3",
      status: "active",
      expiresAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 hari lagi
      views: 80,
      submissions: 20,
    },
  ];

  return NextResponse.json(mockLinks);
} 