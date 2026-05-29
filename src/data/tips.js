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
    title: 'Read Only The Columns You Need',
    category: 'Open SQL',
    summary: 'Fetching unnecessary columns increases database traffic, memory use, and ALV/report preparation time.',
    checklist: [
      'Prefer an explicit field list over SELECT * for large tables and productive reports.',
      'Keep technical fields out of the result set unless the next step really needs them.',
      'Review old reports after requirements change because unused fields often stay behind.',
    ],
  },
  {
    title: 'Use WHERE Like A Performance Feature',
    category: 'Open SQL',
    summary: 'A selective WHERE clause is often the biggest difference between a fast report and a risky one.',
    checklist: [
      'Filter by key fields or indexed fields where the business requirement allows it.',
      'Avoid allowing large tables to run with completely open selections.',
      'Trace slow queries with ST05 before guessing which condition is the problem.',
    ],
  },
  {
    title: 'Check Indexes Before Blaming ABAP',
    category: 'Performance',
    summary: 'Slow SELECT statements may be caused by missing or unsuitable database indexes, not only ABAP logic.',
    checklist: [
      'Use ST05 to see the expensive SQL statement and access path.',
      'Compare the WHERE fields with existing table indexes in SE11 or ADT.',
      'Do not create custom indexes casually; confirm volume, selectivity, and functional ownership first.',
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
    title: 'Measure Before You Tune',
    category: 'Performance',
    summary: 'Performance work should start with evidence from SAP tools, not guesses from reading the code.',
    checklist: [
      'Use SAT when you need ABAP runtime hotspots and call hierarchy details.',
      'Use ST05 when database time looks suspicious or a SELECT is called too often.',
      'Compare traces using realistic data volumes, not only tiny test selections.',
    ],
  },
  {
    title: 'Reduce Data Transfer Between Layers',
    category: 'Performance',
    summary: 'Moving too much data between the database, application server, and UI slows otherwise simple programs.',
    checklist: [
      'Apply filtering and aggregation as close to the database as your release and design allow.',
      'Send only the fields the UI, ALV, interface, or next calculation needs.',
      'For very large jobs, process in packages instead of loading everything into memory at once.',
    ],
  },
  {
    title: 'Use Buffers With Care',
    category: 'Performance',
    summary: 'Buffered customizing or reference data can avoid repeated reads, but stale or unsuitable buffering causes confusion.',
    checklist: [
      'Consider buffering for stable, frequently read reference data.',
      'Avoid buffering assumptions for transactional tables that change often.',
      'Document local cache refresh rules when you keep lookup data in internal tables.',
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
    title: 'Replace Nested Loops With Keyed Access',
    category: 'Performance',
    summary: 'Nested loops over large internal tables can grow quickly from acceptable to painful.',
    checklist: [
      'Sort once and use READ TABLE ... BINARY SEARCH when classic syntax is required.',
      'Use SORTED or HASHED tables when repeated key lookups are the main operation.',
      'Move matching logic into SQL joins when the database can do the work more efficiently.',
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
    title: 'Keep Internal Tables Purpose-Sized',
    category: 'Internal Tables',
    summary: 'Internal tables are fast, but oversized tables still consume memory and make loops slower.',
    checklist: [
      'Store only rows and fields that are needed for the current processing step.',
      'Clear temporary tables after large package processing when they are no longer needed.',
      'Avoid keeping multiple full copies of the same dataset unless there is a clear reason.',
    ],
  },
  {
    title: 'Binary Search Needs Sorted Data',
    category: 'Internal Tables',
    summary: 'READ TABLE ... BINARY SEARCH is only reliable when the table is sorted by the same key sequence.',
    checklist: [
      'SORT the table by the exact fields used for the binary search.',
      'Prefer SORTED TABLE when the table should always remain sorted by key.',
      'If the key is unique and lookups dominate, consider HASHED TABLE instead.',
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
    title: 'Keep TRY CATCH Outside Hot Loops',
    category: 'Error Handling',
    summary: 'Exception handling is important, but wrapping tiny repeated operations can add avoidable overhead.',
    checklist: [
      'Validate known risky inputs before the loop when possible.',
      'Catch expected business issues at a meaningful process boundary.',
      'Inside loops, collect row-level errors and report them after processing.',
    ],
  },
  {
    title: 'Do Not MESSAGE In Every Iteration',
    category: 'Error Handling',
    summary: 'Messages inside large loops can slow processing and overwhelm users or job logs.',
    checklist: [
      'Collect warnings and errors in an internal table during processing.',
      'Show a summary with drill-down details after the loop finishes.',
      'For background jobs, write useful application log entries instead of repeated screen messages.',
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
    title: 'Precalculate Values Used In Loops',
    category: 'Performance',
    summary: 'Repeated calculations inside large loops waste runtime when the result does not change per row.',
    checklist: [
      'Move constants, conversion factors, and date boundaries outside the loop.',
      'Avoid repeated function calls in a loop when one lookup table can hold the results.',
      'Keep the loop body focused on row-specific logic only.',
    ],
  },
  {
    title: 'Build Long Strings Deliberately',
    category: 'Performance',
    summary: 'Repeated string concatenation in big loops can become expensive and hard to read.',
    checklist: [
      'Collect lines in an internal table when building large text output.',
      'Use string templates for readable single-line formatting on supported releases.',
      'Avoid growing the same string thousands of times unless the volume is known to be small.',
    ],
  },
  {
    title: 'Package Large Background Work',
    category: 'Batch Processing',
    summary: 'Large data jobs are easier to control when processed in smaller chunks.',
    checklist: [
      'Read and process data in packages when full-table processing would be too large.',
      'Commit only at controlled boundaries for update programs, never randomly inside helpers.',
      'Record progress and failed keys so the job can be analyzed or restarted safely.',
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
  {
    title: 'Optimize Fiori And Web Dynpro Round Trips',
    category: 'UI Performance',
    summary: 'For SAP web UIs, user experience depends heavily on how much data and how many requests each screen needs.',
    checklist: [
      'Load only the data needed for the current view or user action.',
      'Avoid expensive backend calls during simple rendering events.',
      'Keep view logic separate from data retrieval so performance issues are easier to trace.',
    ],
  },
  {
    title: 'Lazy Load Secondary Details',
    category: 'UI Performance',
    summary: 'Not every tab, section, or detail table has to be loaded before the user asks for it.',
    checklist: [
      'Load header or summary data first, then fetch details on demand.',
      'Use lazy loading especially for logs, attachments, long histories, and secondary item lists.',
      'Make loading states clear so users understand that data is still being fetched.',
    ],
  },
];
