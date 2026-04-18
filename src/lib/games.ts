// Define o formato de um jogo dentro do SocialRom
export interface Game {
    id: string;
    title: string;
    system: 'SNES' | 'GBA' | 'NES' | 'PS1' | 'N64';
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
        id: 'pokemon-lazarus',
        title: 'Pokémon Lazarus',
        system: 'GBA',
        romUrl: '/roms/Pokemon Lazarus v2.0.gba',
        thumbnail: '/thumbs/lazarus.jpg',
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
        title: 'The Legend of Zelda: A Link to the Past',
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
        title: 'Castlevania IV',
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
    {
        id: 'Resident-Evil-3',
        title: 'Resident Evil 3 - Nemesis',
        system: 'PS1',
        romUrl: '/roms/ps1/Resident Evil 3 - Nemesis (Europe).chd',
        thumbnail: '/thumbs/resident-evil-3-nemesis-1999_zmr6.jpg',
        playersOnline: 0,
    },
    {
        id: 'Resident-Evil-Director-Cut',
        title: 'Resident Evil - Director Cut',
        system: 'PS1',
        romUrl: '/roms/ps1/Resident Evil - Director Cut(Europe).chd',
        thumbnail: '/thumbs/residentevil.jpg',
        playersOnline: 0,
    },
    {
        id: 'Bomberman-Fantasy-Race',
        title: 'Bomberman Fantasy Race',
        system: 'PS1',
        romUrl: '/roms/ps1/Bomberman Fantasy Race (Europe) (En,Fr,De,Es).chd',
        thumbnail: '/thumbs/bomberman.jpg',
        playersOnline: 0,
    },
    {
        id: 'Yu-Gi-Oh-Forbidden-Memories',
        title: 'Yu-Gi-Oh! Forbidden Memories',
        system: 'PS1',
        romUrl: '/roms/ps1/Yu-Gi-Oh! Forbidden Memories (Europe).chd',
        thumbnail: '/thumbs/yugioh.jpg',
        playersOnline: 0,
    },
    {
        id: 'Legend-of-Zelda-Ocarina-of-Time',
        title: 'The Legend of Zelda: Ocarina of Time',
        system: 'N64',
        romUrl: '/roms/n64/Legend of Zelda, The - Ocarina of Time (Europe) (Collectors Edition).z64',
        thumbnail: '/thumbs/zeldaman.jpg',
        playersOnline: 0,
    },
    {
        id: 'Paper-Mario',
        title: 'Paper Mario',
        system: 'N64',
        romUrl: '/roms/n64/Paper Mario (Europe) (En,Fr,De,Es).z64',
        thumbnail: '/thumbs/papelmario.jpg',
        playersOnline: 0,
    },
    {
        id: 'Pokemon-Stadium',
        title: 'Pokemon Stadium',
        system: 'N64',
        romUrl: '/roms/n64/Pokemon Stadium (Europe).z64',
        thumbnail: '/thumbs/pokemon-stadium.jpg',
        playersOnline: 0,
    },
    {
        id: 'Pokemon-Stadium-2',
        title: 'Pokemon Stadium 2',
        system: 'N64',
        romUrl: '/roms/n64/Pokemon Stadium 2 (Europe).z64',
        thumbnail: '/thumbs/pokemon-stadium2.jpg',
        playersOnline: 0,
    },
    {
        id: 'Legend-of-Zelda-Majoras-Mask',
        title: 'The Legend of Zelda: Majora\'s Mask',
        system: 'N64',
        romUrl: '/roms/n64/Legend of Zelda, The - Majoras Mask(axekin.com).z64',
        thumbnail: '/thumbs/zeldamajora.jpg',
        playersOnline: 0,
    },



];
