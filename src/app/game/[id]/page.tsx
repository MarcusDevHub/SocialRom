import { notFound } from 'next/navigation';
import { mockGames } from '@/lib/games';
import GameRoomClient from '@/components/game-room-client';


type GamePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function GamePage({ params }: GamePageProps) {
    // No Next.js atual, params é Promise.
    const { id } = await params;

    // Procuramos o jogo na lista mock.
    const game = mockGames.find((item) => item.id === id);

    // Se não encontrar, mostramos a página 404.
    if (!game) {
        notFound();
    }

    // Se encontrar, passamos o objeto inteiro para o componente client.
    return <GameRoomClient game={game} />;
}
