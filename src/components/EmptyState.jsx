import { SearchX } from 'lucide-react';

function EmptyState({ onClear }) {
  return (
    <section className="rounded-md border border-dashed border-ink-300 bg-white p-10 text-center dark:border-ink-700 dark:bg-ink-900">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-md bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-200">
        <SearchX size={22} />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-ink-950 dark:text-white">No cheatsheets found</h2>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-600 dark:text-ink-300">
        Try a broader keyword or reset the category filter.
      </p>
      <button
        className="mt-5 rounded-md bg-sap-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sap-800 dark:bg-sap-500 dark:hover:bg-sap-400"
        onClick={onClear}
        type="button"
      >
        Reset filters
      </button>
    </section>
  );
}

export default EmptyState;
