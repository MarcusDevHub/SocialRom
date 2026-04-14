// components/game-filters.tsx

'use client'

import { useLocale } from '@/context/locale-context'
import { FilterState, SortOption } from '@/hooks/use-game-filters'

interface GameFiltersProps {
  filters: FilterState
  uniqueSystems: string[]
  updateFilter: (key: keyof FilterState, value: string) => void
  resetFilters: () => void
  activeFilterCount: number
  resultCount: number
  toggleSortDirection: () => void
}

export function GameFilters({
  filters,
  uniqueSystems,
  updateFilter,
  resetFilters,
  activeFilterCount,
  resultCount,
  toggleSortDirection,
}: GameFiltersProps) {
  const { locale } = useLocale()

  const t = {
    pt: {
      search: 'Buscar jogo...',
      system: 'Sistema',
      allSystems: 'Todos os sistemas',
      sortBy: 'Ordenar por',
      name: 'Nome ',
      popularity: 'Popularidade',
      results: 'resultado(s)',
      clearFilters: 'Limpar filtros',
    },
    en: {
      search: 'Search game...',
      system: 'System',
      allSystems: 'All systems',
      sortBy: 'Sort by',
      name: 'Name ',
      popularity: 'Popularity',
      results: 'result(s)',
      clearFilters: 'Clear filters',
    },
  }[locale]

  const isFiltered = activeFilterCount > 0

  return (
    <section className="filters-section mb-6" data-shape-mask>
      <div className="filters-grid">
        {/* Barra de busca */}
        <div className="filters-search">
          <input
            type="text"
            placeholder={t.search}
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            className="crt-input search-input text-[16px]"
          />
        </div>

        {/* Filtro de sistema */}
        <div className="filters-select-group">
          <label className="filter-label">{t.system}</label>
          <select
            value={filters.system}
            onChange={e => updateFilter('system', e.target.value)}
            className="crt-select text-[16px]"
          >
            <option value="">{t.allSystems}</option>
            {uniqueSystems.map(sys => (
              <option key={sys} value={sys}>{sys}</option>
            ))}
          </select>
        </div>

        {/* Ordenação */}
        <div className="filters-select-group">
          <label className="filter-label text-[16px]">{t.sortBy}</label>
          <select
            value={filters.sortBy}
            onChange={e => updateFilter('sortBy', e.target.value as SortOption)}
            className="crt-select text-[16px]"
          >
            <option value="name">{t.name}</option>
            <option value="popularity">{t.popularity}</option>
          </select>
          <button
            type="button"
            className="crt-button"
            onClick={toggleSortDirection}
          >
            {filters.sortDirection === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>

        </div >


        {/* Resultados e botão limpar */}
        < div className="filters-footer" >
          <span className="results-count">
            {resultCount} {t.results}
          </span>
          <button onClick={resetFilters} className="crt-button clear-filters">
            {t.clearFilters}
          </button>
        </div >
      </div>

      <style jsx>{`
        .filters-section {
          border: 2px solid var(--color-border);
          border-radius: 8px;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
        }

        .filters-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0.75rem;
        }

        @media (min-width: 640px) {
          .filters-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        .filters-search input {
          width: 100%;
          padding: 0.5rem 0.75rem;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-text-primary);
          font-family: inherit;
          font-size: 21px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .filters-search input:focus {
          outline: none;
          border-color: var(--color-accent-yellow);
          box-shadow: 0 0 0 3px rgba(249, 230, 92, 0.2);
        }

        .filters-select-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .filter-label {
          font-size: 16px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-text-secondary);
        }

        .crt-select {
          padding: 0.5rem;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-text-primary);
          font-family: inherit;
          font-size: 16px;
          cursor: pointer;
        }

        .crt-select:focus {
          outline: none;
          border-color: var(--color-accent-yellow);
          box-shadow: 0 0 0 3px rgba(249, 230, 92, 0.2);
        }

        .crt-select option {
          background: #0a0a0a;
          color: var(--color-text-primary);
        }

        .filters-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1rem;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border);
        }

        .results-count {
          font-size: 16px;
          color: var(--color-text-secondary);
        }

        .clear-filters {
          padding: 0.35rem 0.75rem;
          background: transparent;
          border: 1px solid var(--color-border);
          border-radius: 4px;
          color: var(--color-text-secondary);
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-filters:hover {
          border-color: var(--color-accent-red);
          color: var(--color-accent-red);
          background: rgba(255, 82, 82, 0.1);
        }
      `}</style>
    </section>
  )
}