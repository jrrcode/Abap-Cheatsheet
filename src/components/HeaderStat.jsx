function HeaderStat({ label, value }) {
  return (
    <div className="rounded-md border border-ink-200 bg-white p-4 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-ink-500 dark:text-ink-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-ink-950 dark:text-white">{value}</p>
    </div>
  );
}

export default HeaderStat;
