import type { Metadata } from 'next';
import './globals.css';
import AuthSessionProvider from '@/providers/session-provider';

export const metadata: Metadata = {
  title: 'SocialRom',
  description: 'Jogue clássicos online com chat e presença ao vivo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
