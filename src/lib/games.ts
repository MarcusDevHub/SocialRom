// Define o formato de um jogo dentro do SocialRom
export interface Game {
    id: string;                    // usado na URL (/game/id)
    title: string;                 // nome do jogo
    system: 'SNES' | 'GBA' | 'NES';// console do jogo
    romUrl: string;                // caminho da ROM (depois ligamos no emulador)
    thumbnail: string;             // imagem de capa do jogo
    playersOnline: number;         // contador de jogadores (por enquanto mock)
    description: string;           // descrição curta para a página do jogo
}

// Lista inicial de jogos fictícios para a home e página de jogo
export const mockGames: Game[] = [
    {
        id: 'super-mario-world',
        title: 'Super Mario World',
        system: 'SNES',
        romUrl: '/roms/smario.sfc',
        thumbnail: '/thumbs/smario.jpg',
        playersOnline: 0,
        description: 'Plataforma clássico do SNES com Mario e Yoshi.',
    },
    {
        id: 'pokemon-emerald',
        title: 'Pokémon Emerald',
        system: 'GBA',
        romUrl: '/roms/Pokemon - Emerald Version (USA, Europe).gba',
        thumbnail: '/thumbs/poke.jpg',
        playersOnline: 0,
        description: 'RPG clássico de Pokémon no Game Boy Advance.',
    },
    {
        id: 'zelda-lttp',
        title: 'The Legend of Zelda: A Link to the Past',
        system: 'SNES',
        romUrl: '/roms/zelda.sfc',
        thumbnail: '/thumbs/zelda.jpg',
        playersOnline: 0,
        description: 'Aventura clássica de Link no universo de Hyrule.',
    },
];
