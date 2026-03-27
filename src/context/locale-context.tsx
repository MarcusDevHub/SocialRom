'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Locale = 'pt' | 'en';

type LocaleContextValue = {
    locale: Locale;
    setLocale: (locale: Locale) => void;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<Locale>('en');

    useEffect(() => {
        // 1) tenta pegar do localStorage
        const stored = typeof window !== 'undefined'
            ? window.localStorage.getItem('socialrom-locale')
            : null;

        if (stored === 'pt' || stored === 'en') {
            setLocaleState(stored);
            return;
        }

        // 2) se não tiver salvo, detecta idioma do navegador
        if (typeof window !== 'undefined') {
            const navLang = navigator.language || navigator.languages?.[0] || 'en';
            const normalized = navLang.toLowerCase();

            if (normalized.startsWith('pt')) {
                setLocaleState('pt');
            } else {
                // se não for pt, nem en explícito, default = en
                setLocaleState('en');
            }
        }
    }, []);

    function setLocale(next: Locale) {
        setLocaleState(next);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('socialrom-locale', next);
        }
    }

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const ctx = useContext(LocaleContext);
    if (!ctx) {
        throw new Error('useLocale must be used within LocaleProvider');
    }
    return ctx;
}