'use client';

import AuthHeader from '@/components/auth-header';
import { mockGames } from '@/lib/games';
import { useGamesRoomCounts } from '@/hooks/use-games-room-counts';
import Link from 'next/link';
import { useLocale } from '@/context/locale-context';

export default function Home() {
  const { locale } = useLocale();
  const { playersByGame } = useGamesRoomCounts();

  const t = {
    pt: {
      title: 'SocialRom',
      subtitle: 'Jogue e converse com outros jogadores em tempo real',
      playingNow: 'jogando agora',
      play: 'Jogar',
    },
    en: {
      title: 'SocialRom',
      subtitle: 'Play and chat with other players in real time',
      playingNow: 'playing now',
      play: 'Play',
    },
  }[locale];

  return (
    <main className="min-h-screen px-4 py-10 text-[--color-text-primary]">
      <div className="crt-frame">
        <AuthHeader />

        {/* Título SocialRom com vibe neon */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-yellow-400 drop-shadow-[0_0_8px_rgba(255,255,150,0.8)]">
            {t.title}
          </h1>
          <p className="mt-3 text-sm text-gray-400 opacity-90">
            {t.subtitle}
          </p>
        </div>

        {/* Cards com estilo expandível TIPO CODEPEN */}
        <div className="game-cards-container">
          {mockGames.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="game-card"
            >
              <img
                src={game.thumbnail}
                alt={game.title}
                className="game-card-image"
              />

              <div className="game-card-content">
                <h2 className="game-card-title">{game.title}</h2>
                <p className="game-card-system">{game.system}</p>
                <p className="game-card-status">
                  {String(playersByGame[game.id] ?? 0)} {t.playingNow.toUpperCase()}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}