const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// Inicializa o app Next
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    // Criamos um servidor HTTP normal
    const httpServer = createServer((req, res) => {
        handle(req, res);
    });

    // Plugamos o Socket.IO nesse mesmo servidor HTTP
    const io = new Server(httpServer, {
        cors: {
            origin: `http://${hostname}:${port}`,
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        console.log('Cliente conectado:', socket.id);

        // Quando o cliente entra numa sala de jogo
        socket.on('join-room', (roomId) => {
            socket.join(roomId);

            // Conta quantas conexões existem nessa room
            const roomSize = io.of('/').adapter.rooms.get(roomId)?.size || 0;

            // Envia para todos da sala o total atualizado
            io.to(roomId).emit('room-count', roomSize);

            console.log(`${socket.id} entrou na sala ${roomId}. Total: ${roomSize}`);
        });

        // Quando o cliente sai manualmente de uma sala
        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);

            const roomSize = io.of('/').adapter.rooms.get(roomId)?.size || 0;
            io.to(roomId).emit('room-count', roomSize);

            console.log(`${socket.id} saiu da sala ${roomId}. Total: ${roomSize}`);
        });

        // Quando a conexão cai, o Socket.IO remove o socket das rooms.
        // Esperamos o próximo tick para contar a room atualizada.
        socket.on('disconnecting', () => {
            for (const roomId of socket.rooms) {
                if (roomId !== socket.id) {
                    setTimeout(() => {
                        const roomSize = io.of('/').adapter.rooms.get(roomId)?.size || 0;
                        io.to(roomId).emit('room-count', roomSize);
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

            // Envia a mensagem para todo mundo na sala desse jogo
            io.to(roomId).emit('chat-message', payload);
            console.log(`Mensagem em ${roomId} de ${username}: ${content}`);
        });
    });

    httpServer.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
