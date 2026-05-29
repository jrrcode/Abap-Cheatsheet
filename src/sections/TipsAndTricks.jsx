import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { tips } from '../data/tips';

function TipsAndTricks() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedTips, setExpandedTips] = useState([]);

  const tipCategories = useMemo(
    () => ['All', ...new Set(tips.map((tip) => tip.category))],
    [],
  );

  const visibleTips = useMemo(
    () => tips.filter((tip) => activeCategory === 'All' || tip.category === activeCategory),
    [activeCategory],
  );

  const toggleTip = (title) => {
    setExpandedTips((current) =>
      current.includes(title) ? current.filter((item) => item !== title) : [...current, title],
    );
  };

  return (
    <section>
      <div className="mb-5 rounded-md border border-ink-200 bg-white p-3 dark:border-ink-800 dark:bg-ink-900 sm:p-4">
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

      <div className="grid items-start gap-4 md:grid-cols-2">
        {visibleTips.map((tip) => {
          const expanded = expandedTips.includes(tip.title);

          return (
            <article
              className="self-start rounded-md border border-ink-200 bg-white shadow-sm transition hover:border-sap-200 hover:shadow-md dark:border-ink-800 dark:bg-ink-900 dark:hover:border-sap-800"
              key={tip.title}
            >
              <button
                aria-expanded={expanded}
                className={`w-full p-4 text-left sm:p-5 ${expanded ? 'border-b border-ink-200 dark:border-ink-800' : ''}`}
                onClick={() => toggleTip(tip.title)}
                type="button"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
                      {tip.category}
                    </p>
                    <h2 className="mt-2 text-base font-semibold leading-6 text-sap-900 dark:text-sap-100 sm:text-lg">
                      {tip.title}
                    </h2>
                  </div>
                  <ChevronDown
                    className={`mt-1 shrink-0 text-ink-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
                    size={18}
                  />
                </div>
              </button>

              {expanded ? (
                <div className="p-4 sm:p-5">
                  <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{tip.summary}</p>
                  <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
                    {tip.checklist.map((item) => (
                      <li key={item}>- {item}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default TipsAndTricks;
