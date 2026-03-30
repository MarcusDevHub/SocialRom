'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Game } from '@/lib/games';
import { useRoomSocket } from '@/hooks/use-room-socket';
import { EmulatorPlayer } from '@/components/emulatorPlayer';


type Message = {
    id: number;
    username: string;
    content: string;
    createdAt: string;
};

type GameRoomClientProps = {
    game: Game;
};

type MessageCardProps = {
    message: Message;
    timeTick: number;
};

function formatTimeAgo(timestamp: string): string {
    const created = new Date(timestamp).getTime();
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - created) / 1000));

    if (diffSec < 60) {
        return `há ${diffSec}s`;
    }

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) {
        return `há ${diffMin}m`;
    }

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) {
        return `há ${diffHours}h`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `há ${diffDays}d`;
}

function MessageCard({ message, timeTick }: MessageCardProps) {
    const timeLabel = useMemo(
        () => formatTimeAgo(message.createdAt),
        [message.createdAt, timeTick],
    );

    return (
        <div className="rounded-lg bg-gray-800 p-3">
            <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-blue-400">
                    @{message.username}
                </p>
                <span className="text-xs text-gray-500">
                    {timeLabel}
                </span>
            </div>

            <p className="mt-1 break-words text-sm text-gray-200">
                {message.content}
            </p>
        </div>
    );
}

export default function GameRoomClient({ game }: GameRoomClientProps) {
    const { data: session, status } = useSession();

    // Socket: contador, status e função pra enviar mensagens
    const { roomCount, isConnected, socket, sendMessage } = useRoomSocket(game.id);

    const [isPlaying] = useState(true);
    const [messageInput, setMessageInput] = useState('');
    const [timeTick, setTimeTick] = useState(0);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            username: 'retrofan',
            content: 'Esse jogo é clássico demais.',
            createdAt: new Date().toISOString(),
        },
        {
            id: 2,
            username: 'speedrunner',
            content: 'Quero zerar isso em tempo recorde.',
            createdAt: new Date().toISOString(),
        },
    ]);

    const currentUsername = useMemo(() => {
        return session?.user?.name || 'user';
    }, [session]);


    // Recebe mensagens em tempo real
    useEffect(() => {
        if (!socket) return;

        function handleIncomingMessage(message: Message) {
            setMessages((prev) => [...prev, message]);
        }

        socket.on('chat-message', handleIncomingMessage);

        return () => {
            socket.off('chat-message', handleIncomingMessage);
        };
    }, [socket]);

    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    // Auto-scroll: só acompanha se o usuário estiver perto do final
    useEffect(() => {

        console.log('auto-scroll effect, mensagens:', messages.length);

        const container = messagesContainerRef.current;
        if (!container) return;

        const threshold = 200; // tolerância em px

        const isNearBottom =
            container.scrollHeight - container.scrollTop - container.clientHeight <
            threshold;

        if (isNearBottom && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Tick global para atualizar tempos a cada 30s
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeTick((prev) => prev + 1);
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();

        if (!session?.user) return;
        if (!messageInput.trim()) return;

        const content = messageInput.trim();
        const username = currentUsername;

        sendMessage({
            roomId: game.id,
            username,
            content,
        });

        setMessageInput('');
    }

    function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
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
                    {/* Área do jogo */}
                    <section className="rounded-xl bg-gray-900 p-6 shadow-xl">
                        <div className="mb-4">
                            <h1 className="text-3xl font-bold">{game.title}</h1>
                            <p className="mt-2 text-sm text-gray-400">
                                {game.system} • {game.description}
                            </p>
                            <p className="mt-2 text-xs text-gray-500">
                                Status da sala em tempo real: {isConnected ? 'conectado' : 'conectando...'}
                            </p>
                        </div>

                        <div className="flex h-[492px] items-center justify-center rounded-lg border border-gray-700 bg-gray-950">
                            {isPlaying && (
                                <EmulatorPlayer romUrl={game.romUrl} system={game.system} />
                            )}
                        </div>
                    </section>

                    {/* Chat */}
                    <aside className="flex h-[720px] flex-col rounded-xl bg-gray-900 p-5 shadow-xl">
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

                        <div
                            ref={messagesContainerRef}
                            className="chat-scroll mt-4 flex-1 space-y-3 overflow-y-auto rounded-lg bg-gray-950 p-3"
                        >
                            {messages.map((message) => (
                                <MessageCard
                                    key={message.id}
                                    message={message}
                                    timeTick={timeTick}
                                />
                            ))}

                            {/* âncora no final */}
                            <div ref={messagesEndRef} />
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
                                    className="chat-scroll min-h-[90px] w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:border-blue-500"
                                    placeholder={`Comentar como @${currentUsername}...`}
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyDown={handleTextareaKeyDown}
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