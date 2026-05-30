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
];
