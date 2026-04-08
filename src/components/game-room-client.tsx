'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
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

const CONTROLS: Record<
    'SNES' | 'GBA' | 'NES' | 'PS1',
    { label: string; key: string }[]
> = {
    SNES: [
        { label: 'D-Pad', key: '↑ ↓ ← →' },
        { label: 'A', key: 'Z' },
        { label: 'B', key: 'X' },
        { label: 'Y', key: 'A' },
        { label: 'X', key: 'S' },
        { label: 'L', key: 'Q' },
        { label: 'R', key: 'W' },
        { label: 'Start', key: 'Enter' },
        { label: 'Select', key: 'Shift' },
    ],
    GBA: [
        { label: 'D-Pad', key: '↑ ↓ ← →' },
        { label: 'A', key: 'Z' },
        { label: 'B', key: 'X' },
        { label: 'L', key: 'Q' },
        { label: 'R', key: 'W' },
        { label: 'Start', key: 'Enter' },
        { label: 'Select', key: 'Shift' },
    ],
    NES: [
        { label: 'D-Pad', key: '↑ ↓ ← →' },
        { label: 'A', key: 'Z' },
        { label: 'B', key: 'X' },
        { label: 'Start', key: 'Enter' },
        { label: 'Select', key: 'Shift' },
    ],
    PS1: [
        { label: 'D-Pad', key: '↑ ↓ ← →' },
        { label: 'Cross', key: 'X' },
        { label: 'Circle', key: 'Z' },
        { label: 'Square', key: 'A' },
        { label: 'Triangle', key: 'S' },
        { label: 'L1', key: 'Q' },
        { label: 'R1', key: 'W' },
        { label: 'Start', key: 'Enter' },
        { label: 'Select', key: 'Shift' },
    ],
};

function formatTimeAgo(timestamp: string): string {
    const created = new Date(timestamp).getTime();
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - created) / 1000));

    if (diffSec < 60) return `há ${diffSec}s`;

    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `há ${diffMin}m`;

    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `há ${diffHours}h`;

    const diffDays = Math.floor(diffHours / 24);
    return `há ${diffDays}d`;
}

function MessageCard({ message, timeTick }: MessageCardProps) {
    const timeLabel = useMemo(
        () => formatTimeAgo(message.createdAt),
        [message.createdAt, timeTick],
    );

    return (
        <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-emerald-400">
                    @{message.username}
                </span>
                <span className="text-white/30">{timeLabel}</span>
            </div>

            <p className="break-words text-white/80">{message.content}</p>
        </div>
    );
}

function ControlsPanel({ system }: { system: 'SNES' | 'GBA' | 'NES' | 'PS1' }) {
    const controls = CONTROLS[system];

    return (
        <section
            data-shape-mask
            className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md"
        >
            <h3 className="mb-3 font-semibold uppercase tracking-widest text-white/40">
                Controles — {system}
            </h3>

            <p className="mb-4 text-white/55">
                Teclas atuais do teclado para este jogo.
            </p>

            <div className="space-y-2">
                {controls.map(({ label, key }) => (
                    <div
                        key={label}
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-black/20 px-3 py-2 backdrop-blur-sm"
                    >
                        <span className="text-white/60">{label}</span>
                        <kbd className="rounded-md bg-white/10 px-2 py-1 font-mono text-white/85">
                            {key}
                        </kbd>
                    </div>
                ))}
            </div>

            <div className="mt-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 backdrop-blur-sm">
                <p className="text-emerald-300">
                    No celular, os controles aparecem direto no emulador como virtual gamepad.
                </p>
            </div>
        </section>
    );
}

export default function GameRoomClient({ game }: GameRoomClientProps) {
    const { data: session } = useSession();
    const { roomCount, isConnected, sendMessage, socket } = useRoomSocket(game.id);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [timeTick, setTimeTick] = useState(0);
    const [showEmulator] = useState(true);

    const chatScrollRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const interval = setInterval(() => setTimeTick((t) => t + 1), 30_000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleMessage = (msg: Message) => {
            setMessages((prev) => [...prev, msg]);
        };

        socket.on('chat-message', handleMessage);

        return () => {
            socket.off('chat-message', handleMessage);
        };
    }, [socket]);

    useEffect(() => {
        const container = chatScrollRef.current;
        if (!container) return;

        container.scrollTop = container.scrollHeight;
    }, [messages]);

    const handleBackToLibrary = () => {
        window.location.href = '/';
    };

    useEffect(() => {
        const previousHtmlOverflow = document.documentElement.style.overflow;
        const previousBodyOverflow = document.body.style.overflow;
        const previousBodyHeight = document.body.style.height;

        document.documentElement.style.overflow = 'hidden';
        document.body.style.overflow = 'hidden';
        document.body.style.height = '100dvh';

        return () => {
            document.documentElement.style.overflow = previousHtmlOverflow;
            document.body.style.overflow = previousBodyOverflow;
            document.body.style.height = previousBodyHeight;
        };
    }, []);

    function handleSendMessage(e: React.FormEvent) {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const username = session?.user?.name ?? 'Anônimo';

        sendMessage({
            roomId: game.id,
            username,
            content: inputValue,
        });

        setInputValue('');
    }

    return (
        <div className="min-h-[100dvh] overflow-hidden bg-transparent text-white">
            <header
                data-shape-mask
                className="border-b border-white/10 bg-black/25 px-4 backdrop-blur-md sm:px-6"
            >
                <div className="flex items-center justify-between gap-3 py-4">
                    <button
                        onClick={handleBackToLibrary}
                        className="shrink-0 text-white/50 transition hover:text-white"
                    >
                        ← Voltar para a biblioteca
                    </button>

                    <div className="min-w-0 text-center">
                        <span className="block truncate font-semibold">{game.title}</span>
                        <span className="text-white/40">{game.system}</span>
                    </div>

                    <div className="shrink-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <span
                                className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-yellow-400'
                                    }`}
                            />
                            <span className="text-white/40">
                                {isConnected ? `${roomCount} jogando` : 'conectando...'}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-[1800px] gap-4 p-4 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
                <aside className="order-2 hidden xl:order-1 xl:block">
                    <ControlsPanel system={game.system} />
                </aside>

                <section className="order-1 xl:order-2">
                    {showEmulator && (
                        <div
                            data-shape-mask
                            className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur-sm"
                        >
                            <div className="aspect-video w-full">
                                <EmulatorPlayer
                                    romUrl={game.romUrl}
                                    system={game.system}
                                    gameTitle={game.title}
                                />
                            </div>
                        </div>
                    )}
                </section>

                <aside
                    data-shape-mask
                    className="order-3 rounded-2xl border border-white/10 bg-slate-950/40 p-3 backdrop-blur-md"
                >
                    <p className="font-semibold uppercase tracking-widest text-white/30">
                        Chat da sala
                    </p>

                    <div
                        ref={chatScrollRef}
                        className="chat-scroll mt-3 max-h-[320px] space-y-2 overflow-y-auto rounded-xl border border-white/6 bg-black/20 p-3 backdrop-blur-sm sm:max-h-[380px] xl:max-h-[calc(100dvh-220px)]"
                    >
                        {messages.length === 0 ? (
                            <p className="mt-4 text-center text-white/25">
                                Nenhuma mensagem ainda. Seja o primeiro!
                            </p>
                        ) : (
                            messages.map((msg) => (
                                <MessageCard key={msg.id} message={msg} timeTick={timeTick} />
                            ))
                        )}
                    </div>

                    <form onSubmit={handleSendMessage} className="mt-3 flex gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Mensagem..."
                            maxLength={200}
                            className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-white placeholder:text-white/30 outline-none backdrop-blur-sm transition focus:border-emerald-500/60"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || !isConnected}
                            className="rounded-xl bg-emerald-600 px-4 py-2 font-medium transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                            Enviar
                        </button>
                    </form>
                </aside>
            </main>
        </div>
    );
}