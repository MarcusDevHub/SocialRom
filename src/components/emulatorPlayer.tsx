'use client';

import { useEffect, useRef, useState } from 'react';

type EmulatorSystem = 'SNES' | 'GBA' | 'NES' | 'PS1' | 'N64';

type EmulatorPlayerProps = {
    romUrl: string;
    system: EmulatorSystem;
    gameTitle?: string;
    locale?: 'pt' | 'en';
};

const CORE_MAP: Record<EmulatorSystem, string> = {
    SNES: 'snes',
    GBA: 'gba',
    NES: 'nes',
    PS1: 'psx',
    N64: 'n64',
};


function getBiosUrl(system: EmulatorSystem) {
    if (system === 'PS1') return '../../bios/scph5501.bin';
    return undefined;
}

function getStableGameId(gameTitle?: string, romUrl?: string): string {
    const base = gameTitle || romUrl?.split('/').pop() || 'game';
    return base.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
}

async function resetEmulatorSettings(gameId: string) {
    try {
        const db = await new Promise<IDBDatabase>((resolve, reject) => {
            const req = indexedDB.open('EmulatorJS');
            req.onsuccess = () => resolve(req.result);
            req.onerror = reject;
        });
        if (!db.objectStoreNames.contains('settings')) { db.close(); return; }
        const tx = db.transaction('settings', 'readwrite');
        const store = tx.objectStore('settings');
        store.delete(`${gameId}_fast-forward-ratio`);
        store.delete(`${gameId}_rewind`);
        db.close();
    } catch { }
}

export function EmulatorPlayer({ romUrl, system, gameTitle, locale = 'pt' }: EmulatorPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [emulatorReady, setEmulatorReady] = useState(false);


    useEffect(() => {
        setEmulatorReady(false);
        if (!containerRef.current) return;

        let active = true;
        let resizeFix: ReturnType<typeof setInterval>;
        let readyCheck: ReturnType<typeof setInterval>;
        let script: HTMLScriptElement;


        async function init() {
            if (!containerRef.current || !active) return;

            if ((window as any).EJS_emulator) {
                try { (window as any).EJS_emulator.stop(); } catch { }
            }
            document.querySelectorAll('script[src*="loader.js"]').forEach(s => s.remove());

            const stableId = getStableGameId(gameTitle, romUrl);
            await resetEmulatorSettings(stableId);
            if (!active) return;

            containerRef.current.innerHTML = '';

            (window as any).EJS_player = '#emulator-container';
            (window as any).EJS_core = CORE_MAP[system];
            (window as any).EJS_gameUrl = romUrl;
            (window as any).EJS_gameName = stableId;
            (window as any).EJS_gameID = stableId;
            (window as any).EJS_pathtodata = 'https://cdn.emulatorjs.org/latest/data/';
            (window as any).EJS_threads = false;
            (window as any).EJS_startOnLoaded = true;
            (window as any).EJS_volume = 0.7;
            (window as any).EJS_color = '#00FF80';
            (window as any).EJS_saveStateLocation = 'browser';
            (window as any).EJS_defaultOptions = {
                shader: 'crt-easymode.glslp',
                'save-state-location': 'browser',
                'save-location': 'browser',
                'fast-forward-ratio': 1,
                'rewind': false,
            };
            (window as any).EJS_onGameStart = () => {
                try {
                    const emu = (window as any).EJS_emulator;
                    if (emu?.settings?.save) {
                        emu.settings.save('save-state-location', 'browser');
                    }
                } catch { }
            };

            const biosUrl = getBiosUrl(system);
            if (biosUrl) (window as any).EJS_biosUrl = biosUrl;
            else delete (window as any).EJS_biosUrl;

            script = document.createElement('script');
            script.src = 'https://cdn.emulatorjs.org/latest/data/loader.js';
            script.async = true;
            containerRef.current.appendChild(script);

            // Detecta quando o emulador terminou de carregar
            readyCheck = setInterval(() => {
                if (!active) { clearInterval(readyCheck); return; }
                if ((window as any).EJS_emulator?.gameManager) {
                    setEmulatorReady(true);
                    clearInterval(readyCheck);
                }
            }, 500);

            resizeFix = setInterval(() => {
                if (!active || !containerRef.current) return;
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




        }

        init();

        return () => {
            active = false;
            clearInterval(resizeFix);
            clearInterval(readyCheck);
            setEmulatorReady(false);

            try {
                if ((window as any).EJS_emulator?.stop) (window as any).EJS_emulator.stop();
            } catch { }

            document.querySelectorAll('audio').forEach(audio => {
                audio.pause();
                audio.src = '';
            });

            document.querySelectorAll('script[src*="loader.js"]').forEach(s => s.remove());
            script?.remove();

            if (containerRef.current) containerRef.current.innerHTML = '';

            delete (window as any).EJS_player;
            delete (window as any).EJS_core;
            delete (window as any).EJS_gameUrl;
            delete (window as any).EJS_gameName;
            delete (window as any).EJS_pathtodata;
            delete (window as any).EJS_startOnLoaded;
            delete (window as any).EJS_volume;
            delete (window as any).EJS_color;
            delete (window as any).EJS_gameID;
            delete (window as any).EJS_saveStateLocation;
            delete (window as any).EJS_defaultOptions;
            delete (window as any).EJS_onGameStart;
            delete (window as any).EJS_biosUrl;
            delete (window as any).EJS_threads;
            delete (window as any).EJS_emulator;
        };
    }, [romUrl, system, gameTitle]);


    return (
        <div className="flex w-full min-w-0 flex-col gap-2">
            <div className="relative w-full overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl">
                <div className="emulator-wrapper aspect-video w-full overflow-hidden">
                    <div
                        id="emulator-container"
                        ref={containerRef}
                        className="h-full w-full min-w-0 overflow-hidden [&>*]:max-w-full [&_canvas]:h-full [&_canvas]:w-full [&_iframe]:h-full [&_iframe]:w-full"
                    />
                </div>
            </div>
        </div>
    );
}