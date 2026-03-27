import type { Metadata } from 'next';
import './globals.css';
import AuthSessionProvider from '@/providers/session-provider';
import { LocaleProvider } from '@/context/locale-context';

export const metadata: Metadata = {
  title: 'SocialRom',
  description: 'Jogue e converse em jogos clássicos online',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="body-crt">
        <div className="main-crt">
          <AuthSessionProvider>
            <LocaleProvider>
              {children}
            </LocaleProvider>
          </AuthSessionProvider>
        </div>
      </body>
    </html>
  );
}