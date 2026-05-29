# ABAP Cheatsheets

A static React + Tailwind CSS documentation site for searchable ABAP templates and quick references.

This is a personal project for learning and quickly reusing practical ABAP patterns.

## Run Locally

```bash
npm.cmd install
npm.cmd run dev
```

`npm.cmd run dev` builds the static site and serves it with Vite preview. Open the URL printed after `Local:`.

If your shell allows normal npm commands, `npm install` and `npm run dev` work too. On locked-down PowerShell setups, prefer `npm.cmd`.

## Build

```bash
npm.cmd run build
```

The production site is generated in `dist/`.

## Edit Content

Cheatsheet entries live in `src/data/cheatsheets.js`. Each entry supports:

- `id`
- `title`
- `category`
- `subcategory`
- `tags`
- `compatibility`
- `difficulty`
- `explanation`
- `code`
- `notes`
- `commonMistakes`
- `relatedTopics`

Categories and prepared topic lists live in `src/data/categories.js`.

## Add A Cheatsheet

Copy an existing object in `src/data/cheatsheets.js`, give it a unique `id`, choose a category from `src/data/categories.js`, and update the text/code fields.

```js
{
  id: 'select-single-customer',
  title: 'SELECT SINGLE Customer',
  category: 'SELECT Statements',
  subcategory: 'SELECT SINGLE',
  tags: ['Classic ABAP', 'Open SQL', 'Beginner'],
  compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
  difficulty: 'Beginner',
  explanation: 'Short explanation for this template.',
  code: `SELECT SINGLE kunnr, name1
  FROM kna1
  WHERE kunnr = @p_kunnr
  INTO @DATA(ls_customer).`,
  notes: ['Add practical tips here.'],
  commonMistakes: ['Add common pitfalls here.'],
  relatedTopics: ['SELECT SINGLE', 'WHERE'],
}
```

