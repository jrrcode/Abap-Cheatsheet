export function getAllTags(items) {
  return [...new Set(items.flatMap((item) => item.tags))].sort((a, b) => a.localeCompare(b));
}

export function filterCheatsheets(items, { query, category, tags, favoritesOnly, favorites }) {
  const normalizedQuery = query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesFavorites = !favoritesOnly || favorites.includes(item.id);
    const matchesCategory = category === 'All' || item.category === category;
    const matchesTags = tags.length === 0 || tags.every((tag) => item.tags.includes(tag));
    const searchableText = [
      item.title,
      item.category,
      item.subcategory,
      item.compatibility,
      item.compatibilityNotes,
      item.difficulty,
      item.explanation,
      item.code,
      item.notes.join(' '),
      item.commonMistakes.join(' '),
      item.relatedTopics.join(' '),
      item.tags.join(' '),
    ]
      .join(' ')
      .toLowerCase();
    const matchesQuery = normalizedQuery.length === 0 || searchableText.includes(normalizedQuery);

    return matchesFavorites && matchesCategory && matchesTags && matchesQuery;
  });
}
