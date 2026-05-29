function HeaderStat({ label, value }) {
  return (
    <div className="rounded-md border border-ink-200 bg-white p-3 shadow-sm dark:border-ink-800 dark:bg-ink-900">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.1em] text-ink-500 dark:text-ink-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-sap-900 dark:text-sap-100">{value}</p>
    </div>
  );
}

export default HeaderStat;
