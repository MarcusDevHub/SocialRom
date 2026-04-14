'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ShapeWaveBackground from '@/components/shape-wave-background';
import { useLocale } from '@/context/locale-context';

export default function SignUpPage() {
    const router = useRouter();
    const { locale } = useLocale();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isLoading, setIsLoading] = useState(false);

    const t = {
        pt: {
            title: 'Criar conta',
            username: 'Username',
            email: 'Email',
            password: 'Senha',
            submit: 'Criar conta',
            submitting: 'Criando conta...',
            success: 'Conta criada com sucesso! Você será redirecionado para o login.',
            error: 'Erro ao criar conta',
            hasAccount: 'Já tem conta?',
            signIn: 'Entrar',
            backToLibrary: 'Voltar para a biblioteca',
        },
        en: {
            title: 'Create account',
            username: 'Username',
            email: 'Email',
            password: 'Password',
            submit: 'Create account',
            submitting: 'Creating account...',
            success: 'Account created successfully! You will be redirected to sign in.',
            error: 'Error creating account',
            hasAccount: 'Already have an account?',
            signIn: 'Sign in',
            backToLibrary: 'Back to library',
        },
    }[locale];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setIsLoading(true);
        setMessage('');
        setMessageType('');

        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            setMessage(t.success);
            setMessageType('success');

            setUsername('');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                router.push('/auth/signin');
            }, 1500);
        } else {
            setMessage(data.error || t.error);
            setMessageType('error');
        }

        setIsLoading(false);
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

                    {message && (
                        <div
                            className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${messageType === 'success'
                                ? 'bg-emerald-900/40 text-emerald-300 border border-emerald-700'
                                : 'bg-red-900/40 text-red-300 border border-red-700'
                                }`}
                        >
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1 block text-sm text-white/70">{t.username}</label>
                            <input
                                type="text"
                                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none backdrop-blur-sm transition focus:border-[var(--color-accent-blue)]"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-white/70">{t.email}</label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-white outline-none backdrop-blur-sm transition focus:border-[var(--color-accent-blue)]"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-white/70">{t.password}</label>
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
                            disabled={isLoading}
                            className="w-full rounded-lg bg-[var(--color-accent-green)] py-2 font-semibold text-white transition hover:bg-[var(--color-accent-blue)] disabled:opacity-60"
                        >
                            {isLoading ? t.submitting : t.submit}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-white/50">
                        {t.hasAccount}{' '}
                        <Link href="/auth/signin" className="text-[var(--color-accent-blue)] hover:text-[var(--color-accent-green)] hover:underline">
                            {t.signIn}
                        </Link>
                    </p>
                </div >
            </div >
        </div >
    );
}