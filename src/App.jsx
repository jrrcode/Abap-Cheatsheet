import { useMemo, useState } from 'react';
import {
  BookOpen,
  Github,
  Lightbulb,
  Menu,
  Moon,
  StickyNote,
  Star,
  Sun,
  X,
} from 'lucide-react';
import { cheatsheets } from './data/cheatsheets';
import { categories } from './data/categories';
import { snippets } from './data/snippets';
import { useDarkMode } from './hooks/useDarkMode';
import { useFavorites } from './hooks/useFavorites';
import { filterCheatsheets, getAllTags } from './utils/search';
import HeaderStat from './components/HeaderStat';
import Sidebar from './components/Sidebar';
import SearchBar from './components/SearchBar';
import FilterChips from './components/FilterChips';
import CheatSheetCard from './components/CheatSheetCard';
import EmptyState from './components/EmptyState';
import AddTemplateGuide from './sections/AddTemplateGuide';
import TipsAndTricks from './sections/TipsAndTricks';
import MySnippets from './sections/MySnippets';

const views = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'snippets', label: 'My Snippets', icon: StickyNote },
  { id: 'tips', label: 'Tips & Tricks', icon: Lightbulb },
  { id: 'favorites', label: 'Favorites', icon: Star },
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
  snippets: {
    eyebrow: 'Personal work notes',
    title: 'My Snippets',
  },
  favorites: {
    eyebrow: 'Saved quick references',
    title: 'Favorites',
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
  const [favorites, toggleFavorite] = useFavorites();

  const tags = useMemo(() => getAllTags(cheatsheets), []);

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
  const showingCategoryPage = activeView === 'overview' && activeCategory !== 'All';
  const showingOverviewHome = activeView === 'overview' && activeCategory === 'All';

  const handleViewChange = (view) => {
    setActiveView(view);
    if (view === 'overview') {
      setActiveCategory('All');
      setActiveTags([]);
    }
    setMobileNavOpen(false);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setActiveTags([]);
    setActiveView('overview');
    setMobileNavOpen(false);
  };

  const toggleTag = (tag) => {
    setActiveTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag],
    );
    setActiveView('overview');
  };

  const clearFilters = () => {
    setQuery('');
    setActiveCategory('All');
    setActiveTags([]);
  };

  return (
    <div className="min-h-screen bg-ink-50 text-ink-900 transition-colors dark:bg-ink-950 dark:text-ink-50">
      <div className="flex min-h-screen">
        <Sidebar
          activeView={activeView}
          activeCategory={activeCategory}
          categories={categories}
          views={views}
          onViewChange={handleViewChange}
          onCategoryChange={handleCategoryChange}
        />

        {mobileNavOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              aria-label="Close navigation overlay"
              className="absolute inset-0 bg-ink-950/60"
              onClick={() => setMobileNavOpen(false)}
              type="button"
            />
            <aside className="relative h-full w-[min(88vw,22rem)] overflow-y-auto bg-white p-4 shadow-soft dark:bg-ink-900">
              <div className="mb-4 flex items-center justify-between">
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
              <Sidebar
                activeView={activeView}
                activeCategory={activeCategory}
                categories={categories}
                mobile
                views={views}
                onViewChange={handleViewChange}
                onCategoryChange={handleCategoryChange}
              />
            </aside>
          </div>
        ) : null}

        <main className="min-w-0 flex-1">
          <header className="site-header sticky top-0 z-30 border-b border-ink-200/80 bg-white/90 backdrop-blur dark:border-ink-800 dark:bg-ink-950/95">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-3">
                <button
                  aria-label="Open navigation"
                  className="icon-button lg:hidden"
                  onClick={() => setMobileNavOpen(true)}
                  type="button"
                >
                  <Menu size={20} />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
                    {showingCategoryPage ? 'Category templates' : currentPage.eyebrow}
                  </p>
                  <h1 className="truncate text-xl font-semibold text-sap-900 dark:text-sap-100 sm:text-2xl">
                    {showingCategoryPage ? activeCategory : currentPage.title}
                  </h1>
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
              {activeView !== 'tips' ? <SearchBar query={query} onQueryChange={setQuery} /> : null}
            </div>
          </header>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {showingOverviewHome ? (
              <section className="mb-5 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <HeaderStat label="Sample templates" value={cheatsheets.length} />
                <HeaderStat label="Prepared categories" value={categories.length} />
                <HeaderStat label="Tag filters" value={tags.length} />
                <HeaderStat label="My snippets" value={snippets.length} />
              </section>
            ) : null}

            {activeView === 'contribute' ? <AddTemplateGuide /> : null}

            {activeView === 'tips' ? <TipsAndTricks /> : null}

            {activeView === 'snippets' ? <MySnippets query={query} onClearSearch={() => setQuery('')} /> : null}

            {showingOverviewHome ? (
              <>
                <FilterChips
                  activeCategory={activeCategory}
                  activeTags={activeTags}
                  categories={categories}
                  tags={tags}
                  onCategoryChange={setActiveCategory}
                  onClear={clearFilters}
                  onToggleTag={toggleTag}
                />
              </>
            ) : null}

            {activeView === 'overview' || activeView === 'favorites' ? (
              <>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm text-ink-600 dark:text-ink-300">
                    {activeCategory === 'All' ? 'Showing' : `Showing ${activeCategory}`}{' '}
                    <span className="font-semibold text-ink-950 dark:text-white">{visibleCheatsheets.length}</span>{' '}
                    templates
                  </p>
                </div>

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
                ) : (
                  <EmptyState onClear={clearFilters} />
                )}
              </>
            ) : null}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
