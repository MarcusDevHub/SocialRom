'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignInPage() {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
            alert('Email ou senha inválidos');
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <div className="w-full max-w-[32rem] rounded-xl bg-gray-900 p-8 shadow-xl">
                <h1 className="mb-6 text-3xl font-bold ">Entrar no SocialRom</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-s text-gray-300">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg text-[24px] border border-gray-700 bg-gray-800 px-3 py-2 outline-none focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-s text-gray-300">Senha</label>
                        <input
                            type="password"
                            className="w-full rounded-lg text-[24px] border border-gray-700 bg-gray-800 px-3 py-2 outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full rounded-lg bg-blue-600 py-2 font-semibold hover:bg-blue-700"
                    >
                        Entrar
                    </button>
                </form>

                <p className="mt-4 text-s text-gray-400">
                    Ainda não tem conta?{' '}
                    <a href="/auth/signup" className="text-blue-400 hover:underline">
                        Criar conta
                    </a>
                </p>
            </div>
        </main>
    );
}
