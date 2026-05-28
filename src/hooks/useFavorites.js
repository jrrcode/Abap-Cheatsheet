import { useEffect, useState } from 'react';

const storageKey = 'abap-cheatsheets-favorites';

function getInitialFavorites() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    return JSON.parse(localStorage.getItem(storageKey)) ?? [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(getInitialFavorites);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return [favorites, toggleFavorite];
}
