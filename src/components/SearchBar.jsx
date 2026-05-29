import { Search, X } from 'lucide-react';

function SearchBar({ query, onQueryChange }) {
  return (
    <div className="relative min-w-0">
      <Search
        aria-hidden="true"
        className="search-icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
        size={18}
      />
      <input
        aria-label="Search cheatsheets"
        className="search-input h-12 w-full rounded-md border border-ink-200 bg-ink-50 pl-10 pr-11 text-base text-ink-950 outline-none transition placeholder:text-ink-400 focus:border-sap-500 focus:bg-white focus:ring-2 focus:ring-sap-200 dark:border-ink-700 dark:bg-ink-900 dark:text-white dark:placeholder:text-ink-500 dark:focus:border-sap-400 dark:focus:bg-ink-900 dark:focus:ring-sap-900 sm:text-sm"
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Search by keyword, category, tag, compatibility, or ABAP syntax..."
        type="search"
        value={query}
      />
      {query ? (
        <button
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-ink-500 hover:bg-ink-200 dark:text-ink-300 dark:hover:bg-ink-800"
          onClick={() => onQueryChange('')}
          type="button"
        >
          <X size={16} />
        </button>
      ) : null}
    </div>
  );
}

export default SearchBar;
