'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import AuthHeader from '@/components/auth-header';
import ShapeWaveBackground from '@/components/shape-wave-background';
import { mockGames } from '@/lib/games';
import { useGamesRoomCounts } from '@/hooks/use-games-room-counts';
import { useLocale } from '@/context/locale-context';

export default function Home() {
  const { locale } = useLocale();
  const { playersByGame } = useGamesRoomCounts();

  const t = {
    pt: {
      title: 'SocialRom',
      subtitle: 'Jogue e converse com outros jogadores em tempo real',
      playingNow: 'jogando agora',
    },
    en: {
      title: 'SocialRom',
      subtitle: 'Play and chat with other players in real time',
      playingNow: 'playing now',
    },
  }[locale];

  const gameRows = mockGames.reduce<typeof mockGames[]>((rows, game, index) => {
    const rowIndex = Math.floor(index / 4);

    if (!rows[rowIndex]) {
      rows[rowIndex] = [];
    }

    rows[rowIndex].push(game);
    return rows;
  }, []);

  const subtitles = [
    'Jogue e converse com outros jogadores em tempo real',
    'Play and chat with other players in real time',
    'papito'
  ];

  const newSubtitles = subtitles[Math.floor(Math.random() * subtitles.length)];

  useEffect(() => {
    const element = document.getElementsByClassName("flicker-subtitle")[0] as HTMLElement;
    if (element) {
      element.innerText = newSubtitles;
    }
  }, [newSubtitles]);



  return (
    <div className="body-crt home-scroll">
      <ShapeWaveBackground />
      <div className="shape-wave-vignette" aria-hidden="true" />

      <main className="main-crt px-4 py-8 md:px-8">
        <div className="crt-frame">
          <div data-shape-mask>
            <AuthHeader />
          </div>

          <section className="mb-10 text-center" data-shape-mask>
            <h1 className="mb-3 text-px64 text-[var(--color-accent-yellow)] drop-shadow-[0_0_18px_rgba(249,230,92,0.55)] md:text-px80">
              {t.title}
            </h1>

            <p className="flicker-subtitle mx-auto max-w-2xl text-px16 text-[var(--color-text-secondary)]">
              {t.subtitle}
            </p>
          </section>

          <section className="game-cards-stack">
            {gameRows.map((row, rowIndex) => (
              <div key={rowIndex} className="game-cards-container" data-shape-mask>
                {row.map((game) => (
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
                        {String(playersByGame[game.id] ?? 0).padStart(2, '0')}{' '}
                        {t.playingNow.toUpperCase()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}