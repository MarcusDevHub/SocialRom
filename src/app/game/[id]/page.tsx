import { notFound } from 'next/navigation';
import { mockGames } from '@/lib/games';

// Define o tipo esperado para os parâmetros da rota.
// Como a pasta se chama [id], o Next envia params.id.
type GamePageProps = {
    params: {
        id: string;
    };
};

export default function GamePage({ params }: GamePageProps) {
    // Procura no array de jogos um item com id igual ao da URL.
    const game = mockGames.find((item) => item.id === params.id);

    // Se não encontrar o jogo, mostramos a página 404 do Next.js.
    if (!game) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-black p-8 text-white">
            <div className="mx-auto max-w-5xl">
                <a
                    href="/"
                    className="mb-6 inline-block text-sm text-blue-400 hover:underline"
                >
                    ← Voltar para a home
                </a>

                <div className="rounded-xl bg-gray-900 p-8 shadow-xl">
                    <h1 className="text-4xl font-bold">{game.title}</h1>

                    <p className="mt-2 text-sm text-gray-400">
                        Sistema: {game.system}
                    </p>

                    <p className="mt-4 text-gray-300">{game.description}</p>

                    <div className="mt-8 flex h-[420px] items-center justify-center rounded-lg border border-gray-700 bg-gray-950">
                        <div className="text-center">
                            <p className="text-xl font-semibold">Área do emulador</p>
                            <p className="mt-2 text-sm text-gray-400">
                                Aqui vamos renderizar o jogo depois.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-lg bg-gray-800 p-4">
                        <p className="text-sm text-gray-400">Jogadores online agora</p>
                        <p className="mt-1 text-2xl font-bold text-green-400">
                            {game.playersOnline}
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
