import React from "react";

interface LinkAnalyticsProps {
  views: number;
  submissions: number;
}

export default function LinkAnalytics({ views, submissions }: LinkAnalyticsProps) {
  const conversionRate = views > 0 ? ((submissions / views) * 100).toFixed(1) : "0.0";
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Views:</span>
        <span className="font-semibold">{views}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Submissions:</span>
        <span className="font-semibold">{submissions}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Conversion Rate:</span>
        <span className="font-semibold">{conversionRate}%</span>
      </div>
    </div>
  );
} 