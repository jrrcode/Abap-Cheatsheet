import { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { tips as initialTips } from '../data/tips';

const storageKey = 'abap-cheatsheets-user-tips';
const migrationKey = 'abap-cheatsheets-built-in-tips-v1';

function loadTips() {
  if (typeof window === 'undefined') {
    return initialTips;
  }

  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    if (!Array.isArray(saved)) {
      localStorage.setItem(migrationKey, 'done');
      localStorage.setItem(storageKey, JSON.stringify(initialTips));
      return initialTips;
    }

    if (localStorage.getItem(migrationKey) === 'done') {
      return saved;
    }

    const savedIds = new Set(saved.map((tip) => tip.id));
    const missingBuiltIns = initialTips.filter((tip) => !savedIds.has(tip.id));
    const migratedTips = [...missingBuiltIns, ...saved];
    localStorage.setItem(migrationKey, 'done');
    localStorage.setItem(storageKey, JSON.stringify(migratedTips));
    return migratedTips;
  } catch {
    return initialTips;
  }
}

function listFromText(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function TipsAndTricks() {
  const [tips, setTips] = useState(loadTips);
  const [form, setForm] = useState({
    title: '',
    summary: '',
    checklist: '',
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(tips));
  }, [tips]);

  useEffect(() => {
    const refreshTips = () => setTips(loadTips());
    window.addEventListener('abap-cheatsheets-tips-restored', refreshTips);
    return () => window.removeEventListener('abap-cheatsheets-tips-restored', refreshTips);
  }, []);

  const sortedTips = useMemo(
    () => [...tips].sort((a, b) => a.title.localeCompare(b.title)),
    [tips],
  );

  const addTip = (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const summary = form.summary.trim();
    const checklist = listFromText(form.checklist);

    if (!title || !summary) {
      return;
    }

    setTips((current) => [
      ...current,
      {
        id: `tip-${Date.now()}`,
        title,
        summary,
        checklist,
      },
    ]);
    setForm({ title: '', summary: '', checklist: '' });
  };

  const deleteTip = (id) => {
    setTips((current) => current.filter((tip) => tip.id !== id));
  };

  return (
    <section className="grid gap-5 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <form
        className="rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-5"
        onSubmit={addTip}
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
            Local notes
          </p>
          <h2 className="mt-2 text-lg font-semibold text-sap-900 dark:text-sap-100">Add a tip</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
            Tips are saved only in this browser. Use Backup & Restore if you want to move them to another device.
          </p>
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
            Title
          </span>
          <input
            className="form-control"
            onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
            placeholder="Example: Check selection size before SELECT"
            value={form.title}
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
            Summary
          </span>
          <textarea
            className="form-control min-h-24"
            onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))}
            placeholder="Write the practical note or reminder."
            value={form.summary}
          />
        </label>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
            Checklist, one per line
          </span>
          <textarea
            className="form-control min-h-32"
            onChange={(event) => setForm((current) => ({ ...current, checklist: event.target.value }))}
            placeholder="Use ST05 when SQL is slow&#10;Avoid SELECT inside LOOP"
            value={form.checklist}
          />
        </label>

        <button
          className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-sap-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sap-800 dark:bg-sap-500 dark:hover:bg-sap-400"
          type="submit"
        >
          <Plus size={16} />
          Add tip
        </button>
      </form>

      <div className="grid items-start gap-4">
        {sortedTips.length ? (
          sortedTips.map((tip) => (
            <article
              className="rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-5"
              key={tip.id}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-6 text-sap-900 dark:text-sap-100 sm:text-lg">
                    {tip.title}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{tip.summary}</p>
                </div>
                <button
                  aria-label={`Delete ${tip.title}`}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-red-200 px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-200 dark:hover:bg-red-950"
                  onClick={() => deleteTip(tip.id)}
                  type="button"
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
              {tip.checklist.length ? (
                <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
                  {tip.checklist.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))
        ) : (
          <section className="rounded-md border border-dashed border-ink-300 bg-white p-8 text-center dark:border-ink-700 dark:bg-ink-900">
            <h2 className="text-lg font-semibold text-ink-950 dark:text-white">No tips yet</h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-600 dark:text-ink-300">
              Add your own ABAP reminders, useful notes, and best practices here.
            </p>
          </section>
        )}
      </div>
    </section>
  );
}

export default TipsAndTricks;
