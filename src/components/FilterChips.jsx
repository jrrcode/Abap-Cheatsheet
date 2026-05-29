function FilterChips({
  activeCategory,
  activeTags,
  categories,
  onCategoryChange,
  onClear,
  onToggleTag,
  tags,
}) {
  const hasFilters = activeCategory !== 'All' || activeTags.length > 0;

  return (
    <section className="print-hidden mb-6 rounded-md border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink-950 dark:text-white">Filters</h2>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">Combine one category with any number of tags.</p>
        </div>
        {hasFilters ? (
          <button
            className="rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
            onClick={onClear}
            type="button"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <div className="space-y-3">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <button
            className={`tag-chip shrink-0 ${activeCategory === 'All' ? 'tag-chip-active' : ''}`}
            onClick={() => onCategoryChange('All')}
            type="button"
          >
            All
          </button>
          {categories.map((category) => (
            <button
              className={`tag-chip shrink-0 ${activeCategory === category.name ? 'tag-chip-active' : ''}`}
              key={category.name}
              onClick={() => onCategoryChange(category.name)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              className={`tag-chip ${activeTags.includes(tag) ? 'tag-chip-active' : ''}`}
              key={tag}
              onClick={() => onToggleTag(tag)}
              type="button"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FilterChips;
