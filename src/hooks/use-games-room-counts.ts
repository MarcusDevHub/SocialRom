'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

type UseGamesRoomCountsResult = {
    playersByGame: Record<string, number>;
    isConnected: boolean;
};

export function useGamesRoomCounts(): UseGamesRoomCountsResult {
    const socketRef = useRef<Socket | null>(null);
    const [playersByGame, setPlayersByGame] = useState<Record<string, number>>({});
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Cria a conexão com o servidor socket
        const socket = io({
            path: '/socket.io',
        });

        socketRef.current = socket;

        socket.on('connect', () => {
            setIsConnected(true);
            // Pede as contagens de todos os jogos assim que conecta
            socket.emit('get-all-games-counts');
        });

        // Recebe o snapshot inicial de contagens
        socket.on('games-counts-init', (counts: Record<string, number>) => {
            setPlayersByGame(counts);
        });

        // Recebe atualizações em tempo real quando alguém entra/sai de uma sala
        socket.on('games-counts-update', (data: { gameId: string; count: number }) => {
            setPlayersByGame((prev) => ({
                ...prev,
                [data.gameId]: data.count,
            }));
        });

        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return {
        playersByGame,
        isConnected,
    };
}