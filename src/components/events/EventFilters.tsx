"use client";

interface Category {
  id: string;
  name: string;
}

interface FilterState {
  type: string;
  category: string;
}

interface EventFiltersProps {
  categories: Category[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function EventFilters({
  categories,
  filters,
  onFilterChange,
}: EventFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <div>
        <label htmlFor="filter-type" className="sr-only">Type</label>
        <select
          id="filter-type"
          aria-label="Type"
          value={filters.type}
          onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
        >
          <option value="">All types</option>
          <option value="event">Events</option>
          <option value="training">Trainings</option>
        </select>
      </div>

      <div>
        <label htmlFor="filter-category" className="sr-only">Category</label>
        <select
          id="filter-category"
          aria-label="Category"
          value={filters.category}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
        >
          <option value="">All categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {(filters.type || filters.category) && (
        <button
          onClick={() => onFilterChange({ type: "", category: "" })}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
