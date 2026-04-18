'use client';

import { useEffect, useRef } from 'react';

type EmulatorSystem = 'SNES' | 'GBA' | 'NES' | 'PS1' | 'N64';

type EmulatorPlayerProps = {
    romUrl: string;
    system: EmulatorSystem;
    gameTitle?: string;
};

const CORE_MAP: Record<EmulatorSystem, string> = {
    SNES: 'snes',
    GBA: 'gba',
    NES: 'nes',
    PS1: 'psx',
    N64: 'n64',
};

function getBiosUrl(system: EmulatorSystem) {
    if (system === 'PS1') {
        return '../../bios/scph5501.bin';
    }

    return undefined;
}

function getDefaultOptions(system: EmulatorSystem) {
    return {
        shader: 'crt-easymode.glslp',
        'save-state-location': 'browser',
    };
}


export function EmulatorPlayer({
    romUrl,
    system,
    gameTitle,
}: EmulatorPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const containerId = 'emulator-container';
        const biosUrl = getBiosUrl(system);

        containerRef.current.innerHTML = '';

        (window as any).EJS_player = `#${containerId}`;
        (window as any).EJS_core = CORE_MAP[system];
        (window as any).EJS_gameUrl = romUrl;
        (window as any).EJS_gameName = gameTitle || romUrl.split('/').pop() || 'game';
        (window as any).EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';
        (window as any).EJS_threads = false;
        (window as any).EJS_startOnLoaded = true;
        (window as any).EJS_volume = 0.7;
        (window as any).EJS_color = '#00FF80';
        (window as any).EJS_defaultOptions = getDefaultOptions(system);

        if (biosUrl) {
            (window as any).EJS_biosUrl = biosUrl;
        } else {
            delete (window as any).EJS_biosUrl;
        }

        const script = document.createElement('script');
        script.src = 'https://cdn.emulatorjs.org/stable/data/loader.js';
        script.async = true;
        containerRef.current.appendChild(script);

        const resizeFix = window.setInterval(() => {
            if (!containerRef.current) return;

            const iframe = containerRef.current.querySelector('iframe') as HTMLIFrameElement | null;
            const canvas = containerRef.current.querySelector('canvas') as HTMLCanvasElement | null;

            if (iframe) {
                iframe.style.width = '100%';
                iframe.style.maxWidth = '100%';
                iframe.style.height = '100%';
                iframe.style.display = 'block';
                iframe.style.border = '0';
            }

            if (canvas) {
                canvas.style.width = '100%';
                canvas.style.maxWidth = '100%';
                canvas.style.height = '100%';
                canvas.style.display = 'block';
            }
        }, 300);

        return () => {
            window.clearInterval(resizeFix);

            try {
                if ((window as any).EJS_emulator?.stop) {
                    (window as any).EJS_emulator.stop();
                }
            } catch { }

            document.querySelectorAll('audio').forEach((audio) => {
                audio.pause();
                audio.src = '';
            });

            script.remove();

            if (containerRef.current) {
                containerRef.current.innerHTML = '';
            }

            delete (window as any).EJS_player;
            delete (window as any).EJS_core;
            delete (window as any).EJS_gameUrl;
            delete (window as any).EJS_gameName;
            delete (window as any).EJS_pathtodata;
            delete (window as any).EJS_startOnLoaded;
            delete (window as any).EJS_volume;
            delete (window as any).EJS_color;
            delete (window as any).EJS_defaultOptions;
            delete (window as any).EJS_biosUrl;
            delete (window as any).EJS_threads;
            delete (window as any).EJS_emulator;
        };
    }, [romUrl, system, gameTitle]);

    return (
        <div className="flex w-full min-w-0 justify-center">
            <div className="relative w-full max-w-[1060px] min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                <div className="aspect-video w-full max-w-full overflow-hidden">
                    <div
                        id="emulator-container"
                        ref={containerRef}
                        className="h-full w-full max-w-full min-w-0 overflow-hidden [&>*]:max-w-full [&_canvas]:h-full [&_canvas]:w-full [&_iframe]:h-full [&_iframe]:w-full"
                    />
                </div>
            </div>
        </div>
    );
}