'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useLocale } from '@/context/locale-context';

export default function AuthHeader() {
    const { data: session, status } = useSession();
    const { locale, setLocale } = useLocale();

    const isLoading = status === 'loading';
    const user = session?.user;

    const t = {
        pt: {
            smallSubtitle: 'Jogue e converse',
            loading: 'Carregando sessão...',
            loggedInAs: 'Logado como',
            signIn: 'Entrar / Criar conta',
            signOut: 'Sair',
        },
        en: {
            smallSubtitle: 'Play & chat',
            loading: 'Loading session...',
            loggedInAs: 'Logged in as',
            signIn: 'Sign in / Create account',
            signOut: 'Sign out',
        },
    }[locale];

    return (
        <header className="mb-6 flex items-center justify-between">
            {/* Lado direito: idioma + sessão */}
            <div className="flex items-center gap-3">
                {/* Seletor de idioma por bandeiras */}
                <div className="flex items-center gap-1 rounded-full bg-gray-900/70 px-2 py-1 text-xs">
                    <button
                        type="button"
                        onClick={() => setLocale('pt')}
                        className={`flex h-6 w-8 items-center justify-center rounded ${locale === 'pt' ? 'bg-yellow-500/20' : 'opacity-60 hover:opacity-100'
                            }`}
                        aria-label="Português"
                        title="Português"
                    >
                        <span className="text-lg">🇧🇷</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setLocale('en')}
                        className={`flex h-6 w-8 items-center justify-center rounded ${locale === 'en' ? 'bg-yellow-500/20' : 'opacity-60 hover:opacity-100'
                            }`}
                        aria-label="English"
                        title="English"
                    >
                        <span className="text-lg">🇺🇸</span>
                    </button>
                </div>

                {isLoading ? (
                    <div className="h-9 min-w-[140px] rounded-full bg-gray-800/60 px-4 py-2 text-center text-xs text-gray-400">
                        {t.loading}
                    </div>
                ) : user ? (
                    <>
                        <div className="flex items-center gap-2 rounded-full border border-yellow-500/40 bg-gray-900/80 px-4 py-2 text-s text-gray-200">
                            <span className="text-px16 uppercase tracking-wide text-gray-400">
                                {t.loggedInAs}
                            </span>
                            <span className="text-px16 font-semibold text-yellow-300">
                                @{user.name}
                            </span>
                        </div>

                        <button
                            onClick={() => signOut({ callbackUrl: '/' })}
                            className="rounded-full bg-red-600 px-8 py-2 text-px16 font-semibold text-white transition hover:bg-red-700"
                        >
                            {t.signOut}
                        </button>
                    </>
                ) : (
                    <Link
                        href="/auth/signin"
                        className="rounded-full bg-yellow-500 px-4 py-2 text-s font-semibold text-black shadow-sm transition hover:bg-yellow-400"
                    >
                        {t.signIn}
                    </Link>
                )}
            </div>
        </header>
    );
}