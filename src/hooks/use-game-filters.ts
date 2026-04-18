// hooks/use-game-filters.ts

'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Game } from '@/lib/games'

export type SortOption = 'name' | 'popularity'
export type SortDirection = 'asc' | 'desc'

export interface FilterState {
    search: string
    system: string
    sortBy: SortOption
    sortDirection: SortDirection
}

// Filtro padrão quando ninguém está online
const DEFAULT_FILTERS_EMPTY: FilterState = {
    search: '',
    system: '',
    sortBy: 'name',
    sortDirection: 'asc',
}

// Filtro padrão quando há jogadores online
const DEFAULT_FILTERS_ACTIVE: FilterState = {
    search: '',
    system: '',
    sortBy: 'popularity',
    sortDirection: 'desc',
}

export function useGameFilters(
    games: Game[],
    playersByGame: Record<string, number> = {}
) {
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS_EMPTY)

    // Rastreia se o usuário alterou o filtro manualmente
    const userHasChangedFilter = useRef(false)

    // Reage quando os dados do socket chegam pela primeira vez
    useEffect(() => {
        if (userHasChangedFilter.current) return

        const hasAnyPlayers = games.some((g) => (playersByGame[g.id] ?? 0) > 0)

        setFilters(hasAnyPlayers ? DEFAULT_FILTERS_ACTIVE : DEFAULT_FILTERS_EMPTY)
    }, [playersByGame, games])

    const uniqueSystems = useMemo(() => {
        const systems = new Set(games.map((g) => g.system))
        return Array.from(systems).sort()
    }, [games])

    const filteredGames = useMemo(() => {
        let result = [...games]

        // Filtro de busca
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase()
            result = result.filter((g) =>
                g.title.toLowerCase().includes(searchLower)
            )
        }

        // Filtro por sistema
        if (filters.system) {
            result = result.filter((g) => g.system === filters.system)
        }

        // Ordenação
        result.sort((a, b) => {
            let comparison = 0

            switch (filters.sortBy) {
                case 'name':
                    comparison = a.title.localeCompare(b.title)
                    break

                case 'popularity':
                    // Usa os dados em tempo real do socket, não o campo estático
                    const aPlayers = playersByGame[a.id] ?? 0
                    const bPlayers = playersByGame[b.id] ?? 0
                    comparison = aPlayers - bPlayers
                    break
            }

            return filters.sortDirection === 'asc' ? comparison : -comparison
        })

        return result
    }, [games, filters, playersByGame])

    const resetFilters = () => {
        userHasChangedFilter.current = false
        const hasAnyPlayers = games.some((g) => (playersByGame[g.id] ?? 0) > 0)
        setFilters(hasAnyPlayers ? DEFAULT_FILTERS_ACTIVE : DEFAULT_FILTERS_EMPTY)
    }

    const updateFilter = (key: keyof FilterState, value: string) => {
        userHasChangedFilter.current = true
        setFilters((prev) => ({ ...prev, [key]: value }))
    }

    const toggleSortDirection = () => {
        userHasChangedFilter.current = true
        setFilters((prev) => ({
            ...prev,
            sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc',
        }))
    }

    // Calcula o DEFAULT atual para comparar corretamente o activeFilterCount
    const currentDefault = useMemo(() => {
        const hasAnyPlayers = games.some((g) => (playersByGame[g.id] ?? 0) > 0)
        return hasAnyPlayers ? DEFAULT_FILTERS_ACTIVE : DEFAULT_FILTERS_EMPTY
    }, [games, playersByGame])

    const activeFilterCount = useMemo(() => {
        let count = 0
        if (filters.search.trim()) count++
        if (filters.system) count++
        if (filters.sortBy !== currentDefault.sortBy) count++
        if (filters.sortDirection !== currentDefault.sortDirection) count++
        return count
    }, [filters, currentDefault])

    return {
        filters,
        filteredGames,
        uniqueSystems,
        updateFilter,
        toggleSortDirection,
        resetFilters,
        activeFilterCount,
    }
}