function Sidebar({
  activeView,
  mobile = false,
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
