'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type UseRoomSocketResult = {
    socket: Socket | null;
    roomCount: number;
    isConnected: boolean;
    sendMessage: (data: { roomId: string; username: string; content: string }) => void;
};

export function useRoomSocket(roomId: string): UseRoomSocketResult {
    const socketRef = useRef<Socket | null>(null);
    const [roomCount, setRoomCount] = useState(0);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Cria a conexão com o servidor socket
        const socket = io({
            path: '/socket.io',
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);

            // Assim que conectar, entra na room do jogo
            socket.emit('join-room', roomId);
        });

        socket.on('room-count', (count: number) => {
            setRoomCount(count);
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        // Ao desmontar a página, avisa que saiu da sala
        return () => {
            socket.emit('leave-room', roomId);
            socket.disconnect();
        };
    }, [roomId]);

    function sendMessage(data: { roomId: string; username: string; content: string }) {
        if (!socketRef.current) return;
        if (!data.content.trim()) return;

        socketRef.current.emit('chat-message', data);
    }

    return {
        socket: socketRef.current,
        roomCount,
        isConnected,
        sendMessage,
    };
}
