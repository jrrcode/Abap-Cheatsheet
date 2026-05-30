// Built-in tips are editable in the browser after first load.
// User changes are stored locally under localStorage key:
// abap-cheatsheets-user-tips.
export const tips = [
  {
    id: 'tip-debugging-workflow',
    title: 'Debugging Workflow',
    summary:
      'Use the debugger to inspect variables, internal tables, SY-SUBRC, call stack, SELECT results, and parameter flow between routines.',
    checklist: [
      '/h starts debugging before executing a transaction or report.',
      'Use a session breakpoint for your current user/session.',
      'Use an external breakpoint for HTTP, RFC, and similar entry points for your user.',
      'Use watchpoints to stop when a variable changes or reaches a condition.',
      'Check SY-SUBRC immediately after READ, CALL, SELECT, and other important statements.',
      'Inspect internal table row count, table keys, and selected row content.',
      'Check the call stack to understand how the code path was reached.',
      'For RFC issues, set the external breakpoint in the called system and user context.',
      'Remove temporary BREAK-POINT statements before transport unless intentionally controlled.',
    ],
  },
  {
    id: 'tip-common-sap-transactions',
    title: 'Common SAP Transactions',
    summary:
      'These SAP GUI transactions are common starting points for inspecting code, dictionary objects, function modules, transports, jobs, dumps, logs, and RFC destinations.',
    checklist: [
      'SE38: ABAP Editor and reports.',
      'SE80: Object Navigator.',
      'SE11: ABAP Dictionary.',
      'SE16N: Table display.',
      'SE37: Function Builder.',
      'SE24: Class Builder.',
      'SE09 / SE10: Transport Organizer.',
      'SE03: Transport Organizer Tools.',
      'SM59: RFC destinations.',
      'ST22: ABAP dumps.',
      'SM21: System log.',
      'SM37: Background jobs.',
      'Transaction availability depends on system type, SAP GUI usage, roles, and authorizations.',
    ],
  },
  {
    id: 'tip-common-beginner-mistakes',
    title: 'Common Beginner Mistakes',
    summary:
      'Use this checklist when code compiles but behaves strangely, dumps, returns too much data, or fails during transport analysis.',
    checklist: [
      'FORM/PERFORM parameter count, order, and types must match.',
      'Do not define FORM inside another FORM.',
      'Transport object type for programs is commonly PROG, not arbitrary text such as REPS.',
      'Modern Open SQL needs @ for ABAP host variables.',
      'SORT before DELETE ADJACENT DUPLICATES using the same comparison fields.',
      'Avoid SELECT inside LOOP.',
      'Check the driver table is not initial before FOR ALL ENTRIES.',
      'Avoid old internal tables WITH HEADER LINE.',
      'SQL LIKE uses %, while ABAP CP uses *.',
      'Use SE11 for object fields and SE09/SE10 for transport ownership.',
    ],
  },
  {
    id: 'tip-ddic-object-types',
    title: 'SAP Dictionary Object Types',
    summary:
      'Use SE11 to understand whether you are working with a table, structure, data element, domain, or search help before writing ABAP against it.',
    checklist: [
      'Tables store or expose tabular data and have key fields.',
      'Structures define reusable field groups but do not store database rows by themselves.',
      'Data elements provide semantic meaning, labels, and documentation.',
      'Domains define the technical type, length, fixed values, and possible conversion exits.',
      'Search helps provide input help for fields.',
      'Transparent tables map directly to database tables.',
      'Pool and cluster tables are legacy concepts; avoid treating them as S/4HANA-ready design targets.',
      'Always confirm field names, key fields, and conversion exits in SE11 before coding.',
    ],
  },
  {
    id: 'tip-inner-vs-left-join',
    title: 'When to Use INNER JOIN vs LEFT OUTER JOIN',
    summary:
      'Choose the join type based on whether missing right-side data should remove the left-side row or remain visible with empty optional fields.',
    checklist: [
      'Use INNER JOIN when both sides must exist for the result to be meaningful.',
      'Use LEFT OUTER JOIN when the left-side row must remain even if optional right-side data is missing.',
      'Header and item joins often use INNER JOIN when only complete header/item combinations matter.',
      'Text, status, or optional detail joins often use LEFT OUTER JOIN.',
      'A WHERE condition on the right table of a LEFT OUTER JOIN can accidentally remove unmatched rows.',
      'Do not use DISTINCT to hide duplicates caused by an incorrect join condition.',
    ],
  },
  {
    id: 'tip-methods-over-forms',
    title: 'Why Methods Are Preferred Over FORMs',
    summary:
      'FORMS are still important in legacy reports, but methods are usually clearer and easier to maintain for new ABAP logic.',
    checklist: [
      'Methods have clearer signatures and stronger encapsulation.',
      'Classes make it easier to separate responsibilities.',
      'Methods are easier to refactor than large procedural FORM blocks.',
      'Instance methods can hold required state without relying on global variables.',
      'Static methods are useful for stateless helper behavior.',
      'Use FORMs when maintaining classic reports that already follow that style.',
    ],
  },
  {
    id: 'tip-selection-screen-light',
    title: 'Keep Selection Screen Logic Light',
    summary:
      'Selection-screen events should mainly validate input and control screen behavior, not run heavy business logic.',
    checklist: [
      'Use AT SELECTION-SCREEN for input validation.',
      'Use AT SELECTION-SCREEN OUTPUT for dynamic screen modification.',
      'Avoid expensive SELECTs in selection-screen events unless truly necessary.',
      'Use clear MESSAGE TYPE E validation when input is invalid.',
      'Move heavy reads and processing to START-OF-SELECTION or methods.',
    ],
  },
  {
    id: 'tip-message-behavior',
    title: 'Message Behavior Reminders',
    summary:
      'ABAP message behavior depends on message type and processing context, especially on selection screens.',
    checklist: [
      "TYPE 'E' stops processing on the selection screen.",
      "TYPE 'I' normally shows an information popup.",
      "TYPE 'S' DISPLAY LIKE 'E' is useful when you want error styling without a hard stop in some report contexts.",
      'Message class placeholders &1, &2, &3, and &4 are filled by MSGV1 to MSGV4.',
      'Read SY-MSG fields immediately because later statements can overwrite them.',
    ],
  },
  {
    id: 'tip-lock-object-basics',
    title: 'SAP Lock Object Basics',
    summary:
      'Lock objects help prevent multiple users from changing the same business data at the same time.',
    checklist: [
      'Lock objects are created in SE11.',
      'Generated ENQUEUE_* and DEQUEUE_* function modules depend on the lock object name.',
      'Check lock entries in SM12.',
      'Always release locks when done.',
      'Handle foreign locks with a useful user message.',
    ],
  },
  {
    id: 'tip-background-jobs',
    title: 'Background Job Reminders',
    summary:
      'Background jobs run without normal foreground screen interaction, so reports must be designed for unattended execution.',
    checklist: [
      'Use SM36 to schedule jobs.',
      'Use SM37 to monitor jobs.',
      'Use variants for repeatable background execution.',
      'Avoid frontend-dependent logic in background jobs.',
      'WRITE output usually goes to spool for background runs.',
    ],
  },
  {
    id: 'tip-enhancements',
    title: 'Enhancement Basics',
    summary:
      'Enhancements let you add custom logic without directly modifying SAP standard code.',
    checklist: [
      'BADIs are common in newer SAP systems.',
      'User exits and customer exits are common in older ECC systems.',
      'Use SMOD/CMOD for classic customer exits.',
      'Use SE18/SE19 for BADI definition/implementation work.',
      'Search existing enhancements before creating a new one.',
      'Avoid direct modification of SAP standard unless formally approved.',
    ],
  },
  {
    id: 'tip-search-techniques',
    title: 'ABAP Search Techniques',
    summary:
      'A large part of ABAP work is finding where existing logic, tables, messages, and enhancements already live.',
    checklist: [
      'Use where-used before changing code.',
      'Use SE84 Repository Information System for repository searches.',
      'Search by table name, field name, function module name, class name, and message text.',
      'Use SE80 source search when maintaining classic code.',
      'Use the debugger call stack to trace runtime flow.',
      'Use TADIR when you need object directory context.',
    ],
  },
  {
    id: 'tip-file-processing',
    title: 'Application Server File Processing',
    summary:
      'OPEN DATASET works with application-server files, not local PC files.',
    checklist: [
      'Use AL11 to inspect application server directories.',
      'Check SY-SUBRC after OPEN DATASET, READ DATASET, TRANSFER, and CLOSE DATASET.',
      'Frontend upload/download is different from server file processing.',
      'Coordinate directories and authorizations with BASIS when needed.',
      'BDC is old but still appears in legacy projects; prefer stable APIs when available.',
    ],
  },
  {
    id: 'tip-standard-code-reading',
    title: 'Reading SAP Standard Code',
    summary:
      'Reading SAP standard code is a real ABAP skill: debug first, understand the flow, then decide whether an enhancement is appropriate.',
    checklist: [
      'Use breakpoints in standard code when authorized.',
      'Read the call stack before changing anything.',
      'Search standard includes from the main program.',
      'Learn naming patterns used by the module you support.',
      'Copy patterns carefully and adapt types/field names.',
      'Do not modify SAP standard directly unless approved.',
    ],
  },
  {
    id: 'tip-useful-standard-tables',
    title: 'Useful SAP Standard Tables',
    summary:
      'Use these as read-only orientation points when debugging or analyzing SAP data. Prefer standard transactions, APIs, and authorization-aware tools for business use.',
    checklist: [
      'USR02: user master logon/account data.',
      'USR21: links SAP user IDs to person/address numbers.',
      'ADRP: person name and address-related data used with person numbers.',
      'DD02L: ABAP Dictionary table metadata.',
      'DD03L: ABAP Dictionary table field metadata.',
      'DD04L: data element metadata.',
      'TADIR: repository object directory.',
      'TRDIR: ABAP program directory metadata.',
      'TBTCO: background job header and status data.',
      'TBTCP: background job step, program, and variant data.',
      'Never update SAP standard tables directly; use standard tools, APIs, or approved application logic.',
    ],
  },
  {
    id: 'tip-useful-function-modules',
    title: 'Useful Common Function Modules',
    summary:
      'These function modules often appear in classic ABAP systems. Always confirm the interface and release behavior in SE37 before using them in your system.',
    checklist: [
      'CONVERSION_EXIT_ALPHA_INPUT: convert external values to internal ALPHA format.',
      'CONVERSION_EXIT_ALPHA_OUTPUT: convert internal ALPHA values to display format.',
      'POPUP_TO_CONFIRM: simple confirmation popup for foreground SAP GUI reports.',
      'GUI_UPLOAD: upload a frontend file in foreground SAP GUI processing.',
      'GUI_DOWNLOAD: download a frontend file in foreground SAP GUI processing.',
      'JOB_OPEN: start defining a background job.',
      'JOB_CLOSE: close and schedule a background job.',
      'ENQUEUE_* generated function modules: lock business objects.',
      'DEQUEUE_* generated function modules: release locks.',
      'DATE_CHECK_PLAUSIBILITY: check whether a date value is valid in many classic systems.',
      'RFC_CONNECTION_CLOSE: close an RFC destination connection when needed.',
      'Avoid frontend-only function modules in background jobs, RFC contexts, and application-server-only processing.',
    ],
  },
  {
    id: 'tip-first-job-abap',
    title: 'Junior ABAP First Job Checklist',
    summary:
      'Focus first on the ABAP skills that help you safely read, debug, and change existing enterprise code.',
    checklist: [
      'Master internal tables first.',
      'Learn debugging before trying to memorize everything.',
      'Avoid SELECT inside LOOP.',
      'Always check SY-SUBRC after important operations.',
      'Learn SE11 table structures before coding SELECTs.',
      'Prefer typed parameters over generic tables.',
      'Keep selection-screen logic light.',
      'Use INNER JOIN when you need records existing in both tables.',
      'Use LEFT JOIN when you need all header records even if details are missing.',
      'Read existing code patterns in the same system before inventing new ones.',
      'Ask functional meaning before changing technical logic.',
      'Confirm local vs remote execution when RFC DESTINATION is involved.',
    ],
  },
];
