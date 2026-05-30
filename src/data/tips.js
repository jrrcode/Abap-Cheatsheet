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
      'Distinguish transport requests from tasks in E070 and E071.',
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
    id: 'tip-transport-request-vs-task',
    title: 'Transport Request vs Task',
    summary:
      'Transport analysis is easier when you separate parent requests from developer tasks and understand where objects are currently assigned.',
    checklist: [
      'E070-TRKORR contains the request or task number.',
      'E070-STRKORR contains the parent request for a task.',
      'E070-TRSTATUS contains the transport status.',
      'Objects can remain under unreleased tasks before they appear as expected at request level.',
      'Use E071 to inspect object entries under a request or task.',
      'Use E071K for transported table keys such as TABU entries.',
      'Released and unreleased behavior depends on your team transport process and route.',
      'Use SE09 or SE10 first for normal transport ownership checks.',
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
];
