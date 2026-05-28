export const tips = [
  {
    title: 'Keep Report Logic DRY',
    category: 'Maintainability',
    summary: 'If the same SELECT, validation, or formatting logic appears in multiple places, extract it.',
    checklist: [
      'Move repeated logic into a method or FORM when maintaining legacy code.',
      'Give extracted routines business names, not technical names like process_data2.',
      'Keep shared code small enough to understand without jumping through many layers.',
    ],
  },
  {
    title: 'Before Writing A SELECT',
    category: 'Open SQL',
    summary: 'Decide what data you need, how much data is safe to read, and which fields restrict the result.',
    checklist: [
      'Avoid SELECT * unless you truly need every field.',
      'Use a meaningful WHERE condition for large SAP tables.',
      'Check whether a join, FOR ALL ENTRIES, CDS view, or released API is the right access pattern.',
    ],
  },
  {
    title: 'Before Transporting A Report',
    category: 'Quality Check',
    summary: 'Do a small pre-flight review so avoidable issues do not reach QA or production.',
    checklist: [
      'Remove unconditional BREAK-POINT statements.',
      'Check authorization handling for sensitive data.',
      'Run with empty, small, and large-ish selections.',
      'Confirm messages are useful for both users and support.',
    ],
  },
  {
    title: 'When To Prefer Methods',
    category: 'OOP ABAP',
    summary: 'Use methods when logic has a clear responsibility or may grow beyond a few procedural lines.',
    checklist: [
      'Use a public run method for report orchestration.',
      'Use private methods for selection, validation, mapping, and display steps.',
      'Keep database access separate from output formatting where possible.',
    ],
  },
  {
    title: 'Performance First Questions',
    category: 'Performance',
    summary: 'Before tuning code, identify where time is spent and whether the data volume is realistic.',
    checklist: [
      'Use SAT for ABAP runtime hotspots.',
      'Use ST05 for expensive SQL statements.',
      'Watch for SELECT inside LOOP, missing keys, and overly broad selections.',
    ],
  },
  {
    title: 'S/4HANA Compatibility Habit',
    category: 'S/4HANA',
    summary: 'Classic ECC syntax can still compile while the data model or recommended API has changed.',
    checklist: [
      'Check simplification notes for classic table assumptions.',
      'Prefer released APIs or CDS views when SAP provides them.',
      'Do not treat compatibility views as the best default for new development.',
    ],
  },
  {
    title: 'Keep One Routine At One Level Of Detail',
    category: 'Clean Code',
    summary: 'A method should either orchestrate steps or perform one detailed step, not both at once.',
    checklist: [
      'Let run methods read like a short business process.',
      'Move low-level formatting, mapping, or validation into named helper methods.',
      'If a method needs many comments to explain the sections, split it.',
    ],
  },
  {
    title: 'Name Variables For Business Meaning',
    category: 'Readability',
    summary: 'Readable ABAP is easier to review, debug, and hand over to another developer.',
    checklist: [
      'Prefer lv_company_code over lv_bukrs only when business meaning is clearer.',
      'Avoid names like lt_data, ls_wa, or lv_flag when a precise name is available.',
      'Name boolean variables like lv_has_errors or lv_is_authorized.',
    ],
  },
  {
    title: 'Avoid SELECT Inside LOOP',
    category: 'Performance',
    summary: 'Repeated database calls inside loops are one of the most common ABAP performance problems.',
    checklist: [
      'Collect keys first, then read related data once.',
      'Consider INNER JOIN, LEFT OUTER JOIN, FOR ALL ENTRIES, or IN @range.',
      'Use ST05 to prove which SQL statement is expensive.',
    ],
  },
  {
    title: 'Choose The Right Internal Table Type',
    category: 'Performance',
    summary: 'The table type should match how the program reads and writes the data.',
    checklist: [
      'Use STANDARD TABLE for simple append-and-loop scenarios.',
      'Use SORTED TABLE for key reads plus ordered processing.',
      'Use HASHED TABLE for fast unique full-key lookup.',
    ],
  },
  {
    title: 'Validate Early On Selection Screens',
    category: 'UX',
    summary: 'Catch missing or unsafe inputs before expensive report logic starts.',
    checklist: [
      'Use AT SELECTION-SCREEN for input combinations.',
      'Protect large reports from completely open selections.',
      'Show messages that tell the user exactly what to fix.',
    ],
  },
  {
    title: 'Make Error Handling Useful',
    category: 'Error Handling',
    summary: 'A good error path should help the user or support team understand what failed.',
    checklist: [
      'Do not swallow exceptions silently.',
      'Log technical details for background jobs and interfaces.',
      'Use business-friendly messages on screens and detailed logs for support.',
    ],
  },
  {
    title: 'Before Using Modern Syntax',
    category: 'Compatibility',
    summary: 'Modern ABAP is cleaner, but system release and team standards still matter.',
    checklist: [
      'Check whether the target ECC or S/4HANA release supports the syntax.',
      'Use modern syntax where it improves readability, not just because it is shorter.',
      'Keep broadly reused examples classic-compatible when supporting older systems.',
    ],
  },
  {
    title: 'Review ALV Output Like A User',
    category: 'Reporting',
    summary: 'A technically correct ALV can still be hard to use if columns are noisy or unclear.',
    checklist: [
      'Hide technical columns that users do not need.',
      'Set clear column labels for business fields.',
      'Optimize widths and enable layout variants when users work with the report often.',
    ],
  },
  {
    title: 'Use Test Runs For Risky Updates',
    category: 'Safety',
    summary: 'Mass updates should give users a safe way to preview impact before committing changes.',
    checklist: [
      'Add a test-run checkbox for update reports.',
      'Show what would change before calling commit logic.',
      'Make update mode visually and textually obvious on the selection screen.',
    ],
  },
  {
    title: 'Think In SAP LUWs',
    category: 'Transactions',
    summary: 'Commit and rollback behavior affects data consistency across BAPIs, update tasks, and custom saves.',
    checklist: [
      'Avoid COMMIT WORK deep inside low-level helper methods.',
      'Use BAPI_TRANSACTION_COMMIT after BAPIs that require it.',
      'Use COMMIT WORK AND WAIT only when follow-up logic depends on the completed update.',
    ],
  },
];
