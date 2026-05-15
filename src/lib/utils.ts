export function ratingDots(rating: number): string {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '●'.repeat(full) + (half ? '◐' : '') + '○'.repeat(empty);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function groupByYear<T extends { data: { date: Date } }>(
  entries: T[]
): Map<number, T[]> {
  const map = new Map<number, T[]>();
  for (const entry of entries) {
    const year = entry.data.date.getFullYear();
    if (!map.has(year)) map.set(year, []);
    map.get(year)!.push(entry);
  }
  return map;
}
