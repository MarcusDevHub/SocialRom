// Define o formato de um jogo dentro do SocialRom
export interface Game {
    id: string;
    title: string;
    system: 'SNES' | 'GBA' | 'NES' | 'PS1';
    romUrl: string;
    thumbnail: string;
    playersOnline: number;
}

// Lista inicial de jogos fictícios para a home e página de jogo
export const mockGames: Game[] = [
    {
        id: 'castle-Aria',
        title: 'Castlevania Aria of Sorrow',
        system: 'GBA',
        romUrl: '/roms/Castlevania - Aria of Sorrow (Europe) (En,Fr,De).gba',
        thumbnail: '/thumbs/castle-aria.jpg',
        playersOnline: 0,
    },
    {
        id: 'pokemon-emerald',
        title: 'Pokémon Emerald',
        system: 'GBA',
        romUrl: '/roms/Pokemon - Emerald Version (USA, Europe).gba',
        thumbnail: '/thumbs/poke.jpg',
        playersOnline: 0,
    },
    {
        id: 'pokemon-unbound',
        title: 'Pokémon Unbound',
        system: 'GBA',
        romUrl: '/roms/Pokemon Unbound (v2.1.1.1).gba',
        thumbnail: '/thumbs/pokeunbound.jpg',
        playersOnline: 0,
    },
    {
        id: 'earthbound',
        title: 'Earthbound',
        system: 'SNES',
        romUrl: '/roms/EarthBound (USA).sfc',
        thumbnail: '/thumbs/earthbound.jpg',
        playersOnline: 0,
    },
    {
        id: 'zelda-lttp',
        title: 'The Legend of Zelda: A Link to the Past. Artwork by: By Kilian Eng',
        system: 'SNES',
        romUrl: '/roms/Legend of Zelda, The - A Link to the Past (Canada).sfc',
        thumbnail: '/thumbs/zelda.jpg',
        playersOnline: 0,
    },
    {
        id: 'megaman-x',
        title: 'Mega Man X',
        system: 'SNES',
        romUrl: '/roms/Mega Man X (Europe).sfc',
        thumbnail: '/thumbs/megaman.jpg',
        playersOnline: 0,
    },
    {
        id: 'final-Fantasy-VI',
        title: 'Final Fantasy VI',
        system: 'SNES',
        romUrl: '/roms/FFVI.sfc',
        thumbnail: '/thumbs/ffvi.jpg',
        playersOnline: 0,
    },
    {
        id: 'super-Castlevania-IV',
        title: 'Super Castlevania IV',
        system: 'SNES',
        romUrl: '/roms/Super Castlevania IV (Europe).sfc',
        thumbnail: '/thumbs/super_castlevania_iv.jpg',
        playersOnline: 0,
    },
    {
        id: 'castlevania-sotn',
        title: 'Castlevania Symphony of the Night',
        system: 'PS1',
        romUrl: '/roms/ps1/Castlevania - Symphony of the Night (USA).chd',
        thumbnail: '/thumbs/castlevania-sotn.jpg',
        playersOnline: 0,
    },
    {
        id: 'Jackie-Chan-Stuntmaster',
        title: 'Jackie Chan Stuntmaster',
        system: 'PS1',
        romUrl: '/roms/ps1/Jackie Chan Stuntmaster (Europe).chd',
        thumbnail: '/thumbs/jackie-chan-stuntmaster.jpg',
        playersOnline: 0,
    },


];
