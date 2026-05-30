import { useMemo, useState } from 'react';
import { Check, Clipboard, RotateCcw } from 'lucide-react';
import { compatibilityOptions, difficultyOptions } from '../data/cheatsheets';

const starterTemplate = {
  title: '',
  category: '',
  subcategory: '',
  compatibility: ['Classic ABAP'],
  compatibilityNotes: '',
  difficulty: 'Beginner',
  explanation: '',
  code: '',
  notes: '',
  commonMistakes: '',
  relatedTopics: '',
};

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function listFromText(value) {
  return value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean);
}

function quote(value) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function arrayBlock(values, indent = '    ') {
  if (values.length === 0) {
    return '[]';
  }

  return `[\n${values.map((value) => `${indent}${quote(value)}`).join(',\n')},\n  ]`;
}

function templateString(value) {
  return `\`${value.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``;
}

function buildTemplateObject(form) {
  const id = slugify(form.title || form.subcategory || 'new-abap-template');
  const notes = listFromText(form.notes);
  const mistakes = listFromText(form.commonMistakes);
  const related = listFromText(form.relatedTopics);

  return `{
  id: ${quote(id)},
  title: ${quote(form.title || 'New ABAP Template')},
  category: ${quote(form.category)},
  subcategory: ${quote(form.subcategory || 'General')},
  compatibility: ${arrayBlock(form.compatibility)},
  compatibilityNotes: ${quote(form.compatibilityNotes)},
  difficulty: ${quote(form.difficulty)},
  explanation: ${quote(form.explanation)},
  code: ${templateString(form.code)},
  notes: ${arrayBlock(notes)},
  commonMistakes: ${arrayBlock(mistakes)},
  relatedTopics: ${arrayBlock(related)},
},`;
}

function Field({ children, label }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
        {label}
      </span>
      {children}
    </label>
  );
}

function AddTemplateGuide() {
  const [form, setForm] = useState(starterTemplate);
  const [copied, setCopied] = useState(false);

  const generatedTemplate = useMemo(() => buildTemplateObject(form), [form]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const toggleCompatibility = (option) => {
    setForm((current) => {
      const next = current.compatibility.includes(option)
        ? current.compatibility.filter((item) => item !== option)
        : [...current.compatibility, option];

      return { ...current, compatibility: next };
    });
  };

  const copyTemplate = async () => {
    await navigator.clipboard.writeText(generatedTemplate);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(24rem,0.85fr)]">
      <div className="rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
            Template Builder
          </p>
          <h2 className="mt-2 text-xl font-semibold text-ink-950 dark:text-white sm:text-2xl">Create a new cheatsheet entry</h2>
          <p className="mt-2 text-sm leading-6 text-ink-600 dark:text-ink-300">
            Fill the form, copy the generated object, then paste it into the array in{' '}
            <span className="font-mono">src/data/cheatsheets.js</span>.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input
              className="form-control"
              onChange={(event) => updateField('title', event.target.value)}
              placeholder="SELECT SINGLE By Key"
              value={form.title}
            />
          </Field>

          <Field label="Category">
            <input
              className="form-control"
              onChange={(event) => updateField('category', event.target.value)}
              placeholder="Example: Open SQL"
              value={form.category}
            />
          </Field>

          <Field label="Subcategory">
            <input
              className="form-control"
              onChange={(event) => updateField('subcategory', event.target.value)}
              placeholder="SELECT SINGLE"
              value={form.subcategory}
            />
          </Field>

          <Field label="Difficulty">
            <select
              className="form-control"
              onChange={(event) => updateField('difficulty', event.target.value)}
              value={form.difficulty}
            >
              {difficultyOptions.map((difficulty) => (
                <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="mt-4">
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.08em] text-ink-500 dark:text-ink-400">
            Compatibility
          </span>
          <div className="flex flex-wrap gap-2">
            {compatibilityOptions.map((option) => (
              <button
                className={`tag-chip ${form.compatibility.includes(option) ? 'tag-chip-active' : ''}`}
                key={option}
                onClick={() => toggleCompatibility(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4">
          <Field label="Compatibility Notes">
            <input
              className="form-control"
              onChange={(event) => updateField('compatibilityNotes', event.target.value)}
              placeholder="Example: Inline DATA requires ABAP 7.40+."
              value={form.compatibilityNotes}
            />
          </Field>

          <Field label="Explanation">
            <textarea
              className="form-control min-h-24"
              onChange={(event) => updateField('explanation', event.target.value)}
              placeholder="Describe when and why to use this pattern."
              value={form.explanation}
            />
          </Field>

          <Field label="ABAP Code">
            <textarea
              className="form-control min-h-52 font-mono"
              onChange={(event) => updateField('code', event.target.value)}
              placeholder="Paste the ABAP template here."
              value={form.code}
            />
          </Field>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Related Topics, one per line">
            <textarea
              className="form-control min-h-28"
              onChange={(event) => updateField('relatedTopics', event.target.value)}
              placeholder="Open SQL&#10;Messages"
              value={form.relatedTopics}
            />
          </Field>

          <Field label="Notes / Best Practices, one per line">
            <textarea
              className="form-control min-h-32"
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Use a selective WHERE condition."
              value={form.notes}
            />
          </Field>

          <Field label="Common Mistakes, one per line">
            <textarea
              className="form-control min-h-32"
              onChange={(event) => updateField('commonMistakes', event.target.value)}
              placeholder="Do not use SELECT SINGLE without WHERE."
              value={form.commonMistakes}
            />
          </Field>
        </div>

        <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-sap-700 px-4 py-2 text-sm font-semibold text-white hover:bg-sap-800 dark:bg-sap-500 dark:hover:bg-sap-400"
            onClick={copyTemplate}
            type="button"
          >
            {copied ? <Check size={16} /> : <Clipboard size={16} />}
            {copied ? 'Copied' : 'Copy template object'}
          </button>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink-200 px-4 py-2 text-sm font-semibold text-ink-700 hover:bg-ink-100 dark:border-ink-700 dark:text-ink-200 dark:hover:bg-ink-800"
            onClick={() => setForm(starterTemplate)}
            type="button"
          >
            <RotateCcw size={16} />
            Reset
          </button>
        </div>
      </div>

      <aside className="min-w-0 rounded-md border border-ink-200 bg-ink-950 shadow-sm dark:border-ink-800">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-sm text-ink-100">
          <span className="font-semibold">Generated object</span>
          <button
            className="inline-flex min-h-9 items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold hover:bg-white/10"
            onClick={copyTemplate}
            type="button"
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="code-scrollbar max-h-[28rem] overflow-auto p-3 text-xs leading-6 text-ink-100 sm:max-h-[64rem] sm:p-4 sm:text-sm">
          <code>{generatedTemplate}</code>
        </pre>
      </aside>
    </section>
  );
}

export default AddTemplateGuide;
