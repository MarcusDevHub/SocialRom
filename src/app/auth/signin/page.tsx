'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ShapeWaveBackground from '@/components/shape-wave-background';
import { useLocale } from '@/context/locale-context';

export default function SignInPage() {
    const router = useRouter();
    const { locale } = useLocale();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const t = {
        pt: {
            title: 'Entrar no SocialRom',
            email: 'Email',
            password: 'Senha',
            submit: 'Entrar',
            noAccount: 'Ainda não tem conta?',
            createAccount: 'Criar conta',
            invalidCredentials: 'Email ou senha inválidos',
            backToLibrary: 'Voltar para a biblioteca',
        },
        en: {
            title: 'Sign in to SocialRom',
            email: 'Email',
            password: 'Password',
            submit: 'Sign in',
            noAccount: "Don't have an account?",
            createAccount: 'Create account',
            invalidCredentials: 'Invalid email or password',
            backToLibrary: 'Back to library',
        },
    }[locale];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const result = await signIn('credentials', {
            email,
            password,
            redirect: false,
        });

        if (result?.ok) {
            router.push('/');
            router.refresh();
        } else {
            alert(t.invalidCredentials);
        }
    }

    return (
        <div className="body-crt relative min-h-[100dvh] overflow-hidden">
            <ShapeWaveBackground />
            <div className="shape-wave-vignette" aria-hidden="true" />

            <div className="relative z-2 flex min-h-[100dvh] items-center justify-center p-6">
                <div className="absolute left-4 top-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-white/50 transition hover:text-white"
                    >
                        ← {t.backToLibrary}
                    </Link>
                </div>

                <div className="w-full max-w-[32rem] rounded-2xl border border-white/10 bg-slate-950/40 p-8 shadow-2xl backdrop-blur-md">
                    <h1 className="mb-6 text-3xl font-bold text-[var(--color-accent-yellow)] drop-shadow-[0_0_12px_rgba(249,230,92,0.6)]">
                        {t.title}
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-s text-white/70">{t.email}</label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none backdrop-blur-sm transition focus:border-[var(--color-accent-blue)]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-s text-white/70">{t.password}</label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none backdrop-blur-sm transition focus:border-[var(--color-accent-blue)]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-[var(--color-accent-blue)] py-2 font-semibold text-white transition hover:bg-[var(--color-accent-green)]"
                        >
                            {t.submit}
                        </button>
                    </form>

                    <p className="mt-4 text-s text-white/50">
                        {t.noAccount}{' '}
                        <Link href="/auth/signup" className="text-[var(--color-accent-blue)] hover:text-[var(--color-accent-green)] hover:underline">
                            {t.createAccount}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}