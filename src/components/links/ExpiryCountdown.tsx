import React, { useState, useEffect } from "react";

interface ExpiryCountdownProps {
  expiresAt: string;
}

export default function ExpiryCountdown({ expiresAt }: ExpiryCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [statusColor, setStatusColor] = useState<string>("text-green-600");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const difference = expiry - now;

      if (difference <= 0) {
        setTimeLeft("Expired");
        setStatusColor("text-red-500");
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      setTimeLeft(`${days} hari, ${hours} jam, ${minutes} menit`);

      if (days < 1) setStatusColor("text-red-500");
      else if (days < 7) setStatusColor("text-yellow-500");
      else setStatusColor("text-green-600");
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update setiap menit

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <span className={`text-sm font-medium ${statusColor}`}>
      {timeLeft}
    </span>
  );
} 