import { ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import CodeBlock from '../components/CodeBlock';
import EmptyState from '../components/EmptyState';
import { snippets } from '../data/snippets';
import { filterCheatsheets } from '../utils/search';

function MySnippets({ onClearSearch, query }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedSnippets, setExpandedSnippets] = useState([]);

  const snippetCategories = useMemo(
    () => ['All', ...new Set(snippets.map((snippet) => snippet.category))],
    [],
  );

  const visibleSnippets = useMemo(
    () =>
      filterCheatsheets(snippets, {
        query,
        category: activeCategory,
        tags: [],
        favoritesOnly: false,
        favorites: [],
      }),
    [activeCategory, query],
  );

  const toggleSnippet = (id) => {
    setExpandedSnippets((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  const clearSnippetFilters = () => {
    setActiveCategory('All');
    onClearSearch();
  };

  return (
    <section>
      <div className="mb-5 rounded-md border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-ink-950 dark:text-white">Snippet Categories</h2>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
            Personal notes stay in local data and are filtered by the top search bar.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {snippetCategories.map((category) => (
            <button
              className={`tag-chip ${activeCategory === category ? 'tag-chip-active' : ''}`}
              key={category}
              onClick={() => setActiveCategory(category)}
              type="button"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {visibleSnippets.length ? (
        <div className="grid items-start gap-4 md:grid-cols-2">
          {visibleSnippets.map((snippet) => {
            const expanded = expandedSnippets.includes(snippet.id);

            return (
              <article
                className="self-start rounded-md border border-ink-200 bg-white shadow-sm transition hover:border-sap-200 hover:shadow-md dark:border-ink-800 dark:bg-ink-900 dark:hover:border-sap-800"
                key={snippet.id}
              >
                <button
                  aria-expanded={expanded}
                  className={`w-full p-5 text-left ${expanded ? 'border-b border-ink-200 dark:border-ink-800' : ''}`}
                  onClick={() => toggleSnippet(snippet.id)}
                  type="button"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
                        {snippet.category}
                      </p>
                      <h2 className="mt-2 text-lg font-semibold text-sap-900 dark:text-sap-100">{snippet.title}</h2>
                    </div>
                    <ChevronDown
                      className={`mt-1 shrink-0 text-ink-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                      size={18}
                    />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {snippet.tags.map((tag) => (
                      <span className="tag-chip" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </button>

                {expanded ? (
                  <div className="flex flex-col gap-4 p-5">
                    <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{snippet.explanation}</p>
                    <CodeBlock code={snippet.code} compatibility={snippet.tags.slice(0, 3)} />
                    <div>
                      <h3 className="text-sm font-semibold text-ink-950 dark:text-white">Notes</h3>
                      <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
                        {snippet.notes.map((note) => (
                          <li key={note}>- {note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState onClear={clearSnippetFilters} />
      )}
    </section>
  );
}

export default MySnippets;
