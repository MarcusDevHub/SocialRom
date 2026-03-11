'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import type { Game } from '@/lib/games';

type GameRoomClientProps = {
    game: Game;
};

export default function GameRoomClient({ game }: GameRoomClientProps) {
    const { data: session, status } = useSession();

    // Mensagens fake por enquanto, só para a interface.
    const mockMessages = [
        { id: 1, username: 'retrofan', content: 'Esse jogo é clássico demais.' },
        { id: 2, username: 'gba_player', content: 'Curti muito essa ideia do SocialRom.' },
        { id: 3, username: 'speedrunner', content: 'Quero ver esse contador ao vivo funcionando.' },
    ];

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

                        <div className="flex h-[420px] items-center justify-center rounded-lg border border-gray-700 bg-gray-950">
                            <div className="text-center">
                                <p className="text-lg font-semibold">Área do emulador</p>
                                <p className="mt-2 text-sm text-gray-400">
                                    Aqui vamos conectar o emulador do jogo.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-800 px-4 py-3">
                            <div>
                                <p className="text-sm text-gray-400">Jogadores agora</p>
                                <p className="text-xl font-bold text-green-400">
                                    {game.playersOnline}
                                </p>
                            </div>

                            <button className="rounded-full bg-blue-600 px-5 py-2 font-semibold hover:bg-blue-700">
                                Iniciar jogo
                            </button>
                        </div>
                    </section>

                    <aside className="flex h-[620px] flex-col rounded-xl bg-gray-900 p-4 shadow-xl">
                        <div className="border-b border-gray-800 pb-4">
                            <h2 className="text-xl font-bold">Chat da sala</h2>
                            <p className="mt-1 text-sm text-gray-400">
                                Converse com quem está jogando este título agora.
                            </p>
                        </div>

                        <div className="mt-4 rounded-lg bg-gray-800 px-4 py-3">
                            <p className="text-sm text-gray-400">Pessoas nesta sala</p>
                            <p className="text-2xl font-bold text-green-400">
                                {game.playersOnline}
                            </p>
                        </div>

                        <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-lg bg-gray-950 p-3">
                            {mockMessages.map((message) => (
                                <div key={message.id} className="rounded-lg bg-gray-800 p-3">
                                    <p className="text-sm font-semibold text-blue-400">
                                        @{message.username}
                                    </p>
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
                            <form className="mt-4 space-y-3">
                                <textarea
                                    className="min-h-[90px] w-full rounded-lg border border-gray-700 bg-gray-800 p-3 text-sm outline-none focus:border-blue-500"
                                    placeholder={`Comentar como @${session.user.name}...`}
                                />
                                <button
                                    type="button"
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
