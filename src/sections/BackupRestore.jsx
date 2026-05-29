import { Download, Upload } from 'lucide-react';
import { useRef, useState } from 'react';

const backupVersion = 1;
const favoritesKey = 'abap-cheatsheets-favorites';
const themeKey = 'abap-cheatsheets-theme';

function normalizeFavorites(value) {
  return Array.isArray(value) ? value.filter((item) => typeof item === 'string') : null;
}

function normalizeTheme(value) {
  return value === 'dark' || value === 'light' ? value : null;
}

function BackupRestore({ darkMode, favorites, onRestoreFavorites, onRestoreTheme }) {
  const [status, setStatus] = useState(null);
  const fileInputRef = useRef(null);

  const exportBackup = () => {
    const backup = {
      app: 'ABAP Cheatsheets',
      version: backupVersion,
      exportedAt: new Date().toISOString(),
      localStorage: {
        [favoritesKey]: favorites,
        [themeKey]: darkMode ? 'dark' : 'light',
      },
    };

    const blob = new window.Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `abap-cheatsheets-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
    setStatus({ type: 'success', message: 'Backup file created.' });
  };

  const importBackup = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const parsed = JSON.parse(await file.text());
      const storage = parsed?.localStorage;
      const importedFavorites = normalizeFavorites(storage?.[favoritesKey]);
      const importedTheme = normalizeTheme(storage?.[themeKey]);

      if (!storage || importedFavorites === null || importedTheme === null) {
        throw new Error('Unsupported backup format.');
      }

      onRestoreFavorites([...new Set(importedFavorites)]);
      onRestoreTheme(importedTheme === 'dark');
      setStatus({ type: 'success', message: 'Backup restored. Favorites and theme were updated.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Could not import the selected file.',
      });
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="max-w-3xl rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900 sm:p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-sap-700 dark:text-sap-300">
          Local browser data
        </p>
        <h2 className="mt-2 text-lg font-semibold text-sap-900 dark:text-sap-100 sm:text-xl">Backup & Restore</h2>
        <p className="mt-3 text-sm leading-6 text-ink-600 dark:text-ink-300">
          Export or restore only local settings stored by this site. No code notes, credentials, SAP system names, or
          server data are included.
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-sap-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sap-800"
          onClick={exportBackup}
          type="button"
        >
          <Download size={16} />
          Export JSON
        </button>
        <button
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-ink-200 bg-white px-4 py-2.5 text-sm font-semibold text-ink-800 transition hover:bg-ink-100 dark:border-ink-700 dark:bg-ink-950 dark:text-ink-100 dark:hover:bg-ink-800"
          onClick={() => fileInputRef.current?.click()}
          type="button"
        >
          <Upload size={16} />
          Import JSON
        </button>
      </div>

      <input
        accept="application/json,.json"
        className="hidden"
        onChange={importBackup}
        ref={fileInputRef}
        type="file"
      />

      <div className="mt-5 rounded-md bg-ink-50 p-4 text-sm leading-6 text-ink-600 dark:bg-ink-950 dark:text-ink-300">
        <p className="font-semibold text-ink-900 dark:text-white">Included localStorage keys</p>
        <ul className="mt-2 space-y-1">
          <li>- {favoritesKey}</li>
          <li>- {themeKey}</li>
        </ul>
      </div>

      {status ? (
        <p
          className={`mt-4 rounded-md px-3 py-2 text-sm font-medium ${
            status.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-100'
              : 'bg-red-50 text-red-800 dark:bg-red-950 dark:text-red-100'
          }`}
        >
          {status.message}
        </p>
      ) : null}
    </section>
  );
}

export default BackupRestore;
