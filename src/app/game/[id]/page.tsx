import { notFound } from 'next/navigation';
import { mockGames } from '@/lib/games';
import GameRoomClient from '@/components/game-room-client';
import ShapeWaveBackground from '@/components/shape-wave-background';

type GamePageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function GamePage({ params }: GamePageProps) {
    const { id } = await params;

    const game = mockGames.find((item) => item.id === id);

    if (!game) {
        notFound();
    }

    return (
        <div className="body-crt-game">
            <ShapeWaveBackground />
            <div className="shape-wave-vignette" aria-hidden="true" />

            <main className="main-crt game-page-root">
                <GameRoomClient game={game} />
            </main>
        </div>
    );
}