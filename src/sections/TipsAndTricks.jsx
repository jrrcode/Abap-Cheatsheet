import { useEffect, useMemo, useState } from 'react';
import { MoreVertical, Pencil, Plus, Search, Trash2, X } from 'lucide-react';
import { tips as initialTips } from '../data/tips';

const storageKey = 'abap-cheatsheets-user-tips';
const migrationKey = 'abap-cheatsheets-built-in-tips-v4';

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
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingTipId, setEditingTipId] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [tipQuery, setTipQuery] = useState('');
  const [addForm, setAddForm] = useState({
    title: '',
    summary: '',
    checklist: '',
  });
  const [editForm, setEditForm] = useState({
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

  const visibleTips = useMemo(() => {
    const normalizedQuery = tipQuery.trim().toLowerCase();

    return tips
      .filter((tip) => {
        if (!normalizedQuery) {
          return true;
        }

        const searchableText = [tip.title, tip.summary, ...(tip.checklist ?? [])].join(' ').toLowerCase();
        return searchableText.includes(normalizedQuery);
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [tips, tipQuery]);

  const closeAddModal = () => {
    setAddForm({ title: '', summary: '', checklist: '' });
    setAddModalOpen(false);
  };

  const openAddModal = () => {
    setAddForm({ title: '', summary: '', checklist: '' });
    setOpenMenuId(null);
    setAddModalOpen(true);
  };

  const startEditingTip = (tip) => {
    setEditForm({
      title: tip.title,
      summary: tip.summary,
      checklist: tip.checklist.join('\n'),
    });
    setEditingTipId(tip.id);
    setOpenMenuId(null);
  };

  const cancelEditingTip = () => {
    setEditForm({ title: '', summary: '', checklist: '' });
    setEditingTipId(null);
  };

  const addTip = (event) => {
    event.preventDefault();

    const title = addForm.title.trim();
    const summary = addForm.summary.trim();
    const checklist = listFromText(addForm.checklist);

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

    closeAddModal();
  };

  const saveEditedTip = (id) => {
    const title = editForm.title.trim();
    const summary = editForm.summary.trim();
    const checklist = listFromText(editForm.checklist);

    if (!title || !summary) {
      return;
    }

    setTips((current) =>
      current.map((tip) => (tip.id === id ? { ...tip, title, summary, checklist } : tip)),
    );
    cancelEditingTip();
  };

  const deleteTip = (id) => {
    setTips((current) => current.filter((tip) => tip.id !== id));
    setOpenMenuId(null);
    if (editingTipId === id) {
      cancelEditingTip();
    }
  };

  return (
    <section className="grid gap-5">
      <div className="flex flex-col gap-3 rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <h2 className="text-lg font-semibold text-sap-900 dark:text-sap-100">Tips & Tricks</h2>
          <p className="mt-1 text-sm leading-6 text-ink-600 dark:text-ink-300">
            Keep practical ABAP notes, checklists, and reminders here. Changes are saved in this browser.
          </p>
        </div>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-sap-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sap-800 dark:bg-sap-500 dark:hover:bg-sap-400"
          onClick={openAddModal}
          type="button"
        >
          <Plus size={16} />
          Add tip
        </button>
      </div>

      <div className="relative">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 dark:text-ink-500"
          size={18}
        />
        <input
          aria-label="Search tips and tricks"
          className="form-control min-h-12 pl-10 pr-11"
          onChange={(event) => setTipQuery(event.target.value)}
          placeholder="Search tips and tricks..."
          value={tipQuery}
        />
        {tipQuery ? (
          <button
            aria-label="Clear tips search"
            className="absolute right-2 top-1/2 inline-flex min-h-9 min-w-9 -translate-y-1/2 items-center justify-center rounded-md text-ink-500 hover:bg-ink-100 hover:text-ink-800 dark:text-ink-300 dark:hover:bg-ink-800 dark:hover:text-white"
            onClick={() => setTipQuery('')}
            type="button"
          >
            <X size={16} />
          </button>
        ) : null}
      </div>

      {addModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/60 p-3 sm:items-center sm:p-6">
          <button
            aria-label="Close add tip modal"
            className="absolute inset-0"
            onClick={closeAddModal}
            type="button"
          />
          <form
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-md border border-ink-200 bg-white p-4 shadow-soft dark:border-ink-800 dark:bg-ink-900 sm:p-5"
            onSubmit={addTip}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
                  Local notes
                </p>
                <h2 className="mt-2 text-lg font-semibold text-sap-900 dark:text-sap-100">Add a tip</h2>
                <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
                  Tips are saved only in this browser. Use Backup & Restore if you want to move them to another device.
                </p>
              </div>
              <button
                aria-label="Close add tip form"
                className="icon-button"
                onClick={closeAddModal}
                type="button"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                  Title
                </span>
                <input
                  className="form-control"
                  onChange={(event) => setAddForm((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Example: Check selection size before SELECT"
                  value={addForm.title}
                />
              </label>

              <label className="block md:row-span-2">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                  Checklist, one per line
                </span>
                <textarea
                  className="form-control min-h-32"
                  onChange={(event) => setAddForm((current) => ({ ...current, checklist: event.target.value }))}
                  placeholder="Use ST05 when SQL is slow&#10;Avoid SELECT inside LOOP"
                  value={addForm.checklist}
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                  Summary
                </span>
                <textarea
                  className="form-control min-h-24"
                  onChange={(event) => setAddForm((current) => ({ ...current, summary: event.target.value }))}
                  placeholder="Write the practical note or reminder."
                  value={addForm.summary}
                />
              </label>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
                onClick={closeAddModal}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-sap-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sap-800 dark:bg-sap-500 dark:hover:bg-sap-400"
                type="submit"
              >
                <Plus size={16} />
                Add tip
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="grid items-start gap-4">
        {visibleTips.length ? (
          visibleTips.map((tip) => {
            const isEditing = editingTipId === tip.id;

            return (
              <article
                className="rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-5"
                key={tip.id}
              >
                {isEditing ? (
                  <div className="grid gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
                        Editing tip
                      </p>
                      <button
                        aria-label={`Cancel editing ${tip.title}`}
                        className="icon-button"
                        onClick={cancelEditingTip}
                        type="button"
                      >
                        <X size={17} />
                      </button>
                    </div>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                        Title
                      </span>
                      <input
                        className="form-control"
                        onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                        value={editForm.title}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                        Summary
                      </span>
                      <textarea
                        className="form-control min-h-24"
                        onChange={(event) => setEditForm((current) => ({ ...current, summary: event.target.value }))}
                        value={editForm.summary}
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
                        Checklist, one per line
                      </span>
                      <textarea
                        className="form-control min-h-32"
                        onChange={(event) => setEditForm((current) => ({ ...current, checklist: event.target.value }))}
                        value={editForm.checklist}
                      />
                    </label>
                    <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                      <button
                        className="inline-flex min-h-11 items-center justify-center rounded-md border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
                        onClick={cancelEditingTip}
                        type="button"
                      >
                        Cancel
                      </button>
                      <button
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-sap-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sap-800 dark:bg-sap-500 dark:hover:bg-sap-400"
                        onClick={() => saveEditedTip(tip.id)}
                        type="button"
                      >
                        <Pencil size={15} />
                        Save changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h2 className="text-base font-semibold leading-6 text-sap-900 dark:text-sap-100 sm:text-lg">
                          {tip.title}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">{tip.summary}</p>
                      </div>
                      <div className="relative self-end sm:self-start">
                        <button
                          aria-expanded={openMenuId === tip.id}
                          aria-label={`Open options for ${tip.title}`}
                          className="icon-button"
                          onClick={() => setOpenMenuId((current) => (current === tip.id ? null : tip.id))}
                          type="button"
                        >
                          <MoreVertical size={17} />
                        </button>
                        {openMenuId === tip.id ? (
                          <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-md border border-ink-200 bg-white py-1 shadow-soft dark:border-ink-700 dark:bg-ink-900">
                            <button
                              className="flex min-h-10 w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:text-ink-200 dark:hover:bg-ink-800"
                              onClick={() => startEditingTip(tip)}
                              type="button"
                            >
                              <Pencil size={15} />
                              Edit
                            </button>
                            <button
                              className="flex min-h-10 w-full items-center gap-2 px-3 py-2 text-left text-sm font-semibold text-red-700 hover:bg-red-50 dark:text-red-200 dark:hover:bg-red-950"
                              onClick={() => deleteTip(tip.id)}
                              type="button"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    {tip.checklist.length ? (
                      <ul className="mt-4 space-y-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
                        {tip.checklist.map((item) => (
                          <li key={item}>- {item}</li>
                        ))}
                      </ul>
                    ) : null}
                  </>
                )}
              </article>
            );
          })
        ) : (
          <section className="rounded-md border border-dashed border-ink-300 bg-white p-8 text-center dark:border-ink-700 dark:bg-ink-900">
            <h2 className="text-lg font-semibold text-ink-950 dark:text-white">
              {tipQuery ? 'No tips match your search' : 'No tips yet'}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-ink-600 dark:text-ink-300">
              {tipQuery
                ? 'Try a different keyword or clear the tips search.'
                : 'Add your own ABAP reminders, useful notes, and best practices here.'}
            </p>
            {tipQuery ? (
              <button
                className="mt-4 inline-flex min-h-11 items-center justify-center rounded-md border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
                onClick={() => setTipQuery('')}
                type="button"
              >
                Clear search
              </button>
            ) : null}
          </section>
        )}
      </div>
    </section>
  );
}

export default TipsAndTricks;
