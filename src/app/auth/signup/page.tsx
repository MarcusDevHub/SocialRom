'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (res.ok) {
            router.push('/auth/signin');
        } else {
            const data = await res.json();
            alert(data.error || 'Erro ao criar conta');
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-black text-white">
            <div className="w-full max-w-md bg-gray-900 p-8 rounded-lg shadow-xl">
                <h1 className="text-3xl font-bold mb-6 text-center">Criar conta no SocialRom</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block mb-1 text-sm">Username</label>
                        <input
                            className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

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
                        className="w-full bg-green-600 hover:bg-green-700 py-2 rounded font-semibold transition-colors"
                    >
                        Criar conta
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-400">
                    Já tem conta?{' '}
                    <a href="/auth/signin" className="text-blue-400 hover:underline">
                        Entrar
                    </a>
                </p>
            </div>
        </main>
    );
}
