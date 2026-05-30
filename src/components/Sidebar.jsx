function Sidebar({
  activeCategory,
  activeView,
  categories,
  categoryCounts,
  mobile = false,
  onCategoryChange,
  onViewChange,
  views,
}) {
  const content = (
    <>
      {!mobile ? (
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-sap-600 text-sm font-bold tracking-wide text-white">
            SAP
          </div>
          <div>
            <p className="font-semibold text-ink-950 dark:text-white">ABAP Cheatsheets</p>
            <p className="text-xs text-ink-500 dark:text-ink-400">Developer reference</p>
          </div>
        </div>
      ) : null}

      <nav aria-label="Main navigation" className="space-y-1">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              className={`nav-button ${activeView === view.id ? 'nav-button-active' : ''}`}
              key={view.id}
              onClick={() => onViewChange(view.id)}
              type="button"
            >
              <Icon size={17} />
              <span>{view.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-6 border-t border-ink-200 pt-5 dark:border-ink-800">
        <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
          Categories
        </p>
        <nav aria-label="Category navigation" className="space-y-1">
          {categories.map((category) => (
            <button
              className={`nav-button justify-between gap-3 text-left ${
                activeCategory === category && (activeView === 'overview' || activeView === 'favorites')
                  ? 'nav-button-active'
                  : ''
              }`}
              key={category}
              onClick={() => onCategoryChange(category)}
              type="button"
            >
              <span className="min-w-0 truncate">{category}</span>
              <span className="shrink-0 rounded-md bg-ink-100 px-2 py-0.5 text-[0.68rem] font-semibold text-ink-600 dark:bg-ink-800 dark:text-ink-300">
                {categoryCounts[category] ?? 0}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );

  if (mobile) {
    return content;
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 overflow-y-auto border-r border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900 lg:block">
      {content}
    </aside>
  );
}

export default Sidebar;
