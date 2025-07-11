import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Form Builder - Formy',
  description: 'Build and customize your forms with our intuitive form builder',
};

export default function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 