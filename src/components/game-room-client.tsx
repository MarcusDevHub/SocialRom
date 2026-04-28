'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Game } from '@/lib/games';
import { useRoomSocket } from '@/hooks/use-room-socket';
import { EmulatorPlayer } from '@/components/emulatorPlayer';
import { useLocale } from '@/context/locale-context';

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
    locale: 'pt' | 'en';
};

const CONTROLS: Record<
    'SNES' | 'GBA' | 'NES' | 'PS1' | 'N64',
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
    N64: [
        { label: 'D-Pad / Analógico', key: '↑↓←→' },
        { label: 'A', key: 'Z' },
        { label: 'B', key: 'X' },
        { label: 'Z', key: 'A' },
        { label: 'L', key: 'Q' },
        { label: 'R', key: 'W' },
        { label: 'Start', key: 'Enter' },
        { label: 'C-Up', key: 'I' },
        { label: 'C-Down', key: 'K' },
        { label: 'C-Left', key: 'J' },
        { label: 'C-Right', key: 'L' },
    ],
};

function formatTimeAgo(timestamp: string, locale: 'pt' | 'en'): string {
    const created = new Date(timestamp).getTime();
    const now = Date.now();
    const diffSec = Math.max(0, Math.floor((now - created) / 1000));

    if (locale === 'en') {
        if (diffSec < 60) return `${diffSec}s ago`;
        const diffMin = Math.floor(diffSec / 60);
        if (diffMin < 60) return `${diffMin}m ago`;
        const diffHours = Math.floor(diffMin / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return `${Math.floor(diffHours / 24)}d ago`;
    }

    if (diffSec < 60) return `há ${diffSec}s`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `há ${diffMin}m`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `há ${diffHours}h`;
    return `há ${Math.floor(diffHours / 24)}d`;
}

function MessageCard({ message, timeTick, locale }: MessageCardProps) {
    const timeLabel = useMemo(
        () => formatTimeAgo(message.createdAt, locale),
        [message.createdAt, timeTick, locale],
    );

    return (
        <div className="flex flex-col gap-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-emerald-400">@{message.username}</span>
                <span className="text-white/30">{timeLabel}</span>
            </div>
            <p className="break-words text-white/80">{message.content}</p>
        </div>
    );
}

function ControlsPanel({
    system,
    locale,
}: {
    system: 'SNES' | 'GBA' | 'NES' | 'PS1' | 'N64';
    locale: 'pt' | 'en';
}) {
    const controls = CONTROLS[system];

    const saveInstructions = {
        SNES: {
            inGame: locale === 'en' ? "Use the game's built-in save system." : 'Use o sistema de save do próprio jogo.',
            state: locale === 'en' ? 'Shift + F1 to save / F1 to load.' : 'Shift + F1 para salvar / F1 para carregar.',
            tip: locale === 'en'
                ? 'Always backup your saves/save states locally on mobile or PC.'
                : 'Sempre faça backup ou armazene seus saves / savesStates localmente seja mobile ou pc.',
        },
        GBA: {
            inGame: locale === 'en' ? "Use the game's built-in save system." : 'Use o sistema de save do próprio jogo.',
            state: locale === 'en' ? 'Shift + F1 to save / F1 to load.' : 'Shift + F1 para salvar / F1 para carregar.',
            tip: locale === 'en'
                ? 'Always backup your saves/save states locally on mobile or PC.'
                : 'Sempre faça backup ou armazene seus saves / savesStates localmente seja mobile ou pc.',
        },
        NES: {
            inGame: locale === 'en' ? "Use the game's built-in save system." : 'Use o sistema de save do próprio jogo.',
            state: locale === 'en' ? 'Shift + F1 to save / F1 to load.' : 'Shift + F1 para salvar / F1 para carregar.',
            tip: locale === 'en'
                ? 'Always backup your saves/save states locally on mobile or PC.'
                : 'Sempre faça backup ou armazene seus saves / savesStates localmente seja mobile ou pc.',
        },
        PS1: {
            inGame: locale === 'en' ? 'Save via Memory Card inside the game.' : 'Salve via Memory Card dentro do jogo.',
            state: locale === 'en' ? 'Shift + F1 to save / F1 to load.' : 'Shift + F1 para salvar / F1 para carregar.',
            tip: locale === 'en'
                ? 'Always save before closing — PS1 requires Memory Card!'
                : 'Salve sempre antes de fechar — PS1 exige Memory Card!',
        },
        N64: {
            inGame: locale === 'en' ? "Use the game's built-in save system." : 'Use o sistema de save do próprio jogo.',
            state: locale === 'en' ? 'Shift + F1 to save / F1 to load.' : 'Shift + F1 para salvar / F1 para carregar.',
            tip: locale === 'en'
                ? 'Always backup your saves/save states locally on mobile or PC.'
                : 'Sempre faça backup ou armazene seus saves / savesStates localmente seja mobile ou pc.',
        },
    }[system];

    return (
        <section
            data-shape-mask
            className="rounded-2xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md"
        >
            <h3 className="mb-3 font-semibold uppercase tracking-widest text-white/40">
                {locale === 'en' ? 'Controls' : 'Controles'} — {system}
            </h3>

            <div className="space-y-2">
                {controls.map(({ label, key }) => (
                    <div
                        key={label}
                        className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-black/20 px-3 py-2 backdrop-blur-sm"
                    >
                        <span className="text-white/60">{label}</span>
                        <kbd className="rounded-md bg-white/10 px-2 font-mono text-white/85">{key}</kbd>
                    </div>
                ))}
            </div>

            <div className="mt-4 border-t border-white/10 pt-2">
                <h4 className="mb-2 font-semibold uppercase tracking-widest text-white/40">
                    {locale === 'en' ? 'How to Save' : 'Como Salvar'}
                </h4>

                <div className="space-y-2 text-s">
                    <div className="flex items-start gap-2">
                        <span className="shrink-0 text-emerald-400">▸</span>
                        <p className="text-white/70">
                            <span className="font-medium text-white/90">
                                {locale === 'en' ? 'In-game:' : 'No jogo:'}
                            </span>{' '}
                            {saveInstructions.inGame}
                        </p>
                    </div>

                    <div className="flex items-start gap-2">
                        <span className="shrink-0 text-emerald-400">▸</span>
                        <p className="text-white/70">
                            <span className="font-medium text-white/90">Save State:</span>{' '}
                            {saveInstructions.state}
                        </p>
                    </div>

                    {saveInstructions.tip && (
                        <div className="mt-2 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2">
                            <span className="shrink-0 text-yellow-400">⚠</span>
                            <p className="text-yellow-300/90 text-[15px]">{saveInstructions.tip}</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default function GameRoomClient({ game }: GameRoomClientProps) {
    const { data: session, status } = useSession();
    const { locale } = useLocale();
    const { roomCount, isConnected, sendMessage, socket } = useRoomSocket(game.id);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [timeTick, setTimeTick] = useState(0);
    const [showEmulator] = useState(true);

    const chatScrollRef = useRef<HTMLDivElement | null>(null);
    const [historicalMessages, setHistoricalMessages] = useState<Message[]>([]);
    const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

    const t = {
        pt: {
            back: '← Voltar para a biblioteca',
            playing: 'jogando',
            connecting: 'conectando...',
            chatTitle: 'Chat da sala',
            noMessages: 'Nenhuma mensagem ainda. Seja o primeiro!',
            checkingSession: 'Verificando sessão...',
            loginToChat: 'Faça login para comentar enquanto joga...',
            loginButton: 'Entrar para comentar',
            messagePlaceholder: 'Mensagem...',
            send: 'Enviar',
        },
        en: {
            back: '← Back to library',
            playing: 'playing',
            connecting: 'connecting...',
            chatTitle: 'Room Chat',
            noMessages: 'No messages yet. Be the first!',
            checkingSession: 'Checking session...',
            loginToChat: 'Sign in to chat while you play...',
            loginButton: 'Sign in to chat',
            messagePlaceholder: 'Message...',
            send: 'Send',
        },
    }[locale];

    useEffect(() => {
        const interval = setInterval(() => setTimeTick((t) => t + 1), 30_000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handleMessage = (msg: Message) => setMessages((prev) => [...prev, msg]);
        socket.on('chat-message', handleMessage);
        return () => { socket.off('chat-message', handleMessage); };
    }, [socket]);

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

    const canSendMessage = Boolean(session?.user) && isConnected;

    useEffect(() => {
        if (!isConnected || hasLoadedHistory) return;
        const loadHistory = async () => {
            try {
                const res = await fetch(`/api/chat?roomId=${game.id}`);
                if (!res.ok) throw new Error('Falha ao carregar histórico');
                const data = await res.json();
                setHistoricalMessages(data.messages || []);
                setHasLoadedHistory(true);
            } catch (err) {
                console.error('Erro ao carregar histórico:', err);
            }
        };
        loadHistory();
    }, [isConnected, game.id, hasLoadedHistory]);

    const handleSendMessageWithHistory = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSendMessage || !inputValue.trim()) return;
        const username = session!.user.name ?? 'Usuário';
        const content = inputValue.trim();
        sendMessage({ roomId: game.id, username, content });
        try {
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomId: game.id, username, content }),
            });
        } catch (err) {
            console.error('Erro ao salvar no histórico:', err);
        }
        setInputValue('');
    }, [canSendMessage, inputValue, sendMessage, game.id, session]);

    const allMessages = useMemo(() => {
        const historicalIds = new Set(historicalMessages.map(m => m.id));
        const liveMessages = messages.filter(m => !historicalIds.has(m.id));
        return [...historicalMessages, ...liveMessages];
    }, [historicalMessages, messages]);

    useEffect(() => {
        const container = chatScrollRef.current;
        if (!container) return;
        container.scrollTop = container.scrollHeight;
    }, [allMessages]);

    return (
        <div className="min-h-[100dvh] overflow-hidden bg-transparent text-white">
            <header
                data-shape-mask
                className="border-b border-white/10 bg-black/25 px-4 backdrop-blur-md sm:px-6"
            >
                <div className="flex items-center justify-between gap-3 py-4">
                    <button
                        onClick={() => window.location.href = '/'}
                        className="shrink-0 text-white/50 transition hover:text-white"
                    >
                        {t.back}
                    </button>

                    <div className="min-w-0 text-center">
                        <span className="block truncate font-semibold">{game.title}</span>
                        <span className="text-white/40">{game.system}</span>
                    </div>

                    <div className="shrink-0 text-right">
                        <div className="flex items-center justify-end gap-2">
                            <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-emerald-400' : 'bg-yellow-400'}`} />
                            <span className="text-white/40">
                                {isConnected ? `${roomCount} ${t.playing}` : t.connecting}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="mx-auto grid max-w-[1800px] gap-4 p-4 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
                <aside className="order-2 hidden xl:order-1 xl:block">
                    <ControlsPanel system={game.system} locale={locale} />
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
                    className="order-3 flex h-fit max-h-[720px] flex-col rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md"
                >
                    <p className="font-semibold uppercase tracking-widest text-white/30">
                        {t.chatTitle}
                    </p>

                    <div
                        ref={chatScrollRef}
                        className="chat-scroll mt-3 max-h-[320px] space-y-2 overflow-y-auto rounded-xl border border-white/6 bg-black/20 p-3 backdrop-blur-sm sm:max-h-[380px] xl:max-h-[calc(100dvh-220px)]"
                    >
                        {allMessages.length === 0 ? (
                            <p className="mt-4 text-center text-white/25">{t.noMessages}</p>
                        ) : (
                            allMessages.map((msg) => (
                                <MessageCard key={msg.id} message={msg} timeTick={timeTick} locale={locale} />
                            ))
                        )}
                    </div>

                    {status === 'loading' ? (
                        <div className="mt-4 rounded-lg bg-gray-800 p-3 text-sm text-gray-400">
                            {t.checkingSession}
                        </div>
                    ) : !session?.user ? (
                        <div className="mt-4 space-y-3">
                            <textarea
                                className="min-h-[90px] w-full rounded-lg border border-[var(--color-emerald-400)] bg-black-800 p-3 text-s outline-none"
                                placeholder={t.loginToChat}
                                disabled
                            />
                            <Link
                                href="/auth/signin"
                                className="block w-full rounded-lg bg-[var(--color-emerald-400)] py-2 text-center font-semibold hover:bg-[var(--color-emerald-500)] text-black transition"
                            >
                                {t.loginButton}
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSendMessageWithHistory} className="mt-3 flex gap-2">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={t.messagePlaceholder}
                                maxLength={200}
                                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-black/25 px-3 py-2 text-white placeholder:text-white/30 outline-none backdrop-blur-sm transition focus:border-emerald-500/60"
                            />
                            <button
                                type="submit"
                                disabled={!inputValue.trim() || !isConnected}
                                className="rounded-xl bg-emerald-600 px-4 py-2 font-medium transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-30"
                            >
                                {t.send}
                            </button>
                        </form>
                    )}
                </aside>
            </main>
        </div>
    );
}