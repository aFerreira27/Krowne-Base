import type { Metadata } from 'next';
import React from 'react';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/main-layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Krowne Base',
  description: 'Manage and browse Krowne products with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/icons/krowneBaseIcon.svg" type="image/svg+xml" />
      </head>
      <body className="font-body antialiased">
        <MainLayout>{children}</MainLayout>
        <Toaster />
      </body>
    </html>
  );
}