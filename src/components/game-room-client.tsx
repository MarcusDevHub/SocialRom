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

const ROM_EXTENSIONS: Record<string, string> = {
    SNES: '.sfc,.smc',
    GBA: '.gba',
    NES: '.nes',
    PS1: '.chd,.bin,.cue,.iso',
    N64: '.n64,.z64,.v64',
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

function SavePanel({ locale }: { locale: 'pt' | 'en' }) {
    const [open, setOpen] = useState(false);

    const t = {
        pt: {
            toggle: '💾 Como Salvar',
            title: 'Como salvar seu progresso',

            step1Title: 'Abra o menu do emulador',
            step1Desc: 'Clique no ícone ☰ na barra inferior do emulador.',

            step2Title: 'Salvar estado',
            step2Desc: 'Clique em "Save State". O jogo é salvo instantaneamente no navegador.',

            step3Title: 'Carregar estado',
            step3Desc: 'Para continuar de onde parou: menu ☰ → "Load State".',

            step4Title: 'Backup em arquivo (recomendado)',
            step4Desc: 'Para não perder ao limpar o navegador: menu ☰ → "Save State" → clique no ícone de download 💾 ao lado do slot.',

            mobileTitle: '📱 No celular',
            mobileDesc: 'Toque na tela do emulador para exibir os controles → toque em ☰ → Save State.',

            warnTitle: '⚠️ Save in-game (dentro do jogo)',
            warnDesc: 'Alguns jogos têm save próprio (ex: Pokémon). Esse save pode não persistir entre sessões — sempre confirme com um Save State pelo menu.',
        },
        en: {
            toggle: '💾 How to Save',
            title: 'How to save your progress',

            step1Title: 'Open the emulator menu',
            step1Desc: 'Click the ☰ icon on the emulator\'s bottom bar.',

            step2Title: 'Save state',
            step2Desc: 'Click "Save State". The game is instantly saved in your browser.',

            step3Title: 'Load state',
            step3Desc: 'To continue where you left off: menu ☰ → "Load State".',

            step4Title: 'File backup (recommended)',
            step4Desc: 'To avoid losing progress when clearing the browser: menu ☰ → "Save State" → click the download icon 💾 next to the slot.',

            mobileTitle: '📱 On mobile',
            mobileDesc: 'Tap the emulator screen to show controls → tap ☰ → Save State.',

            warnTitle: '⚠️ In-game save',
            warnDesc: 'Some games have their own save system (e.g. Pokémon). That save may not persist between sessions — always confirm with a Save State via the menu.',
        },
    }[locale];

    const steps = [
        { num: '1', title: t.step1Title, desc: t.step1Desc, color: 'border-white/10 bg-white/5' },
        { num: '2', title: t.step2Title, desc: t.step2Desc, color: 'border-emerald-500/20 bg-emerald-500/8' },
        { num: '3', title: t.step3Title, desc: t.step3Desc, color: 'border-blue-500/20 bg-blue-500/8' },
        { num: '4', title: t.step4Title, desc: t.step4Desc, color: 'border-blue-500/20 bg-blue-500/8' },
    ];

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/70 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
            >
                {t.toggle}
            </button>

            {open && (
                <>
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                        onClick={() => setOpen(false)}
                    />

                    {/* Mobile: bottom sheet | Desktop: dropdown */}
                    <div className="
            fixed bottom-0 left-0 right-0 z-50
            rounded-t-2xl border-t border-white/10 bg-slate-950/98 p-4 shadow-2xl
            xl:absolute xl:bottom-auto xl:left-0 xl:top-full xl:mt-2
            xl:w-max xl:min-w-[260px] xl:max-w-[570px]
            xl:rounded-2xl xl:border xl:border-white/10
        ">
                        {/* Handle mobile */}
                        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20 xl:hidden" />

                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="font-semibold text-white">{t.title}</h3>
                            <button onClick={() => setOpen(false)} className="text-white/30 transition hover:text-white">✕</button>
                        </div>

                        {/* Grid: 1 col mobile, 2 col desktop */}
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {steps.map((step) => (
                                <div key={step.num} className={`flex gap-3 rounded-xl border p-3 xl:flex-col xl:gap-1.5 ${step.color}`}>
                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-s font-bold text-white/60">
                                        {step.num}
                                    </span>
                                    <div>
                                        <p className="text-s font-semibold leading-snug text-white/80">{step.title}</p>
                                        <p className="mt-0.5 break-words text-s leading-relaxed text-white/50">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <div className="flex gap-3 rounded-xl border border-purple-500/20 bg-purple-500/8 p-3 xl:flex-col xl:gap-1.5">
                                <span className="text-base">📱</span>
                                <div>
                                    <p className="text-s font-semibold leading-snug text-purple-300">{t.mobileTitle}</p>
                                    <p className="mt-0.5 break-words text-s leading-relaxed text-white/50">{t.mobileDesc}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 rounded-xl border border-yellow-500/20 bg-yellow-500/8 p-3 xl:flex-col xl:gap-1.5">
                                <span className="text-base">⚠️</span>
                                <div>
                                    <p className="text-s font-semibold leading-snug text-yellow-400">{t.warnTitle}</p>
                                    <p className="mt-0.5 break-words text-s leading-relaxed text-white/50">{t.warnDesc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
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

    const ps1Tip = {
        pt: 'Salve via Memory Card dentro do jogo. PS1 exige Memory Card!',
        en: 'Save via Memory Card inside the game. PS1 requires Memory Card!',
    }[locale];

    return (
        <>
            <div className="mt-4 border-t border-white/10 pt-4">
                <SavePanel locale={locale} />
            </div>

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

                {system === 'PS1' && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2">
                        <span className="shrink-0 text-yellow-400">⚠</span>
                        <p className="text-[15px] text-yellow-300/90">{ps1Tip}</p>
                    </div>
                )}
            </section>

        </>
    );
}

function RomDropZone({
    system,
    locale,
    onFileSelect,
}: {
    system: string;
    locale: 'pt' | 'en';
    onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const ext = ROM_EXTENSIONS[system] ?? '*';

    const label = locale === 'en'
        ? { title: 'Load your ROM to play', sub: `Accepted formats: ${ext}`, btn: 'Select ROM file' }
        : { title: 'Carregue sua ROM para jogar', sub: `Formatos aceitos: ${ext}`, btn: 'Selecionar arquivo de ROM' };

    return (
        <div className="flex w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-white/20 bg-black/40 py-8 backdrop-blur-sm sm:aspect-video sm:py-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl sm:h-16 sm:w-16 sm:text-4xl">
                🎮
            </div>
            <div className="text-center px-4">
                <p className="text-sm font-semibold text-white/80 sm:text-base">{label.title}</p>
                <p className="mt-1 text-s text-yellow-300 sm:text-s">{label.sub}</p>
            </div>
            <button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-s font-semibold transition hover:bg-emerald-500 active:scale-95"
            >
                {label.btn}
            </button>
            <input ref={fileInputRef} type="file" accept={ext} onChange={onFileSelect} className="hidden" />
        </div>

    );
}

export default function GameRoomClient({ game }: GameRoomClientProps) {
    const { data: session, status } = useSession();
    const { locale } = useLocale();
    const { roomCount, isConnected, sendMessage, socket } = useRoomSocket(game.id);

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [timeTick, setTimeTick] = useState(0);

    const [localRomUrl, setLocalRomUrl] = useState<string | null>(null);
    const [localRomName, setLocalRomName] = useState<string | null>(null);
    const [showRomBanner, setShowRomBanner] = useState(false);

    const hasHostedRom = Boolean(game.romUrl);
    const activeRomUrl = hasHostedRom ? game.romUrl : localRomUrl;
    const isReady = Boolean(activeRomUrl);

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
            romLoaded: 'ROM carregada:',
            changeRom: 'Trocar ROM',
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
            romLoaded: 'ROM loaded:',
            changeRom: 'Change ROM',
        },
    }[locale];

    useEffect(() => {
        return () => {
            if (localRomUrl) URL.revokeObjectURL(localRomUrl);
        };
    }, [localRomUrl]);

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (localRomUrl) URL.revokeObjectURL(localRomUrl);
        const blobUrl = URL.createObjectURL(file);
        setLocalRomUrl(blobUrl);
        setLocalRomName(file.name);
        setShowRomBanner(true);
    }

    useEffect(() => {
        if (!showRomBanner) return;
        const timer = setTimeout(() => setShowRomBanner(false), 6000);
        return () => clearTimeout(timer);
    }, [showRomBanner]);

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


    const canSendMessage = Boolean(session?.user) && isConnected;

    useEffect(() => {
        if (!isConnected || hasLoadedHistory) return;
        const loadHistory = async () => {
            try {
                const res = await fetch(`/api/chat?roomId=${game.id}`);
                if (!res.ok) {
                    const text = await res.text();
                    console.error(`Histórico falhou — status ${res.status}:`, text);
                    setHasLoadedHistory(true);
                    return;
                }
                const data = await res.json();
                setHistoricalMessages(data.messages || []);
                setHasLoadedHistory(true);
            } catch (err) {
                console.error('Erro ao carregar histórico:', err);
                setHasLoadedHistory(true);
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

    const changeRomRef = useRef<HTMLInputElement>(null);

    return (
        <div className="min-h-[100dvh] overflow-hidden bg-transparent text-white">
            <header
                data-shape-mask
                className="border-b border-white/10 bg-black/25 px-4 backdrop-blur-md sm:px-6"
            >
                <div className="flex items-center justify-between gap-2 py-2 sm:py-4">
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

            <main className="mx-auto grid max-w-[1800px] gap-3 p-2 pb-8 sm:p-4 sm:gap-4 xl:grid-cols-[260px_minmax(0,1fr)_360px]">
                <aside className="order-2 hidden xl:order-1 xl:block">
                    <ControlsPanel system={game.system} locale={locale} />
                </aside>

                <section className="order-1 xl:order-2 flex flex-col gap-3">
                    {/* Banner ROM carregada — some após 6s */}
                    {!hasHostedRom && showRomBanner && localRomName && (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                            <div className="min-w-0">
                                <span className="text-sm text-white/40">{t.romLoaded} </span>
                                <span className="truncate text-sm font-medium text-emerald-400">{localRomName}</span>
                            </div>
                            <button
                                onClick={() => changeRomRef.current?.click()}
                                className="shrink-0 rounded-lg bg-white/10 px-3 py-1 text-s text-white/60 transition hover:bg-white/20 hover:text-white"
                            >
                                {t.changeRom}
                            </button>
                            <input
                                ref={changeRomRef}
                                type="file"
                                accept={ROM_EXTENSIONS[game.system]}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </div>
                    )}

                    {/* Emulador ou DropZone */}
                    <div
                        data-shape-mask
                        className="overflow-hidden rounded-2xl border border-white/10 bg-black/20 shadow-2xl backdrop-blur-sm"
                    >
                        {isReady ? (

                            <EmulatorPlayer
                                romUrl={activeRomUrl!}
                                system={game.system}
                                gameTitle={localRomName ?? game.title}
                                locale={locale}
                            />

                        ) : (
                            <RomDropZone
                                system={game.system}
                                locale={locale}
                                onFileSelect={handleFileSelect}
                            />
                        )}
                    </div>
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
                                className="min-h-[90px] w-full rounded-lg border border-white/10 bg-black/25 p-3 text-sm text-white/30 outline-none"
                                placeholder={t.loginToChat}
                                disabled
                            />
                            <Link
                                href="/auth/signin"
                                className="block w-full rounded-lg bg-emerald-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-emerald-500"
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