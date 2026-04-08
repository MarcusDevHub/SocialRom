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
      playingNow: 'jogando agora'
    },
    en: {
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
    'speedrunning my mental breakdown',
    'nobody: / me at 3am: *loads game*',
    'certified hood classic',
    'The real final boss was the loading screens',
    'just built different fr fr',
    'my sleep schedule is a war crime',
    '404: Skill not found',
    'killing it in single player since 2009',
    'Main character syndrome activated',
    'Wololo',
    '"Skill issue" – Sun Tzu, The Art of War',
    'I should have been the one to fill your dark soul with LIIIGHT!',
    'You just lost The Game',
    'heh, nothing personnel, kid',
    'I am thou, thou art I',
    'Pain.',
    'bro has a gamer chair and no friends. respect.',
    'the grind never stops (I literally cannot stop)',
    'day 1 patch victim',
    'patch notes jumpscare',
    'this boss has another phase???',
    'I parried that in my head',
    'cutscene diff',
    'the tutorial was the peak',
    'lore accurate ragequit',
    'enemy team paid actors',
    'skill issue',
    'touch grass',
    'cope + seethe',
    'desk slam any%',
    'report jungler',
    'top lane incident',
    'enemy team paid actors',
    'my aim is on vacation',
    'cutscene diff',
    'lore accurate ragequit',
    'patch notes jumpscare',
    'this wipe is personal',
    'queue again',
    'blame the healer',
    'he\'s one shot',
    'lag killed me',
    'NPC behavior',
    'bro is NOT him',
    'no thoughts, only respawn',
    'ranked ruined my personality',
    'mental stack collapsed',
    'parried it in my head',
    'the grind consumed me',
    'respawn and deny everything',
    'another easy uninstall angle',
    'just one more run',
    'my build came to me in a dream',
    'gamer posture, goblin hours',
    '404: skill not found',
    'the tutorial was the peak',
    'Wololo',
    'Ramirez, do everything!',
    'What a save!',
    'speedrunning my breakdown',
    'my sleep schedule is a side quest',
    'the real boss was the camera',
    'farming simulator but it\'s ranked',
    'I can fix my aim tomorrow',
    'main character syndrome activated',
    'certified respawn moment',
    'bro really whiffed that',
    'we are so back',
    'we are so cooked',
    'loading screen final boss',
    'mission failed successfully',
    'pain.',
    'queued up, immediately regretted it',
    'all aim, no brain',
    'one more match, surely',
    'this boss has another phase???'
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
              SocialRom
            </h1>

            <p className="flicker-subtitle mx-auto max-w-2xl text-px16 text-[var(--color-text-secondary)]">
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