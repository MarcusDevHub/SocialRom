'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignInPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/';
    const error = searchParams.get('error');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await signIn('credentials', {
            redirect: false,
            email,
            password,
            callbackUrl,
        });

        if (res?.ok) {
            router.push(callbackUrl);
        } else {
            alert('Email ou senha inválidos');
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Entrar no SocialRom</h1>

                {error && (
                    <p className="mb-4 text-red-400 text-center">
                        Ocorreu um erro ao autenticar. Tente novamente.
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="block mb-1 text-sm">Senha</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold transition-colors"
                    >
                        Entrar
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-400">
                    Ainda não tem conta?{' '}
                    <a href="/auth/signup" className="text-blue-400 hover:underline">
                        Criar conta
                    </a>
                </p>
            </div>
        </main>
    );
}
