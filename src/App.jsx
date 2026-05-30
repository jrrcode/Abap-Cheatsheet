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
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [favorites, toggleFavorite, setFavorites] = useFavorites();

  const tags = useMemo(() => getAllTags(cheatsheets), []);
  const validFavoriteCount = useMemo(
    () => favorites.filter((id) => cheatsheets.some((sheet) => sheet.id === id)).length,
    [favorites],
  );

  const visibleCheatsheets = useMemo(
    () =>
      filterCheatsheets(cheatsheets, {
        query,
        category: 'All',
        tags: [],
        favoritesOnly: activeView === 'favorites',
        favorites,
      }),
    [query, activeView, favorites],
  );

  const currentPage = pageMeta[activeView] ?? pageMeta.overview;
  const showingOverviewHome = activeView === 'overview' && query.trim() === '';
  const showSearch = activeView === 'overview' || activeView === 'favorites';

  const handleViewChange = (view) => {
    setActiveView(view);
    setMobileNavOpen(false);
  };

  const clearFilters = () => {
    setQuery('');
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
                        onToggleTag={() => {}}
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
