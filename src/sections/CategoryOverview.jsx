function CategoryOverview({ categories, onCategoryChange }) {
  return (
    <section className="mb-6 rounded-md border border-ink-200 bg-white p-5 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ink-950 dark:text-white">Category Map</h2>
          <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">
            Browse the library by ABAP work area. Selecting a category opens matching templates.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <button
            className="rounded-md border border-ink-200 p-4 text-left transition hover:border-sap-300 hover:bg-sap-50 dark:border-ink-700 dark:hover:border-sap-700 dark:hover:bg-sap-900/25"
            key={category.name}
            onClick={() => onCategoryChange(category.name)}
            type="button"
          >
            <h3 className="text-sm font-semibold text-ink-950 dark:text-white">{category.name}</h3>
            <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{category.description}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {category.topics.slice(0, 5).map((topic) => (
                <span
                  className="rounded-md bg-ink-100 px-2 py-1 text-xs text-ink-700 dark:bg-ink-800 dark:text-ink-200"
                  key={topic}
                >
                  {topic}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export default CategoryOverview;
