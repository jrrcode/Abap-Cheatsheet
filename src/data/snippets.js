export const snippets = [
  {
    id: 'work-rfc-destination-smoke-test',
    title: 'RFC Destination Smoke Test',
    category: 'RFC',
    tags: ['RFC', 'Integration', 'Classic ABAP', 'Work Note'],
    explanation: 'Small personal note for checking whether an RFC destination responds before deeper interface testing.',
    code: `DATA lv_message TYPE string.

CALL FUNCTION 'RFC_PING'
  DESTINATION 'YOUR_RFC_DESTINATION'
  EXCEPTIONS
    system_failure        = 1 MESSAGE lv_message
    communication_failure = 2 MESSAGE lv_message
    OTHERS                = 3.

IF sy-subrc = 0.
  MESSAGE 'RFC destination is reachable' TYPE 'S'.
ELSE.
  MESSAGE lv_message TYPE 'E'.
ENDIF.`,
    notes: [
      'Replace YOUR_RFC_DESTINATION with the SM59 destination name.',
      'Use this only as a connectivity check; it does not prove the target function module works.',
      'For productive interfaces, log the destination and returned error text.',
    ],
  },
  {
    id: 'work-alv-hide-technical-columns',
    title: 'ALV Hide Technical Columns',
    category: 'ALV',
    tags: ['ALV', 'Reporting', 'CL_SALV_TABLE', 'Work Note'],
    explanation: 'Reminder snippet for keeping technical keys available in the output table while hiding them from users.',
    code: `DATA lo_alv     TYPE REF TO cl_salv_table.
DATA lo_columns TYPE REF TO cl_salv_columns_table.
DATA lo_column  TYPE REF TO cl_salv_column.

cl_salv_table=>factory(
  IMPORTING
    r_salv_table = lo_alv
  CHANGING
    t_table      = lt_output ).

lo_columns = lo_alv->get_columns( ).
lo_columns->set_optimize( abap_true ).

lo_column = lo_columns->get_column( 'MANDT' ).
lo_column->set_visible( abap_false ).

lo_alv->display( ).`,
    notes: [
      'Wrap get_column calls in TRY/CATCH if the output structure can change.',
      'Keep hidden keys only when they are useful for sorting, drilldown, or support.',
      'Use clear column names for fields users actually see.',
    ],
  },
  {
    id: 'work-select-options-safe-default',
    title: 'SELECT-OPTIONS With Default Date Range',
    category: 'Selection Screen',
    tags: ['SELECT-OPTIONS', 'Selection Screen', 'Beginner', 'Work Note'],
    explanation: 'Starter pattern for reports that should avoid running wide open by default.',
    code: `PARAMETERS p_bukrs TYPE bukrs OBLIGATORY.

SELECT-OPTIONS s_erdat FOR sy-datum.

INITIALIZATION.
  s_erdat-sign   = 'I'.
  s_erdat-option = 'BT'.
  s_erdat-low    = sy-datum - 30.
  s_erdat-high   = sy-datum.
  APPEND s_erdat.

AT SELECTION-SCREEN.
  IF s_erdat[] IS INITIAL.
    MESSAGE 'Enter a date range before running the report' TYPE 'E'.
  ENDIF.`,
    notes: [
      'Replace sy-datum with the real table field in a full report.',
      'Default ranges help prevent accidental full-table reads.',
      'Keep validation messages specific so users know what to fix.',
    ],
  },
  {
    id: 'work-modif-id-basic-toggle',
    title: 'Dynamic Selection Screen Toggle',
    category: 'Selection Screen',
    tags: ['MODIF ID', 'Selection Screen', 'UI', 'Work Note'],
    explanation: 'Compact pattern for showing or hiding advanced inputs based on a checkbox.',
    code: `PARAMETERS p_adv AS CHECKBOX USER-COMMAND adv.
PARAMETERS p_limit TYPE i MODIF ID adv.

AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'ADV'.
      screen-active = COND #( WHEN p_adv = abap_true THEN 1 ELSE 0 ).
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.`,
    notes: [
      'MODIF ID values are compared through SCREEN-GROUP1 in uppercase.',
      'For older releases, replace COND # with a normal IF statement.',
      'Keep dynamic fields optional unless validation also checks when they are visible.',
    ],
  },
  {
    id: 'work-transport-preflight-check',
    title: 'Transport Preflight Checklist',
    category: 'Transports',
    tags: ['Transport', 'Quality Check', 'Work Note'],
    explanation: 'Personal checklist to run before releasing a transport that contains ABAP report or class changes.',
    code: `" Transport preflight notes:
" 1. Syntax check all changed includes/classes/programs.
" 2. Remove temporary BREAK-POINT and test WRITE statements.
" 3. Run the main happy path and at least one empty-result path.
" 4. Confirm text elements, messages, and selection texts are transported.
" 5. Check dependent DDIC objects, roles, variants, and customizing requests.
" 6. Add test evidence or comments required by your team process.`,
    notes: [
      'Keep this as a checklist snippet rather than executable ABAP.',
      'Verify whether the change needs separate customizing or role transports.',
      'For urgent fixes, still record what was tested and what risk remains.',
    ],
  },
];
