'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';

export default function AuthHeader() {
    // useSession lê o estado atual da autenticação no client
    const { data: session, status } = useSession();

    // Enquanto o next-auth está verificando a sessão,
    // mostramos um estado simples de carregamento.
    if (status === 'loading') {
        return (
            <header className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-400">Carregando sessão...</p>
                </div>
            </header>
        );
    }

    return (
        <header className="mb-6 flex items-center justify-between">
            <div>
                <h2 className="text-lg font-semibold text-white">SocialRom</h2>
                <p className="text-sm text-gray-400">
                    Jogue clássicos online com sala ao vivo
                </p>
            </div>

            {!session?.user ? (
                <div className="flex gap-3">
                    <Link
                        href="/auth/signin"
                        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Entrar
                    </Link>

                    <Link
                        href="/auth/signup"
                        className="rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                    >
                        Criar conta
                    </Link>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-800 px-4 py-2 text-sm text-gray-200">
                        Logado como{' '}
                        <span className="font-bold text-blue-400">
                            @{session.user.name}
                        </span>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                        Sair
                    </button>
                </div>
            )}
        </header>
    );
}
