import { useEffect, useState } from 'react';

const storageKey = 'abap-cheatsheets-theme';

function getInitialMode() {
  if (typeof window === 'undefined') {
    return false;
  }

  const saved = localStorage.getItem(storageKey);
  if (saved) {
    return saved === 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export function useDarkMode() {
  const [darkMode, setDarkMode] = useState(getInitialMode);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(storageKey, darkMode ? 'dark' : 'light');
  }, [darkMode]);

  return [darkMode, setDarkMode];
}
