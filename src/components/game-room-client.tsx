'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Game } from '@/lib/games';
import { useRoomSocket } from '@/hooks/use-room-socket';


type Message = {
    id: number;
    username: string;
    content: string;
    createdAt: string;
};

type GameRoomClientProps = {
    game: Game;
};

export default function GameRoomClient({ game }: GameRoomClientProps) {
    const { data: session, status } = useSession();

    const { roomCount, isConnected } = useRoomSocket(game.id);


    const [isPlaying] = useState(true);

    // Campo do chat.
    const [messageInput, setMessageInput] = useState('');

    // Mensagens locais mockadas.
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            username: 'retrofan',
            content: 'Esse jogo é clássico demais.',
            createdAt: 'agora',
        },
        {
            id: 2,
            username: 'speedrunner',
            content: 'Quero zerar isso em tempo recorde.',
            createdAt: 'agora',
        },
    ]);

    const currentUsername = useMemo(() => {
        return session?.user?.name || 'user';
    }, [session]);


    function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();

        if (!session?.user) return;
        if (!messageInput.trim()) return;

        const newMessage: Message = {
            id: Date.now(),
            username: currentUsername,
            content: messageInput.trim(),
            createdAt: 'agora',
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessageInput('');
    }

    return (
        <main className="min-h-screen bg-black p-6 text-white">
            <div className="mx-auto max-w-7xl">
                <div className="mb-6">
                    <Link
                        href="/"
                        className="text-sm text-blue-400 hover:text-blue-300 hover:underline"
                    >
                        ← Voltar para a biblioteca
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
                    <section className="rounded-xl bg-gray-900 p-6 shadow-xl">
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold">{game.title}</h1>
                            <p className="mt-2 text-sm text-gray-400">
                                {game.system} • {game.description}
                            </p>
                        </div>

                        <p className="mt-2 text-xs text-gray-500">
                            Status da sala: {isConnected ? 'conectado em tempo real' : 'conectando...'}
                        </p>


                        <div className="flex h-[492px] items-center justify-center rounded-lg border border-gray-700 bg-gray-950">
                            {isPlaying && (
                                <div className="text-center">
                                    <p className="text-xl font-bold text-green-400">
                                        Jogo iniciado
                                    </p>
                                    <p className="mt-2 text-sm text-gray-300">
                                        Você entrou na sala e o jogo já começou automaticamente.
                                    </p>
                                    <p className="mt-4 text-xs text-gray-500">
                                        Depois vamos conectar o emulador real aqui.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    <aside className="flex h-[620px] flex-col rounded-xl bg-gray-900 p-4 shadow-xl">
                        <div className="border-b border-gray-800 pb-4">
                            <h2 className="text-xl font-bold">Chat da sala</h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Ao abrir esta página, você já entra na sala deste jogo.
                            </p>
                        </div>

                        <div className="mt-4 rounded-lg bg-gray-800 px-4 py-3">
                            <p className="text-sm text-gray-400">Pessoas na sala</p>
                            <p className="text-2xl font-bold text-green-400">
                                {roomCount}
                            </p>
                        </div>

                        <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-lg bg-gray-950 p-3">
                            {messages.map((message) => (
                                <div key={message.id} className="rounded-lg bg-gray-800 p-3">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-blue-400">
                                            @{message.username}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                            {message.createdAt}
                                        </span>
                                    </div>

                                    <p className="mt-1 text-sm text-gray-200">
                                        {message.content}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {status === 'loading' ? (
                            <div className="mt-4 rounded-lg bg-gray-800 p-3 text-sm text-gray-400">
                                Verificando sessão...
                            </div>
                        ) : !session?.user ? (
                            <div className="mt-4 space-y-3">
                                <textarea
                                    className="min-h-[90px] w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm outline-none"
                                    placeholder="Faça login para comentar enquanto joga..."
                                    disabled
                                />
                                <Link
                                    href="/auth/signin"
                                    className="block w-full rounded-lg bg-blue-600 py-2 text-center font-semibold hover:bg-blue-700"
                                >
                                    Entrar para comentar
                                </Link>
                            </div>
                        ) : (
                            <form onSubmit={handleSendMessage} className="mt-4 space-y-3">
                                <textarea
                                    className="min-h-[90px] w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:border-blue-500"
                                    placeholder={`Comentar como @${currentUsername}...`}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                />

                                <button
                                    type="submit"
                                    className="w-full rounded-lg bg-green-600 py-2 font-semibold hover:bg-green-700"
                                >
                                    Enviar mensagem
                                </button>
                            </form>
                        )}
                    </aside>
                </div>
            </div>
        </main>
    );
}
