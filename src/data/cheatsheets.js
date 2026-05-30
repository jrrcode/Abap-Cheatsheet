export const compatibilityOptions = ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'];

export const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

export const cheatsheets = [
  {
    id: 'foundation-variables-and-types',
    title: 'Variables And Types Foundation',
    category: 'Basics',
    subcategory: 'Variables and Types',
    tags: ['Beginner', 'Classic ABAP', 'Modern ABAP 7.40+', 'Types', 'Variables'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Inline DATA declarations require ABAP 7.40+. Classic DATA, TYPES, CONSTANTS, FIELD-SYMBOLS, TYPE, and LIKE are broadly compatible.',
    difficulty: 'Beginner',
    explanation: 'Use DATA for variables, TYPES for reusable local type definitions, CONSTANTS for fixed values, and FIELD-SYMBOLS when you need reference-like access to an existing row or field.',
    code: `REPORT z_foundation_variables.

"Local reusable structure type.
TYPES: BEGIN OF ty_customer,
         kunnr TYPE kunnr,
         name1 TYPE name1_gp,
         bukrs TYPE bukrs,
       END OF ty_customer.

"Variables, constants, internal table, and work area.
CONSTANTS gc_active TYPE c LENGTH 1 VALUE 'A'.
DATA gv_bukrs TYPE bukrs.
DATA gv_other_bukrs LIKE gv_bukrs. "LIKE copies the type of an existing object.
DATA gt_customers TYPE STANDARD TABLE OF ty_customer WITH EMPTY KEY.
DATA gs_customer TYPE ty_customer.
FIELD-SYMBOLS <ls_customer> TYPE ty_customer.

"Old style fill.
gs_customer-kunnr = '0000001000'.
gs_customer-name1 = 'Demo Customer'.
APPEND gs_customer TO gt_customers.

"Modern inline declaration.
DATA(lv_today) = sy-datum.

LOOP AT gt_customers ASSIGNING <ls_customer>.
  <ls_customer>-bukrs = '1000'.
ENDLOOP.`,
    notes: [
      'Prefer TYPE for DDIC types and local TYPES; use LIKE when you intentionally mirror an existing variable or table field.',
      'WITH EMPTY KEY avoids the surprising implicit standard key for standard tables.',
      'Inline DATA keeps small helper variables close to their first use, but do not hide important business types.',
    ],
    commonMistakes: [
      'Using LIKE randomly when TYPE would make the intended DDIC type clearer.',
      'Forgetting that FIELD-SYMBOLS change the assigned object directly.',
      'Using internal tables with header lines in new code.',
    ],
    relatedTopics: ['Internal Tables', 'Modern ABAP', 'FIELD-SYMBOLS'],
  },
  {
    id: 'foundation-conditions-control-flow',
    title: 'Conditions And Control Flow',
    category: 'Basics',
    subcategory: 'Conditions',
    tags: ['Beginner', 'Classic ABAP', 'Control Flow', 'Conditions'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'IF, CASE, CHECK, CONTINUE, EXIT, RETURN, EQ, NE, =, and <> are classic-compatible. ABAP_TRUE and ABAP_FALSE come from ABAP boolean conventions.',
    difficulty: 'Beginner',
    explanation: 'Use IF for flexible conditions, CASE for clear single-value branching, and loop-control statements only when they make the flow easier to read.',
    code: `DATA lv_status TYPE c LENGTH 1 VALUE 'A'.
DATA lv_valid  TYPE abap_bool VALUE abap_true.

"Old comparison operators still appear in legacy code.
IF lv_status EQ 'A' AND lv_valid EQ abap_true.
  WRITE: / 'Active'.
ELSEIF lv_status NE 'A'.
  WRITE: / 'Not active'.
ELSE.
  WRITE: / 'Unknown'.
ENDIF.

"Modern comparison operators are easier for many developers to scan.
IF lv_status = 'A' AND lv_valid = abap_true.
  WRITE: / 'Active'.
ENDIF.

CASE lv_status.
  WHEN 'A'.
    WRITE: / 'Approved'.
  WHEN 'B'.
    WRITE: / 'Blocked'.
  WHEN OTHERS.
    WRITE: / 'Other'.
ENDCASE.

LOOP AT lt_items INTO DATA(ls_item).
  CHECK ls_item-active = abap_true.

  IF ls_item-quantity IS INITIAL.
    CONTINUE.
  ENDIF.

  IF ls_item-quantity > 1000.
    EXIT.
  ENDIF.
ENDLOOP.

IF lv_valid = abap_false.
  RETURN.
ENDIF.`,
    notes: [
      'CHECK inside a loop skips the current loop pass when the condition is false.',
      'CONTINUE skips to the next loop pass, EXIT leaves the loop, and RETURN leaves the current procedure or event block.',
      'Use ABAP_TRUE and ABAP_FALSE for boolean-style flags when the type is ABAP_BOOL.',
    ],
    commonMistakes: [
      'Using EXIT when CONTINUE was intended.',
      'Using CHECK outside loops without understanding that it can leave the current processing block.',
      'Mixing old and new comparison styles in the same small block without reason.',
    ],
    relatedTopics: ['Loops', 'Common Mistakes', 'Modern ABAP'],
  },
  {
    id: 'foundation-loops',
    title: 'Loop Patterns',
    category: 'Basics',
    subcategory: 'Loops',
    tags: ['Beginner', 'Classic ABAP', 'Internal Tables', 'Loops'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'LOOP AT, DO, WHILE, SY-TABIX, INTO, and ASSIGNING are broadly compatible. Inline DATA/FIELD-SYMBOL declarations require modern ABAP.',
    difficulty: 'Beginner',
    explanation: 'Use INTO when you want a copy of the row. Use ASSIGNING when you want to read or change the original row without a separate MODIFY.',
    code: `"Classic work area loop.
DATA ls_item TYPE ty_item.
LOOP AT lt_items INTO ls_item.
  WRITE: / sy-tabix, ls_item-matnr.
ENDLOOP.

"Modern inline work area loop.
LOOP AT lt_items INTO DATA(ls_item_inline).
  WRITE: / sy-tabix, ls_item_inline-matnr.
ENDLOOP.

"ASSIGNING works directly on the table row.
LOOP AT lt_items ASSIGNING FIELD-SYMBOL(<ls_item>)
  WHERE status = 'OPEN'.
  <ls_item>-processed = abap_true.
ENDLOOP.

"DO loop.
DO 5 TIMES.
  WRITE: / sy-index.
ENDDO.

"WHILE loop.
DATA lv_count TYPE i VALUE 1.
WHILE lv_count <= 5.
  WRITE: / lv_count.
  lv_count = lv_count + 1.
ENDWHILE.`,
    notes: [
      'SY-TABIX contains the current loop index for index tables, but do not build fragile business logic around it.',
      'ASSIGNING is often faster and clearer for updating rows in place.',
      'LOOP AT ... WHERE filters table rows in ABAP memory; use SQL WHERE if the data can be filtered before being read.',
    ],
    commonMistakes: [
      'Changing a work area from LOOP ... INTO and expecting the internal table to change without MODIFY.',
      'Using nested loops over large tables instead of keyed reads or joins.',
      'Forgetting that SY-TABIX is not meaningful for every table/access pattern.',
    ],
    relatedTopics: ['Internal Tables', 'Performance', 'FIELD-SYMBOLS'],
  },
  {
    id: 'foundation-internal-tables',
    title: 'Internal Tables Foundation',
    category: 'Internal Tables',
    subcategory: 'Table Types and Operations',
    tags: ['Beginner', 'Classic ABAP', 'Modern ABAP 7.40+', 'Internal Tables'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'STANDARD, SORTED, HASHED, READ, MODIFY, DELETE, SORT, CLEAR, and REFRESH are classic-compatible. line_exists, table expressions, and FILTER require modern ABAP.',
    difficulty: 'Beginner',
    explanation: 'Internal tables hold temporary sets of data in ABAP memory. Choose the table type based on how you append, sort, loop, and read the data.',
    code: `TYPES: BEGIN OF ty_item,
         matnr TYPE matnr,
         qty   TYPE i,
       END OF ty_item.

DATA lt_standard TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.
DATA lt_sorted   TYPE SORTED TABLE OF ty_item WITH NON-UNIQUE KEY matnr.
DATA lt_hashed   TYPE HASHED TABLE OF ty_item WITH UNIQUE KEY matnr.
DATA ls_item     TYPE ty_item.

APPEND VALUE #( matnr = 'MAT1' qty = 10 ) TO lt_standard.
INSERT VALUE #( matnr = 'MAT2' qty = 20 ) INTO TABLE lt_sorted.
INSERT VALUE #( matnr = 'MAT3' qty = 30 ) INTO TABLE lt_hashed.

READ TABLE lt_standard INTO ls_item WITH KEY matnr = 'MAT1'.
IF sy-subrc = 0.
  ls_item-qty = ls_item-qty + 1.
  MODIFY lt_standard FROM ls_item TRANSPORTING qty WHERE matnr = ls_item-matnr.
ENDIF.

DELETE lt_standard WHERE qty <= 0.
SORT lt_standard BY matnr.
DELETE ADJACENT DUPLICATES FROM lt_standard COMPARING matnr.

"Modern checks and expressions.
IF line_exists( lt_standard[ matnr = 'MAT1' ] ).
  DATA(ls_found) = lt_standard[ matnr = 'MAT1' ].
ENDIF.

DATA(lt_positive) = FILTER #( lt_standard WHERE qty > 0 ).

CLEAR lt_standard.   "Clears table body for tables without header line.
REFRESH lt_standard. "Legacy style still common in old code.`,
    notes: [
      'Use STANDARD TABLE for append-and-loop, SORTED TABLE for ordered key reads/ranges, and HASHED TABLE for unique full-key lookups.',
      'DELETE ADJACENT DUPLICATES only removes neighboring duplicates, so sort by the comparison fields first.',
      'Avoid header line style in new code because it hides whether you are addressing the table body or work area.',
    ],
    commonMistakes: [
      'Using a STANDARD TABLE for thousands of repeated key reads.',
      'Using APPEND with sorted/hashed tables instead of INSERT INTO TABLE.',
      'Using line_exists on older releases that do not support table expressions.',
    ],
    relatedTopics: ['Loops', 'Performance', 'Modern ABAP'],
  },
  {
    id: 'foundation-open-sql',
    title: 'Open SQL Foundation',
    category: 'Open SQL',
    subcategory: 'SELECT Patterns',
    tags: ['Beginner', 'Intermediate', 'Open SQL', 'Modern ABAP 7.40+', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Modern Open SQL host variables with @ require ABAP 7.40+. Classic syntax without @ still appears in older code.',
    difficulty: 'Intermediate',
    explanation: 'Open SQL reads database tables and views through database-independent ABAP syntax. Select only the fields and rows you need.',
    code: `"SELECT SINGLE by key or selective condition.
SELECT SINGLE bukrs butxt
  FROM t001
  INTO @DATA(ls_company)
  WHERE bukrs = @p_bukrs.

"Specific fields into internal table.
SELECT vbeln erdat auart kunnr
  FROM vbak
  INTO TABLE @DATA(lt_orders)
  WHERE erdat IN @s_erdat
    AND auart NOT LIKE 'Z%'
  ORDER BY erdat DESCENDING
  UP TO 100 ROWS.

"IN / NOT IN with ranges or select-options.
SELECT matnr mtart
  FROM mara
  INTO TABLE @DATA(lt_materials)
  WHERE matnr IN @s_matnr
    AND mtart NOT IN @s_mtart_excl.

"DISTINCT unique combinations.
SELECT DISTINCT kunnr
  FROM vbak
  INTO TABLE @DATA(lt_customers)
  WHERE erdat IN @s_erdat.

"FOR ALL ENTRIES: always guard against empty driver table.
IF lt_customers IS NOT INITIAL.
  SELECT kunnr name1
    FROM kna1
    INTO TABLE @DATA(lt_names)
    FOR ALL ENTRIES IN @lt_customers
    WHERE kunnr = @lt_customers-kunnr.
ENDIF.`,
    notes: [
      'Use @ for host variables in modern Open SQL.',
      'Avoid SELECT inside LOOP; collect keys and use JOIN, IN @range, or FOR ALL ENTRIES when appropriate.',
      'Use SQL wildcard % for LIKE, not ABAP pattern wildcard *.',
    ],
    commonMistakes: [
      'Forgetting @ before ABAP variables in modern Open SQL.',
      'Using FOR ALL ENTRIES with an empty internal table, which can ignore the WHERE driver condition.',
      'Using SELECT * when only a few fields are needed.',
    ],
    relatedTopics: ['Joins', 'Performance', 'Internal Tables'],
  },
  {
    id: 'foundation-joins',
    title: 'Join Patterns',
    category: 'Joins',
    subcategory: 'INNER and OUTER JOIN',
    tags: ['Intermediate', 'Open SQL', 'Joins', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'INNER JOIN and LEFT OUTER JOIN are common ABAP SQL patterns. RIGHT OUTER JOIN support depends on release/syntax level; swapping table order with LEFT OUTER JOIN is usually more portable.',
    difficulty: 'Intermediate',
    explanation: 'Use INNER JOIN when matching rows must exist on both sides. Use LEFT OUTER JOIN when you must keep all left-side rows even if optional right-side data is missing.',
    code: `"Header + item INNER JOIN: only orders with matching items.
SELECT a~vbeln, a~erdat, b~posnr, b~matnr
  FROM vbak AS a
  INNER JOIN vbap AS b
    ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_order_items)
  WHERE a~erdat IN @s_erdat.

"LEFT OUTER JOIN: keep headers even if text/detail is missing.
SELECT a~vbeln, a~erdat, b~posnr, b~matnr
  FROM vbak AS a
  LEFT OUTER JOIN vbap AS b
    ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_orders_with_optional_items)
  WHERE a~erdat IN @s_erdat.

"RIGHT OUTER JOIN if your release supports it; prefer LEFT OUTER by swapping sides for portability.
SELECT a~vbeln, b~posnr
  FROM vbap AS b
  RIGHT OUTER JOIN vbak AS a
    ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_right_join_demo).

"Customer namespace-style table example. Confirm actual key fields in SE11.
SELECT a~*
  FROM /rsc/t_rm_3a AS a
  INNER JOIN /rsc/t_rm_3b AS b
    ON b~rm_id = a~rm_id
  INTO TABLE @DATA(lt_rm_3a_matches).

"CROSS JOIN warning: creates combinations of both sides; avoid unless truly required.`,
    notes: [
      'Check join fields in SE11 before coding; field names differ by table.',
      'A WHERE condition on the right table of a LEFT OUTER JOIN can accidentally turn it into inner-join behavior.',
      'Use aliases to keep multi-table SELECT fields readable.',
    ],
    commonMistakes: [
      'Using DISTINCT to hide duplicates caused by a wrong join condition.',
      'Using LEFT OUTER JOIN when business logic requires only complete matches.',
      'Creating a CROSS JOIN accidentally by missing a join condition in non-ABAP SQL contexts.',
    ],
    relatedTopics: ['Open SQL', 'Performance', 'DDIC'],
  },
  {
    id: 'foundation-modularization',
    title: 'Modularization: FORM, Function Modules, Methods',
    category: 'Modularization',
    subcategory: 'Procedural and OO Blocks',
    tags: ['Beginner', 'Classic ABAP', 'OOP ABAP', 'Function Modules'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'FORM/PERFORM is legacy-compatible. Methods/classes are preferred for new ABAP. TABLES parameters in FORMs are old style.',
    difficulty: 'Beginner',
    explanation: 'Modularize repeated logic into a FORM in legacy reports, a function module for reusable procedural APIs, or methods/classes for modern maintainable ABAP.',
    code: `"FORM with USING and CHANGING.
PERFORM calculate_total USING lv_net lv_tax CHANGING lv_total.

FORM calculate_total
  USING    iv_net   TYPE p
           iv_tax   TYPE p
  CHANGING cv_total TYPE p.
  cv_total = iv_net + iv_tax.
ENDFORM.

"Passing internal tables to FORM. Avoid TABLES in new code.
PERFORM display_items USING lt_items.

FORM display_items USING it_items TYPE ty_item_tab.
  LOOP AT it_items INTO DATA(ls_item).
    WRITE: / ls_item-matnr.
  ENDLOOP.
ENDFORM.

"Function module call.
CALL FUNCTION 'Z_CALCULATE_TOTAL'
  EXPORTING
    iv_net   = lv_net
  IMPORTING
    ev_total = lv_total
  EXCEPTIONS
    failed   = 1
    OTHERS   = 2.

"Modern method call preferred for new application logic.
lv_total = lo_calculator->calculate_total( iv_net = lv_net ).`,
    notes: [
      'FORMS cannot be nested inside other FORMS; define them at program level.',
      'USING is input, CHANGING is input/output. Keep parameter order aligned between PERFORM and FORM.',
      'Use methods/classes for testable, encapsulated new development.',
    ],
    commonMistakes: [
      'FORM and PERFORM parameter mismatch.',
      'Putting FORM inside FORM.',
      'Using old TABLES parameters where typed USING/CHANGING parameters would be clearer.',
    ],
    relatedTopics: ['Function Modules / RFC', 'OOP ABAP', 'Common Mistakes'],
  },
  {
    id: 'foundation-function-modules-rfc',
    title: 'Function Modules And RFC',
    category: 'Function Modules / RFC',
    subcategory: 'CALL FUNCTION',
    tags: ['Intermediate', 'Classic ABAP', 'RFC', 'Function Modules'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CALL FUNCTION is classic-compatible. DESTINATION NONE is a remote-style local call for remote-enabled function modules and differs from omitting DESTINATION.',
    difficulty: 'Intermediate',
    explanation: 'Use CALL FUNCTION for function modules. Add DESTINATION for RFC calls to another system, an RFC destination, or DESTINATION NONE for remote-style execution in the same system.',
    code: `"Local function module call.
CALL FUNCTION 'Z_LOCAL_FM'
  EXPORTING
    iv_input  = lv_input
  IMPORTING
    ev_output = lv_output
  TABLES
    et_items  = lt_items
  EXCEPTIONS
    failed    = 1
    OTHERS    = 2.

IF sy-subrc <> 0.
  MESSAGE 'Function module failed' TYPE 'E'.
ENDIF.

"Remote-enabled function module call.
CALL FUNCTION 'Z_REMOTE_FM'
  DESTINATION lv_rfc
  EXPORTING
    iv_input              = lv_input
  IMPORTING
    ev_output             = lv_output
  TABLES
    et_items              = lt_items
  EXCEPTIONS
    communication_failure = 1 MESSAGE lv_message
    system_failure        = 2 MESSAGE lv_message
    OTHERS                = 3.

"Remote-style local call for a remote-enabled FM.
CALL FUNCTION 'Z_REMOTE_FM'
  DESTINATION 'NONE'
  EXPORTING
    iv_input = lv_input.

"Close an RFC connection when appropriate.
CALL FUNCTION 'RFC_CONNECTION_CLOSE'
  EXPORTING
    destination = lv_rfc.`,
    notes: [
      'A remote-enabled FM can be called locally without DESTINATION, or as RFC-style local execution with DESTINATION NONE.',
      'Handle COMMUNICATION_FAILURE and SYSTEM_FAILURE for RFC calls.',
      'Use SM59 to maintain and test RFC destinations.',
    ],
    commonMistakes: [
      'Assuming DESTINATION NONE is exactly the same as omitting DESTINATION.',
      'Ignoring RFC communication/system failures.',
      'Using TABLES parameters for new APIs when typed exporting/importing/changing tables are available.',
    ],
    relatedTopics: ['RFC', 'SM59', 'Modularization'],
  },
  {
    id: 'foundation-ddic',
    title: 'SAP Dictionary / DDIC Basics',
    category: 'DDIC',
    subcategory: 'SE11 Objects',
    tags: ['Beginner', 'DDIC', 'SE11', 'Classic ABAP', 'S/4HANA'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Transparent tables, structures, data elements, domains, and search helps are core DDIC concepts. Pool/cluster tables are legacy topics and are not a new-development target in S/4HANA.',
    difficulty: 'Beginner',
    explanation: 'Use SE11 to inspect table fields, data elements, domains, structures, and search helps. DDIC types keep ABAP variables aligned with SAP table definitions.',
    code: `"Use DDIC field types directly.
DATA lv_bukrs TYPE t001-bukrs.
DATA lv_vbeln TYPE vbak-vbeln.

"Structure and internal table based on a transparent table.
DATA ls_order  TYPE vbak.
DATA lt_orders TYPE STANDARD TABLE OF vbak WITH EMPTY KEY.

"Select only needed DDIC fields.
SELECT vbeln erdat auart kunnr
  FROM vbak
  INTO TABLE @DATA(lt_order_list)
  WHERE vbeln IN @s_vbeln.

"Useful SE11 checks:
"1. Display table fields and key fields.
"2. Open the data element to see labels and documentation.
"3. Open the domain to see fixed values/conversion exits.
"4. Check search helps attached to fields or data elements.`,
    notes: [
      'Transparent tables map to database tables. Pool and cluster tables are legacy storage concepts.',
      'Data elements provide semantic meaning, labels, and documentation; domains provide technical type and fixed values.',
      'Search helps improve selection-screen and dynpro input help.',
    ],
    commonMistakes: [
      'Guessing field names instead of checking SE11.',
      'Using generic character types instead of table field types.',
      'Treating old pooled/cluster table assumptions as S/4HANA-ready design.',
    ],
    relatedTopics: ['Open SQL', 'Selection Screens', 'S/4HANA'],
  },
  {
    id: 'foundation-debugging',
    title: 'Debugging Workflow',
    category: 'Debugging',
    subcategory: 'Debugger Basics',
    tags: ['Beginner', 'Debugging', 'Classic ABAP', 'RFC'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Debugger tools vary by SAP GUI, ADT, authorization, and system settings, but the workflow applies broadly.',
    difficulty: 'Beginner',
    explanation: 'Use the debugger to inspect variables, internal tables, SY-SUBRC, call stack, SELECT results, and parameter flow between routines.',
    code: `"Debugger quick notes:
"/h                    -> start debugging before executing a transaction/report.
"Session breakpoint    -> current user/session.
"External breakpoint   -> HTTP/RFC/background-style entry points for your user.
"Watchpoint            -> stop when a variable changes or reaches a condition.

"Useful checks while debugging:
"1. Check SY-SUBRC immediately after READ/CALL/SELECT.
"2. Inspect internal table row count and keys.
"3. Check the call stack to see how code was reached.
"4. Compare FORM/PERFORM parameter order and types.
"5. For RFC, set an external breakpoint in the called system/user context.
"6. For SELECT issues, inspect selection ranges and returned table contents.

BREAK-POINT. "Remove before transport unless intentionally controlled.`,
    notes: [
      'Use external breakpoints for RFC, web, and some background/debug entry points.',
      'Watchpoints are excellent for finding where a variable changes unexpectedly.',
      'Always remove temporary BREAK-POINT statements before transport.',
    ],
    commonMistakes: [
      'Checking SY-SUBRC too late after another statement changed it.',
      'Debugging the caller system when the RFC issue is in the called system.',
      'Missing a FORM/PERFORM mismatch because the parameter order looks similar.',
    ],
    relatedTopics: ['Function Modules / RFC', 'Open SQL', 'Common Mistakes'],
  },
  {
    id: 'foundation-transport-management',
    title: 'Transport Management Tables',
    category: 'Transport Tables',
    subcategory: 'E070 / E071 / E071K',
    tags: ['Intermediate', 'Classic ABAP', 'Transport', 'Open SQL'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'E070, E071, and E071K are common transport organizer tables. Interpret status and ownership according to your landscape process.',
    difficulty: 'Intermediate',
    explanation: 'Use E070 for requests/tasks, E071 for transported objects, and E071K for table keys such as TABU entries.',
    code: `"Request header / task data.
SELECT SINGLE trkorr strkorr trstatus as4user
  FROM e070
  INTO @DATA(ls_request)
  WHERE trkorr = @p_trkorr.

"Tasks under a request: E070-STRKORR points to the parent request.
SELECT trkorr trstatus as4user
  FROM e070
  INTO TABLE @DATA(lt_tasks)
  WHERE strkorr = @p_trkorr.

"Objects under a request or task.
SELECT trkorr pgmid object obj_name
  FROM e071
  INTO TABLE @DATA(lt_objects)
  WHERE trkorr = @p_trkorr.

"TABU keys for table content transports.
SELECT trkorr pgmid object objname tabkey
  FROM e071k
  INTO TABLE @DATA(lt_tabu_keys)
  WHERE trkorr = @p_trkorr.

"Common fields:
"E070-TRKORR   request/task number
"E070-STRKORR  parent request for a task
"E070-TRSTATUS transport status`,
    notes: [
      'A request can contain tasks; unreleased object entries may still sit under tasks until release/collection.',
      'E071 object type PROG is for programs; do not confuse object names and object types.',
      'Released transport behavior depends on task/request release state and transport route.',
    ],
    commonMistakes: [
      'Confusing request and task numbers.',
      'Looking only at the request and missing objects still assigned to tasks.',
      'Using wrong object type names, for example REPS when PROG is expected in many report contexts.',
    ],
    relatedTopics: ['Open SQL', 'Common Mistakes', 'SE09 / SE10'],
  },
  {
    id: 'foundation-alv-reports',
    title: 'ALV Report Templates',
    category: 'ALV',
    subcategory: 'Classic ALV and SALV',
    tags: ['Intermediate', 'Classic ABAP', 'ALV', 'Reporting'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'REUSE_ALV_GRID_DISPLAY is classic function-module ALV. CL_SALV_TABLE is a common read-only OO ALV option.',
    difficulty: 'Intermediate',
    explanation: 'Use classic ALV when maintaining old reports with field catalogs. Use SALV for quick read-only table display in newer code.',
    code: `"Classic ALV.
DATA lt_fieldcat TYPE slis_t_fieldcat_alv.
DATA ls_fieldcat TYPE slis_fieldcat_alv.
DATA ls_layout   TYPE slis_layout_alv.

ls_fieldcat-fieldname = 'VBELN'.
ls_fieldcat-seltext_m = 'Sales Doc'.
APPEND ls_fieldcat TO lt_fieldcat.

ls_layout-zebra = abap_true.

CALL FUNCTION 'REUSE_ALV_GRID_DISPLAY'
  EXPORTING
    is_layout   = ls_layout
    it_fieldcat = lt_fieldcat
  TABLES
    t_outtab    = lt_output.

"SALV read-only ALV.
DATA lo_alv TYPE REF TO cl_salv_table.

cl_salv_table=>factory(
  IMPORTING
    r_salv_table = lo_alv
  CHANGING
    t_table      = lt_output ).

lo_alv->get_functions( )->set_all( abap_true ).
lo_alv->get_columns( )->set_optimize( abap_true ).
lo_alv->get_columns( )->get_column( 'VBELN' )->set_medium_text( 'Sales Doc' ).
lo_alv->display( ).`,
    notes: [
      'Handle no-data-found before opening ALV so users get a clear message.',
      'Classic ALV is common in older reports; SALV is simpler for read-only display.',
      'Set column text and optimize widths before DISPLAY.',
    ],
    commonMistakes: [
      'Calling DISPLAY before configuring columns/functions.',
      'Using SALV for editable-grid requirements.',
      'Building a field catalog with wrong field names.',
    ],
    relatedTopics: ['Open SQL', 'Reporting', 'CL_SALV_TABLE'],
  },
  {
    id: 'foundation-modern-abap',
    title: 'Modern ABAP Syntax Quick Reference',
    category: 'Modern ABAP',
    subcategory: 'Expressions',
    tags: ['Modern ABAP 7.40+', 'Intermediate', 'S/4HANA', 'Expressions'],
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Exact expression availability depends on release. Use only syntax supported by your target ECC/S/4HANA system.',
    difficulty: 'Intermediate',
    explanation: 'Modern ABAP reduces boilerplate with inline declarations and expressions. Use it when it improves readability and your target release supports it.',
    code: `DATA(lv_text) = |Material { lv_matnr ALPHA = OUT }|.
DATA(lv_internal_matnr) = |{ lv_matnr ALPHA = IN }|.

DATA(lt_numbers) = VALUE int4_table( ( 1 ) ( 2 ) ( 3 ) ).

DATA(ls_target) = CORRESPONDING ty_target( ls_source ).

DATA(lv_result) = COND string(
  WHEN lv_count = 0 THEN 'Empty'
  ELSE 'Filled' ).

DATA(lv_type_text) = SWITCH string( lv_type
  WHEN 'A' THEN 'Active'
  WHEN 'B' THEN 'Blocked'
  ELSE 'Other' ).

DATA(lt_open) = FILTER #( lt_items WHERE status = 'OPEN' ).

DATA(lv_total) = REDUCE i(
  INIT sum = 0
  FOR ls_item IN lt_items
  NEXT sum = sum + ls_item-quantity ).

IF line_exists( lt_items[ matnr = lv_matnr ] ).
  DATA(ls_item) = VALUE #( lt_items[ matnr = lv_matnr ] OPTIONAL ).
ENDIF.

DATA(lv_flag) = xsdbool( lines( lt_items ) > 0 ).

lt_items = VALUE #( BASE lt_items ( matnr = 'MAT1' quantity = 1 ) ).

LOOP AT lt_items ASSIGNING FIELD-SYMBOL(<ls_item>) GROUP BY <ls_item>-matnr.
  "Group processing here.
ENDLOOP.`,
    notes: [
      'Use OPTIONAL with table expressions when a missing row should not raise an exception.',
      'BASE preserves existing rows or structure values when building with VALUE.',
      'Do not use modern syntax only to be clever; use it to make intent clearer.',
    ],
    commonMistakes: [
      'Using unsupported expression syntax on older ECC systems.',
      'Creating overly dense one-liners that are hard to debug.',
      'Assuming line_exists sets SY-SUBRC like READ TABLE.',
    ],
    relatedTopics: ['Internal Tables', 'Open SQL', 'OOP ABAP'],
  },
  {
    id: 'foundation-oop-abap',
    title: 'Object-Oriented ABAP Basics',
    category: 'OOP ABAP',
    subcategory: 'Classes and Methods',
    tags: ['Beginner', 'Intermediate', 'OOP ABAP', 'Modern ABAP 7.40+'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CLASS/METHOD syntax is broadly available. Inline object creation with NEW requires modern ABAP.',
    difficulty: 'Intermediate',
    explanation: 'Use classes and methods to organize responsibilities, make code easier to test, and avoid large procedural reports full of global state.',
    code: `INTERFACE lif_formatter.
  METHODS format
    IMPORTING iv_value TYPE string
    RETURNING VALUE(rv_text) TYPE string.
ENDINTERFACE.

CLASS lcl_report DEFINITION.
  PUBLIC SECTION.
    INTERFACES lif_formatter.
    CLASS-METHODS get_version RETURNING VALUE(rv_version) TYPE string.
    METHODS constructor IMPORTING iv_bukrs TYPE bukrs.
    METHODS run.
  PRIVATE SECTION.
    DATA mv_bukrs TYPE bukrs.
    METHODS read_data RETURNING VALUE(rt_items) TYPE ty_item_tab.
ENDCLASS.

CLASS lcl_report IMPLEMENTATION.
  METHOD constructor.
    mv_bukrs = iv_bukrs.
  ENDMETHOD.

  METHOD lif_formatter~format.
    rv_text = |Value: { iv_value }|.
  ENDMETHOD.

  METHOD get_version.
    rv_version = '1.0'.
  ENDMETHOD.

  METHOD run.
    DATA(lt_items) = read_data( ).
  ENDMETHOD.

  METHOD read_data.
    "Read data here.
  ENDMETHOD.
ENDCLASS.

DATA(lo_report) = NEW lcl_report( iv_bukrs = p_bukrs ).
lo_report->run( ).`,
    notes: [
      'Use instance methods when behavior depends on object state.',
      'Use static methods for stateless utility behavior, but avoid turning classes into dumping grounds.',
      'Prefer methods over FORMs for new code because signatures are clearer and easier to refactor.',
    ],
    commonMistakes: [
      'Making everything PUBLIC.',
      'Using global data instead of attributes/parameters.',
      'Creating static methods just to avoid understanding object creation.',
    ],
    relatedTopics: ['Modularization', 'Modern ABAP', 'Interfaces'],
  },
  {
    id: 'foundation-performance-basics',
    title: 'Performance Basics',
    category: 'Performance',
    subcategory: 'Safe Defaults',
    tags: ['Beginner', 'Intermediate', 'Performance', 'Open SQL', 'Internal Tables'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'The principles apply across ECC and S/4HANA; exact tuning should be measured with tools such as ST05 and SAT.',
    difficulty: 'Beginner',
    explanation: 'Most beginner performance problems come from reading too much data, reading data too often, or using the wrong internal table access pattern.',
    code: `"Avoid SELECT inside LOOP.
"Bad:
LOOP AT lt_orders INTO DATA(ls_order).
  SELECT SINGLE name1 FROM kna1 INTO @DATA(lv_name)
    WHERE kunnr = @ls_order-kunnr.
ENDLOOP.

"Better: collect keys, remove duplicates, read once.
DATA lt_kunnr TYPE SORTED TABLE OF kunnr WITH UNIQUE KEY table_line.

LOOP AT lt_orders INTO ls_order.
  INSERT ls_order-kunnr INTO TABLE lt_kunnr.
ENDLOOP.

IF lt_kunnr IS NOT INITIAL.
  SELECT kunnr name1
    FROM kna1
    INTO TABLE @DATA(lt_names)
    FOR ALL ENTRIES IN @lt_kunnr
    WHERE kunnr = @lt_kunnr-table_line.
ENDIF.

"Use a hashed table for repeated exact key reads.
DATA lt_names_h TYPE HASHED TABLE OF ty_name WITH UNIQUE KEY kunnr.
READ TABLE lt_names_h INTO DATA(ls_name) WITH TABLE KEY kunnr = ls_order-kunnr.`,
    notes: [
      'Select only needed fields and avoid SELECT * in productive reports.',
      'Check the driver table is not initial before FOR ALL ENTRIES.',
      'Use SORTED or HASHED tables for repeated key reads; use proper keys.',
    ],
    commonMistakes: [
      'FOR ALL ENTRIES with an empty table.',
      'DELETE ADJACENT DUPLICATES without sorting first.',
      'Using DISTINCT to hide data-model or join mistakes.',
    ],
    relatedTopics: ['Open SQL', 'Internal Tables', 'ST05 / SAT'],
  },
  {
    id: 'foundation-common-transactions',
    title: 'Common SAP Transactions',
    category: 'Basics',
    subcategory: 'Transactions',
    tags: ['Beginner', 'SAP GUI', 'Transactions'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Transaction availability depends on system type, authorization, SAP GUI, and whether the system is classic GUI or cloud-oriented.',
    difficulty: 'Beginner',
    explanation: 'These are common SAP GUI transactions ABAP developers use to inspect code, dictionary objects, function modules, transports, jobs, dumps, logs, and RFC destinations.',
    code: `"Development:
"SE38  ABAP Editor / reports
"SE80  Object Navigator
"SE11  ABAP Dictionary
"SE16N Table display
"SE37  Function Builder
"SE24  Class Builder

"Transports:
"SE09  Transport Organizer
"SE10  Transport Organizer
"SE03  Transport Organizer Tools

"Runtime / administration:
"SM59  RFC destinations
"ST22  ABAP dumps
"SM21  System log
"SM37  Background jobs`,
    notes: [
      'Use SE11 before coding against unfamiliar tables.',
      'Use ST22 after a runtime error and SM37 for background job issues.',
      'Use SM59 to test RFC destinations before debugging ABAP interface logic.',
    ],
    commonMistakes: [
      'Using SE16N results as proof of authorization or application behavior.',
      'Checking the wrong client/system when debugging transport or table issues.',
      'Forgetting that transaction access depends on roles.',
    ],
    relatedTopics: ['DDIC', 'Debugging', 'Transport Tables'],
  },
  {
    id: 'foundation-common-beginner-mistakes',
    title: 'Common Beginner Mistakes',
    category: 'Common Mistakes',
    subcategory: 'Troubleshooting Checklist',
    tags: ['Beginner', 'Common Mistakes', 'Debugging', 'Performance'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'These mistakes appear across classic and modern ABAP. Exact symptoms differ by release and syntax mode.',
    difficulty: 'Beginner',
    explanation: 'Use this checklist when code compiles but behaves strangely, dumps, returns too much data, or fails during transport analysis.',
    code: `"Checklist:
"1. FORM/PERFORM parameter count, order, and types must match.
"2. Do not define FORM inside another FORM.
"3. Transport object type for programs is commonly PROG, not random text such as REPS.
"4. Modern Open SQL needs @ for ABAP host variables.
"5. SORT before DELETE ADJACENT DUPLICATES using the same comparison fields.
"6. Avoid SELECT inside LOOP.
"7. Check driver table is not initial before FOR ALL ENTRIES.
"8. Avoid old internal tables WITH HEADER LINE.
"9. SQL LIKE uses %, ABAP CP uses *.
"10. Distinguish transport request from task in E070/E071.

"SQL LIKE:
WHERE name1 LIKE 'ABC%'

"ABAP CP:
IF lv_name CP 'ABC*'.
ENDIF.`,
    notes: [
      'When stuck, check SY-SUBRC immediately after the statement that matters.',
      'Use debugger call stack for FORM/PERFORM and method flow issues.',
      'Use SE11 for object fields and SE09/SE10 for transport ownership.',
    ],
    commonMistakes: [
      'Assuming all pattern matching uses the same wildcard.',
      'Using generic STANDARD TABLE parameters without defining a useful row type.',
      'Confusing request-level and task-level transport entries.',
    ],
    relatedTopics: ['Debugging', 'Transport Tables', 'Open SQL'],
  },
  {
    id: 'foundation-practical-templates',
    title: 'Practical Copy/Paste Templates',
    category: 'Practical Templates',
    subcategory: 'Work Starter Pack',
    tags: ['Beginner', 'Intermediate', 'Templates', 'Classic ABAP', 'Modern ABAP 7.40+'],
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Some templates use modern Open SQL with @ and inline DATA. Convert inline declarations to explicit DATA on older releases.',
    difficulty: 'Beginner',
    explanation: 'Copy these compact starter patterns when building a report, selection screen, database read, ALV, RFC call, transport lookup, range table, message, TRY/CATCH, FORM, or method.',
    code: `REPORT z_quick_template.

"Selection screen.
PARAMETERS p_bukrs TYPE bukrs OBLIGATORY.
SELECT-OPTIONS s_vbeln FOR vbak-vbeln.

AT SELECTION-SCREEN.
  IF s_vbeln[] IS INITIAL.
    MESSAGE 'Enter at least one document range' TYPE 'E'.
  ENDIF.

"Simple SELECT.
SELECT vbeln erdat auart kunnr
  FROM vbak
  INTO TABLE @DATA(lt_orders)
  WHERE vbeln IN @s_vbeln.

"INNER JOIN.
SELECT a~vbeln, b~posnr, b~matnr
  FROM vbak AS a
  INNER JOIN vbap AS b ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_items)
  WHERE a~vbeln IN @s_vbeln.

"LEFT OUTER JOIN.
SELECT a~vbeln, b~posnr
  FROM vbak AS a
  LEFT OUTER JOIN vbap AS b ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_optional_items)
  WHERE a~vbeln IN @s_vbeln.

"FOR ALL ENTRIES.
IF lt_orders IS NOT INITIAL.
  SELECT vbeln posnr matnr
    FROM vbap
    INTO TABLE @DATA(lt_fae_items)
    FOR ALL ENTRIES IN @lt_orders
    WHERE vbeln = @lt_orders-vbeln.
ENDIF.

"Range table from select-options.
DATA lt_vbeln_range LIKE s_vbeln[].
lt_vbeln_range = s_vbeln[].

"Delete entries based on another table.
DATA lr_blocked_matnr TYPE RANGE OF matnr.
lr_blocked_matnr = VALUE #(
  FOR ls_blocked IN lt_blocked_matnr
  ( sign = 'I' option = 'EQ' low = ls_blocked-matnr ) ).
DELETE lt_items WHERE matnr IN lr_blocked_matnr.

"Message and TRY/CATCH.
TRY.
    "Risky logic.
  CATCH cx_root INTO DATA(lx_error).
    MESSAGE lx_error->get_text( ) TYPE 'E'.
ENDTRY.

"RFC call.
CALL FUNCTION 'Z_REMOTE_FM'
  DESTINATION lv_rfc
  EXPORTING iv_input = lv_input
  EXCEPTIONS communication_failure = 1 MESSAGE lv_message
             system_failure        = 2 MESSAGE lv_message
             OTHERS                = 3.

"Transport tables.
SELECT SINGLE trkorr strkorr trstatus FROM e070 INTO @DATA(ls_e070) WHERE trkorr = @p_trkorr.
SELECT trkorr pgmid object obj_name FROM e071 INTO TABLE @DATA(lt_e071) WHERE trkorr = @p_trkorr.
SELECT trkorr objname tabkey FROM e071k INTO TABLE @DATA(lt_e071k) WHERE trkorr = @p_trkorr.

"SALV.
cl_salv_table=>factory( IMPORTING r_salv_table = DATA(lo_alv) CHANGING t_table = lt_orders ).
lo_alv->get_functions( )->set_all( abap_true ).
lo_alv->display( ).

"FORM and method returning.
PERFORM add_one USING lv_input CHANGING lv_result.
FORM add_one USING iv_input TYPE i CHANGING cv_result TYPE i.
  cv_result = iv_input + 1.
ENDFORM.

METHODS get_count RETURNING VALUE(rv_count) TYPE i.`,
    notes: [
      'Treat this as a starter pack and adapt types, table names, and error handling to the real requirement.',
      'For classic ALV with REUSE_ALV_GRID_DISPLAY, build SLIS_T_FIELDCAT_ALV and pass T_OUTTAB.',
      'Keep templates small; create a focused card when a pattern needs more explanation.',
    ],
    commonMistakes: [
      'Copying a template without changing DDIC types and table fields.',
      'Leaving generic message text in production code.',
      'Using modern syntax in a system that does not support it.',
    ],
    relatedTopics: ['Open SQL', 'ALV', 'Function Modules / RFC', 'Transport Tables'],
  },
];
