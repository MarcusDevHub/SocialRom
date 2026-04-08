const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// ⭐ ADICIONE AQUI TODOS OS IDs DOS SEUS JOGOS
// Copie exatamente como estão no seu lib/games.ts
const ALL_GAME_IDS = [
    'pokemon-emerald',
    'zelda-lttp',
    'earthbound',
    'megaman-x',
    'castle-Aria',
    'pokemon-unbound',
    'final-Fantasy-VI',
    'super-Castlevania-IV',
    'castlevania-sotn',
    'jackie-Chan-Stuntmaster',
];

// Função auxiliar para contar usuários em uma room
function countInRoom(io, roomId) {
    return io.of('/').adapter.rooms.get(roomId)?.size || 0;
}

// Função para obter contagens de TODOS os jogos
function getAllGamesCounts(io) {
    const counts = {};
    for (const gameId of ALL_GAME_IDS) {
        counts[gameId] = countInRoom(io, gameId);
    }
    return counts;
}

app.prepare().then(() => {
    const httpServer = createServer((req, res) => {
        handle(req, res);
    });

    const io = new Server(httpServer, {
        cors: {
            origin: `http://${hostname}:${port}`,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // ⭐ NOVO: Cliente pede contagens de todos os jogos
        socket.on('get-all-games-counts', () => {
            const counts = getAllGamesCounts(io);
            socket.emit('games-counts-init', counts);
            console.log('Enviando contagens iniciais:', counts);
        });

        // Quando o cliente entra numa sala de jogo
        socket.on('join-room', (roomId) => {
            socket.join(roomId);

            const roomSize = countInRoom(io, roomId);

            // Envia para todos da sala o total atualizado
            io.to(roomId).emit('room-count', roomSize);

            // ⭐ NOVO: Notifica todos os clientes sobre a atualização
            io.emit('games-counts-update', {
                gameId: roomId,
                count: roomSize,
            });

            console.log(`${socket.id} entrou na sala ${roomId}. Total: ${roomSize}`);
        });

        // Quando o cliente sai manualmente de uma sala
        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);

            const roomSize = countInRoom(io, roomId);
            io.to(roomId).emit('room-count', roomSize);

            // ⭐ NOVO: Notifica sobre a atualização
            io.emit('games-counts-update', {
                gameId: roomId,
                count: roomSize,
            });

            console.log(`${socket.id} saiu da sala ${roomId}. Total: ${roomSize}`);
        });

        // Quando a conexão cai
        socket.on('disconnecting', () => {
            for (const roomId of socket.rooms) {
                if (roomId !== socket.id) {
                    setTimeout(() => {
                        const roomSize = countInRoom(io, roomId);
                        io.to(roomId).emit('room-count', roomSize);

                        // ⭐ NOVO: Notifica sobre a atualização
                        io.emit('games-counts-update', {
                            gameId: roomId,
                            count: roomSize,
                        });

                        console.log(`Sala ${roomId} após disconnect: ${roomSize}`);
                    }, 0);
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('Cliente desconectado:', socket.id);
        });

        // Mensagens de chat por sala
        socket.on('chat-message', ({ roomId, username, content }) => {
            if (!roomId || !content) return;

            const payload = {
                id: Date.now(),
                username,
                content,
                createdAt: new Date().toISOString(),
            };

            io.to(roomId).emit('chat-message', payload);
            console.log(`Mensagem em ${roomId} de ${username}: ${content}`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});