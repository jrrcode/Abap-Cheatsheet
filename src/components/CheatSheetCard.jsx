import { ChevronDown, Star } from 'lucide-react';
import { useState } from 'react';
import CodeBlock from './CodeBlock';

function CheatSheetCard({ favorite, onToggleFavorite, onToggleTag, sheet }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      className={`flex flex-col rounded-md border border-ink-200 bg-white shadow-sm transition hover:border-sap-200 hover:shadow-md dark:border-ink-800 dark:bg-ink-900 dark:hover:border-sap-800 ${expanded ? 'xl:col-span-2' : ''}`}
    >
      <div
        aria-expanded={expanded}
        className={`w-full p-5 text-left ${expanded ? 'border-b border-ink-200 dark:border-ink-800' : ''}`}
        onClick={() => setExpanded((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setExpanded((current) => !current);
          }
        }}
        role="button"
        tabIndex={0}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
              {sheet.category}
            </p>
            <p className="mt-1 text-xs font-medium text-ink-500 dark:text-ink-400">{sheet.subcategory}</p>
            <h3 className="mt-2 text-lg font-semibold text-sap-900 dark:text-sap-100">{sheet.title}</h3>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`icon-button ${favorite ? 'border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-600 dark:bg-accent-900/25 dark:text-accent-200' : ''}`}
              onClick={(event) => {
                event.stopPropagation();
                onToggleFavorite();
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleFavorite();
                }
              }}
              role="button"
              tabIndex={0}
              title={favorite ? 'Remove favorite' : 'Add favorite'}
            >
              <Star fill={favorite ? 'currentColor' : 'none'} size={18} />
            </span>
            <ChevronDown
              className={`text-ink-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
              size={18}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {sheet.tags.map((tag) => (
            <span
              className="tag-chip cursor-pointer"
              key={tag}
              onClick={(event) => {
                event.stopPropagation();
                onToggleTag(tag);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  event.stopPropagation();
                  onToggleTag(tag);
                }
              }}
              role="button"
              tabIndex={0}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {expanded ? (
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="text-sm leading-6 text-ink-600 dark:text-ink-300">{sheet.explanation}</p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-md bg-ink-100 px-2.5 py-1 font-semibold text-ink-700 dark:bg-ink-800 dark:text-ink-200">
            {sheet.difficulty}
          </span>
          {sheet.compatibility.map((item) => (
            <span
              className="rounded-md bg-sap-50 px-2.5 py-1 font-semibold text-sap-800 dark:bg-sap-900/35 dark:text-sap-100"
              key={item}
            >
              {item}
            </span>
          ))}
        </div>
        {sheet.compatibilityNotes ? (
          <p className="text-xs leading-5 text-ink-500 dark:text-ink-400">
            Compatibility notes: <span className="text-ink-700 dark:text-ink-200">{sheet.compatibilityNotes}</span>
          </p>
        ) : null}
        <CodeBlock code={sheet.code} compatibility={sheet.compatibility} difficulty={sheet.difficulty} />
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h4 className="text-sm font-semibold text-ink-950 dark:text-white">Notes</h4>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
              {sheet.notes.map((note) => (
                <li key={note}>- {note}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-ink-950 dark:text-white">Common Mistakes</h4>
            <ul className="mt-2 space-y-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
              {sheet.commonMistakes.map((mistake) => (
                <li key={mistake}>- {mistake}</li>
              ))}
            </ul>
          </div>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-ink-950 dark:text-white">Related Topics</h4>
            <div className="mt-2 flex flex-wrap gap-2">
              {sheet.relatedTopics.map((topic) => (
                <span
                  className="rounded-md bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-700 dark:bg-ink-800 dark:text-ink-200"
                  key={topic}
                >
                  {topic}
                </span>
              ))}
            </div>
        </div>
      </div>
      ) : null}
    </article>
  );
}

export default CheatSheetCard;
