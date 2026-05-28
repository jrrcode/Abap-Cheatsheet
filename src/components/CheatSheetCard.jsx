import { Star } from 'lucide-react';
import CodeBlock from './CodeBlock';

function CheatSheetCard({ favorite, onToggleFavorite, onToggleTag, sheet }) {
  return (
    <article className="flex flex-col rounded-md border border-ink-200 bg-white shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <div className="border-b border-ink-200 p-5 dark:border-ink-800">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
              {sheet.category}
            </p>
            <p className="mt-1 text-xs font-medium text-ink-500 dark:text-ink-400">{sheet.subcategory}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink-950 dark:text-white">{sheet.title}</h3>
          </div>
          <button
            aria-label={favorite ? 'Remove favorite' : 'Add favorite'}
            className={`icon-button ${favorite ? 'border-accent-300 bg-accent-50 text-accent-700 dark:border-accent-600 dark:bg-accent-900/25 dark:text-accent-200' : ''}`}
            onClick={onToggleFavorite}
            type="button"
            title={favorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star fill={favorite ? 'currentColor' : 'none'} size={18} />
          </button>
        </div>
        <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">{sheet.explanation}</p>
        <div className="mt-3 flex flex-wrap gap-2 text-xs">
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
          <p className="mt-3 text-xs leading-5 text-ink-500 dark:text-ink-400">
            Compatibility notes: <span className="text-ink-700 dark:text-ink-200">{sheet.compatibilityNotes}</span>
          </p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {sheet.tags.map((tag) => (
            <button className="tag-chip" key={tag} onClick={() => onToggleTag(tag)} type="button">
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
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
    </article>
  );
}

export default CheatSheetCard;
