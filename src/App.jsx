import { useMemo, useState } from 'react';
import {
  ArchiveRestore,
  BookOpen,
  Github,
  Lightbulb,
  Menu,
  Moon,
  Star,
  Sun,
  X,
} from 'lucide-react';
import { cheatsheets } from './data/cheatsheets';
import { useDarkMode } from './hooks/useDarkMode';
import { useFavorites } from './hooks/useFavorites';
import { filterCheatsheets, getAllTags } from './utils/search';
import HeaderStat from './components/HeaderStat';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import CheatSheetCard from './components/CheatSheetCard';
import EmptyState from './components/EmptyState';
import AddTemplateGuide from './sections/AddTemplateGuide';
import TipsAndTricks from './sections/TipsAndTricks';
import BackupRestore from './sections/BackupRestore';

const views = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'tips', label: 'Tips & Tricks', icon: Lightbulb },
  { id: 'favorites', label: 'Favorites', icon: Star },
  { id: 'backup', label: 'Backup & Restore', icon: ArchiveRestore },
  { id: 'contribute', label: 'Add Template Guide', icon: Github },
];

const categoryOrder = [
  'All',
  'Basics',
  'Internal Tables',
  'Open SQL',
  'Joins',
  'Modularization',
  'Function Modules / RFC',
  'SAP Dictionary / DDIC',
  'Transport Tables',
  'ALV',
  'Modern ABAP',
  'OOP ABAP',
  'Debugging',
  'Performance',
  'Common Mistakes',
  'Practical Templates',
];

const pageMeta = {
  overview: {
    eyebrow: 'ABAP reference workspace',
    title: 'ABAP Cheatsheets',
  },
  tips: {
    eyebrow: 'Practical guidance',
    title: 'Tips & Tricks',
  },
  favorites: {
    eyebrow: 'Saved quick references',
    title: 'Favorites',
  },
  backup: {
    eyebrow: 'Local data tools',
    title: 'Backup & Restore',
  },
  contribute: {
    eyebrow: 'Content editing guide',
    title: 'Add Template Guide',
  },
};

function App() {
  const [activeView, setActiveView] = useState('overview');
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeTags, setActiveTags] = useState([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [favorites, toggleFavorite, setFavorites] = useFavorites();

  const tags = useMemo(() => getAllTags(cheatsheets), []);
  const categoryCounts = useMemo(
    () =>
      cheatsheets.reduce(
        (counts, sheet) => ({
          ...counts,
          [sheet.category]: (counts[sheet.category] ?? 0) + 1,
        }),
        { All: cheatsheets.length },
      ),
    [],
  );
  const categories = useMemo(() => {
    const available = new Set(['All', ...cheatsheets.map((sheet) => sheet.category)]);
    const ordered = categoryOrder.filter((category) => available.has(category));
    const remaining = [...available]
      .filter((category) => !categoryOrder.includes(category))
      .sort((a, b) => a.localeCompare(b));
    return [...ordered, ...remaining];
  }, []);
  const validFavoriteCount = useMemo(
    () => favorites.filter((id) => cheatsheets.some((sheet) => sheet.id === id)).length,
    [favorites],
  );

  const visibleCheatsheets = useMemo(
    () =>
      filterCheatsheets(cheatsheets, {
        query,
        category: activeCategory,
        tags: activeTags,
        favoritesOnly: activeView === 'favorites',
        favorites,
      }),
    [query, activeCategory, activeTags, activeView, favorites],
  );

  const currentPage = pageMeta[activeView] ?? pageMeta.overview;
  const showingOverviewHome =
    activeView === 'overview' && query.trim() === '' && activeCategory === 'All' && activeTags.length === 0;
  const showSearch = activeView === 'overview' || activeView === 'favorites';

  const handleViewChange = (view) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  const toggleTag = (tag) => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
  };

  const clearFilters = () => {
    setQuery('');
    setActiveCategory('All');
    setActiveTags([]);
  };

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 transition-colors dark:bg-ink-950 dark:text-ink-50">
      <div className="flex min-h-screen">
        <Sidebar activeView={activeView} views={views} onViewChange={handleViewChange} />

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close navigation overlay"
              className="absolute inset-0 bg-ink-950/60"
              onClick={() => setMobileNavOpen(false)}
              type="button"
            />
            <aside className="relative h-full w-[min(92vw,22rem)] overflow-y-auto bg-white p-4 pb-8 shadow-soft dark:bg-ink-900">
              <div className="sticky top-0 z-10 -mx-4 -mt-4 mb-4 flex items-center justify-between bg-white px-4 py-4 dark:bg-ink-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-sap-600 text-sm font-bold tracking-wide text-white">
                    SAP
                  </div>
                  <div>
                    <p className="text-sm font-semibold">ABAP Cheatsheets</p>
                    <p className="text-xs text-ink-500 dark:text-ink-300">Quick reference library</p>
                  </div>
                </div>
                <button
                  aria-label="Close navigation"
                  className="icon-button"
                  onClick={() => setMobileNavOpen(false)}
                  type="button"
                >
                  <X size={18} />
                </button>
              </div>
              <Sidebar mobile activeView={activeView} views={views} onViewChange={handleViewChange} />
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1">
          <header className="site-header sticky top-0 z-30 border-b border-ink-200/80 bg-white/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/95">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
              <div className="flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
                  <button
                    aria-label="Open navigation"
                    className="icon-button lg:hidden"
                    onClick={() => setMobileNavOpen(true)}
                    type="button"
                  >
                    <Menu size={20} />
                  </button>
                  <div className="min-w-0 flex-1">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-sap-700 dark:text-sap-300 sm:text-xs sm:tracking-[0.12em]">
                      {currentPage.eyebrow}
                    </p>
                    <h1 className="truncate text-lg font-semibold text-sap-900 dark:text-sap-100 sm:text-2xl">
                      {currentPage.title}
                    </h1>
                  </div>
                </div>
                <button
                  aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                  className="icon-button"
                  onClick={() => setDarkMode(!darkMode)}
                  type="button"
                  title={darkMode ? 'Light mode' : 'Dark mode'}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </button>
              </div>
              {showSearch ? <SearchBar query={query} onQueryChange={setQuery} /> : null}
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
            {showingOverviewHome ? (
              <section className="mb-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <HeaderStat label="Cheatsheet templates" value={cheatsheets.length} />
                <HeaderStat label="Categories" value={categories.length - 1} />
                <HeaderStat label="Tag filters" value={tags.length} />
                <HeaderStat label="Saved favorites" value={validFavoriteCount} />
              </section>
            ) : null}

            {activeView === 'contribute' ? <AddTemplateGuide /> : null}

            {activeView === 'tips' ? <TipsAndTricks /> : null}

            {activeView === 'backup' ? (
              <BackupRestore
                darkMode={darkMode}
                favorites={favorites}
                onRestoreFavorites={setFavorites}
                onRestoreTheme={setDarkMode}
              />
            ) : null}

            {activeView === 'overview' || activeView === 'favorites' ? (
              <section className="mb-5 rounded-md border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900 sm:p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-ink-950 dark:text-white">Topic Tabs</h2>
                    <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
                      Choose a category tab, then use tags or search to narrow further.
                    </p>
                  </div>
                  {activeCategory !== 'All' || activeTags.length > 0 || query ? (
                    <button
                      className="min-h-10 rounded-md border border-ink-200 px-3 py-2 text-xs font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
                      onClick={clearFilters}
                      type="button"
                    >
                      Reset
                    </button>
                  ) : null}
                </div>
                <div className="space-y-3">
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                    {categories.map((category) => (
                      <button
                        className={`min-h-11 rounded-md border px-3 py-2 text-left text-sm font-semibold transition ${
                          activeCategory === category
                            ? 'border-sap-500 bg-sap-50 text-sap-800 dark:border-sap-500 dark:bg-sap-900/45 dark:text-sap-100'
                            : 'border-ink-200 bg-white text-ink-700 hover:border-sap-300 hover:text-sap-800 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200 dark:hover:border-sap-700 dark:hover:text-sap-200'
                        }`}
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        type="button"
                      >
                        <span className="flex items-center justify-between gap-3">
                          <span>{category}</span>
                          <span className="rounded-md bg-ink-100 px-2 py-0.5 text-xs text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                            {categoryCounts[category] ?? 0}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                  {tags.length ? (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                        Tags
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => (
                          <button
                            className={`tag-chip ${activeTags.includes(tag) ? 'tag-chip-active' : ''}`}
                            key={tag}
                            onClick={() => toggleTag(tag)}
                            type="button"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              </section>
            ) : null}

            {activeView === 'overview' || activeView === 'favorites' ? (
              <>
                {!showingOverviewHome ? (
                  <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
                    <p className="text-sm text-ink-600 dark:text-ink-300">
                      Showing <span className="font-semibold text-ink-950 dark:text-white">{visibleCheatsheets.length}</span>{' '}
                      entries
                    </p>
                  </div>
                ) : null}

                {visibleCheatsheets.length ? (
                  <section className="grid items-start gap-4 md:grid-cols-2">
                    {visibleCheatsheets.map((sheet) => (
                      <CheatSheetCard
                        favorite={favorites.includes(sheet.id)}
                        key={sheet.id}
                        sheet={sheet}
                        onToggleFavorite={() => toggleFavorite(sheet.id)}
                        onToggleTag={toggleTag}
                      />
                    ))}
                  </section>
                ) : !showingOverviewHome ? (
                  <EmptyState onClear={clearFilters} />
                ) : null}
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
