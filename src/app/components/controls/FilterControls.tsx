import React from 'react';

export type FilterType = 'all' | 'pending' | 'completed';

interface FilterControlsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({ currentFilter, onFilterChange }) => {
  const filters: FilterType[] = ['all', 'pending', 'completed'];

  return (
    <div className="filter-controls-container">
      {filters.map(filter => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`filter-button ${currentFilter === filter ? 'active' : ''}`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  );
};

export default FilterControls;