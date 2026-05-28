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

## Deploy

Recommended option: Vercel.

### Vercel

1. Push this project to a GitHub repository.
2. Go to Vercel and choose **Add New Project**.
3. Import the repository.
4. Use these settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Deploy.

This repo includes `vercel.json`, so Vercel can infer the build command, output directory, and SPA fallback.

### GitHub Pages

The Vite config uses `base: './'`, so built assets work when hosted under a GitHub Pages repository subpath.

Simple manual flow:

```bash
npm.cmd run build
```

Then publish the `dist/` folder using your preferred GitHub Pages workflow or action.

### Preview Production Build Locally

```bash
npm.cmd run build
npm.cmd run preview
```
