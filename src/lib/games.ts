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
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/castle-aria.jpg',
        playersOnline: 0,
    },
    {
        id: 'pokemon-emerald',
        title: 'Pokémon Emerald',
        system: 'GBA',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/poke.jpg',
        playersOnline: 0,
    },
    {
        id: 'pokemon-unbound',
        title: 'Pokémon Unbound',
        system: 'GBA',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/pokeunbound.jpg',
        playersOnline: 0,
    },
    {
        id: 'pokemon-lazarus',
        title: 'Pokémon Lazarus',
        system: 'GBA',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/lazarus.jpg',
        playersOnline: 0,
    },
    {
        id: 'earthbound',
        title: 'Earthbound',
        system: 'SNES',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/earthbound.jpg',
        playersOnline: 0,
    },
    {
        id: 'zelda-lttp',
        title: 'The Legend of Zelda: A Link to the Past',
        system: 'SNES',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/zelda.jpg',
        playersOnline: 0,
    },
    {
        id: 'megaman-x',
        title: 'Mega Man X',
        system: 'SNES',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/megaman.jpg',
        playersOnline: 0,
    },
    {
        id: 'final-Fantasy-VI',
        title: 'Final Fantasy VI',
        system: 'SNES',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/ffvi.jpg',
        playersOnline: 0,
    },
    {
        id: 'super-Castlevania-IV',
        title: 'Castlevania IV',
        system: 'SNES',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/super_castlevania_iv.jpg',
        playersOnline: 0,
    },
    {
        id: 'castlevania-sotn',
        title: 'Castlevania Symphony of the Night',
        system: 'PS1',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/castlevania-sotn.jpg',
        playersOnline: 0,
    },
    {
        id: 'Jackie-Chan-Stuntmaster',
        title: 'Jackie Chan Stuntmaster',
        system: 'PS1',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/jackie-chan-stuntmaster.jpg',
        playersOnline: 0,
    },
    {
        id: 'Resident-Evil-3',
        title: 'Resident Evil 3 - Nemesis',
        system: 'PS1',
        romUrl: '',
        thumbnail: 'https://dn721800.ca.archive.org/0/items/socialrom-games/resident-evil-3-nemesis-1999_zmr6.jpg',
        playersOnline: 0,
    },
    {
        id: 'Resident-Evil-Director-Cut',
        title: 'Resident Evil - Director Cut',
        system: 'PS1',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/residentevil.jpg',
        playersOnline: 0,
    },
    {
        id: 'Bomberman-Fantasy-Race',
        title: 'Bomberman Fantasy Race',
        system: 'PS1',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/bomberman.jpg',
        playersOnline: 0,
    },
    {
        id: 'Yu-Gi-Oh-Forbidden-Memories',
        title: 'Yu-Gi-Oh! Forbidden Memories',
        system: 'PS1',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/yugioh.jpg',
        playersOnline: 0,
    },
    {
        id: 'Legend-of-Zelda-Ocarina-of-Time',
        title: 'The Legend of Zelda: Ocarina of Time',
        system: 'N64',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/zeldaman.jpg',
        playersOnline: 0,
    },
    {
        id: 'Paper-Mario',
        title: 'Paper Mario',
        system: 'N64',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/papelmario.jpg',
        playersOnline: 0,
    },
    {
        id: 'Pokemon-Stadium',
        title: 'Pokemon Stadium',
        system: 'N64',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/pokemon-stadium.jpg',
        playersOnline: 0,
    },
    {
        id: 'Pokemon-Stadium-2',
        title: 'Pokemon Stadium 2',
        system: 'N64',
        romUrl: '',
        thumbnail: 'https://ia903101.us.archive.org/33/items/socialrom-games/pokemon-stadium2.jpg',
        playersOnline: 0,
    },
    {
        id: 'Legend-of-Zelda-Majoras-Mask',
        title: 'The Legend of Zelda: Majora\'s Mask',
        system: 'N64',
        romUrl: '',
        thumbnail: 'https://archive.org/download/socialrom-games/zeldamajora.jpg',
        playersOnline: 0,
    },



];
