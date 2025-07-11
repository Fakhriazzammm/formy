import React from "react";
import ExpiryCountdown from '@/components/links/ExpiryCountdown';

export interface LinkItem {
  id: string;
  url: string;
  status: "active" | "expired";
  expiresAt: string;
  views: number;
  submissions: number;
}

interface LinkListProps {
  links: LinkItem[];
  onCopy: (url: string) => void;
  onExtend: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (id: string) => void; // Tambah prop opsional untuk select
}

export default function LinkList({ links, onCopy, onExtend, onDelete, onSelect }: LinkListProps) {
  if (!links.length) {
    return <div className="text-gray-400 italic">Belum ada link.</div>;
  }

  const getStatusClass = (expiresAt: string) => {
    const difference = new Date(expiresAt).getTime() - new Date().getTime();
    if (difference <= 0) return 'border-red-500 bg-red-50';
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    if (days < 1) return 'border-red-500 bg-red-50';
    if (days < 7) return 'border-yellow-500 bg-yellow-50';
    return 'border-green-500 bg-green-50';
  };

  return (
    <ul className="space-y-4">
      {links.map((link) => (
        <li
          key={link.id}
          className={`p-4 rounded border ${getStatusClass(link.expiresAt)} ${link.status === 'expired' ? 'text-gray-400' : ''} cursor-pointer`}
          onClick={() => typeof onSelect === "function" && onSelect(link.id)}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <div className="font-mono text-sm break-all">{link.url}</div>
              <div className="text-xs mt-1">
                Status:{" "}
                <span className={link.status === "active" ? "text-green-600" : "text-red-500"}>
                  {link.status}
                </span>
              </div>
              <div className="text-xs">Sisa Waktu: <ExpiryCountdown expiresAt={link.expiresAt} /></div>
              <div className="text-xs">Views: {link.views} | Submissions: {link.submissions}</div>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300" onClick={() => onCopy(link.url)}>Copy</button>
              <button className="px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300" onClick={() => onExtend(link.id)} disabled={link.status === "expired"}>Extend</button>
              <button className="px-2 py-1 bg-red-200 rounded hover:bg-red-300" onClick={() => onDelete(link.id)}>Delete</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
} 