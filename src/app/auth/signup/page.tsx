'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');
    const [isLoading, setIsLoading] = useState(false);

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
            setMessage('Conta criada com sucesso! Você será redirecionado para o login.');
            setMessageType('success');

            setUsername('');
            setEmail('');
            setPassword('');

            setTimeout(() => {
                router.push('/auth/signin');
            }, 1500);
        } else {
            setMessage(data.error || 'Erro ao criar conta');
            setMessageType('error');
        }

        setIsLoading(false);
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-black text-white p-6">
            <div className="w-full max-w-md rounded-xl bg-gray-900 p-8 shadow-xl">
                <h1 className="mb-6 text-3xl font-bold">Criar conta</h1>

                {message && (
                    <div
                        className={`mb-4 rounded-lg px-4 py-3 text-sm font-medium ${messageType === 'success'
                            ? 'bg-green-900/40 text-green-300 border border-green-700'
                            : 'bg-red-900/40 text-red-300 border border-red-700'
                            }`}
                    >
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Username</label>
                        <input
                            type="text"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 outline-none focus:border-blue-500"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Email</label>
                        <input
                            type="email"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 outline-none focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm text-gray-300">Senha</label>
                        <input
                            type="password"
                            className="w-full rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 outline-none focus:border-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-green-600 py-2 font-semibold hover:bg-green-700 disabled:opacity-60"
                    >
                        {isLoading ? 'Criando conta...' : 'Criar conta'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-gray-400">
                    Já tem conta?{' '}
                    <a href="/auth/signin" className="text-blue-400 hover:underline">
                        Entrar
                    </a>
                </p>
            </div>
        </main>
    );
}
