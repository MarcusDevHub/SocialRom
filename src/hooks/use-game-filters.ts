// hooks/use-game-filters.ts

'use client'

import { useMemo, useState } from 'react'
import { Game } from '@/lib/games'

export type SortOption = 'name' | 'popularity'
export type SortDirection = 'asc' | 'desc';

export interface FilterState {
    search: string
    system: string
    sortBy: SortOption
    sortDirection: SortDirection
}

const DEFAULT_FILTERS: FilterState = {
    search: '',
    system: '',
    sortBy: 'popularity',
    sortDirection: 'desc'

}


export function useGameFilters(games: Game[]) {
    const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

    const uniqueSystems = useMemo(() => {
        const systems = new Set(games.map(g => g.system))
        return Array.from(systems).sort()
    }, [games])

    const filteredGames = useMemo(() => {
        let result = [...games]

        // Filtro de busca
        if (filters.search.trim()) {
            const searchLower = filters.search.toLowerCase()
            result = result.filter(g =>
                g.title.toLowerCase().includes(searchLower)
            )
        }

        // Filtro por sistema
        if (filters.system) {
            result = result.filter(g => g.system === filters.system)
        }

        // Ordenação
        result.sort((a, b) => {
            let comparison = 0

            switch (filters.sortBy) {
                case 'name':
                    comparison = a.title.localeCompare(b.title)
                    break

                case 'popularity':
                    comparison = a.playersOnline - b.playersOnline
                    break
            }

            return filters.sortDirection === 'asc' ? comparison : -comparison
        })



        return result
    }, [games, filters])

    const resetFilters = () => setFilters(DEFAULT_FILTERS)

    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    const toggleSortDirection = () => {
        setFilters((prev) => ({
            ...prev,
            sortDirection: prev.sortDirection === 'asc' ? 'desc' : 'asc',
        }))
    }

    const activeFilterCount = useMemo(() => {
        let count = 0
        if (filters.search.trim()) count++
        if (filters.system) count++
        if (filters.sortBy !== DEFAULT_FILTERS.sortBy) count++
        if (filters.sortDirection !== DEFAULT_FILTERS.sortDirection) count++
        return count
    }, [filters])


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