'use client';

import { useEffect, useRef } from 'react';

type EmulatorPlayerProps = {
    romUrl: string;
    system: 'SNES' | 'GBA' | 'NES';
};

// Mapeia o tipo do sistema para o core do EmulatorJS
const CORE_MAP: Record<EmulatorPlayerProps['system'], string> = {
    SNES: 'snes',
    GBA: 'gba',
    NES: 'nes',
};

export function EmulatorPlayer({ romUrl, system }: EmulatorPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Configurações que o EmulatorJS lê como variáveis globais
        (window as any).EJS_player = '#emulator-container';
        (window as any).EJS_core = CORE_MAP[system];
        (window as any).EJS_gameUrl = romUrl;
        (window as any).EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
        (window as any).EJS_startOnLoaded = true;

        // Injeta o script do EmulatorJS dinamicamente
        const script = document.createElement('script');
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
        script.async = true;
        containerRef.current.appendChild(script);

        return () => {
            // Limpa ao sair da sala
            script.remove();
            delete (window as any).EJS_player;
            delete (window as any).EJS_gameUrl;
        };
    }, [romUrl, system]);

    return (
        <div
            id="emulator-container"
            ref={containerRef}
            style={{ width: '100%', aspectRatio: '4/3' }}
        />
    );
}