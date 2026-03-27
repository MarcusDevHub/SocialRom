'use client';

import AuthHeader from '@/components/auth-header';
import { mockGames } from '@/lib/games';
import Link from 'next/link';
import { useLocale } from '@/context/locale-context';

export default function Home() {
  const { locale } = useLocale();

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
          <h1 className="text-5xl font-bold text-[--color-accent-yellow] drop-shadow-[0_0_14px_rgba(249,230,92,0.95)]">
            {t.title}
          </h1>
          <p className="mt-3 text-sm text-[--color-text-secondary]">
            {t.subtitle}
          </p>
        </div>

        {/* Cards com estilo expandível arcade */}
        <div className="game-cards-container">
          {mockGames.map((game) => (
            <article key={game.id} className="game-card">
              <img
                src={game.thumbnail}
                alt={game.title}
              />

              <div className="game-card-content">
                <h2 className="game-card-title">{game.title}</h2>
                <p className="game-card-system">{game.system}</p>
                <p className="game-card-status">
                  {String(game.playersOnline).padStart(2, '0')} {t.playingNow.toUpperCase()}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Botão de play (opcional, fora dos cards) */}
        <div className="mt-8 text-center">
          <p className="text-xs text-[--color-text-secondary] uppercase tracking-widest">
            ✦ HOVER NOS CARDS PARA EXPANDIR ✦
          </p>
        </div>
      </div>
    </main>
  );
}