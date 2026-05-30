export function filterCheatsheets(items, { query, category, favoritesOnly, favorites }) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesFavorites = !favoritesOnly || favorites.includes(item.id);
    const matchesCategory = category === 'All' || item.category === category;
    const searchableText = [
      item.title,
      item.category,
      item.subcategory,
      item.compatibility,
      item.compatibilityNotes,
      item.difficulty,
      item.explanation,
      item.code,
      (item.notes ?? []).join(' '),
      (item.commonMistakes ?? []).join(' '),
      (item.relatedTopics ?? []).join(' '),
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesFavorites && matchesCategory && matchesQuery;
  });
}
