export const compatibilityOptions = ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'];

export const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

export const cheatsheets = [
  {
    id: 'selection-screen-parameters-basic',
    title: 'PARAMETERS Basic Input Fields',
    category: 'User Interface / Selection Screens',
    subcategory: 'PARAMETERS',
    tags: ['Classic ABAP', 'Beginner', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Use PARAMETERS for single-value inputs on an executable report selection screen. This syntax is broadly compatible and works well for required fields, defaults, and checkboxes.',
    code: `REPORT z_demo_parameters.

PARAMETERS:
  p_bukrs TYPE bukrs OBLIGATORY,
  p_gjahr TYPE gjahr DEFAULT sy-datum(4),
  p_test  AS CHECKBOX DEFAULT abap_true.

START-OF-SELECTION.
  WRITE: / 'Company code:', p_bukrs,
         / 'Fiscal year:',  p_gjahr,
         / 'Test run:',     p_test.`,
    notes: [
      'Use OBLIGATORY for required user input.',
      'Prefer data elements such as BUKRS or GJAHR when they provide useful SAP search helps and labels.',
      'Checkbox parameters return ABAP_TRUE or ABAP_FALSE on modern systems; on older systems they are commonly handled as X or space.',
    ],
    commonMistakes: [
      'Using PARAMETERS for multiple values or ranges; use SELECT-OPTIONS instead.',
      'Putting business validation in START-OF-SELECTION instead of AT SELECTION-SCREEN.',
      'Assuming DEFAULT values replace validation; users can still change them.',
    ],
    relatedTopics: ['SELECT-OPTIONS', 'AT SELECTION-SCREEN', 'checkboxes', 'radio buttons'],
  },
  {
    id: 'selection-screen-select-options-basic',
    title: 'SELECT-OPTIONS Range Input',
    category: 'User Interface / Selection Screens',
    subcategory: 'SELECT-OPTIONS',
    tags: ['Classic ABAP', 'Beginner', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Use SELECT-OPTIONS when the user needs ranges, multiple values, exclusions, or pattern-style selection criteria.',
    code: `REPORT z_demo_select_options.

TABLES mara.

SELECT-OPTIONS:
  s_matnr FOR mara-matnr,
  s_mtart FOR mara-mtart NO INTERVALS.

START-OF-SELECTION.
  SELECT matnr, mtart, meins
    FROM mara
    INTO TABLE @DATA(lt_materials)
    WHERE matnr IN @s_matnr
      AND mtart IN @s_mtart.

  WRITE: / 'Materials found:', lines( lt_materials ).`,
    notes: [
      'SELECT-OPTIONS creates an internal range table with SIGN, OPTION, LOW, and HIGH.',
      'NO INTERVALS allows multiple single values but hides the HIGH field.',
      'The modern Open SQL example with @ host variables requires ABAP 7.40+.',
    ],
    commonMistakes: [
      'Forgetting that an empty SELECT-OPTIONS table means no restriction in an IN condition.',
      'Using TABLES only for business logic; here it is only used to declare the selection reference field.',
      'Not checking whether broad selections could read too much data.',
    ],
    relatedTopics: ['ranges', 'SELECT with WHERE', 'Open SQL', 'selection screens'],
  },
  {
    id: 'selection-screen-modif-id-dynamic',
    title: 'Dynamic Selection Screen With MODIF ID',
    category: 'User Interface / Selection Screens',
    subcategory: 'MODIF ID',
    tags: ['Classic ABAP', 'Intermediate', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Intermediate',
    explanation:
      'Use MODIF ID with AT SELECTION-SCREEN OUTPUT to hide, show, enable, or disable fields based on user choices.',
    code: `REPORT z_demo_modif_id.

PARAMETERS:
  p_test RADIOBUTTON GROUP r1 DEFAULT 'X' USER-COMMAND mode,
  p_post RADIOBUTTON GROUP r1,
  p_date TYPE sy-datum MODIF ID pst.

AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'PST'.
      screen-active = COND #( WHEN p_post = abap_true THEN 1 ELSE 0 ).
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.

START-OF-SELECTION.
  IF p_post = abap_true.
    WRITE: / 'Posting date:', p_date.
  ELSE.
    WRITE: / 'Running test mode'.
  ENDIF.`,
    notes: [
      'MODIF ID values are stored in SCREEN-GROUP1 and are usually written as uppercase at runtime.',
      'USER-COMMAND on a radio button triggers a screen refresh when the selection changes.',
      'COND # is ABAP 7.40+; use IF/ELSE assignment for older releases.',
    ],
    commonMistakes: [
      'Changing SCREEN fields without calling MODIFY SCREEN.',
      'Expecting START-OF-SELECTION changes to affect the selection screen; use AT SELECTION-SCREEN OUTPUT.',
      'Using lowercase group checks even though SCREEN-GROUP1 is uppercase at runtime.',
    ],
    relatedTopics: ['AT SELECTION-SCREEN OUTPUT', 'radio buttons', 'dynamic input fields'],
  },
  {
    id: 'select-basic-list',
    title: 'Basic SELECT Into Internal Table',
    category: 'SELECT Statements',
    subcategory: 'Basic SELECT',
    tags: ['Classic ABAP', 'Modern ABAP 7.40+', 'Beginner', 'Open SQL'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Read a set of rows from a transparent table into an internal table. Select only the fields you need and always apply meaningful restrictions for large tables.',
    code: `TYPES: BEGIN OF ty_material,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
         meins TYPE mara-meins,
       END OF ty_material.

DATA lt_materials TYPE STANDARD TABLE OF ty_material.

SELECT matnr mtart meins
  FROM mara
  INTO TABLE lt_materials
  WHERE mtart = 'FERT'.

IF sy-subrc = 0.
  WRITE: / 'Rows selected:', lines( lt_materials ).
ENDIF.`,
    notes: [
      'This classic form is broadly compatible with ECC systems.',
      'For production code, avoid unrestricted SELECTs on large application tables.',
      'Use package-size processing when very large result sets are expected.',
    ],
    commonMistakes: [
      'Using SELECT * when only a few fields are needed.',
      'Assuming SY-SUBRC alone tells you how many rows were selected; use LINES for the count.',
      'Reading large tables without WHERE conditions.',
    ],
    relatedTopics: ['SELECT with WHERE', 'internal tables', 'performance'],
  },
  {
    id: 'select-single-by-key',
    title: 'SELECT SINGLE By Key',
    category: 'SELECT Statements',
    subcategory: 'SELECT SINGLE',
    tags: ['Classic ABAP', 'Beginner', 'Open SQL'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Use SELECT SINGLE to read one row, ideally by a full or highly selective key. Always handle the case where no row is found.',
    code: `DATA ls_company TYPE t001.

SELECT SINGLE bukrs butxt land1 waers
  FROM t001
  INTO CORRESPONDING FIELDS OF ls_company
  WHERE bukrs = p_bukrs.

IF sy-subrc = 0.
  WRITE: / ls_company-bukrs, ls_company-butxt.
ELSE.
  MESSAGE 'Company code not found' TYPE 'E'.
ENDIF.`,
    notes: [
      'SELECT SINGLE without a selective WHERE condition can return an arbitrary matching row.',
      'INTO CORRESPONDING FIELDS is useful when the target structure has compatible field names.',
      'Modern ABAP can use inline DATA declarations if the release supports them.',
    ],
    commonMistakes: [
      'Using SELECT SINGLE without a WHERE clause.',
      'Expecting SELECT SINGLE to mean sorted first row; use ORDER BY with UP TO 1 ROWS when order matters.',
      'Ignoring SY-SUBRC after the database read.',
    ],
    relatedTopics: ['WHERE', 'inline declarations', 'messages'],
  },
  {
    id: 'join-inner-sales-items',
    title: 'INNER JOIN Header And Item Tables',
    category: 'Joins',
    subcategory: 'INNER JOIN',
    tags: ['Modern ABAP 7.40+', 'Open SQL', 'Intermediate', 'Performance'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Intermediate',
    explanation:
      'Use INNER JOIN when matching rows must exist in both tables. This example reads sales order header and item fields in one database request.',
    code: `SELECT a~vbeln,
       a~erdat,
       a~auart,
       b~posnr,
       b~matnr,
       b~kwmeng
  FROM vbak AS a
  INNER JOIN vbap AS b
    ON b~vbeln = a~vbeln
  WHERE a~erdat >= @p_date
    AND a~auart = @p_auart
  INTO TABLE @DATA(lt_sales_items).`,
    notes: [
      'The @ host variable syntax requires ABAP 7.40+.',
      'Use INNER JOIN only when rows without matching items should be excluded.',
      'Keep the field list narrow to reduce memory and network traffic.',
    ],
    commonMistakes: [
      'Joining tables without checking cardinality and expected row multiplication.',
      'Filtering only after reading into ABAP instead of pushing conditions to the database.',
      'Using INNER JOIN when missing child rows should still be shown.',
    ],
    relatedTopics: ['LEFT OUTER JOIN', 'Open SQL', 'ST05', 'performance'],
  },
  {
    id: 'join-left-outer-master-text',
    title: 'LEFT OUTER JOIN Optional Text Data',
    category: 'Joins',
    subcategory: 'LEFT OUTER JOIN',
    tags: ['Modern ABAP 7.40+', 'Open SQL', 'Intermediate'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Intermediate',
    explanation:
      'Use LEFT OUTER JOIN when the left table row should remain in the result even if optional text or detail data is missing.',
    code: `SELECT a~matnr,
       a~mtart,
       t~maktx
  FROM mara AS a
  LEFT OUTER JOIN makt AS t
    ON  t~matnr = a~matnr
    AND t~spras = @sy-langu
  WHERE a~matnr IN @s_matnr
  INTO TABLE @DATA(lt_materials).`,
    notes: [
      'Put right-table language or status filters in the ON condition when they define the optional match.',
      'Fields from the right table can be initial when no matching row exists.',
      'The modern host variable syntax requires ABAP 7.40+.',
    ],
    commonMistakes: [
      'Putting right-table filters in WHERE and accidentally turning the query into an INNER JOIN effect.',
      'Not handling initial text fields when optional rows are missing.',
      'Selecting text table rows without a language condition.',
    ],
    relatedTopics: ['INNER JOIN', 'text tables', 'Open SQL'],
  },
  {
    id: 'internal-table-loop-read-classic',
    title: 'Internal Table LOOP And READ TABLE',
    category: 'Internal Tables',
    subcategory: 'LOOP / READ TABLE',
    tags: ['Classic ABAP', 'Beginner', 'Internal Tables'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Use LOOP AT to process table rows and READ TABLE to find a related row by key. This classic pattern is common in ECC codebases.',
    code: `TYPES: BEGIN OF ty_total,
         matnr TYPE matnr,
         qty   TYPE menge_d,
       END OF ty_total.

DATA lt_totals TYPE SORTED TABLE OF ty_total WITH UNIQUE KEY matnr.
DATA ls_total  TYPE ty_total.

LOOP AT lt_items INTO DATA(ls_item).
  READ TABLE lt_totals INTO ls_total
    WITH KEY matnr = ls_item-matnr.

  IF sy-subrc = 0.
    ls_total-qty = ls_total-qty + ls_item-menge.
    MODIFY lt_totals FROM ls_total.
  ELSE.
    ls_total-matnr = ls_item-matnr.
    ls_total-qty   = ls_item-menge.
    INSERT ls_total INTO TABLE lt_totals.
  ENDIF.
ENDLOOP.`,
    notes: [
      'A SORTED TABLE with a key makes repeated key access more predictable than a plain STANDARD TABLE.',
      'Use HASHED TABLE for direct unique-key lookup when sorted order is not needed.',
      'Inline DATA declarations require ABAP 7.40+; declare work areas separately for older releases.',
    ],
    commonMistakes: [
      'Using BINARY SEARCH on an unsorted STANDARD TABLE.',
      'Modifying a table without using the right key or index.',
      'Nested LOOPs over large tables when a keyed table would be faster.',
    ],
    relatedTopics: ['SORTED TABLE', 'HASHED TABLE', 'READ TABLE', 'performance'],
  },
  {
    id: 'internal-table-value-syntax',
    title: 'VALUE Syntax For Inline Table Data',
    category: 'Internal Tables',
    subcategory: 'VALUE',
    tags: ['Modern ABAP 7.40+', 'Intermediate', 'Internal Tables'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Intermediate',
    explanation:
      'Use VALUE to create structures or internal tables compactly. This is useful for test data, ranges, and small configuration-like lists.',
    code: `TYPES: BEGIN OF ty_status,
         code TYPE char1,
         text TYPE char30,
       END OF ty_status.

DATA lt_status TYPE STANDARD TABLE OF ty_status WITH EMPTY KEY.

lt_status = VALUE #(
  ( code = 'A' text = 'Open' )
  ( code = 'B' text = 'Blocked' )
  ( code = 'C' text = 'Closed' )
).`,
    notes: [
      'VALUE # lets the compiler infer the target type from the left-hand side.',
      'For older releases before ABAP 7.40, use APPEND or INSERT statements instead.',
      'Keep large production data creation readable; compact syntax is not always clearer.',
    ],
    commonMistakes: [
      'Using VALUE # where the compiler cannot infer the type.',
      'Building huge tables inline and making the code hard to maintain.',
      'Forgetting WITH EMPTY KEY behavior when table key semantics matter.',
    ],
    relatedTopics: ['ranges', 'inline declarations', 'Modern ABAP 7.40+'],
  },
  {
    id: 'internal-table-corresponding',
    title: 'CORRESPONDING For Field Mapping',
    category: 'Internal Tables',
    subcategory: 'CORRESPONDING',
    tags: ['Modern ABAP 7.40+', 'Intermediate', 'Internal Tables'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Intermediate',
    explanation:
      'Use CORRESPONDING to map fields with the same names between structures or tables. Use explicit MAPPING when names differ.',
    code: `TYPES: BEGIN OF ty_source,
         matnr TYPE matnr,
         maktx TYPE maktx,
         meins TYPE meins,
       END OF ty_source.

TYPES: BEGIN OF ty_target,
         material TYPE matnr,
         maktx    TYPE maktx,
         unit     TYPE meins,
       END OF ty_target.

DATA ls_target TYPE ty_target.

ls_target = CORRESPONDING #(
  ls_source
  MAPPING material = matnr
          unit     = meins
).`,
    notes: [
      'Fields with identical names are copied automatically.',
      'MAPPING is useful when the target structure uses cleaner or API-specific names.',
      'Check your system release for the exact CORRESPONDING additions available.',
    ],
    commonMistakes: [
      'Assuming differently named fields are copied without MAPPING.',
      'Missing fields silently because names do not match.',
      'Using broad automatic mapping where explicit assignments would be safer for business-critical transformations.',
    ],
    relatedTopics: ['VALUE', 'MOVE-CORRESPONDING', 'data transformations'],
  },
  {
    id: 'alv-cl-salv-basic-display',
    title: 'CL_SALV_TABLE Basic ALV Display',
    category: 'ALV',
    subcategory: 'CL_SALV_TABLE',
    tags: ['Classic ABAP', 'Beginner', 'ALV', 'Reporting'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Use CL_SALV_TABLE for a quick read-only ALV list with standard functions and optimized column widths.',
    code: `DATA lo_alv TYPE REF TO cl_salv_table.

TRY.
    cl_salv_table=>factory(
      IMPORTING
        r_salv_table = lo_alv
      CHANGING
        t_table      = lt_output ).

    lo_alv->get_functions( )->set_all( abap_true ).
    lo_alv->get_columns( )->set_optimize( abap_true ).
    lo_alv->display( ).

  CATCH cx_salv_msg INTO DATA(lx_salv).
    MESSAGE lx_salv->get_text( ) TYPE 'E'.
ENDTRY.`,
    notes: [
      'SALV is best for read-only report output.',
      'Use CL_GUI_ALV_GRID or editable ALV patterns when users need to edit cells.',
      'Inline exception variable DATA(lx_salv) requires ABAP 7.40+; declare it before TRY on older systems.',
    ],
    commonMistakes: [
      'Trying to build editable grids with basic SALV.',
      'Calling DISPLAY before configuring columns or functions.',
      'Not catching CX_SALV_MSG around factory creation.',
    ],
    relatedTopics: ['column settings', 'layout', 'display customization', 'TRY/CATCH'],
  },
  {
    id: 'rfc-call-function-destination',
    title: 'CALL FUNCTION DESTINATION RFC',
    category: 'RFC',
    subcategory: 'CALL FUNCTION DESTINATION',
    tags: ['Classic ABAP', 'Intermediate', 'RFC', 'Integration'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'CALL FUNCTION DESTINATION is classic-compatible. Inline MESSAGE DATA declarations require newer syntax, so this template uses explicit variables.',
    difficulty: 'Intermediate',
    explanation:
      'Use DESTINATION to call a remote-enabled function module in another SAP system. Always handle communication and system failures.',
    code: `DATA lv_destination TYPE rfcdest VALUE 'YOUR_RFC_DESTINATION'.
DATA lv_comm_msg    TYPE string.
DATA lv_sys_msg     TYPE string.
DATA lt_return      TYPE TABLE OF bapiret2.

CALL FUNCTION 'Z_REMOTE_STATUS_READ'
  DESTINATION lv_destination
  EXPORTING
    iv_object_id            = lv_object_id
  TABLES
    et_return               = lt_return
  EXCEPTIONS
    communication_failure   = 1 MESSAGE lv_comm_msg
    system_failure          = 2 MESSAGE lv_sys_msg
    OTHERS                  = 3.

CASE sy-subrc.
  WHEN 0.
    "Process returned data here.
  WHEN 1.
    MESSAGE lv_comm_msg TYPE 'E'.
  WHEN 2.
    MESSAGE lv_sys_msg TYPE 'E'.
  WHEN OTHERS.
    MESSAGE 'RFC call failed' TYPE 'E'.
ENDCASE.`,
    notes: [
      'The called function module must be remote-enabled in SE37.',
      'The destination must exist and be authorized in SM59.',
      'Use RFC_PING or SM59 connection tests for a quick connectivity check before debugging application logic.',
      'Keep destination names configurable when the same code moves through DEV, QA, and production.',
    ],
    commonMistakes: [
      'Calling a normal function module remotely when it is not remote-enabled.',
      'Ignoring COMMUNICATION_FAILURE and SYSTEM_FAILURE.',
      'Hardcoding destinations without considering landscape and transport strategy.',
      'Treating a successful ping as proof that the business function module will also succeed.',
    ],
    relatedTopics: ['SM59', 'remote-enabled function modules', 'error handling'],
  },
  {
    id: 'oop-local-class-report-template',
    title: 'Local Class Report Template',
    category: 'Classes / OOP ABAP',
    subcategory: 'Local Classes',
    tags: ['Classic ABAP', 'Modern ABAP 7.40+', 'Beginner', 'OOP'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Use a local class to keep report logic organized. This structure separates selection-screen input from the main execution method.',
    code: `REPORT z_demo_local_class.

PARAMETERS p_bukrs TYPE bukrs OBLIGATORY.

CLASS lcl_report DEFINITION FINAL.
  PUBLIC SECTION.
    METHODS:
      constructor IMPORTING iv_bukrs TYPE bukrs,
      run.
  PRIVATE SECTION.
    DATA mv_bukrs TYPE bukrs.
ENDCLASS.

CLASS lcl_report IMPLEMENTATION.
  METHOD constructor.
    mv_bukrs = iv_bukrs.
  ENDMETHOD.

  METHOD run.
    WRITE: / 'Running report for company code:', mv_bukrs.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  DATA(lo_report) = NEW lcl_report( p_bukrs ).
  lo_report->run( ).`,
    notes: [
      'FINAL is useful when a local helper class is not meant to be inherited.',
      'NEW and inline DATA require ABAP 7.40+; use CREATE OBJECT for older releases.',
      'This pattern makes it easier to move logic into a global class later.',
    ],
    commonMistakes: [
      'Leaving all logic in START-OF-SELECTION after creating a local class.',
      'Making every attribute public instead of using methods.',
      'Using OOP structure without clear method responsibilities.',
    ],
    relatedTopics: ['methods', 'constructors', 'interfaces', 'START-OF-SELECTION'],
  },
  {
    id: 'forms-perform-template',
    title: 'FORM / PERFORM Template',
    category: 'Forms / Subroutines',
    subcategory: 'FORM / PERFORM',
    tags: ['Classic ABAP', 'Beginner', 'Legacy Code'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'FORM routines are common in older ABAP reports. Use them when maintaining legacy code, but prefer methods for new development when possible.',
    code: `DATA gv_total TYPE p LENGTH 10 DECIMALS 2.

START-OF-SELECTION.
  PERFORM calculate_total
    USING    p_net_value
             p_tax_value
    CHANGING gv_total.

  WRITE: / 'Total:', gv_total.

FORM calculate_total
  USING    iv_net   TYPE p
           iv_tax   TYPE p
  CHANGING cv_total TYPE p.

  cv_total = iv_net + iv_tax.

ENDFORM.`,
    notes: [
      'USING passes input values; CHANGING is for values the routine may modify.',
      'Keep FORM routines small and named clearly when working in legacy reports.',
      'For new code, methods provide better encapsulation and testability.',
    ],
    commonMistakes: [
      'Changing USING parameters and making data flow hard to follow.',
      'Creating very large FORM routines with hidden global dependencies.',
      'Adding new FORM-heavy designs in modern codebases when classes would be clearer.',
    ],
    relatedTopics: ['USING / CHANGING', 'local classes', 'legacy code'],
  },
  {
    id: 'messages-basic-handling',
    title: 'MESSAGE Handling Basics',
    category: 'Other ABAP Topics',
    subcategory: 'Messages',
    tags: ['Classic ABAP', 'Beginner', 'Messages', 'Error Handling'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Beginner',
    explanation:
      'Use MESSAGE statements to communicate validation errors, warnings, information, or success. In real applications, prefer message classes for reusable texts.',
    code: `IF p_bukrs IS INITIAL.
  MESSAGE 'Company code is required' TYPE 'E'.
ENDIF.

IF gv_count = 0.
  MESSAGE 'No records found' TYPE 'I'.
ENDIF.

MESSAGE 'Processing completed successfully' TYPE 'S'.`,
    notes: [
      'TYPE E stops processing in many dialog and selection-screen contexts.',
      'TYPE I shows an information popup or status message depending on context.',
      'Message classes such as MESSAGE e001(zmsg) WITH lv_value are better for translatable production texts.',
    ],
    commonMistakes: [
      'Using hardcoded message text everywhere instead of a message class.',
      'Using error messages where a warning or information message would be less disruptive.',
      'Not considering how message behavior changes between report, dialog, update, and background contexts.',
    ],
    relatedTopics: ['AT SELECTION-SCREEN', 'exception handling', 'message classes'],
  },
  {
    id: 'try-catch-exception-handling',
    title: 'TRY/CATCH Exception Handling',
    category: 'Other ABAP Topics',
    subcategory: 'Exception Handling',
    tags: ['Modern ABAP 7.40+', 'Intermediate', 'Error Handling'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    difficulty: 'Intermediate',
    explanation:
      'Use TRY/CATCH for class-based exceptions. Catch the most specific exception you can handle, then use the exception text or attributes for diagnostics.',
    code: `TRY.
    DATA(lv_result) = lo_service->calculate_total(
      iv_document = lv_document ).

    WRITE: / 'Result:', lv_result.

  CATCH cx_sy_itab_line_not_found INTO DATA(lx_line).
    MESSAGE lx_line->get_text( ) TYPE 'E'.

  CATCH cx_root INTO DATA(lx_root).
    MESSAGE lx_root->get_text( ) TYPE 'E'.
ENDTRY.`,
    notes: [
      'Inline DATA declarations require ABAP 7.40+.',
      'CX_ROOT catches all class-based exceptions, so keep it as the last fallback catch.',
      'Do not catch exceptions you cannot meaningfully handle unless you re-raise or log them.',
    ],
    commonMistakes: [
      'Catching CX_ROOT first and hiding more specific handling.',
      'Swallowing exceptions without logging or informing the caller.',
      'Using TRY/CATCH for expected control flow instead of validating input first.',
    ],
    relatedTopics: ['class-based exceptions', 'MESSAGE handling', 'CX_ROOT'],
  },
  {
    id: 'parameters-radio-buttons-and-validation',
    title: 'PARAMETERS With Radio Buttons And Validation',
    category: 'User Interface / Selection Screens',
    subcategory: 'PARAMETERS',
    tags: ['Classic ABAP', 'Beginner', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'The radio button and AT SELECTION-SCREEN syntax is classic-compatible. Replace ABAP_TRUE checks with X checks on very old systems if needed.',
    difficulty: 'Beginner',
    explanation:
      'Use radio button groups when the user must choose one processing mode. Validate combinations in AT SELECTION-SCREEN before the report starts.',
    code: `REPORT z_demo_parameters_radio.

PARAMETERS:
  p_test RADIOBUTTON GROUP run DEFAULT 'X',
  p_post RADIOBUTTON GROUP run,
  p_bukrs TYPE bukrs OBLIGATORY,
  p_date  TYPE sy-datum.

AT SELECTION-SCREEN.
  IF p_post = abap_true AND p_date IS INITIAL.
    MESSAGE 'Posting date is required for update mode' TYPE 'E'.
  ENDIF.

START-OF-SELECTION.
  IF p_test = abap_true.
    WRITE: / 'Running in test mode'.
  ELSE.
    WRITE: / 'Running in update mode for', p_bukrs.
  ENDIF.`,
    notes: [
      'Radio buttons in the same GROUP are mutually exclusive.',
      'Use AT SELECTION-SCREEN for validation that should stop invalid input immediately.',
      'Keep required-by-mode validation separate from always-required fields.',
    ],
    commonMistakes: [
      'Putting radio buttons in different groups by accident.',
      'Validating only in START-OF-SELECTION, after the selection screen has already been accepted.',
      'Using checkboxes when exactly one mode should be selected.',
    ],
    relatedTopics: ['PARAMETERS', 'AT SELECTION-SCREEN', 'radio buttons', 'MODIF ID'],
  },
  {
    id: 'select-options-defaults-and-validation',
    title: 'SELECT-OPTIONS Defaults And Validation',
    category: 'User Interface / Selection Screens',
    subcategory: 'SELECT-OPTIONS',
    tags: ['Classic ABAP', 'Beginner', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'The selection option declaration is classic-compatible. Inline Open SQL host variables in the SELECT need ABAP 7.40+.',
    difficulty: 'Beginner',
    explanation:
      'Use SELECT-OPTIONS for flexible range entry, safe defaults, and validation that prevents expensive reports from running wide open.',
    code: `REPORT z_demo_so_validation.

TABLES vbak.

SELECT-OPTIONS:
  s_vbeln FOR vbak-vbeln,
  s_erdat FOR vbak-erdat.

INITIALIZATION.
  s_erdat-sign   = 'I'.
  s_erdat-option = 'BT'.
  s_erdat-low    = sy-datum - 30.
  s_erdat-high   = sy-datum.
  APPEND s_erdat.

AT SELECTION-SCREEN.
  IF s_vbeln[] IS INITIAL AND s_erdat[] IS INITIAL.
    MESSAGE 'Enter sales document or creation date' TYPE 'E'.
  ENDIF.

START-OF-SELECTION.
  SELECT vbeln erdat auart kunnr
    FROM vbak
    INTO TABLE @DATA(lt_orders)
    WHERE vbeln IN @s_vbeln
      AND erdat IN @s_erdat.

  WRITE: / 'Orders found:', lines( lt_orders ).`,
    notes: [
      'Use the internal table body syntax s_field[] when checking whether a selection option has entries.',
      'Default ranges help users and reduce accidental full-table reads, but they should not replace validation.',
      'Date restrictions are a practical safety net for large business tables.',
      'Replace the demo date field with the real business date field for the report.',
    ],
    commonMistakes: [
      'Assuming an empty SELECT-OPTIONS table means select nothing; in Open SQL it usually means no restriction.',
      'Not protecting reports from accidentally broad selections.',
      'Forgetting that users can enter exclusions and patterns in selection options.',
      'Using sy-datum as a placeholder but forgetting to align the type with the selected table field.',
    ],
    relatedTopics: ['ranges', 'SELECT with WHERE', 'selection-screen validation'],
  },
  {
    id: 'modif-id-classic-compatible',
    title: 'MODIF ID Dynamic Fields Without New Syntax',
    category: 'User Interface / Selection Screens',
    subcategory: 'MODIF ID',
    tags: ['Classic ABAP', 'Intermediate', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'This version avoids COND and inline declarations, so it is friendlier for older ECC systems.',
    difficulty: 'Intermediate',
    explanation:
      'Hide, show, enable, or disable selection-screen fields based on a user choice while staying close to classic ABAP syntax.',
    code: `REPORT z_demo_modif_classic.

PARAMETERS:
  p_disp RADIOBUTTON GROUP act DEFAULT 'X' USER-COMMAND act,
  p_upd  RADIOBUTTON GROUP act,
  p_file TYPE rlgrap-filename MODIF ID upd,
  p_test AS CHECKBOX DEFAULT 'X' MODIF ID upd.

AT SELECTION-SCREEN OUTPUT.
  LOOP AT SCREEN.
    IF screen-group1 = 'UPD'.
      IF p_upd = 'X'.
        screen-active = 1.
        screen-input  = 1.
      ELSE.
        screen-active = 0.
      ENDIF.
      MODIFY SCREEN.
    ENDIF.
  ENDLOOP.`,
    notes: [
      'Use USER-COMMAND so changing the radio button refreshes the screen immediately.',
      'SCREEN-ACTIVE hides or shows the field; SCREEN-INPUT controls editability.',
      'MODIF ID is limited to three characters and is seen in SCREEN-GROUP1.',
      'Checkboxes and radio buttons can drive the same MODIF ID logic as long as validation matches the visible fields.',
    ],
    commonMistakes: [
      'Forgetting MODIFY SCREEN inside the LOOP AT SCREEN.',
      'Checking screen-group1 with the wrong uppercase value.',
      'Using MODIF ID logic to replace authorization or business validation.',
      'Making a field optional visually but still validating it when it is hidden.',
    ],
    relatedTopics: ['AT SELECTION-SCREEN OUTPUT', 'dynamic selection screen', 'radio buttons'],
  },
  {
    id: 'select-inner-join-classic-style',
    title: 'INNER JOIN Classic-Compatible Open SQL',
    category: 'Joins',
    subcategory: 'INNER JOIN',
    tags: ['Classic ABAP', 'Intermediate', 'Open SQL', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'This uses older INTO TABLE syntax without @ host variables. Table availability and fields still depend on your SAP module and release.',
    difficulty: 'Intermediate',
    explanation:
      'Read matching header and item rows with an INNER JOIN using syntax commonly found in ECC reports.',
    code: `TYPES: BEGIN OF ty_item,
         vbeln TYPE vbak-vbeln,
         erdat TYPE vbak-erdat,
         auart TYPE vbak-auart,
         posnr TYPE vbap-posnr,
         matnr TYPE vbap-matnr,
       END OF ty_item.

DATA lt_items TYPE STANDARD TABLE OF ty_item.

SELECT a~vbeln a~erdat a~auart b~posnr b~matnr
  FROM vbak AS a
  INNER JOIN vbap AS b
    ON b~vbeln = a~vbeln
  INTO TABLE lt_items
  WHERE a~erdat IN s_erdat
    AND a~auart = p_auart.`,
    notes: [
      'INNER JOIN returns only rows that exist in both joined tables.',
      'Keep filters on indexed fields where possible.',
      'Avoid SELECT inside LOOP when a join can safely fetch the same data set.',
    ],
    commonMistakes: [
      'Joining without understanding row multiplication from item tables.',
      'Selecting too many fields from both tables.',
      'Using INNER JOIN when header rows without items still need to be shown.',
    ],
    relatedTopics: ['LEFT OUTER JOIN', 'SELECT performance', 'ST05'],
  },
  {
    id: 'select-left-outer-join-classic-style',
    title: 'LEFT OUTER JOIN With Optional Text',
    category: 'Joins',
    subcategory: 'LEFT OUTER JOIN',
    tags: ['Classic ABAP', 'Intermediate', 'Open SQL'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'The general LEFT OUTER JOIN pattern is broadly available, but specific Open SQL additions vary by release.',
    difficulty: 'Intermediate',
    explanation:
      'Keep the main table rows even when optional language-dependent text is missing.',
    code: `TYPES: BEGIN OF ty_material,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
         maktx TYPE makt-maktx,
       END OF ty_material.

DATA lt_materials TYPE STANDARD TABLE OF ty_material.

SELECT a~matnr a~mtart t~maktx
  FROM mara AS a
  LEFT OUTER JOIN makt AS t
    ON  t~matnr = a~matnr
    AND t~spras = sy-langu
  INTO TABLE lt_materials
  WHERE a~matnr IN s_matnr.`,
    notes: [
      'Language filters for the optional table belong in the ON condition.',
      'Right-side fields can be initial when no matching row exists.',
      'This is useful for master data plus optional descriptions.',
    ],
    commonMistakes: [
      'Moving right-side table conditions to WHERE and losing the outer join effect.',
      'Not handling missing text values in the output.',
      'Joining text tables without SPRAS and returning multiple language rows.',
    ],
    relatedTopics: ['INNER JOIN', 'text tables', 'Open SQL'],
  },
  {
    id: 'internal-table-read-loop-modify',
    title: 'READ / LOOP / MODIFY Internal Table',
    category: 'Internal Tables',
    subcategory: 'READ / LOOP / MODIFY',
    tags: ['Classic ABAP', 'Beginner', 'Internal Tables'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Uses classic internal table statements. Inline work areas can be added on ABAP 7.40+ systems.',
    difficulty: 'Beginner',
    explanation:
      'Find rows in an internal table, update selected fields, and write the changed row back with MODIFY.',
    code: `DATA ls_item TYPE ty_item.

LOOP AT lt_items INTO ls_item.
  IF ls_item-status = 'OPEN'.
    ls_item-processed = 'X'.
    ls_item-message   = 'Marked for processing'.

    MODIFY lt_items FROM ls_item INDEX sy-tabix.
  ENDIF.
ENDLOOP.

READ TABLE lt_items INTO ls_item
  WITH KEY matnr = p_matnr.

IF sy-subrc = 0.
  WRITE: / 'Found material:', ls_item-matnr.
ENDIF.`,
    notes: [
      'Use INDEX sy-tabix when modifying the current row of a STANDARD TABLE loop.',
      'For keyed access in large tables, prefer SORTED or HASHED TABLE types.',
      'Field symbols can avoid copying when updating many rows.',
    ],
    commonMistakes: [
      'Using sy-tabix after operations that may change it.',
      'READ TABLE by key on a huge STANDARD TABLE inside another LOOP.',
      'Forgetting MODIFY after changing the work area.',
    ],
    relatedTopics: ['SORTED TABLE', 'HASHED TABLE', 'field symbols', 'performance'],
  },
  {
    id: 'internal-table-sorted-table-key-read',
    title: 'SORTED TABLE For Repeated Key Reads',
    category: 'Internal Tables',
    subcategory: 'SORTED TABLE',
    tags: ['Classic ABAP', 'Intermediate', 'Internal Tables', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'SORTED TABLE is classic-compatible. Inline DATA in the example requires ABAP 7.40+.',
    difficulty: 'Intermediate',
    explanation:
      'Use a SORTED TABLE when you need efficient key reads and also want data maintained in key order.',
    code: `TYPES: BEGIN OF ty_material,
         matnr TYPE mara-matnr,
         mtart TYPE mara-mtart,
       END OF ty_material.

DATA lt_materials TYPE SORTED TABLE OF ty_material
  WITH UNIQUE KEY matnr.

INSERT VALUE #( matnr = 'MAT001' mtart = 'FERT' ) INTO TABLE lt_materials.
INSERT VALUE #( matnr = 'MAT002' mtart = 'HALB' ) INTO TABLE lt_materials.

READ TABLE lt_materials INTO DATA(ls_material)
  WITH TABLE KEY matnr = 'MAT001'.

IF sy-subrc = 0.
  WRITE: / ls_material-matnr, ls_material-mtart.
ENDIF.`,
    notes: [
      'A SORTED TABLE maintains order automatically by its key.',
      'Use WITH TABLE KEY to make the intended key access explicit.',
      'Choose UNIQUE or NON-UNIQUE based on the business key.',
    ],
    commonMistakes: [
      'Using APPEND on a SORTED TABLE instead of INSERT INTO TABLE.',
      'Defining the wrong key and then wondering why reads are slow or duplicates fail.',
      'Using SORTED TABLE when insertion volume is high and ordering is not needed.',
    ],
    relatedTopics: ['READ TABLE', 'HASHED TABLE', 'table keys'],
  },
  {
    id: 'internal-table-hashed-table-lookup',
    title: 'HASHED TABLE For Fast Unique Lookup',
    category: 'Internal Tables',
    subcategory: 'HASHED TABLE',
    tags: ['Classic ABAP', 'Intermediate', 'Internal Tables', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'HASHED TABLE is broadly available. VALUE # and inline DATA require ABAP 7.40+.',
    difficulty: 'Intermediate',
    explanation:
      'Use a HASHED TABLE for fast exact-key lookups where each key is unique and sorted output is not required.',
    code: `TYPES: BEGIN OF ty_customer,
         kunnr TYPE kna1-kunnr,
         name1 TYPE kna1-name1,
       END OF ty_customer.

DATA lt_customers TYPE HASHED TABLE OF ty_customer
  WITH UNIQUE KEY kunnr.

lt_customers = VALUE #(
  ( kunnr = '0000001000' name1 = 'Demo Customer A' )
  ( kunnr = '0000002000' name1 = 'Demo Customer B' )
).

READ TABLE lt_customers INTO DATA(ls_customer)
  WITH TABLE KEY kunnr = '0000001000'.`,
    notes: [
      'HASHED TABLE requires a unique key.',
      'Lookup is optimized for full-key access, not partial-key scans.',
      'Use SORTED TABLE when range processing or ordered output matters.',
    ],
    commonMistakes: [
      'Expecting hashed tables to preserve display order.',
      'Trying to read efficiently with only part of the unique key.',
      'Using HASHED TABLE for tiny tables where clarity matters more than lookup performance.',
    ],
    relatedTopics: ['SORTED TABLE', 'READ TABLE', 'performance'],
  },
  {
    id: 'alv-hide-columns-salv',
    title: 'Hide Columns In CL_SALV_TABLE',
    category: 'ALV',
    subcategory: 'Column Settings',
    tags: ['Classic ABAP', 'Intermediate', 'ALV', 'Reporting'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'CL_SALV_TABLE is available in many ECC and S/4HANA systems for read-only ALV display.',
    difficulty: 'Intermediate',
    explanation:
      'Hide technical fields such as internal IDs from the ALV while keeping them available in the output table.',
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

lo_column  = lo_columns->get_column( 'MANDT' ).
lo_column->set_visible( abap_false ).

lo_alv->display( ).`,
    notes: [
      'Use the internal field name when retrieving a SALV column.',
      'Column names are usually uppercase in ALV metadata.',
      'Wrap GET_COLUMN in TRY/CATCH when the field may not exist.',
      'Keeping a technical key in the output table can still help sorting, drilldown, or support even when it is hidden.',
    ],
    commonMistakes: [
      'Using the displayed column text instead of the field name.',
      'Trying to hide a field that is not part of the ALV output table.',
      'Assuming SALV is ideal for editable ALV requirements.',
      'Hiding all key fields and making it hard to reconcile the ALV output with source data.',
    ],
    relatedTopics: ['CL_SALV_TABLE', 'column settings', 'TRY/CATCH'],
  },
  {
    id: 'alv-change-column-names-salv',
    title: 'Change ALV Column Names In CL_SALV_TABLE',
    category: 'ALV',
    subcategory: 'Column Settings',
    tags: ['Classic ABAP', 'Intermediate', 'ALV', 'Reporting'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'SALV text methods are broadly usable, though exact display behavior depends on available column width.',
    difficulty: 'Intermediate',
    explanation:
      'Set short, medium, and long labels for a SALV column to make report output easier to understand.',
    code: `DATA lo_columns TYPE REF TO cl_salv_columns_table.
DATA lo_column  TYPE REF TO cl_salv_column.

lo_columns = lo_alv->get_columns( ).
lo_column  = lo_columns->get_column( 'NETWR' ).

lo_column->set_short_text(  'Net' ).
lo_column->set_medium_text( 'Net Value' ).
lo_column->set_long_text(   'Net Order Value' ).

lo_columns->set_optimize( abap_true ).`,
    notes: [
      'Set all three text lengths so ALV can choose based on available width.',
      'Call SET_OPTIMIZE when column width should fit content and labels.',
      'Use business-friendly labels instead of raw technical names.',
    ],
    commonMistakes: [
      'Only setting long text and wondering why a short label still appears.',
      'Using field labels that are too long for common screen sizes.',
      'Changing labels after DISPLAY is already called.',
    ],
    relatedTopics: ['CL_SALV_TABLE', 'column settings', 'layout'],
  },
  {
    id: 'bapi-call-bapiret2-commit',
    title: 'BAPI Call With BAPIRET2 Handling',
    category: 'BAPI',
    subcategory: 'BAPIRET2 Handling',
    tags: ['Classic ABAP', 'Intermediate', 'BAPI', 'Error Handling'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'The BAPIRET2 pattern is broadly used. The specific BAPI name and parameters must match your business object and release.',
    difficulty: 'Intermediate',
    explanation:
      'Call a BAPI, inspect BAPIRET2 messages, and commit only when no abort or error message is returned.',
    code: `DATA lt_return TYPE TABLE OF bapiret2.
DATA ls_return TYPE bapiret2.
DATA lv_error  TYPE abap_bool.

CALL FUNCTION 'BAPI_SALESORDER_CHANGE'
  EXPORTING
    salesdocument = lv_vbeln
  TABLES
    return        = lt_return.

LOOP AT lt_return INTO ls_return
  WHERE type = 'A' OR type = 'E'.
  lv_error = abap_true.
  EXIT.
ENDLOOP.

IF lv_error = abap_true.
  CALL FUNCTION 'BAPI_TRANSACTION_ROLLBACK'.
ELSE.
  CALL FUNCTION 'BAPI_TRANSACTION_COMMIT'
    EXPORTING
      wait = abap_true.
ENDIF.`,
    notes: [
      'Always read the BAPI documentation for required structures and commit behavior.',
      'Check message types A and E at minimum; warnings may also matter for your process.',
      'Use WAIT = ABAP_TRUE when follow-up reads depend on the committed data.',
    ],
    commonMistakes: [
      'Calling COMMIT WORK directly instead of BAPI_TRANSACTION_COMMIT after a BAPI.',
      'Committing before checking RETURN messages.',
      'Assuming an empty RETURN table always means the business action succeeded.',
    ],
    relatedTopics: ['BAPIRET2', 'COMMIT WORK', 'ROLLBACK', 'message handling'],
  },
  {
    id: 'oop-local-class-with-private-methods',
    title: 'Local Class With Public And Private Methods',
    category: 'Classes / OOP ABAP',
    subcategory: 'Local Classes',
    tags: ['Modern ABAP 7.40+', 'Intermediate', 'OOP'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'The class structure is classic-compatible, but NEW and inline DATA in START-OF-SELECTION require ABAP 7.40+.',
    difficulty: 'Intermediate',
    explanation:
      'Use public methods for the report workflow and private methods for smaller implementation steps.',
    code: `CLASS lcl_report DEFINITION FINAL.
  PUBLIC SECTION.
    METHODS run.
  PRIVATE SECTION.
    METHODS:
      select_data,
      display_data.

    DATA mt_output TYPE STANDARD TABLE OF ty_output.
ENDCLASS.

CLASS lcl_report IMPLEMENTATION.
  METHOD run.
    select_data( ).
    display_data( ).
  ENDMETHOD.

  METHOD select_data.
    SELECT bukrs butxt land1
      FROM t001
      INTO TABLE mt_output.
  ENDMETHOD.

  METHOD display_data.
    LOOP AT mt_output INTO DATA(ls_output).
      WRITE: / ls_output-bukrs, ls_output-butxt.
    ENDLOOP.
  ENDMETHOD.
ENDCLASS.

START-OF-SELECTION.
  NEW lcl_report( )->run( ).`,
    notes: [
      'A run method gives the report one clear entry point.',
      'Private helper methods keep the public interface small.',
      'For older ABAP, instantiate with CREATE OBJECT and declare work areas explicitly.',
    ],
    commonMistakes: [
      'Making helper methods public without a reason.',
      'Letting one method grow into hundreds of lines.',
      'Mixing selection, transformation, and display logic in one method.',
    ],
    relatedTopics: ['methods', 'constructors', 'report structure'],
  },
  {
    id: 'authority-check-company-code',
    title: 'AUTHORITY-CHECK For Company Code',
    category: 'Other ABAP Topics',
    subcategory: 'Authority Checks',
    tags: ['Classic ABAP', 'Intermediate', 'Security'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'AUTHORITY-CHECK is classic-compatible. Authorization objects and fields vary by business area and customer configuration.',
    difficulty: 'Intermediate',
    explanation:
      'Check whether the current user is authorized for a business object before showing or changing sensitive data.',
    code: `AUTHORITY-CHECK OBJECT 'F_BKPF_BUK'
  ID 'BUKRS' FIELD p_bukrs
  ID 'ACTVT' FIELD '03'.

IF sy-subrc <> 0.
  MESSAGE 'You are not authorized for this company code' TYPE 'E'.
ENDIF.`,
    notes: [
      'ACTVT 03 commonly means display; 02 commonly means change.',
      'Use the authorization object relevant to the business process, not a random similar one.',
      'Work with your security team for the correct object and field values.',
    ],
    commonMistakes: [
      'Skipping authorization checks in custom reports that expose sensitive data.',
      'Checking only display authorization before performing updates.',
      'Hardcoding the wrong authorization object for the process.',
    ],
    relatedTopics: ['security', 'messages', 'selection-screen validation'],
  },
  {
    id: 'date-handling-basic-calculations',
    title: 'Date Handling And Simple Calculations',
    category: 'Other ABAP Topics',
    subcategory: 'Date Handling',
    tags: ['Classic ABAP', 'Beginner', 'Dates'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Basic DATS arithmetic is broadly compatible. Factory calendars and working-day calculations need SAP calendar function modules or classes.',
    difficulty: 'Beginner',
    explanation:
      'Use DATS fields for SAP dates and perform simple day-based calculations directly when calendar rules are not required.',
    code: `DATA lv_today      TYPE sy-datum.
DATA lv_next_week  TYPE sy-datum.
DATA lv_days_old   TYPE i.

lv_today     = sy-datum.
lv_next_week = sy-datum + 7.
lv_days_old  = sy-datum - p_created_on.

WRITE: / 'Today:',       lv_today,
       / 'Next week:',   lv_next_week,
       / 'Days old:',    lv_days_old.`,
    notes: [
      'SAP date fields use YYYYMMDD internally.',
      'Simple + and - arithmetic counts calendar days.',
      'Use calendar-aware APIs when weekends, holidays, or factory calendars matter.',
    ],
    commonMistakes: [
      'Treating date fields as display strings instead of DATS values.',
      'Using simple arithmetic for business working days.',
      'Ignoring user formatting; output formatting can vary by user settings.',
    ],
    relatedTopics: ['factory calendar', 'sy-datum', 'date formatting'],
  },
  {
    id: 'string-handling-concatenate-template',
    title: 'String Handling With Templates And Condense',
    category: 'Other ABAP Topics',
    subcategory: 'String Handling',
    tags: ['Modern ABAP 7.40+', 'Beginner', 'Strings'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'String templates with |...| require ABAP 7.02+ in many systems, while embedded expressions are commonly associated with modern ABAP style.',
    difficulty: 'Beginner',
    explanation:
      'Use string templates for readable text assembly and CONDENSE to normalize extra spaces when processing user or master data text.',
    code: `DATA lv_name TYPE string.
DATA lv_text TYPE string.

lv_name = |{ ls_customer-name1 } { ls_customer-name2 }|.
CONDENSE lv_name.

lv_text = |Customer { ls_customer-kunnr } - { lv_name }|.

IF strlen( lv_text ) > 80.
  lv_text = lv_text(80).
ENDIF.`,
    notes: [
      'String templates are usually easier to read than long CONCATENATE chains.',
      'CONDENSE removes repeated spaces and trims leading spaces.',
      'Use escape or formatting options when embedding values for UI or files.',
    ],
    commonMistakes: [
      'Forgetting that fixed-length CHAR fields may contain trailing spaces.',
      'Cutting strings without checking expected length and character semantics.',
      'Building CSV, XML, or JSON manually without escaping special characters.',
    ],
    relatedTopics: ['CONDENSE', 'CONCATENATE', 'string templates'],
  },
  {
    id: 'conversion-exit-alpha-input-output',
    title: 'Conversion Exit ALPHA Input And Output',
    category: 'Other ABAP Topics',
    subcategory: 'Conversion Exits',
    tags: ['Classic ABAP', 'Beginner', 'Conversion Exits'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Function module conversion exits are classic-compatible. Modern string-template ALPHA formatting requires newer ABAP syntax.',
    difficulty: 'Beginner',
    explanation:
      'Use ALPHA conversion for fields such as customer, vendor, or material-like keys where external display values differ from internal database values.',
    code: `DATA lv_kunnr_ext TYPE kunnr VALUE '1000'.
DATA lv_kunnr_int TYPE kunnr.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_INPUT'
  EXPORTING
    input  = lv_kunnr_ext
  IMPORTING
    output = lv_kunnr_int.

SELECT SINGLE kunnr name1
  FROM kna1
  INTO @DATA(ls_customer)
  WHERE kunnr = @lv_kunnr_int.

CALL FUNCTION 'CONVERSION_EXIT_ALPHA_OUTPUT'
  EXPORTING
    input  = lv_kunnr_int
  IMPORTING
    output = lv_kunnr_ext.`,
    notes: [
      'Use INPUT before database reads when the user entered an external key.',
      'Use OUTPUT when presenting internal keys back to users.',
      'Not every field uses ALPHA; check the domain conversion routine.',
    ],
    commonMistakes: [
      'Comparing external values directly to internal database keys.',
      'Applying ALPHA to fields whose domains do not use ALPHA conversion.',
      'Forgetting conversion when building custom SELECT ranges from user-entered text.',
    ],
    relatedTopics: ['domain conversion routines', 'SELECT SINGLE', 'user input'],
  },
  {
    id: 'select-for-all-entries-safe-pattern',
    title: 'FOR ALL ENTRIES Safe Pattern',
    category: 'SELECT Statements',
    subcategory: 'FOR ALL ENTRIES',
    tags: ['Classic ABAP', 'Intermediate', 'Open SQL', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'FOR ALL ENTRIES is available in classic ABAP. Modern systems may also support IN @range or joins that are clearer for some cases.',
    difficulty: 'Intermediate',
    explanation:
      'Use FOR ALL ENTRIES to fetch related database rows for a prepared driver table, but always guard against empty input first.',
    code: `SORT lt_items BY matnr.
DELETE ADJACENT DUPLICATES FROM lt_items COMPARING matnr.

IF lt_items IS NOT INITIAL.
  SELECT matnr mtart meins
    FROM mara
    INTO TABLE lt_materials
    FOR ALL ENTRIES IN lt_items
    WHERE matnr = lt_items-matnr.
ENDIF.`,
    notes: [
      'Always check that the driver table is not initial before the SELECT.',
      'Remove duplicate driver keys to reduce database work.',
      'Select only fields needed by the next processing step.',
    ],
    commonMistakes: [
      'Running FOR ALL ENTRIES with an empty driver table, which can read far too much data.',
      'Leaving duplicate keys in the driver table.',
      'Using FOR ALL ENTRIES where a join would be simpler and more predictable.',
    ],
    relatedTopics: ['SELECT performance', 'Joins', 'Internal Tables'],
  },
  {
    id: 'ranges-table-manual-build',
    title: 'Build A Range Table Manually',
    category: 'Other ABAP Topics',
    subcategory: 'Ranges',
    tags: ['Classic ABAP', 'Beginner', 'Ranges', 'Open SQL'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'The RANGES statement is classic-compatible. Modern ABAP often uses typed RANGE OF declarations and VALUE syntax.',
    difficulty: 'Beginner',
    explanation:
      'Use a range table when you need to pass include/exclude criteria to Open SQL or reusable logic.',
    code: `RANGES r_mtart FOR mara-mtart.

CLEAR r_mtart.
r_mtart-sign   = 'I'.
r_mtart-option = 'EQ'.
r_mtart-low    = 'FERT'.
APPEND r_mtart.

CLEAR r_mtart.
r_mtart-sign   = 'I'.
r_mtart-option = 'EQ'.
r_mtart-low    = 'HALB'.
APPEND r_mtart.

SELECT matnr mtart
  FROM mara
  INTO TABLE lt_mara
  WHERE mtart IN r_mtart.`,
    notes: [
      'SIGN I includes values; SIGN E excludes values.',
      'Common OPTION values are EQ, BT, CP, GE, LE, GT, and LT.',
      'Ranges have the same SIGN, OPTION, LOW, HIGH shape as SELECT-OPTIONS.',
    ],
    commonMistakes: [
      'Forgetting to APPEND after filling a range row.',
      'Using HIGH for EQ rows where only LOW is relevant.',
      'Not clearing the header line before building the next range row in classic code.',
    ],
    relatedTopics: ['SELECT-OPTIONS', 'Open SQL', 'VALUE syntax'],
  },
  {
    id: 'ranges-modern-value-syntax',
    title: 'Modern Range Table With VALUE',
    category: 'Other ABAP Topics',
    subcategory: 'Ranges',
    tags: ['Modern ABAP 7.40+', 'Intermediate', 'Ranges', 'Open SQL'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Uses RANGE OF, VALUE #, and @ host variables, which require modern ABAP syntax support.',
    difficulty: 'Intermediate',
    explanation:
      'Build compact range tables with VALUE syntax when your system supports modern ABAP.',
    code: `DATA lr_auart TYPE RANGE OF vbak-auart.

lr_auart = VALUE #(
  ( sign = 'I' option = 'EQ' low = 'OR' )
  ( sign = 'I' option = 'EQ' low = 'TA' )
).

SELECT vbeln erdat auart
  FROM vbak
  WHERE auart IN @lr_auart
  INTO TABLE @DATA(lt_orders).`,
    notes: [
      'RANGE OF gives a strongly typed range table.',
      'VALUE # keeps short range setup readable.',
      'Use constants for repeated SIGN and OPTION values in production code if it improves clarity.',
    ],
    commonMistakes: [
      'Using VALUE # without a typed left-hand side.',
      'Mixing external and internal key formats inside range values.',
      'Building very large ranges when a join or temporary database strategy would be better.',
    ],
    relatedTopics: ['VALUE', 'SELECT-OPTIONS', 'conversion exits'],
  },
  {
    id: 'field-symbol-loop-update',
    title: 'Update Internal Table Rows With FIELD-SYMBOLS',
    category: 'Internal Tables',
    subcategory: 'Field Symbols',
    tags: ['Classic ABAP', 'Intermediate', 'Internal Tables', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'FIELD-SYMBOLS are classic-compatible. The inline declaration FIELD-SYMBOL(<row>) requires newer syntax; declare separately for older systems.',
    difficulty: 'Intermediate',
    explanation:
      'Use field symbols to update internal table rows directly without copying data into a work area and modifying it back.',
    code: `FIELD-SYMBOLS <ls_item> TYPE ty_item.

LOOP AT lt_items ASSIGNING <ls_item>.
  IF <ls_item>-status = 'OPEN'.
    <ls_item>-status  = 'DONE'.
    <ls_item>-message = 'Processed successfully'.
  ENDIF.
ENDLOOP.`,
    notes: [
      'ASSIGNING gives direct access to the row in the internal table.',
      'No MODIFY is needed when changing the assigned row.',
      'Field symbols are useful for large rows or frequent updates.',
    ],
    commonMistakes: [
      'Using a field symbol after it is no longer assigned.',
      'Calling MODIFY unnecessarily inside a LOOP ASSIGNING.',
      'Changing key fields in sorted or hashed tables in ways that violate table key rules.',
    ],
    relatedTopics: ['LOOP AT', 'MODIFY', 'Internal Tables'],
  },
  {
    id: 'data-reference-basic-pattern',
    title: 'Data Reference Basic Pattern',
    category: 'Other ABAP Topics',
    subcategory: 'Data References',
    tags: ['Classic ABAP', 'Advanced', 'Data References'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'CREATE DATA and dereferencing are classic-compatible. Inline reference operators such as REF #( ) require newer ABAP syntax.',
    difficulty: 'Advanced',
    explanation:
      'Use data references when you need dynamic allocation or to pass data by reference in generic helper logic.',
    code: `DATA lr_text TYPE REF TO string.
FIELD-SYMBOLS <lv_text> TYPE string.

CREATE DATA lr_text.
ASSIGN lr_text->* TO <lv_text>.

IF <lv_text> IS ASSIGNED.
  <lv_text> = 'Created dynamically'.
  WRITE / <lv_text>.
ENDIF.`,
    notes: [
      'Always assign the dereferenced value before reading or changing it through a field symbol.',
      'Prefer normal variables unless dynamic behavior is truly needed.',
      'References are common in frameworks, generic utilities, and dynamic data processing.',
    ],
    commonMistakes: [
      'Dereferencing an initial reference.',
      'Using references where simple variables would be clearer.',
      'Forgetting that multiple references can point to the same underlying data.',
    ],
    relatedTopics: ['FIELD-SYMBOLS', 'dynamic programming', 'OO ABAP'],
  },
  {
    id: 'alv-save-layout-variant-salv',
    title: 'Enable ALV Layout Variant Saving',
    category: 'ALV',
    subcategory: 'Layout',
    tags: ['Classic ABAP', 'Intermediate', 'ALV', 'Reporting'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'SALV layout handling is available in many ECC and S/4HANA systems. Authorization and save behavior may vary by system settings.',
    difficulty: 'Intermediate',
    explanation:
      'Allow users to save ALV layouts so they can keep preferred column order, widths, filters, and sorts.',
    code: `DATA lo_layout TYPE REF TO cl_salv_layout.
DATA ls_key    TYPE salv_s_layout_key.

ls_key-report = sy-repid.

lo_layout = lo_alv->get_layout( ).
lo_layout->set_key( ls_key ).
lo_layout->set_save_restriction( if_salv_c_layout=>restrict_none ).
lo_layout->set_default( abap_true ).`,
    notes: [
      'Set a stable layout key, usually the report name.',
      'Save restrictions control whether layouts can be saved globally or user-specifically.',
      'Call layout setup before DISPLAY.',
    ],
    commonMistakes: [
      'Forgetting SET_KEY and wondering why layout variants do not behave as expected.',
      'Enabling global saves without considering authorization or governance.',
      'Setting layout options after the ALV is already displayed.',
    ],
    relatedTopics: ['CL_SALV_TABLE', 'ALV layout', 'reporting'],
  },
  {
    id: 'application-log-bal-basic',
    title: 'Application Log BAL Basic Pattern',
    category: 'Other ABAP Topics',
    subcategory: 'Application Log',
    tags: ['Classic ABAP', 'Advanced', 'Logging', 'Error Handling'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'BAL function modules are widely used in ECC and S/4HANA. Object and subobject must be configured for your application.',
    difficulty: 'Advanced',
    explanation:
      'Use the Business Application Log when a program needs persistent, reviewable messages instead of only screen output.',
    code: `DATA ls_log    TYPE bal_s_log.
DATA ls_msg    TYPE bal_s_msg.
DATA lv_handle TYPE balloghndl.

ls_log-object    = 'ZDEMO'.
ls_log-subobject = 'PROCESS'.
ls_log-extnumber = sy-repid.

CALL FUNCTION 'BAL_LOG_CREATE'
  EXPORTING
    i_s_log      = ls_log
  IMPORTING
    e_log_handle = lv_handle.

ls_msg-msgty = 'E'.
ls_msg-msgid = '00'.
ls_msg-msgno = '001'.
ls_msg-msgv1 = 'Demo application log message'.

CALL FUNCTION 'BAL_LOG_MSG_ADD'
  EXPORTING
    i_log_handle = lv_handle
    i_s_msg      = ls_msg.

CALL FUNCTION 'BAL_DB_SAVE'.`,
    notes: [
      'Application logs can be reviewed in transaction SLG1.',
      'Use configured object and subobject values for real applications.',
      'BAL is valuable for interfaces, background jobs, and mass processing.',
    ],
    commonMistakes: [
      'Using WRITE statements for background or interface logs.',
      'Not saving the log after adding messages.',
      'Using generic log objects that make SLG1 analysis hard.',
    ],
    relatedTopics: ['SLG1', 'background jobs', 'BAPIRET2', 'message handling'],
  },
  {
    id: 'update-task-and-commit-work',
    title: 'Update Task And COMMIT WORK Pattern',
    category: 'Other ABAP Topics',
    subcategory: 'Commit Handling',
    tags: ['Classic ABAP', 'Advanced', 'LUW', 'Update Task'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Update task is classic SAP LUW behavior. Use released APIs/BAPIs where available instead of direct custom update logic.',
    difficulty: 'Advanced',
    explanation:
      'Use IN UPDATE TASK to defer database-changing function modules until COMMIT WORK in the current SAP LUW.',
    code: `CALL FUNCTION 'Z_UPDATE_DOCUMENT'
  IN UPDATE TASK
  EXPORTING
    iv_document = lv_document
    is_data     = ls_data.

IF lv_test_run = abap_false.
  COMMIT WORK AND WAIT.
ELSE.
  ROLLBACK WORK.
ENDIF.`,
    notes: [
      'The function module must be update-enabled.',
      'COMMIT WORK AND WAIT waits for synchronous completion of update processing.',
      'Use transaction SM13 to analyze failed update records.',
    ],
    commonMistakes: [
      'Calling COMMIT WORK inside reusable lower-level routines unexpectedly.',
      'Using update task for logic that should be handled by a released BAPI or API.',
      'Assuming update task failures are visible without checking logs or SM13.',
    ],
    relatedTopics: ['COMMIT WORK', 'ROLLBACK WORK', 'SM13', 'BAPI'],
  },
  {
    id: 'background-job-open-submit-close',
    title: 'Schedule Background Job With JOB_OPEN/SUBMIT/JOB_CLOSE',
    category: 'Other ABAP Topics',
    subcategory: 'Background Jobs',
    tags: ['Classic ABAP', 'Advanced', 'Background Jobs'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Background job function modules are classic-compatible. Job authorization and target server behavior depend on system configuration.',
    difficulty: 'Advanced',
    explanation:
      'Schedule another report as a background job using the classic job control function modules.',
    code: `DATA lv_jobname  TYPE tbtcjob-jobname VALUE 'Z_DEMO_JOB'.
DATA lv_jobcount TYPE tbtcjob-jobcount.

CALL FUNCTION 'JOB_OPEN'
  EXPORTING
    jobname          = lv_jobname
  IMPORTING
    jobcount         = lv_jobcount
  EXCEPTIONS
    cant_create_job  = 1
    invalid_job_data = 2
    OTHERS           = 3.

IF sy-subrc = 0.
  SUBMIT z_target_report
    WITH p_bukrs = p_bukrs
    VIA JOB lv_jobname NUMBER lv_jobcount
    AND RETURN.

  CALL FUNCTION 'JOB_CLOSE'
    EXPORTING
      jobname   = lv_jobname
      jobcount  = lv_jobcount
      strtimmed = abap_true.
ENDIF.`,
    notes: [
      'Use SM37 to monitor scheduled and completed jobs.',
      'AND RETURN gives control back to the scheduling program.',
      'Pass selection-screen parameters explicitly with WITH clauses.',
    ],
    commonMistakes: [
      'Opening a job but not closing it.',
      'Forgetting AND RETURN after SUBMIT VIA JOB.',
      'Not handling authorization or variant requirements for the submitted report.',
    ],
    relatedTopics: ['SM37', 'SUBMIT', 'background processing'],
  },
  {
    id: 'debugging-breakpoint-watchpoint-notes',
    title: 'Debugging Breakpoints And Watchpoints',
    category: 'Debugging',
    subcategory: 'Breakpoints / Watchpoints',
    tags: ['Classic ABAP', 'Beginner', 'Debugging'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Debugger features vary slightly by SAP GUI and backend release, but the concepts apply broadly.',
    difficulty: 'Beginner',
    explanation:
      'Use breakpoints to stop at known code locations and watchpoints to stop when a variable value changes or matches a condition.',
    code: `"Temporary breakpoint for local testing only.
BREAK-POINT.

"Useful conditional stop in code while investigating.
IF sy-uname = 'YOUR_USER'.
  BREAK-POINT.
ENDIF.

"Prefer debugger watchpoints for variable changes instead of leaving debug code in transportable logic.`,
    notes: [
      'Remove BREAK-POINT statements before transport unless they are intentionally user-gated and approved.',
      'Use session or external breakpoints from the debugger for most investigations.',
      'Watchpoints are excellent for finding where a value changes unexpectedly.',
    ],
    commonMistakes: [
      'Transporting unconditional BREAK-POINT statements.',
      'Debugging symptoms without checking selection input and authorization first.',
      'Forgetting that update task, RFC, and background job debugging need special setup.',
    ],
    relatedTopics: ['system debugging', 'update debugging', 'background jobs'],
  },
  {
    id: 'performance-sat-st05-workflow',
    title: 'SAT And ST05 Performance Workflow',
    category: 'Performance',
    subcategory: 'SAT / ST05',
    tags: ['Classic ABAP', 'Intermediate', 'Performance', 'Debugging'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Transaction availability and naming can vary by release and authorization, but SAT and ST05 are common SAP performance tools.',
    difficulty: 'Intermediate',
    explanation:
      'Use SAT for ABAP runtime analysis and ST05 for SQL trace when a report or transaction is slow.',
    code: `Typical workflow:

1. Reproduce the slow action with realistic input.
2. Run SAT to find expensive ABAP methods, forms, and loops.
3. Run ST05 SQL trace to inspect expensive database statements.
4. Check whether filters, indexes, joins, or table access patterns are causing the issue.
5. Change one thing, measure again, and compare results.`,
    notes: [
      'SAT answers where ABAP time is spent.',
      'ST05 answers which SQL statements are expensive and how they are executed.',
      'Measure before and after changes; intuition alone is unreliable for performance work.',
    ],
    commonMistakes: [
      'Optimizing code without a trace.',
      'Using tiny test data and assuming production behavior will match.',
      'Ignoring SELECT-in-LOOP patterns and missing database indexes.',
    ],
    relatedTopics: ['SELECT performance', 'indexes', 'FOR ALL ENTRIES', 'Joins'],
  },
  {
    id: 's4hana-compatibility-table-notes',
    title: 'S/4HANA Compatibility Notes For Classic Tables',
    category: 'Other ABAP Topics',
    subcategory: 'S/4HANA Compatibility',
    tags: ['S/4HANA', 'Intermediate', 'Compatibility'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'This is guidance, not a universal rule. Always check the simplification item list and released APIs for the target S/4HANA release.',
    difficulty: 'Intermediate',
    explanation:
      'Some classic ECC table patterns still compile in S/4HANA but may no longer be the recommended data access path.',
    code: `Practical checks before reusing classic ECC code:

- Is the table still the right source of truth in S/4HANA?
- Is there a compatibility view, CDS view, or released API?
- Does the code rely on fields removed or changed by simplification?
- Does custom SQL bypass business logic that a released API would handle?
- Has performance been checked on HANA with realistic data?`,
    notes: [
      'Prefer released APIs or CDS views when SAP provides them for the business object.',
      'Compatibility views can preserve old SELECTs but may not be best for new development.',
      'Use the SAP simplification item list during ECC-to-S/4HANA remediation.',
    ],
    commonMistakes: [
      'Assuming every ECC table access is still correct business logic in S/4HANA.',
      'Replacing tables mechanically without understanding the process.',
      'Ignoring custom code checks during migration planning.',
    ],
    relatedTopics: ['CDS Views', 'Open SQL', 'custom code remediation'],
  },
  {
    id: 'cds-basic-view-template',
    title: 'Basic CDS View Template',
    category: 'CDS Views',
    subcategory: 'Basic CDS View',
    tags: ['S/4HANA', 'Modern ABAP 7.40+', 'Intermediate', 'CDS'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'CDS availability depends on the ABAP platform release. Annotation support differs between releases.',
    difficulty: 'Intermediate',
    explanation:
      'Create a simple CDS view to expose selected fields with semantic annotations and a stable SQL view name.',
    code: `@AbapCatalog.sqlViewName: 'ZVDEMO_MAT'
@AbapCatalog.compiler.compareFilter: true
@AccessControl.authorizationCheck: #CHECK
@EndUserText.label: 'Demo Material View'
define view ZI_DemoMaterial
  as select from mara
{
  key matnr as Material,
      mtart as MaterialType,
      meins as BaseUnit
}`,
    notes: [
      'Use meaningful CDS names and labels.',
      'Authorization behavior depends on DCL and the authorizationCheck annotation.',
      'Keep basic interface views focused and composable.',
    ],
    commonMistakes: [
      'Using CDS views as a dumping ground for too many unrelated fields.',
      'Forgetting authorization design.',
      'Assuming all annotations work the same on every ABAP platform release.',
    ],
    relatedTopics: ['CDS annotations', 'DCL', 'S/4HANA'],
  },
  {
    id: 'abap-basics-data-constants',
    title: 'DATA And CONSTANTS Declarations',
    category: 'ABAP Basics',
    subcategory: 'Declarations',
    tags: ['Classic ABAP', 'Beginner', 'Basics'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Classic DATA and CONSTANTS declarations work broadly. Inline DATA(...) is a modern alternative on ABAP 7.40+ systems.',
    difficulty: 'Beginner',
    explanation: 'Declare variables and constants with clear types before using them in report logic.',
    code: `DATA lv_bukrs TYPE bukrs.
DATA lv_count TYPE i.
DATA lv_text  TYPE string.

CONSTANTS lc_default_bukrs TYPE bukrs VALUE '1000'.
CONSTANTS lc_max_rows      TYPE i     VALUE 500.

lv_bukrs = lc_default_bukrs.
lv_text  = 'Ready'.`,
    notes: [
      'Use SAP data elements when they carry useful domain rules or labels.',
      'Use constants for repeated fixed values.',
      'Prefix naming is optional by team standard, but consistency matters.',
    ],
    commonMistakes: [
      'Using generic CHAR fields when a SAP data element is available.',
      'Hardcoding the same value in many places instead of using a constant.',
      'Leaving variables with unclear names like lv_var1.',
    ],
    relatedTopics: ['DATA', 'CONSTANTS', 'Types'],
  },
  {
    id: 'abap-basics-if-elseif-else',
    title: 'IF / ELSEIF / ELSE',
    category: 'ABAP Basics',
    subcategory: 'IF Statements',
    tags: ['Classic ABAP', 'Beginner', 'Basics', 'Control Flow'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Classic IF syntax is broadly compatible across ECC and S/4HANA.',
    difficulty: 'Beginner',
    explanation: 'Use IF blocks for simple branching where each condition should be checked in order.',
    code: `IF lv_amount IS INITIAL.
  MESSAGE 'Amount is required' TYPE 'E'.
ELSEIF lv_amount < 0.
  MESSAGE 'Amount cannot be negative' TYPE 'E'.
ELSEIF lv_amount > 10000.
  MESSAGE 'Amount requires approval' TYPE 'W'.
ELSE.
  WRITE: / 'Amount accepted:', lv_amount.
ENDIF.`,
    notes: [
      'Put the most specific checks first.',
      'Use IS INITIAL instead of comparing every type to a literal initial value.',
      'Keep IF blocks short; extract complex logic into methods.',
    ],
    commonMistakes: [
      'Forgetting ENDIF.',
      'Writing deeply nested IF blocks that are hard to read.',
      'Using multiple independent IF statements when ELSEIF should make the branches exclusive.',
    ],
    relatedTopics: ['MESSAGE handling', 'Validation', 'CASE'],
  },
  {
    id: 'abap-basics-case-statement',
    title: 'CASE Statement',
    category: 'ABAP Basics',
    subcategory: 'CASE',
    tags: ['Classic ABAP', 'Beginner', 'Basics', 'Control Flow'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Classic CASE syntax is broadly compatible.',
    difficulty: 'Beginner',
    explanation: 'Use CASE when one value controls several possible branches.',
    code: `CASE lv_status.
  WHEN 'O'.
    lv_text = 'Open'.
  WHEN 'B'.
    lv_text = 'Blocked'.
  WHEN 'C'.
    lv_text = 'Closed'.
  WHEN OTHERS.
    lv_text = 'Unknown'.
ENDCASE.`,
    notes: [
      'CASE is usually clearer than many ELSEIF checks against the same variable.',
      'Always consider a WHEN OTHERS fallback.',
      'Keep branch actions small and readable.',
    ],
    commonMistakes: [
      'Using CASE for complex unrelated conditions.',
      'Forgetting WHEN OTHERS when unknown values are possible.',
      'Putting too much business logic inside each branch.',
    ],
    relatedTopics: ['IF statements', 'SWITCH', 'Control Flow'],
  },
  {
    id: 'abap-basics-switch-expression',
    title: 'SWITCH Expression',
    category: 'ABAP Basics',
    subcategory: 'SWITCH',
    tags: ['Modern ABAP 7.40+', 'Beginner', 'Basics', 'Control Flow'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'SWITCH is modern ABAP expression syntax and is not suitable for older ECC releases.',
    difficulty: 'Beginner',
    explanation: 'Use SWITCH for compact value mapping when the result is assigned directly.',
    code: `DATA(lv_text) = SWITCH string( lv_status
  WHEN 'O' THEN 'Open'
  WHEN 'B' THEN 'Blocked'
  WHEN 'C' THEN 'Closed'
  ELSE 'Unknown'
).`,
    notes: [
      'SWITCH is useful for simple value-to-value mapping.',
      'Use CASE when branch logic has multiple statements.',
      'Explicit result type such as string helps the compiler.',
    ],
    commonMistakes: [
      'Using SWITCH for complex procedural logic.',
      'Forgetting that this requires modern ABAP syntax.',
      'Making one-line expressions so dense that they become harder to read than CASE.',
    ],
    relatedTopics: ['CASE', 'Modern ABAP 7.40+', 'Expressions'],
  },
  {
    id: 'abap-basics-loop-at-where',
    title: 'LOOP AT With WHERE',
    category: 'ABAP Basics',
    subcategory: 'LOOP AT',
    tags: ['Classic ABAP', 'Beginner', 'Internal Tables', 'Basics'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'LOOP AT is classic-compatible. Inline DATA in the work area needs ABAP 7.40+.',
    difficulty: 'Beginner',
    explanation: 'Loop over internal table rows and restrict processing to rows that match a simple condition.',
    code: `LOOP AT lt_items INTO DATA(ls_item)
  WHERE status = 'OPEN'.

  WRITE: / ls_item-matnr, ls_item-quantity.

ENDLOOP.`,
    notes: [
      'WHERE in LOOP AT filters internal table processing, not database access.',
      'For older ABAP, declare the work area before the LOOP.',
      'For large tables and repeated reads, choose a suitable table key.',
    ],
    commonMistakes: [
      'Confusing LOOP AT WHERE with SQL WHERE.',
      'Doing expensive database SELECTs inside the loop.',
      'Using a STANDARD TABLE for many repeated key lookups.',
    ],
    relatedTopics: ['Internal Tables', 'READ TABLE', 'Performance'],
  },
  {
    id: 'abap-basics-do-loop',
    title: 'DO Loop With Counter',
    category: 'ABAP Basics',
    subcategory: 'DO',
    tags: ['Classic ABAP', 'Beginner', 'Basics', 'Control Flow'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'DO loops are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use DO when you need to repeat a block a known number of times.',
    code: `DO 5 TIMES.
  WRITE: / 'Iteration:', sy-index.
ENDDO.`,
    notes: [
      'SY-INDEX contains the current loop counter for DO and WHILE loops.',
      'Use EXIT to leave early when required.',
      'Prefer table loops when processing table rows.',
    ],
    commonMistakes: [
      'Using DO for table processing instead of LOOP AT.',
      'Forgetting a safe exit condition in more complex loops.',
      'Relying on SY-INDEX after nested loops without care.',
    ],
    relatedTopics: ['WHILE', 'LOOP AT', 'Control Flow'],
  },
  {
    id: 'abap-basics-while-loop',
    title: 'WHILE Loop',
    category: 'ABAP Basics',
    subcategory: 'WHILE',
    tags: ['Classic ABAP', 'Beginner', 'Basics', 'Control Flow'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'WHILE loops are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use WHILE when repetition depends on a condition that changes during processing.',
    code: `DATA lv_counter TYPE i VALUE 1.

WHILE lv_counter <= 5.
  WRITE: / 'Counter:', lv_counter.
  lv_counter = lv_counter + 1.
ENDWHILE.`,
    notes: [
      'Make sure the condition changes inside the loop.',
      'Use WHILE carefully; table loops and DO loops are clearer for many cases.',
      'Keep loop bodies small.',
    ],
    commonMistakes: [
      'Creating an infinite loop because the counter is never changed.',
      'Using WHILE when DO TIMES would be simpler.',
      'Changing several loop-control variables and making the condition hard to reason about.',
    ],
    relatedTopics: ['DO', 'EXIT', 'Control Flow'],
  },
  {
    id: 'abap-basics-append-clear-refresh',
    title: 'APPEND, CLEAR, And REFRESH',
    category: 'ABAP Basics',
    subcategory: 'Internal Table Basics',
    tags: ['Classic ABAP', 'Beginner', 'Internal Tables', 'Basics'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Classic internal table statements are broadly compatible.',
    difficulty: 'Beginner',
    explanation: 'Use APPEND to add rows, CLEAR to reset a work area, and CLEAR or REFRESH to empty an internal table.',
    code: `DATA ls_item TYPE ty_item.
DATA lt_items TYPE STANDARD TABLE OF ty_item.

CLEAR ls_item.
ls_item-matnr = 'MAT001'.
ls_item-qty   = 10.
APPEND ls_item TO lt_items.

CLEAR ls_item.
ls_item-matnr = 'MAT002'.
ls_item-qty   = 5.
APPEND ls_item TO lt_items.

CLEAR lt_items.`,
    notes: [
      'CLEAR work areas before reusing them in classic APPEND patterns.',
      'CLEAR itab empties an internal table in modern style; REFRESH is common in older code.',
      'Modern ABAP can often use VALUE syntax instead.',
    ],
    commonMistakes: [
      'Forgetting CLEAR and accidentally carrying old field values into the next row.',
      'Using APPEND on SORTED or HASHED tables where INSERT INTO TABLE is expected.',
      'Confusing CLEAR work_area with clearing the whole internal table.',
    ],
    relatedTopics: ['Internal Tables', 'VALUE syntax', 'SORTED TABLE'],
  },
  {
    id: 'abap-basics-check-continue-exit',
    title: 'CHECK, CONTINUE, And EXIT',
    category: 'ABAP Basics',
    subcategory: 'Loop Control',
    tags: ['Classic ABAP', 'Beginner', 'Basics', 'Control Flow'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CHECK, CONTINUE, and EXIT are classic-compatible, but behavior depends on processing block context.',
    difficulty: 'Beginner',
    explanation: 'Use loop-control statements to skip unwanted rows or stop processing early.',
    code: `LOOP AT lt_items INTO DATA(ls_item).
  CHECK ls_item-status = 'OPEN'.

  IF ls_item-quantity IS INITIAL.
    CONTINUE.
  ENDIF.

  IF ls_item-quantity > 1000.
    EXIT.
  ENDIF.

  WRITE: / ls_item-matnr, ls_item-quantity.
ENDLOOP.`,
    notes: [
      'CHECK inside a loop skips to the next loop pass when the condition is false.',
      'CONTINUE explicitly skips the rest of the current loop pass.',
      'EXIT leaves the loop completely.',
    ],
    commonMistakes: [
      'Using EXIT when CONTINUE was intended.',
      'Using CHECK outside a loop without understanding it can leave the current processing block.',
      'Adding too many early exits and making flow hard to follow.',
    ],
    relatedTopics: ['LOOP AT', 'IF statements', 'Control Flow'],
  },
  {
    id: 'abap-basics-simple-calculation',
    title: 'Simple Calculation And Rounding',
    category: 'ABAP Basics',
    subcategory: 'Calculations',
    tags: ['Classic ABAP', 'Beginner', 'Basics'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Packed numbers are classic-compatible. Decimal behavior depends on type definitions.',
    difficulty: 'Beginner',
    explanation: 'Use packed numbers for decimal calculations such as quantities, rates, and amounts.',
    code: `DATA lv_net   TYPE p LENGTH 10 DECIMALS 2.
DATA lv_tax   TYPE p LENGTH 10 DECIMALS 2.
DATA lv_total TYPE p LENGTH 10 DECIMALS 2.

lv_net = '100.00'.
lv_tax = lv_net * '0.07'.
lv_total = lv_net + lv_tax.

WRITE: / 'Total:', lv_total.`,
    notes: [
      'Use packed numbers for business decimals instead of floating point in most ABAP business logic.',
      'Use currency and quantity fields with their reference fields in real tables and structures.',
      'Be explicit about DECIMALS.',
    ],
    commonMistakes: [
      'Using type F for financial calculations.',
      'Forgetting currency or unit reference fields in DDIC structures.',
      'Assuming all decimal rounding rules are the same across business processes.',
    ],
    relatedTopics: ['DATA declarations', 'Currency fields', 'Quantities'],
  },
  {
    id: 'transport-preflight-checklist',
    title: 'Transport Preflight Checklist',
    category: 'Other ABAP Topics',
    subcategory: 'Transport Notes',
    tags: ['Classic ABAP', 'Beginner', 'Transport', 'Quality Check'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'This is a release-independent review checklist for ABAP development objects. Transport tooling and approvals vary by SAP landscape.',
    difficulty: 'Beginner',
    explanation:
      'Use this checklist before releasing a transport that contains ABAP reports, classes, function modules, text elements, or related DDIC changes.',
    code: `" Transport preflight notes:
" 1. Syntax check changed programs, includes, classes, and function groups.
" 2. Remove temporary BREAK-POINT, WRITE, and test-only messages.
" 3. Run the main success path and at least one empty-result or error path.
" 4. Confirm text elements, message classes, selection texts, and GUI statuses are included.
" 5. Check dependent DDIC objects, roles, variants, and customizing transports.
" 6. Attach or record test evidence according to the team release process.`,
    notes: [
      'Check whether a separate customizing request is needed for configuration, variants, number ranges, or roles.',
      'For urgent fixes, record what was tested and what risk remains.',
      'Release dependent transports in the right order so inactive or missing objects do not reach QA.',
    ],
    commonMistakes: [
      'Transporting code without required DDIC objects, text elements, or message classes.',
      'Leaving developer-only breakpoints or debug output in productive code.',
      'Forgetting that roles, variants, and customizing may live in separate requests.',
    ],
    relatedTopics: ['Quality Check', 'S/4HANA compatibility', 'messages', 'authorization checks'],
  },
  {
    id: 'select-distinct-unique-values',
    title: 'SELECT DISTINCT Unique Values',
    category: 'SELECT Statements',
    subcategory: 'SELECT DISTINCT',
    tags: ['Classic ABAP', 'Intermediate', 'Open SQL', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'SELECT DISTINCT is Open SQL syntax. Use it only when the distinctness is part of the business result, not as a quick fix for duplicate joins.',
    difficulty: 'Intermediate',
    explanation:
      'Use SELECT DISTINCT when the result should contain only unique combinations of the selected columns.',
    code: `TYPES: BEGIN OF ty_customer,
         kunnr TYPE vbak-kunnr,
       END OF ty_customer.

DATA lt_customers TYPE STANDARD TABLE OF ty_customer.

SELECT DISTINCT kunnr
  FROM vbak
  INTO TABLE lt_customers
  WHERE erdat IN s_erdat
    AND kunnr <> space.

IF lt_customers IS INITIAL.
  MESSAGE 'No customers found for the selected date range' TYPE 'S'.
ENDIF.`,
    notes: [
      'DISTINCT applies to the complete selected row, not just one field when multiple fields are selected.',
      'Prefer fixing an incorrect join condition over hiding duplicate rows with DISTINCT.',
      'For internal table de-duplication, SORT plus DELETE ADJACENT DUPLICATES may be clearer after data is already in memory.',
    ],
    commonMistakes: [
      'Selecting extra columns and expecting only one column to be unique.',
      'Using DISTINCT to mask duplicate records caused by an incomplete join.',
      'Forgetting that DISTINCT can add database work on large result sets.',
    ],
    relatedTopics: ['SELECT with WHERE', 'JOINs', 'DELETE ADJACENT DUPLICATES'],
  },
  {
    id: 'select-up-to-one-row-order-by',
    title: 'SELECT UP TO 1 ROWS With ORDER BY',
    category: 'SELECT Statements',
    subcategory: 'SELECT SINGLE',
    tags: ['Classic ABAP', 'Intermediate', 'Open SQL', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'Use SELECT SINGLE for a fully specified unique key. Use UP TO 1 ROWS with ORDER BY when choosing one row from several possible matches.',
    difficulty: 'Intermediate',
    explanation:
      'Use UP TO 1 ROWS with ORDER BY when the program needs the newest, oldest, highest, or otherwise deterministic first row.',
    code: `DATA ls_order TYPE vbak.

SELECT vbeln erdat auart kunnr
  FROM vbak
  INTO CORRESPONDING FIELDS OF ls_order
  UP TO 1 ROWS
  WHERE kunnr = p_kunnr
  ORDER BY erdat DESCENDING vbeln DESCENDING.
ENDSELECT.

IF sy-subrc = 0.
  WRITE: / 'Latest order:', ls_order-vbeln.
ELSE.
  MESSAGE 'No order found for customer' TYPE 'S'.
ENDIF.`,
    notes: [
      'ORDER BY makes the selected first row deterministic for the fields specified.',
      'SELECT SINGLE does not support ORDER BY, so it is not suitable when several rows may match.',
      'For large tables, ensure the WHERE and ORDER BY fields are sensible for the data volume and indexes.',
    ],
    commonMistakes: [
      'Using SELECT SINGLE with a partial key and assuming the same row will always be returned.',
      'Forgetting ENDSELECT in classic SELECT ... UP TO 1 ROWS loop form.',
      'Ordering large result sets without checking ST05 for database cost.',
    ],
    relatedTopics: ['SELECT SINGLE', 'ORDER BY', 'ST05'],
  },
  {
    id: 'selection-screen-pushbutton-user-command',
    title: 'Selection Screen Pushbutton',
    category: 'User Interface / Selection Screens',
    subcategory: 'Pushbuttons',
    tags: ['Classic ABAP', 'Beginner', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'SELECTION-SCREEN PUSHBUTTON and USER-COMMAND are classic selection-screen features for executable reports.',
    difficulty: 'Beginner',
    explanation:
      'Add a pushbutton to a report selection screen when the user needs an explicit helper action before execution.',
    code: `TABLES sscrfields.

DATA gv_help TYPE c LENGTH 25.

SELECTION-SCREEN PUSHBUTTON /1(25) gv_help USER-COMMAND help.

INITIALIZATION.
  gv_help = 'Show input rules'.

AT SELECTION-SCREEN.
  IF sscrfields-ucomm = 'HELP'.
    MESSAGE 'Enter company code and a restricted date range before running' TYPE 'I'.
  ENDIF.`,
    notes: [
      'Declare TABLES SSCRFIELDS to read the function code triggered on the selection screen.',
      'Keep pushbutton actions lightweight; heavy processing belongs after START-OF-SELECTION.',
      'Use clear button text because selection screens are often used by business users.',
    ],
    commonMistakes: [
      'Using a pushbutton for logic that should run when the report is executed.',
      'Forgetting to set the button text during INITIALIZATION.',
      'Not checking SSCRFIELDS-UCOMM in AT SELECTION-SCREEN.',
    ],
    relatedTopics: ['AT SELECTION-SCREEN', 'PARAMETERS', 'selection-screen validation'],
  },
  {
    id: 'selection-screen-field-validation',
    title: 'Field-Level Selection Screen Validation',
    category: 'User Interface / Selection Screens',
    subcategory: 'AT SELECTION-SCREEN',
    tags: ['Classic ABAP', 'Beginner', 'UI', 'Selection Screen'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'AT SELECTION-SCREEN ON field is classic-compatible and useful for focused validation on a specific input.',
    difficulty: 'Beginner',
    explanation:
      'Use field-level validation when one input field has its own rule and the cursor should return to that field after an error.',
    code: `PARAMETERS:
  p_bukrs TYPE bukrs OBLIGATORY,
  p_days  TYPE i DEFAULT 30.

AT SELECTION-SCREEN ON p_days.
  IF p_days <= 0 OR p_days > 365.
    MESSAGE 'Days must be between 1 and 365' TYPE 'E'.
  ENDIF.

AT SELECTION-SCREEN.
  IF p_bukrs IS INITIAL.
    MESSAGE 'Company code is required' TYPE 'E'.
  ENDIF.`,
    notes: [
      'Use AT SELECTION-SCREEN ON field for field-specific checks.',
      'Use the general AT SELECTION-SCREEN event for checks that compare multiple inputs.',
      'Keep error messages actionable so the user knows exactly what to change.',
    ],
    commonMistakes: [
      'Putting every validation in START-OF-SELECTION instead of stopping bad input earlier.',
      'Using field-level validation for rules that depend on several fields.',
      'Showing a generic error message that does not identify the invalid input.',
    ],
    relatedTopics: ['PARAMETERS', 'SELECT-OPTIONS', 'screen validation'],
  },
  {
    id: 'internal-table-sort-stable',
    title: 'SORT With Multiple Keys And STABLE',
    category: 'Internal Tables',
    subcategory: 'SORT',
    tags: ['Classic ABAP', 'Beginner', 'Internal Tables', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'SORT is classic-compatible. STABLE is useful when equal sort keys should keep their previous relative order.',
    difficulty: 'Beginner',
    explanation:
      'Sort standard internal tables explicitly by the fields that matter, especially before binary search or duplicate removal.',
    code: `SORT lt_items BY bukrs ASCENDING
                 matnr ASCENDING
                 erdat DESCENDING.

"Keep previous relative order for rows with equal sort keys.
SORT lt_items STABLE BY bukrs matnr.`,
    notes: [
      'Explicit BY fields make sorting intent clearer than relying on the table key.',
      'Use DESCENDING only for the fields that need reverse order.',
      'Use STABLE when equal keys must preserve earlier ordering.',
    ],
    commonMistakes: [
      'Using BINARY SEARCH after sorting by a different key sequence.',
      'Assuming SORT is stable by default.',
      'Sorting a table repeatedly inside a loop instead of sorting once before processing.',
    ],
    relatedTopics: ['READ TABLE', 'BINARY SEARCH', 'DELETE ADJACENT DUPLICATES'],
  },
  {
    id: 'internal-table-delete-adjacent-duplicates',
    title: 'DELETE ADJACENT DUPLICATES',
    category: 'Internal Tables',
    subcategory: 'DELETE',
    tags: ['Classic ABAP', 'Beginner', 'Internal Tables', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'DELETE ADJACENT DUPLICATES is classic-compatible. Rows must be adjacent, so sorting by the comparison fields is normally required first.',
    difficulty: 'Beginner',
    explanation:
      'Remove duplicate neighboring rows from an internal table after sorting by the fields that define equality.',
    code: `SORT lt_items BY bukrs matnr.

DELETE ADJACENT DUPLICATES FROM lt_items
  COMPARING bukrs matnr.

LOOP AT lt_items INTO DATA(ls_item).
  WRITE: / ls_item-bukrs, ls_item-matnr.
ENDLOOP.`,
    notes: [
      'The statement removes adjacent duplicates, not duplicates scattered throughout an unsorted table.',
      'COMPARING controls which fields define a duplicate.',
      'Sort by the same fields used in COMPARING before deleting duplicates.',
    ],
    commonMistakes: [
      'Forgetting to SORT before DELETE ADJACENT DUPLICATES.',
      'Using COMPARING ALL FIELDS when only a business key should define duplicates.',
      'Removing duplicates before preserving the row that should win.',
    ],
    relatedTopics: ['SORT', 'SELECT DISTINCT', 'Internal Tables'],
  },
  {
    id: 'internal-table-line-exists',
    title: 'line_exists For Existence Checks',
    category: 'Internal Tables',
    subcategory: 'line_exists',
    tags: ['Modern ABAP 7.40+', 'Beginner', 'Internal Tables'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'line_exists uses table expressions introduced with modern ABAP syntax. Use READ TABLE ... TRANSPORTING NO FIELDS on older ECC releases.',
    difficulty: 'Beginner',
    explanation:
      'Use line_exists when you only need to know whether an internal table contains a row for a key.',
    code: `IF line_exists( lt_items[ matnr = p_matnr ] ).
  MESSAGE 'Material exists in the result table' TYPE 'S'.
ELSE.
  MESSAGE 'Material was not selected' TYPE 'S'.
ENDIF.`,
    notes: [
      'line_exists returns a boolean-style result and does not return the row contents.',
      'Use a suitable table key for repeated existence checks on large tables.',
      'Use READ TABLE or table expressions with assignment when you also need the row data.',
    ],
    commonMistakes: [
      'Expecting sy-subrc or sy-tabix to be updated like READ TABLE.',
      'Using line_exists repeatedly on a large standard table without considering a key.',
      'Using it on older systems that do not support table expressions.',
    ],
    relatedTopics: ['READ TABLE', 'HASHED TABLE', 'Modern ABAP 7.40+'],
  },
  {
    id: 'internal-table-filter-expression',
    title: 'FILTER For Internal Tables',
    category: 'Internal Tables',
    subcategory: 'FILTER',
    tags: ['Modern ABAP 7.40+', 'Intermediate', 'Internal Tables'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes:
      'FILTER is modern ABAP syntax and is best used where the target system and team standards support expression-oriented code.',
    difficulty: 'Intermediate',
    explanation:
      'Use FILTER to derive a smaller internal table from an existing table when the filtering condition is simple and readable.',
    code: `TYPES ty_item_tab TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.

DATA lt_open_items TYPE ty_item_tab.

lt_open_items = FILTER #(
  lt_items
  WHERE status = 'OPEN'
    AND quantity > 0 ).`,
    notes: [
      'FILTER can make simple table filtering concise and expressive.',
      'For complex logic, a LOOP with clear IF conditions may be easier to debug.',
      'For very large tables, consider keys and measure performance instead of assuming expression syntax is faster.',
    ],
    commonMistakes: [
      'Using FILTER where a database WHERE condition would avoid reading unnecessary rows in the first place.',
      'Making one expression so dense that beginners cannot maintain it.',
      'Forgetting that release compatibility matters for modern expression syntax.',
    ],
    relatedTopics: ['LOOP AT', 'VALUE syntax', 'Modern ABAP 7.40+'],
  },
];
