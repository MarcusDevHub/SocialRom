'use client';

// Importa o provider do next-auth para disponibilizar a sessão
// em componentes client da aplicação.
import { SessionProvider } from 'next-auth/react';

// Esse componente só repassa os children para dentro do SessionProvider.
// Fazemos isso porque no App Router normalmente criamos um provider próprio.
export default function AuthSessionProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return <SessionProvider>{children}</SessionProvider>;
}
