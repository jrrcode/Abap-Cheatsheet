import { useMemo, useState } from 'react';
import { tips } from '../data/tips';

function TipsAndTricks() {
  const [activeCategory, setActiveCategory] = useState('All');

  const tipCategories = useMemo(
    () => ['All', ...new Set(tips.map((tip) => tip.category))],
    [],
  );

  const visibleTips = useMemo(
    () => tips.filter((tip) => activeCategory === 'All' || tip.category === activeCategory),
    [activeCategory],
  );

  return (
    <section>
      <div className="mb-5 rounded-md border border-ink-200 bg-white p-4 dark:border-ink-800 dark:bg-ink-900">
        <div className="mb-3">
          <h2 className="text-sm font-semibold text-ink-950 dark:text-white">Tip Categories</h2>
          <p className="mt-1 text-xs text-ink-500 dark:text-ink-400">
            Choose a category to focus the advice list.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tipCategories.map((category) => (
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

      <div className="grid gap-4 lg:grid-cols-2">
        {visibleTips.map((tip) => (
          <article
            className="rounded-md border border-ink-200 bg-white p-5 shadow-sm dark:border-ink-800 dark:bg-ink-900"
            key={tip.title}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
              {tip.category}
            </p>
            <h2 className="mt-2 text-lg font-semibold text-ink-950 dark:text-white">{tip.title}</h2>
            <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">{tip.summary}</p>
            <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
              {tip.checklist.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TipsAndTricks;
