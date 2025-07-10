import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function sendEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  // TODO: Integrasi dengan Resend, SMTP, atau email provider lain
  console.log(`[EMAIL] To: ${to} | Subject: ${subject} | Text: ${text}`);
  return true;
}
