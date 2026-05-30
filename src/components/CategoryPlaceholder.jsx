function CategoryPlaceholder({ category, onSelect }) {
  return (
    <article className="rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-sap-700 dark:text-sap-300 sm:text-xs">
            Content count: 0
          </p>
          <h2 className="mt-2 text-lg font-semibold text-sap-900 dark:text-sap-100">{category.name}</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{category.description}</p>
        </div>
        <span className="w-fit rounded-md bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
          Content coming soon
        </span>
      </div>

      {category.topics.length ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {category.topics.map((topic) => (
            <span className="tag-chip" key={topic}>
              {topic}
            </span>
          ))}
        </div>
      ) : null}

      {onSelect ? (
        <button
          className="mt-4 min-h-11 rounded-md border border-ink-200 px-3 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
          onClick={() => onSelect(category.name)}
          type="button"
        >
          Open category
        </button>
      ) : null}
    </article>
  );
}

export default CategoryPlaceholder;
