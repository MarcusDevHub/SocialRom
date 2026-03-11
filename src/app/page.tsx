import AuthHeader from '@/components/auth-header';
import { mockGames } from '@/lib/games';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black p-8 text-white">
      <header className="flex justify-end mb-4">
        <a
          href="/auth/signin"
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-semibold"
        >
          Entrar / Criar conta
        </a>
      </header>
      <div className="mx-auto max-w-6xl">
        <AuthHeader />

        <h1 className="mb-8 text-center text-4xl font-bold">
          SocialROM - Jogue Nostalgia Online
        </h1>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mockGames.map((game) => (
            <div
              key={game.id}
              className="group cursor-pointer rounded-lg bg-gray-800 p-6 shadow-xl transition-all hover:shadow-2xl"
            >
              <img
                src={game.thumbnail}
                alt={game.title}
                className="mb-4 h-48 w-full rounded object-cover transition-transform group-hover:scale-105"
              />

              <h2 className="mb-2 text-2xl font-bold">{game.title}</h2>
              <p className="mb-4 text-sm text-gray-400">{game.system}</p>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-green-400">
                  {game.playersOnline} jogando agora
                </span>

                <Link
                  href={`/game/${game.id}`}
                  className="rounded-full bg-blue-600 px-6 py-2 font-semibold transition-colors hover:bg-blue-700"
                >
                  Jogar
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}


