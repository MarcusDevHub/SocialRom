'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { useLocale } from '@/context/locale-context';

const GITHUB_URL = 'https://github.com/MarcusDevHub/SocialRom'; // ← troque pelo repo correto

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

            {/* Lado esquerdo: ícone GitHub */}
            <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ver no GitHub"
                className="flex items-center justify-center rounded-full bg-gray-900/70 p-2 text-gray-300 transition hover:bg-gray-800 hover:text-white"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
                </svg>
            </a>

            {/* Lado direito: idioma + sessão */}
            <div className="flex items-center gap-3">
                {/* Seletor de idioma por bandeiras */}
                <div className="flex items-center gap-1 rounded-full bg-gray-900/70 px-2 py-1 text-xs">
                    <button
                        type="button"
                        onClick={() => setLocale('pt')}
                        className={`flex h-6 w-8 items-center justify-center rounded ${locale === 'pt' ? 'bg-yellow-500/20' : 'opacity-60 hover:opacity-100'}`}
                        aria-label="Português"
                        title="Português"
                    >
                        <span className="text-lg">🇧🇷</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => setLocale('en')}
                        className={`flex h-6 w-8 items-center justify-center rounded ${locale === 'en' ? 'bg-yellow-500/20' : 'opacity-60 hover:opacity-100'}`}
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