export const compatibilityOptions = ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'];

export const difficultyOptions = ['Beginner', 'Intermediate', 'Advanced'];

export const cheatsheets = [
  {
    id: 'basics-data-declarations',
    title: 'DATA Declarations',
    category: 'Basics',
    subcategory: 'Variables and Types',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Classic DATA declarations work broadly. Inline DATA declarations require ABAP 7.40+.',
    difficulty: 'Beginner',
    explanation: 'Use DATA for local variables and prefer DDIC or local TYPES so your variables match real SAP field definitions.',
    code: `DATA gv_bukrs TYPE bukrs.
DATA gv_other_bukrs LIKE gv_bukrs.
DATA gv_name TYPE c LENGTH 40.
DATA gv_count TYPE i.

"Modern inline declaration.
DATA(lv_today) = sy-datum.
DATA(lv_text) = |Company code: { gv_bukrs }|.`,
    notes: [
      'Prefer TYPE when you know the DDIC or local type.',
      'Use LIKE when you intentionally mirror the type of an existing variable or table field.',
      'Keep important business variables explicitly typed for readability.',
    ],
    commonMistakes: [
      'Using generic character fields when a DDIC type exists.',
      'Using inline DATA on systems below ABAP 7.40.',
      'Naming variables too generically, for example lv_value for everything.',
    ],
    relatedTopics: ['TYPES', 'Constants', 'Modern ABAP'],
  },
  {
    id: 'basics-types-structures',
    title: 'TYPES Structure Template',
    category: 'Basics',
    subcategory: 'Variables and Types',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Local TYPES and structured work areas are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use TYPES to define a reusable local row structure, then create a work area and internal table from that type.',
    code: `TYPES: BEGIN OF ty_customer,
         kunnr TYPE kunnr,
         name1 TYPE name1_gp,
         bukrs TYPE bukrs,
       END OF ty_customer.

DATA gs_customer  TYPE ty_customer.
DATA gt_customers TYPE STANDARD TABLE OF ty_customer WITH EMPTY KEY.

gs_customer-kunnr = '0000001000'.
gs_customer-name1 = 'Demo Customer'.
gs_customer-bukrs = '1000'.
APPEND gs_customer TO gt_customers.`,
    notes: [
      'Create local TYPES when the result structure is not exactly one DDIC table.',
      'WITH EMPTY KEY avoids the old implicit standard key behavior.',
      'Use meaningful type names such as ty_customer or ty_order_item.',
    ],
    commonMistakes: [
      'Using a DDIC table type when the selected fields do not match it.',
      'Forgetting to APPEND or INSERT the filled work area into the table.',
      'Overusing global data instead of local types inside reports/classes.',
    ],
    relatedTopics: ['Internal Tables', 'Open SQL', 'DDIC'],
  },
  {
    id: 'basics-constants',
    title: 'CONSTANTS Template',
    category: 'Basics',
    subcategory: 'Constants',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CONSTANTS is broadly compatible across classic and modern ABAP.',
    difficulty: 'Beginner',
    explanation: 'Use CONSTANTS for fixed values so repeated literals have one clear name and meaning.',
    code: `CONSTANTS gc_status_active TYPE c LENGTH 1 VALUE 'A'.
CONSTANTS gc_max_rows      TYPE i VALUE 100.
CONSTANTS gc_msgid         TYPE symsgid VALUE 'ZMSG'.

IF lv_status = gc_status_active.
  WRITE: / 'Active'.
ENDIF.`,
    notes: [
      'Constants make business meaning clearer than repeated magic values.',
      'Keep constants close to the program or class that owns the meaning.',
      'Use DDIC-compatible types for constants passed to SQL or SAP APIs.',
    ],
    commonMistakes: [
      'Hard-coding the same value in many places.',
      'Creating global constants for values only used in one small method.',
      'Using the wrong length/type for fixed values.',
    ],
    relatedTopics: ['DATA Declarations', 'Messages', 'OOP ABAP'],
  },
  {
    id: 'basics-field-symbols',
    title: 'FIELD-SYMBOLS Basics',
    category: 'Basics',
    subcategory: 'Field Symbols',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'FIELD-SYMBOLS is classic-compatible. Inline FIELD-SYMBOL declarations require newer syntax.',
    difficulty: 'Beginner',
    explanation: 'Field symbols act like references to existing data. When assigned to an internal table row, changes affect the row directly.',
    code: `FIELD-SYMBOLS <ls_customer> TYPE ty_customer.

LOOP AT gt_customers ASSIGNING <ls_customer>.
  <ls_customer>-bukrs = '1000'.
ENDLOOP.

"Modern inline field-symbol declaration.
LOOP AT gt_customers ASSIGNING FIELD-SYMBOL(<ls_customer_inline>).
  <ls_customer_inline>-bukrs = '2000'.
ENDLOOP.`,
    notes: [
      'ASSIGNING avoids copying rows into a work area.',
      'Use field symbols carefully because you change the original data.',
      'Prefer descriptive names such as <ls_customer> for row field symbols.',
    ],
    commonMistakes: [
      'Forgetting that changes to a field symbol update the assigned row.',
      'Using an unassigned field symbol.',
      'Making code harder to read by using generic names such as <fs> everywhere.',
    ],
    relatedTopics: ['LOOP AT ASSIGNING', 'Internal Tables', 'Performance'],
  },
  {
    id: 'basics-if-elseif',
    title: 'IF / ELSEIF Template',
    category: 'Basics',
    subcategory: 'Conditions',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'IF, ELSEIF, ELSE, ENDIF, EQ, NE, =, and <> are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use IF when conditions involve multiple fields, ranges, flags, or more complex boolean logic.',
    code: `DATA lv_status TYPE c LENGTH 1 VALUE 'A'.
DATA lv_valid  TYPE abap_bool VALUE abap_true.

IF lv_status = 'A' AND lv_valid = abap_true.
  WRITE: / 'Active'.
ELSEIF lv_status <> 'A'.
  WRITE: / 'Not active'.
ELSE.
  WRITE: / 'Unknown'.
ENDIF.

"Older comparison style still appears in legacy code.
IF lv_status EQ 'A' AND lv_valid EQ abap_true.
  WRITE: / 'Active'.
ENDIF.`,
    notes: [
      'Modern operators = and <> are often easier to scan.',
      'ABAP_BOOL normally uses ABAP_TRUE and ABAP_FALSE.',
      'Keep conditions readable; split complex checks into named helper variables when needed.',
    ],
    commonMistakes: [
      'Mixing comparison styles heavily in the same block.',
      'Checking a flag against text such as TRUE instead of ABAP_TRUE.',
      'Letting nested IF blocks become too deep.',
    ],
    relatedTopics: ['CASE', 'CHECK', 'Messages'],
  },
  {
    id: 'basics-case',
    title: 'CASE Template',
    category: 'Basics',
    subcategory: 'Conditions',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CASE is classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use CASE when branching depends on one main value, such as status, document type, or mode.',
    code: `CASE lv_status.
  WHEN 'A'.
    WRITE: / 'Approved'.
  WHEN 'B'.
    WRITE: / 'Blocked'.
  WHEN 'C' OR 'D'.
    WRITE: / 'Closed or deleted'.
  WHEN OTHERS.
    WRITE: / 'Other'.
ENDCASE.`,
    notes: [
      'CASE is clearer than many ELSEIF branches when one value drives the decision.',
      'Use WHEN OTHERS for a safe fallback when unexpected values are possible.',
      'Keep side effects small inside each branch.',
    ],
    commonMistakes: [
      'Using CASE for unrelated conditions that do not share one checked value.',
      'Forgetting a fallback when data can contain unexpected values.',
      'Duplicating large code blocks inside many WHEN branches.',
    ],
    relatedTopics: ['IF / ELSEIF', 'SWITCH', 'Messages'],
  },
  {
    id: 'basics-loop-control',
    title: 'CHECK / CONTINUE / EXIT / RETURN',
    category: 'Basics',
    subcategory: 'Control Flow',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CHECK, CONTINUE, EXIT, and RETURN are broadly available, but behavior depends on whether they are used in loops or processing blocks.',
    difficulty: 'Beginner',
    explanation: 'Use loop-control statements to keep loops readable, but be precise about whether you want to skip a row, leave a loop, or leave the current routine.',
    code: `LOOP AT lt_items INTO DATA(ls_item).
  CHECK ls_item-active = abap_true.

  IF ls_item-quantity IS INITIAL.
    CONTINUE.
  ENDIF.

  IF ls_item-quantity > 1000.
    EXIT.
  ENDIF.
ENDLOOP.

IF lv_has_error = abap_true.
  RETURN.
ENDIF.`,
    notes: [
      'CHECK inside a loop skips the current loop pass when the condition is false.',
      'CONTINUE jumps to the next loop pass.',
      'EXIT leaves the loop, while RETURN leaves the current procedure or event block.',
    ],
    commonMistakes: [
      'Using EXIT when CONTINUE was intended.',
      'Using CHECK outside a loop without realizing it may leave the processing block.',
      'Making flow hard to follow with too many early exits.',
    ],
    relatedTopics: ['LOOP AT', 'Performance', 'Common Mistakes'],
  },
  {
    id: 'basics-loop-into',
    title: 'LOOP AT INTO',
    category: 'Basics',
    subcategory: 'Loops',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'LOOP AT INTO is classic-compatible. Inline DATA in the loop requires ABAP 7.40+.',
    difficulty: 'Beginner',
    explanation: 'Use LOOP AT INTO when you want to process a copy of each row without changing the internal table row directly.',
    code: `"Classic work area loop.
DATA ls_item TYPE ty_item.

LOOP AT lt_items INTO ls_item.
  WRITE: / sy-tabix, ls_item-matnr.
ENDLOOP.

"Modern inline work area loop.
LOOP AT lt_items INTO DATA(ls_item_inline).
  WRITE: / sy-tabix, ls_item_inline-matnr.
ENDLOOP.`,
    notes: [
      'INTO copies the row into a work area.',
      'SY-TABIX contains the current loop index for index table loops.',
      'Use INTO for read-only or copy-based processing.',
    ],
    commonMistakes: [
      'Changing the work area and expecting the table to change automatically.',
      'Building business logic that depends too heavily on SY-TABIX.',
      'Looping over huge tables when SQL could filter earlier.',
    ],
    relatedTopics: ['LOOP AT ASSIGNING', 'MODIFY', 'Internal Tables'],
  },
  {
    id: 'basics-loop-assigning',
    title: 'LOOP AT ASSIGNING',
    category: 'Basics',
    subcategory: 'Loops',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'LOOP AT ASSIGNING is broadly compatible. Inline FIELD-SYMBOL declarations require modern syntax.',
    difficulty: 'Beginner',
    explanation: 'Use ASSIGNING when you want to update rows in place or avoid copying large rows.',
    code: `FIELD-SYMBOLS <ls_item> TYPE ty_item.

LOOP AT lt_items ASSIGNING <ls_item>
  WHERE status = 'OPEN'.
  <ls_item>-processed = abap_true.
ENDLOOP.

"Modern inline form.
LOOP AT lt_items ASSIGNING FIELD-SYMBOL(<ls_item_inline>).
  <ls_item_inline>-changed_by = sy-uname.
ENDLOOP.`,
    notes: [
      'ASSIGNING updates the actual row.',
      'It is useful for table updates because no separate MODIFY is required.',
      'Use a WHERE clause when filtering in memory is acceptable.',
    ],
    commonMistakes: [
      'Accidentally changing original data.',
      'Using ASSIGNING for simple read-only loops where INTO is clearer.',
      'Forgetting that LOOP AT ... WHERE filters after data is already in memory.',
    ],
    relatedTopics: ['FIELD-SYMBOLS', 'Performance', 'MODIFY'],
  },
  {
    id: 'basics-do-while',
    title: 'DO and WHILE Loops',
    category: 'Basics',
    subcategory: 'Loops',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'DO, WHILE, SY-INDEX, and ENDDO/ENDWHILE are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use DO for a known number of repetitions and WHILE for condition-based loops.',
    code: `DO 5 TIMES.
  WRITE: / sy-index.
ENDDO.

DATA lv_count TYPE i VALUE 1.

WHILE lv_count <= 5.
  WRITE: / lv_count.
  lv_count = lv_count + 1.
ENDWHILE.`,
    notes: [
      'SY-INDEX contains the current DO loop counter.',
      'WHILE needs a clear condition that will eventually become false.',
      'Prefer LOOP AT for internal tables.',
    ],
    commonMistakes: [
      'Creating an endless WHILE loop.',
      'Using DO/WHILE where LOOP AT would show the intent better.',
      'Changing loop counters in confusing places.',
    ],
    relatedTopics: ['LOOP AT', 'Control Flow', 'Performance'],
  },
  {
    id: 'itab-standard-sorted-hashed',
    title: 'STANDARD / SORTED / HASHED Tables',
    category: 'Internal Tables',
    subcategory: 'Table Types',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'All three table types are broadly compatible. WITH EMPTY KEY is newer than old implicit standard-key style.',
    difficulty: 'Beginner',
    explanation: 'Choose the internal table type based on how the table is filled and read.',
    code: `TYPES: BEGIN OF ty_item,
         matnr TYPE matnr,
         qty   TYPE i,
       END OF ty_item.

DATA lt_standard TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.
DATA lt_sorted   TYPE SORTED TABLE OF ty_item WITH NON-UNIQUE KEY matnr.
DATA lt_hashed   TYPE HASHED TABLE OF ty_item WITH UNIQUE KEY matnr.

APPEND VALUE #( matnr = 'MAT1' qty = 10 ) TO lt_standard.
INSERT VALUE #( matnr = 'MAT2' qty = 20 ) INTO TABLE lt_sorted.
INSERT VALUE #( matnr = 'MAT3' qty = 30 ) INTO TABLE lt_hashed.`,
    notes: [
      'STANDARD TABLE is good for append-and-loop patterns.',
      'SORTED TABLE is useful for ordered reads and range-style access.',
      'HASHED TABLE is best for repeated exact unique-key lookups.',
    ],
    commonMistakes: [
      'Using STANDARD TABLE for thousands of repeated key reads.',
      'Using APPEND with sorted/hashed tables instead of INSERT INTO TABLE.',
      'Choosing HASHED TABLE when duplicate keys are required.',
    ],
    relatedTopics: ['READ TABLE', 'Performance', 'Table Keys'],
  },
  {
    id: 'itab-read-table',
    title: 'READ TABLE Template',
    category: 'Internal Tables',
    subcategory: 'READ TABLE',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'READ TABLE and SY-SUBRC are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use READ TABLE to fetch one row from an internal table, then check SY-SUBRC immediately.',
    code: `DATA ls_item TYPE ty_item.

READ TABLE lt_items INTO ls_item WITH KEY matnr = lv_matnr.
IF sy-subrc = 0.
  WRITE: / ls_item-matnr, ls_item-qty.
ELSE.
  MESSAGE 'Material not found in internal table' TYPE 'I'.
ENDIF.

"For sorted/hashed tables with an explicit key.
READ TABLE lt_items_h INTO ls_item
  WITH TABLE KEY matnr = lv_matnr.`,
    notes: [
      'Check SY-SUBRC right after READ TABLE because later statements can overwrite it.',
      'WITH TABLE KEY is clearer for sorted/hashed tables.',
      'Use TRANSPORTING NO FIELDS when you only need to check existence.',
    ],
    commonMistakes: [
      'Checking SY-SUBRC too late.',
      'Reading a STANDARD TABLE repeatedly without sorting or hashing.',
      'Assuming READ TABLE raises an exception when no row is found.',
    ],
    relatedTopics: ['line_exists', 'HASHED TABLE', 'SY-SUBRC'],
  },
  {
    id: 'itab-modify-delete',
    title: 'MODIFY and DELETE Internal Table Rows',
    category: 'Internal Tables',
    subcategory: 'MODIFY / DELETE',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'MODIFY and DELETE internal table operations are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Use MODIFY when updating rows through a work area and DELETE when removing rows by condition.',
    code: `DATA ls_item TYPE ty_item.

READ TABLE lt_items INTO ls_item WITH KEY matnr = lv_matnr.
IF sy-subrc = 0.
  ls_item-qty = ls_item-qty + 1.
  MODIFY lt_items FROM ls_item TRANSPORTING qty
    WHERE matnr = ls_item-matnr.
ENDIF.

DELETE lt_items WHERE qty <= 0.`,
    notes: [
      'MODIFY is required after LOOP/READ INTO when you changed a work area copy.',
      'TRANSPORTING limits which fields are changed.',
      'DELETE ... WHERE is concise for condition-based cleanup.',
    ],
    commonMistakes: [
      'Changing a work area without MODIFY.',
      'MODIFYing more fields than intended.',
      'Deleting rows before checking whether the condition is too broad.',
    ],
    relatedTopics: ['LOOP AT INTO', 'LOOP AT ASSIGNING', 'READ TABLE'],
  },
  {
    id: 'itab-sort-delete-duplicates',
    title: 'SORT and DELETE ADJACENT DUPLICATES',
    category: 'Internal Tables',
    subcategory: 'Sorting and Duplicates',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'SORT and DELETE ADJACENT DUPLICATES are classic-compatible.',
    difficulty: 'Beginner',
    explanation: 'Sort by the comparison fields before deleting adjacent duplicates; only neighboring duplicates are removed.',
    code: `SORT lt_items BY matnr werks.

DELETE ADJACENT DUPLICATES FROM lt_items
  COMPARING matnr werks.

"Keep newest row per key example.
SORT lt_items BY matnr werks changed_at DESCENDING.
DELETE ADJACENT DUPLICATES FROM lt_items
  COMPARING matnr werks.`,
    notes: [
      'The SORT fields should match the COMPARING fields for predictable duplicate removal.',
      'Use DESCENDING before delete-duplicates when you want to keep the newest/highest row.',
      'This changes table order, so sort again later if display order matters.',
    ],
    commonMistakes: [
      'Deleting adjacent duplicates without sorting first.',
      'Sorting by different fields than COMPARING.',
      'Assuming all duplicates are removed when they are not adjacent.',
    ],
    relatedTopics: ['Internal Tables', 'Performance', 'SELECT DISTINCT'],
  },
  {
    id: 'itab-line-exists',
    title: 'line_exists and Table Expressions',
    category: 'Internal Tables',
    subcategory: 'Modern Table Access',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Table expressions and line_exists require modern ABAP; use READ TABLE on older releases.',
    difficulty: 'Intermediate',
    explanation: 'Use line_exists for a concise existence check and table expressions for direct row access when your release supports them.',
    code: `IF line_exists( lt_items[ matnr = lv_matnr ] ).
  DATA(ls_item) = lt_items[ matnr = lv_matnr ].
ENDIF.

"Avoid an exception when the row may not exist.
DATA(ls_optional) = VALUE ty_item(
  lt_items[ matnr = lv_matnr ] OPTIONAL ).`,
    notes: [
      'line_exists does not set SY-SUBRC.',
      'A table expression without OPTIONAL can raise an exception if no row exists.',
      'Use READ TABLE when supporting older ABAP releases.',
    ],
    commonMistakes: [
      'Expecting SY-SUBRC to change after line_exists.',
      'Using table expressions without handling missing rows.',
      'Using modern syntax on older ECC systems.',
    ],
    relatedTopics: ['READ TABLE', 'Modern ABAP', 'Exception Handling'],
  },
  {
    id: 'itab-filter',
    title: 'FILTER Internal Table',
    category: 'Internal Tables',
    subcategory: 'Modern Table Operations',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'FILTER expressions require modern ABAP and may require suitable table keys depending on the exact use.',
    difficulty: 'Intermediate',
    explanation: 'Use FILTER to create a new internal table from rows that match a condition.',
    code: `DATA(lt_positive) = FILTER #( lt_items WHERE qty > 0 ).

DATA(lt_open_items) = FILTER #( lt_items
  WHERE status = 'OPEN' ).`,
    notes: [
      'FILTER returns a new table; it does not change the original table.',
      'For simple readable filtering, LOOP AT ... WHERE is still fine.',
      'Check release support before using FILTER in older landscapes.',
    ],
    commonMistakes: [
      'Expecting FILTER to update the original table.',
      'Using FILTER when a database WHERE clause would avoid loading unnecessary rows.',
      'Forgetting release compatibility.',
    ],
    relatedTopics: ['Modern ABAP', 'LOOP AT WHERE', 'Performance'],
  },
  {
    id: 'open-sql-select-single',
    title: 'SELECT SINGLE by Key',
    category: 'Open SQL',
    subcategory: 'SELECT SINGLE',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'SELECT SINGLE is classic-compatible. @ host variables are modern Open SQL syntax.',
    difficulty: 'Beginner',
    explanation: 'Use SELECT SINGLE when you expect one row, ideally by full or highly selective key.',
    code: `SELECT SINGLE bukrs butxt
  FROM t001
  INTO @DATA(ls_company)
  WHERE bukrs = @p_bukrs.

IF sy-subrc <> 0.
  MESSAGE 'Company code not found' TYPE 'E'.
ENDIF.`,
    notes: [
      'Select only the fields you need.',
      'Use a selective WHERE condition.',
      'Check SY-SUBRC immediately after SELECT SINGLE.',
    ],
    commonMistakes: [
      'Using SELECT SINGLE without a meaningful WHERE condition.',
      'Assuming SELECT SINGLE returns a deterministic row without proper key/order logic.',
      'Forgetting @ before host variables in modern Open SQL.',
    ],
    relatedTopics: ['SY-SUBRC', 'DDIC', 'Open SQL'],
  },
  {
    id: 'open-sql-select-into-table',
    title: 'SELECT INTO TABLE',
    category: 'Open SQL',
    subcategory: 'SELECT INTO TABLE',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'SELECT INTO TABLE is classic-compatible. ORDER BY and UP TO are broadly used; @ host variables are modern syntax.',
    difficulty: 'Beginner',
    explanation: 'Use SELECT INTO TABLE to read multiple database rows into an internal table.',
    code: `SELECT vbeln erdat auart kunnr
  FROM vbak
  INTO TABLE @DATA(lt_orders)
  WHERE erdat IN @s_erdat
    AND auart NOT LIKE 'Z%'
  ORDER BY erdat DESCENDING
  UP TO 100 ROWS.`,
    notes: [
      'Use WHERE to restrict data at the database.',
      'Use UP TO carefully for preview/search scenarios, not as a substitute for correct filtering.',
      'ORDER BY matters when users expect a stable order.',
    ],
    commonMistakes: [
      'Using SELECT * for reports that need only a few fields.',
      'Loading too many rows and filtering later in ABAP.',
      'Forgetting that SQL LIKE uses % as the wildcard.',
    ],
    relatedTopics: ['SELECT-OPTIONS', 'Performance', 'Internal Tables'],
  },
  {
    id: 'open-sql-select-ranges',
    title: 'SELECT with Ranges or SELECT-OPTIONS',
    category: 'Open SQL',
    subcategory: 'Ranges',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'IN with ranges/select-options is common. @ host variables are modern Open SQL syntax.',
    difficulty: 'Beginner',
    explanation: 'Use IN with SELECT-OPTIONS or range tables to pass flexible user selection criteria to Open SQL.',
    code: `SELECT matnr mtart
  FROM mara
  INTO TABLE @DATA(lt_materials)
  WHERE matnr IN @s_matnr
    AND mtart NOT IN @s_mtart_excl.`,
    notes: [
      'SELECT-OPTIONS produces a range table with SIGN, OPTION, LOW, and HIGH.',
      'Keep range conditions selective when possible.',
      'Validate user input before running expensive selects.',
    ],
    commonMistakes: [
      'Passing an unexpectedly broad range to a large table.',
      'Confusing SQL LIKE wildcard % with ABAP CP wildcard *.',
      'Forgetting @ in modern Open SQL.',
    ],
    relatedTopics: ['Selection Screens', 'Ranges', 'Performance'],
  },
  {
    id: 'open-sql-select-distinct',
    title: 'SELECT DISTINCT',
    category: 'Open SQL',
    subcategory: 'DISTINCT',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'SELECT DISTINCT is broadly supported in Open SQL, but exact SQL feature availability can vary by release.',
    difficulty: 'Beginner',
    explanation: 'Use DISTINCT when you intentionally need unique combinations of selected fields from the database.',
    code: `SELECT DISTINCT kunnr
  FROM vbak
  INTO TABLE @DATA(lt_customers)
  WHERE erdat IN @s_erdat.`,
    notes: [
      'DISTINCT applies to the selected field combination, not one field independently.',
      'Use DISTINCT for real uniqueness requirements, not to hide bad joins.',
      'Consider whether a proper key table or aggregation would express intent better.',
    ],
    commonMistakes: [
      'Using DISTINCT to cover up duplicate rows from a wrong join.',
      'Selecting extra fields and wondering why rows are still duplicated.',
      'Using DISTINCT when DELETE ADJACENT DUPLICATES after sorting would be clearer for in-memory data.',
    ],
    relatedTopics: ['Joins', 'SORT', 'Performance'],
  },
  {
    id: 'open-sql-for-all-entries',
    title: 'FOR ALL ENTRIES',
    category: 'Open SQL',
    subcategory: 'FOR ALL ENTRIES',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'FOR ALL ENTRIES is classic-compatible. In newer code, also consider JOINs or IN @itab where supported and appropriate.',
    difficulty: 'Intermediate',
    explanation: 'Use FOR ALL ENTRIES to read related database rows for keys collected in an internal table, but always guard against an empty driver table.',
    code: `IF lt_customers IS NOT INITIAL.
  SELECT kunnr name1
    FROM kna1
    INTO TABLE @DATA(lt_names)
    FOR ALL ENTRIES IN @lt_customers
    WHERE kunnr = @lt_customers-kunnr.
ENDIF.`,
    notes: [
      'Always check the driver table is not initial.',
      'Remove duplicate keys from the driver table when possible.',
      'JOINs may be clearer when the relationship is direct and the database can handle it well.',
    ],
    commonMistakes: [
      'Running FOR ALL ENTRIES with an empty driver table.',
      'Keeping duplicate keys in the driver table.',
      'Using FOR ALL ENTRIES where a simple JOIN would be clearer.',
    ],
    relatedTopics: ['Joins', 'Performance', 'Internal Tables'],
  },
  {
    id: 'joins-inner',
    title: 'INNER JOIN',
    category: 'Joins',
    subcategory: 'INNER JOIN',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'INNER JOIN is a common Open SQL pattern. @ host variables require modern Open SQL.',
    difficulty: 'Intermediate',
    explanation: 'Use INNER JOIN when rows must exist in both joined tables.',
    code: `SELECT a~vbeln, a~erdat, b~posnr, b~matnr
  FROM vbak AS a
  INNER JOIN vbap AS b
    ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_order_items)
  WHERE a~erdat IN @s_erdat.`,
    notes: [
      'Use table aliases to keep fields readable.',
      'Confirm key fields in SE11 before coding joins.',
      'INNER JOIN removes left-side rows that do not have a matching right-side row.',
    ],
    commonMistakes: [
      'Joining on incomplete keys.',
      'Using DISTINCT to hide duplicate rows from a wrong join condition.',
      'Selecting too many fields from both tables.',
    ],
    relatedTopics: ['LEFT OUTER JOIN', 'Open SQL', 'DDIC'],
  },
  {
    id: 'joins-left-outer',
    title: 'LEFT OUTER JOIN',
    category: 'Joins',
    subcategory: 'LEFT OUTER JOIN',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'LEFT OUTER JOIN is a common Open SQL pattern. Be careful with release-specific SQL restrictions in older systems.',
    difficulty: 'Intermediate',
    explanation: 'Use LEFT OUTER JOIN when you must keep all left-side rows even when optional right-side data is missing.',
    code: `SELECT a~vbeln, a~erdat, b~posnr, b~matnr
  FROM vbak AS a
  LEFT OUTER JOIN vbap AS b
    ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_orders_with_optional_items)
  WHERE a~erdat IN @s_erdat.`,
    notes: [
      'Fields from the right table may be initial when no matching row exists.',
      'Put right-table conditions carefully; a WHERE condition on the right table can change the effective result.',
      'Use LEFT OUTER JOIN for optional text/detail data.',
    ],
    commonMistakes: [
      'Adding right-table WHERE filters that remove unmatched rows.',
      'Using LEFT OUTER JOIN when business logic requires complete matches.',
      'Not handling initial right-side fields.',
    ],
    relatedTopics: ['INNER JOIN', 'Open SQL', 'Performance'],
  },
  {
    id: 'joins-right-outer-portability',
    title: 'RIGHT OUTER JOIN Portability Note',
    category: 'Joins',
    subcategory: 'RIGHT OUTER JOIN',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'RIGHT OUTER JOIN support depends on release/syntax level. Swapping table order and using LEFT OUTER JOIN is often more portable.',
    difficulty: 'Intermediate',
    explanation: 'Prefer LEFT OUTER JOIN by swapping table order when you need broadly portable ABAP SQL.',
    code: `"Instead of relying on RIGHT OUTER JOIN, swap the table order.
SELECT a~vbeln, b~posnr
  FROM vbak AS a
  LEFT OUTER JOIN vbap AS b
    ON b~vbeln = a~vbeln
  INTO TABLE @DATA(lt_result).`,
    notes: [
      'RIGHT OUTER JOIN may not be available in every target release.',
      'LEFT OUTER JOIN is easier for many ABAP teams to read.',
      'Document the business meaning of the preserved table.',
    ],
    commonMistakes: [
      'Assuming RIGHT OUTER JOIN works on all ECC systems.',
      'Changing table order without checking field references.',
      'Forgetting that preserved-side semantics matter.',
    ],
    relatedTopics: ['LEFT OUTER JOIN', 'Compatibility', 'Open SQL'],
  },
  {
    id: 'mod-form-using-changing',
    title: 'FORM / PERFORM USING CHANGING',
    category: 'Modularization',
    subcategory: 'FORM / PERFORM',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'FORM/PERFORM is legacy-compatible but methods/classes are preferred for new code.',
    difficulty: 'Beginner',
    explanation: 'Use FORM/PERFORM mainly when maintaining classic procedural reports.',
    code: `PERFORM calculate_total USING lv_net lv_tax CHANGING lv_total.

FORM calculate_total
  USING    iv_net   TYPE p
           iv_tax   TYPE p
  CHANGING cv_total TYPE p.
  cv_total = iv_net + iv_tax.
ENDFORM.`,
    notes: [
      'USING is input, CHANGING is input/output.',
      'The PERFORM parameter order must match the FORM definition.',
      'Prefer methods for new application logic.',
    ],
    commonMistakes: [
      'Mismatching parameter count, order, or type.',
      'Defining FORM inside another FORM.',
      'Using global variables instead of clear parameters.',
    ],
    relatedTopics: ['Methods', 'Common Mistakes', 'Legacy ABAP'],
  },
  {
    id: 'mod-form-internal-table',
    title: 'FORM with Internal Table Parameter',
    category: 'Modularization',
    subcategory: 'FORM / PERFORM',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Typed USING parameters are preferable to old TABLES parameters.',
    difficulty: 'Beginner',
    explanation: 'Pass internal tables to FORMs with typed USING or CHANGING parameters instead of old TABLES style.',
    code: `TYPES ty_item_tab TYPE STANDARD TABLE OF ty_item WITH EMPTY KEY.

PERFORM display_items USING lt_items.

FORM display_items USING it_items TYPE ty_item_tab.
  LOOP AT it_items INTO DATA(ls_item).
    WRITE: / ls_item-matnr.
  ENDLOOP.
ENDFORM.`,
    notes: [
      'Define a table type when passing internal tables around.',
      'Use CHANGING if the FORM should modify the table.',
      'Avoid obsolete header-line assumptions.',
    ],
    commonMistakes: [
      'Using TABLES parameters in new code.',
      'Passing generic STANDARD TABLE without a useful row type.',
      'Changing a table that should have been read-only.',
    ],
    relatedTopics: ['Internal Tables', 'FORM / PERFORM', 'Methods'],
  },
  {
    id: 'mod-method-call',
    title: 'Method Call Template',
    category: 'Modularization',
    subcategory: 'Methods',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Method calls are broadly available. Inline object creation requires modern ABAP.',
    difficulty: 'Beginner',
    explanation: 'Use methods for clear signatures, encapsulation, and easier refactoring compared with large procedural blocks.',
    code: `lv_total = lo_calculator->calculate_total(
  iv_net = lv_net
  iv_tax = lv_tax ).

lcl_logger=>write_message(
  iv_text = 'Calculation completed' ).`,
    notes: [
      'Use instance methods when behavior depends on object state.',
      'Use static methods for stateless utility behavior.',
      'Named parameters make calls easier to read.',
    ],
    commonMistakes: [
      'Using static methods for everything.',
      'Passing too many loosely related parameters.',
      'Ignoring method return values.',
    ],
    relatedTopics: ['OOP ABAP', 'FORM / PERFORM', 'Classes'],
  },
  {
    id: 'fm-local-call',
    title: 'Local Function Module Call',
    category: 'Function Modules / RFC',
    subcategory: 'CALL FUNCTION',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CALL FUNCTION is classic-compatible. TABLES parameters are common in older function modules.',
    difficulty: 'Beginner',
    explanation: 'Use CALL FUNCTION to call classic function modules and handle declared exceptions with SY-SUBRC.',
    code: `CALL FUNCTION 'Z_LOCAL_FM'
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
ENDIF.`,
    notes: [
      'Check the function module interface in SE37.',
      'Handle documented exceptions.',
      'Prefer modern class methods for new internal APIs when possible.',
    ],
    commonMistakes: [
      'Ignoring SY-SUBRC after exceptions.',
      'Passing the wrong table type to TABLES parameters.',
      'Using function modules for new logic that would fit a class method better.',
    ],
    relatedTopics: ['RFC', 'SE37', 'SY-SUBRC'],
  },
  {
    id: 'rfc-call-destination',
    title: 'CALL FUNCTION DESTINATION',
    category: 'Function Modules / RFC',
    subcategory: 'RFC',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'RFC calls are classic-compatible, but destinations, authorizations, and available function modules depend on the landscape.',
    difficulty: 'Intermediate',
    explanation: 'Use DESTINATION to call a remote-enabled function module through an RFC destination.',
    code: `CALL FUNCTION 'Z_REMOTE_FM'
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
    OTHERS                = 3.`,
    notes: [
      'Handle COMMUNICATION_FAILURE and SYSTEM_FAILURE for RFC calls.',
      'Use SM59 to maintain and test RFC destinations.',
      'Set external breakpoints in the called system/user context when debugging.',
    ],
    commonMistakes: [
      'Only handling OTHERS and losing the real RFC failure reason.',
      'Debugging the caller system when the error happens in the called system.',
      'Assuming every function module is remote-enabled.',
    ],
    relatedTopics: ['SM59', 'Function Modules', 'Debugging Workflow'],
  },
  {
    id: 'rfc-destination-none',
    title: "DESTINATION 'NONE'",
    category: 'Function Modules / RFC',
    subcategory: 'RFC',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: "DESTINATION 'NONE' is used with remote-enabled function modules for RFC-style local execution.",
    difficulty: 'Intermediate',
    explanation: "Use DESTINATION 'NONE' when you intentionally want remote-style execution in the same system for a remote-enabled function module.",
    code: `CALL FUNCTION 'Z_REMOTE_FM'
  DESTINATION 'NONE'
  EXPORTING
    iv_input = lv_input
  EXCEPTIONS
    communication_failure = 1 MESSAGE lv_message
    system_failure        = 2 MESSAGE lv_message
    OTHERS                = 3.`,
    notes: [
      "DESTINATION 'NONE' differs from omitting DESTINATION.",
      'It is still an RFC-style call path.',
      'Use it only when that execution behavior is intended.',
    ],
    commonMistakes: [
      "Assuming DESTINATION 'NONE' is exactly the same as a normal local call.",
      'Using it for function modules that are not remote-enabled.',
      'Forgetting RFC-style exception handling.',
    ],
    relatedTopics: ['RFC', 'Function Modules', 'Compatibility'],
  },
  {
    id: 'rfc-close-connection',
    title: 'Close RFC Connection',
    category: 'Function Modules / RFC',
    subcategory: 'RFC',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'RFC_CONNECTION_CLOSE is commonly used in classic RFC scenarios; usage depends on connection lifecycle needs.',
    difficulty: 'Intermediate',
    explanation: 'Close an RFC connection when your scenario requires releasing a specific destination connection.',
    code: `CALL FUNCTION 'RFC_CONNECTION_CLOSE'
  EXPORTING
    destination = lv_rfc.`,
    notes: [
      'Do not close shared connections blindly in generic helper code.',
      'Use clear destination variables.',
      'Check whether your framework manages the connection lifecycle.',
    ],
    commonMistakes: [
      'Closing a connection that later code still expects to reuse.',
      'Ignoring errors from earlier RFC calls.',
      'Using hard-coded RFC destination names everywhere.',
    ],
    relatedTopics: ['RFC', 'SM59', 'Performance'],
  },
  {
    id: 'ddic-field-types',
    title: 'Use DDIC Field Types',
    category: 'SAP Dictionary / DDIC',
    subcategory: 'SE11 Objects',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'DDIC field typing is a core ABAP practice across classic and modern systems.',
    difficulty: 'Beginner',
    explanation: 'Use DDIC field types so your variables match SAP table definitions, conversion exits, and field lengths.',
    code: `DATA lv_bukrs TYPE t001-bukrs.
DATA lv_vbeln TYPE vbak-vbeln.
DATA lv_matnr TYPE mara-matnr.

DATA ls_order  TYPE vbak.
DATA lt_orders TYPE STANDARD TABLE OF vbak WITH EMPTY KEY.`,
    notes: [
      'Use SE11 to inspect key fields, labels, and data elements.',
      'Data elements provide semantic meaning and documentation.',
      'Domains provide technical type, fixed values, and possible conversion exits.',
    ],
    commonMistakes: [
      'Guessing field lengths manually.',
      'Using generic CHAR fields for material/document/customer numbers.',
      'Forgetting conversion exits such as ALPHA for some business keys.',
    ],
    relatedTopics: ['Open SQL', 'Conversion Exits', 'SE11'],
  },
  {
    id: 'ddic-se11-checklist',
    title: 'SE11 Field Check Template',
    category: 'SAP Dictionary / DDIC',
    subcategory: 'SE11 Objects',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'SE11 object availability and table design differ by system and product version.',
    difficulty: 'Beginner',
    explanation: 'Use this checklist before coding against unfamiliar SAP tables or fields.',
    code: `"Useful SE11 checks:
"1. Display table fields and key fields.
"2. Open the data element to see labels and documentation.
"3. Open the domain to see fixed values and conversion exits.
"4. Check search helps attached to fields or data elements.
"5. Confirm whether the object exists in your ECC/S/4HANA release.`,
    notes: [
      'Transparent tables map to database tables.',
      'Pool and cluster tables are legacy storage concepts.',
      'Search helps improve selection-screen and dynpro input help.',
    ],
    commonMistakes: [
      'Guessing field names instead of checking SE11.',
      'Treating old pooled/cluster table assumptions as S/4HANA-ready design.',
      'Using a table from another module without confirming meaning and keys.',
    ],
    relatedTopics: ['DDIC Types', 'Open SQL', 'S/4HANA'],
  },
  {
    id: 'transport-e070-request-header',
    title: 'Transport Request Header: E070',
    category: 'Transport Tables',
    subcategory: 'E070',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'E070 is a common transport organizer table; interpret status according to your landscape process.',
    difficulty: 'Intermediate',
    explanation: 'Use E070 to inspect transport request/task header information such as request number, parent request, status, and owner.',
    code: `SELECT SINGLE trkorr strkorr trstatus as4user
  FROM e070
  INTO @DATA(ls_request)
  WHERE trkorr = @p_trkorr.

"Tasks under a request: E070-STRKORR points to the parent request.
SELECT trkorr trstatus as4user
  FROM e070
  INTO TABLE @DATA(lt_tasks)
  WHERE strkorr = @p_trkorr.`,
    notes: [
      'E070-TRKORR is the request/task number.',
      'E070-STRKORR contains the parent request for a task.',
      'E070-TRSTATUS contains the transport status.',
    ],
    commonMistakes: [
      'Confusing request numbers and task numbers.',
      'Checking the wrong client or system.',
      'Assuming status interpretation without knowing your release process.',
    ],
    relatedTopics: ['E071', 'E071K', 'SE09 / SE10'],
  },
  {
    id: 'transport-e071-objects',
    title: 'Transport Objects: E071',
    category: 'Transport Tables',
    subcategory: 'E071',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'E071 is commonly used for objects assigned to transport requests/tasks.',
    difficulty: 'Intermediate',
    explanation: 'Use E071 to inspect transported objects and object names under a request or task.',
    code: `SELECT trkorr pgmid object obj_name
  FROM e071
  INTO TABLE @DATA(lt_objects)
  WHERE trkorr = @p_trkorr.`,
    notes: [
      'Objects may sit under tasks before task release.',
      'Object type PROG is commonly used for ABAP programs.',
      'Use SE09/SE10 for normal transport analysis when possible.',
    ],
    commonMistakes: [
      'Looking only at the parent request and missing task-level objects.',
      'Using wrong object type names.',
      'Treating E071 as the only source of transport truth without context.',
    ],
    relatedTopics: ['E070', 'Transport Organizer', 'DDIC'],
  },
  {
    id: 'transport-e071k-table-keys',
    title: 'Transport Table Keys: E071K',
    category: 'Transport Tables',
    subcategory: 'E071K',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'E071K is commonly used for table key entries, especially TABU-style transports.',
    difficulty: 'Intermediate',
    explanation: 'Use E071K to inspect table-key details for transported table entries.',
    code: `SELECT trkorr pgmid object objname tabkey
  FROM e071k
  INTO TABLE @DATA(lt_tabu_keys)
  WHERE trkorr = @p_trkorr.`,
    notes: [
      'TABKEY content must be interpreted according to table key structure.',
      'Use with E071 to understand the transported object context.',
      'Be careful when analyzing customizing transports across clients.',
    ],
    commonMistakes: [
      'Reading TABKEY as plain business text without decoding key structure.',
      'Ignoring client-dependent keys.',
      'Missing related E071 object entries.',
    ],
    relatedTopics: ['E071', 'Customizing', 'SE10'],
  },
  {
    id: 'alv-classic-reuse',
    title: 'Classic ALV: REUSE_ALV_GRID_DISPLAY',
    category: 'ALV',
    subcategory: 'Classic ALV',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'REUSE_ALV_GRID_DISPLAY is common in classic reports. Prefer SALV or newer UI approaches where appropriate.',
    difficulty: 'Intermediate',
    explanation: 'Use classic ALV when maintaining older reports that already use SLIS field catalogs and layouts.',
    code: `DATA lt_fieldcat TYPE slis_t_fieldcat_alv.
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
    t_outtab    = lt_output.`,
    notes: [
      'Field catalog field names must match output table fields.',
      'Classic ALV is still common in older ECC reports.',
      'Handle empty output before calling ALV.',
    ],
    commonMistakes: [
      'Using wrong field names in the field catalog.',
      'Leaving field catalog labels blank.',
      'Using classic ALV for new editable-grid requirements without checking better options.',
    ],
    relatedTopics: ['SALV', 'Reporting', 'Field Catalog'],
  },
  {
    id: 'alv-salv-basic',
    title: 'CL_SALV_TABLE Basic Display',
    category: 'ALV',
    subcategory: 'SALV',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CL_SALV_TABLE is a common read-only ALV approach. Availability depends on your SAP release and GUI context.',
    difficulty: 'Intermediate',
    explanation: 'Use CL_SALV_TABLE for a quick read-only ALV display of an internal table.',
    code: `DATA lo_alv TYPE REF TO cl_salv_table.

cl_salv_table=>factory(
  IMPORTING
    r_salv_table = lo_alv
  CHANGING
    t_table      = lt_output ).

lo_alv->display( ).`,
    notes: [
      'SALV is read-only in the common simple pattern.',
      'Create and configure the ALV before DISPLAY.',
      'Check whether lt_output is initial before opening the ALV.',
    ],
    commonMistakes: [
      'Using SALV when editable cells are required.',
      'Calling DISPLAY before configuration.',
      'Not handling no-data-found cases.',
    ],
    relatedTopics: ['ALV Functions', 'Column Settings', 'Open SQL'],
  },
  {
    id: 'alv-salv-functions-columns',
    title: 'SALV Functions and Column Text',
    category: 'ALV',
    subcategory: 'SALV',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'SALV column APIs are common, but exact behavior can vary by SAP GUI/release.',
    difficulty: 'Intermediate',
    explanation: 'Enable standard ALV functions, optimize widths, and set readable column text before displaying SALV.',
    code: `lo_alv->get_functions( )->set_all( abap_true ).
lo_alv->get_columns( )->set_optimize( abap_true ).

lo_alv->get_columns( )->get_column( 'VBELN' )->set_medium_text( 'Sales Doc' ).
lo_alv->get_columns( )->get_column( 'KUNNR' )->set_medium_text( 'Customer' ).

lo_alv->display( ).`,
    notes: [
      'Set functions and columns before DISPLAY.',
      'Use actual output table field names.',
      'Column text improves usability for custom structures.',
    ],
    commonMistakes: [
      'Misspelling field names when getting a column.',
      'Displaying first and configuring later.',
      'Assuming generated labels are always user-friendly.',
    ],
    relatedTopics: ['CL_SALV_TABLE', 'Reporting', 'DDIC Labels'],
  },
  {
    id: 'modern-inline-string',
    title: 'Inline DATA and String Templates',
    category: 'Modern ABAP',
    subcategory: 'Expressions',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Inline DATA and string templates require modern ABAP; exact formatting options depend on release.',
    difficulty: 'Beginner',
    explanation: 'Use inline declarations and string templates to reduce boilerplate when they improve readability.',
    code: `DATA(lv_text) = |Material { lv_matnr ALPHA = OUT }|.
DATA(lv_internal_matnr) = |{ lv_matnr ALPHA = IN }|.

DATA(lv_message) = |User { sy-uname } changed { lv_matnr }.|.`,
    notes: [
      'ALPHA = IN/OUT is useful for business keys with conversion exits.',
      'String templates are easier to read than repeated CONCATENATE for simple text.',
      'Use explicit DATA when the type is important to understand later.',
    ],
    commonMistakes: [
      'Using inline DATA where the inferred type is unclear.',
      'Assuming ALPHA formatting exists for every field.',
      'Using modern syntax on unsupported systems.',
    ],
    relatedTopics: ['Conversion Exits', 'DATA Declarations', 'S/4HANA'],
  },
  {
    id: 'modern-value-corresponding',
    title: 'VALUE and CORRESPONDING',
    category: 'Modern ABAP',
    subcategory: 'Expressions',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'VALUE and CORRESPONDING expression details vary by release; check target system support.',
    difficulty: 'Intermediate',
    explanation: 'Use VALUE to construct structures/tables and CORRESPONDING to map fields with matching names.',
    code: `DATA(lt_numbers) = VALUE int4_table( ( 1 ) ( 2 ) ( 3 ) ).

DATA(ls_target) = CORRESPONDING ty_target( ls_source ).

lt_items = VALUE #( BASE lt_items
  ( matnr = 'MAT1' quantity = 1 )
  ( matnr = 'MAT2' quantity = 2 ) ).`,
    notes: [
      'BASE preserves existing values or rows.',
      'CORRESPONDING maps same-named compatible components.',
      'Keep expressions readable; break them over multiple lines.',
    ],
    commonMistakes: [
      'Assuming CORRESPONDING maps fields with different names automatically.',
      'Forgetting BASE and accidentally replacing instead of extending.',
      'Creating dense expressions that are hard to debug.',
    ],
    relatedTopics: ['Internal Tables', 'Modern ABAP', 'Mapping'],
  },
  {
    id: 'modern-cond-switch',
    title: 'COND and SWITCH',
    category: 'Modern ABAP',
    subcategory: 'Expressions',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'COND and SWITCH require modern ABAP. Exact availability depends on target release.',
    difficulty: 'Intermediate',
    explanation: 'Use COND for expression-based conditional values and SWITCH for expression-based single-value branching.',
    code: `DATA(lv_result) = COND string(
  WHEN lv_count = 0 THEN 'Empty'
  ELSE 'Filled' ).

DATA(lv_type_text) = SWITCH string( lv_type
  WHEN 'A' THEN 'Active'
  WHEN 'B' THEN 'Blocked'
  ELSE 'Other' ).`,
    notes: [
      'COND is expression-oriented IF logic.',
      'SWITCH is expression-oriented CASE logic.',
      'Use them for values, not for large procedural branches.',
    ],
    commonMistakes: [
      'Making expressions too dense to read.',
      'Using SWITCH when conditions are unrelated to one value.',
      'Forgetting older systems may not support the syntax.',
    ],
    relatedTopics: ['IF / ELSEIF', 'CASE', 'Modern ABAP'],
  },
  {
    id: 'modern-reduce',
    title: 'REDUCE Expression',
    category: 'Modern ABAP',
    subcategory: 'Expressions',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'REDUCE requires modern ABAP and can be harder to debug than an explicit loop.',
    difficulty: 'Advanced',
    explanation: 'Use REDUCE to calculate one result from a set of rows when the expression remains readable.',
    code: `DATA(lv_total) = REDUCE i(
  INIT sum = 0
  FOR ls_item IN lt_items
  NEXT sum = sum + ls_item-quantity ).`,
    notes: [
      'REDUCE is good for compact totals and accumulations.',
      'Prefer a normal LOOP when the logic needs debugging or multiple side effects.',
      'Name accumulator variables clearly.',
    ],
    commonMistakes: [
      'Using REDUCE for complicated procedural logic.',
      'Hurting readability just to avoid a LOOP.',
      'Using unsupported expression syntax in older landscapes.',
    ],
    relatedTopics: ['Modern ABAP', 'Loops', 'Performance'],
  },
  {
    id: 'modern-group-by-loop',
    title: 'LOOP AT GROUP BY',
    category: 'Modern ABAP',
    subcategory: 'Grouped Loops',
    compatibility: ['Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'LOOP AT ... GROUP BY is modern ABAP; exact syntax support depends on release.',
    difficulty: 'Advanced',
    explanation: 'Use GROUP BY loops to process internal table rows grouped by a key without manually collecting groups.',
    code: `LOOP AT lt_items ASSIGNING FIELD-SYMBOL(<ls_item>)
  GROUP BY <ls_item>-matnr.
  "Group processing here.
ENDLOOP.`,
    notes: [
      'GROUP BY can simplify grouping logic in internal table processing.',
      'Use explicit loops when team familiarity or release support is a concern.',
      'Keep grouped processing small and clear.',
    ],
    commonMistakes: [
      'Using GROUP BY syntax on unsupported releases.',
      'Putting too much unrelated logic inside grouped loops.',
      'Assuming database grouping and internal table grouping are the same thing.',
    ],
    relatedTopics: ['Internal Tables', 'Modern ABAP', 'Loops'],
  },
  {
    id: 'oop-interface',
    title: 'Local Interface Template',
    category: 'OOP ABAP',
    subcategory: 'Interfaces',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Local interfaces and interface implementation are broadly available in ABAP Objects.',
    difficulty: 'Intermediate',
    explanation: 'Use interfaces to define behavior contracts that classes can implement.',
    code: `INTERFACE lif_formatter.
  METHODS format
    IMPORTING iv_value TYPE string
    RETURNING VALUE(rv_text) TYPE string.
ENDINTERFACE.`,
    notes: [
      'Interfaces describe behavior without tying callers to one implementation.',
      'Use interface names that describe capability.',
      'Keep interface methods focused.',
    ],
    commonMistakes: [
      'Creating interfaces with too many unrelated methods.',
      'Using vague names such as lif_util.',
      'Changing interface signatures without checking all implementers.',
    ],
    relatedTopics: ['Classes', 'Methods', 'Testing'],
  },
  {
    id: 'oop-local-class',
    title: 'Local Class Template',
    category: 'OOP ABAP',
    subcategory: 'Classes and Methods',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CLASS/METHOD syntax is broadly available. Inline object creation with NEW requires modern ABAP.',
    difficulty: 'Intermediate',
    explanation: 'Use local classes inside reports to organize responsibilities and reduce global procedural code.',
    code: `CLASS lcl_report DEFINITION.
  PUBLIC SECTION.
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
      'Keep attributes private unless there is a strong reason.',
      'Use constructor parameters for required object state.',
      'Move database reads and display logic into separate methods when possible.',
    ],
    commonMistakes: [
      'Making everything PUBLIC.',
      'Using global data instead of attributes or parameters.',
      'Creating one huge RUN method.',
    ],
    relatedTopics: ['Interfaces', 'Constructor', 'Modularization'],
  },
  {
    id: 'oop-static-method',
    title: 'Static Method Template',
    category: 'OOP ABAP',
    subcategory: 'Static Methods',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'CLASS-METHODS is broadly available in ABAP Objects.',
    difficulty: 'Beginner',
    explanation: 'Use static methods for stateless helper logic where no object state is required.',
    code: `CLASS lcl_version DEFINITION.
  PUBLIC SECTION.
    CLASS-METHODS get_version
      RETURNING VALUE(rv_version) TYPE string.
ENDCLASS.

CLASS lcl_version IMPLEMENTATION.
  METHOD get_version.
    rv_version = '1.0'.
  ENDMETHOD.
ENDCLASS.

DATA(lv_version) = lcl_version=>get_version( ).`,
    notes: [
      'Static methods are useful for small stateless utilities.',
      'Use instance methods when behavior depends on object state.',
      'Do not turn one utility class into a dumping ground.',
    ],
    commonMistakes: [
      'Making everything static to avoid object creation.',
      'Storing mutable global state in static attributes unnecessarily.',
      'Mixing unrelated helper methods in one class.',
    ],
    relatedTopics: ['OOP ABAP', 'Methods', 'Clean Code'],
  },
  {
    id: 'performance-avoid-select-loop',
    title: 'Avoid SELECT inside LOOP',
    category: 'Performance',
    subcategory: 'Database Access',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'The principle applies broadly. Exact replacement pattern depends on release and data model.',
    difficulty: 'Beginner',
    explanation: 'Avoid repeatedly hitting the database inside a loop. Collect keys and read related data in one database operation when possible.',
    code: `"Bad:
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
ENDIF.`,
    notes: [
      'Measure with ST05 or SAT when performance matters.',
      'JOIN, IN @itab, and FOR ALL ENTRIES are possible alternatives depending on release and requirement.',
      'Remove duplicate keys before mass reads.',
    ],
    commonMistakes: [
      'Calling SELECT SINGLE thousands of times.',
      'Replacing SELECT inside LOOP with FOR ALL ENTRIES but forgetting the empty-table guard.',
      'Loading too much data because the key collection is not selective.',
    ],
    relatedTopics: ['FOR ALL ENTRIES', 'Joins', 'ST05'],
  },
  {
    id: 'performance-hashed-table-reads',
    title: 'Use HASHED TABLE for Repeated Key Reads',
    category: 'Performance',
    subcategory: 'Internal Tables',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'HASHED TABLE is broadly available. Choose keys carefully.',
    difficulty: 'Intermediate',
    explanation: 'Use a hashed table when you repeatedly read by a unique full key.',
    code: `DATA lt_names_h TYPE HASHED TABLE OF ty_name WITH UNIQUE KEY kunnr.
DATA ls_name    TYPE ty_name.

READ TABLE lt_names_h INTO ls_name
  WITH TABLE KEY kunnr = ls_order-kunnr.

IF sy-subrc = 0.
  WRITE: / ls_name-name1.
ENDIF.`,
    notes: [
      'HASHED TABLE is optimized for exact unique-key access.',
      'SORTED TABLE may be better for range reads or ordered processing.',
      'STANDARD TABLE is fine for simple append-and-loop use.',
    ],
    commonMistakes: [
      'Using hashed tables when duplicate keys are needed.',
      'Reading with a partial key and expecting hashed performance.',
      'Choosing table type without understanding access patterns.',
    ],
    relatedTopics: ['Internal Tables', 'READ TABLE', 'Performance'],
  },
  {
    id: 'performance-select-fields',
    title: 'Select Only Needed Fields',
    category: 'Performance',
    subcategory: 'Database Access',
    compatibility: ['Classic ABAP', 'Modern ABAP 7.40+', 'S/4HANA'],
    compatibilityNotes: 'Selecting field lists instead of SELECT * is a broadly applicable performance and clarity practice.',
    difficulty: 'Beginner',
    explanation: 'Read only the columns your logic needs to reduce data transfer and make intent clearer.',
    code: `"Prefer this:
SELECT vbeln erdat auart kunnr
  FROM vbak
  INTO TABLE @DATA(lt_orders)
  WHERE erdat IN @s_erdat.

"Avoid this unless every field is genuinely needed:
SELECT *
  FROM vbak
  INTO TABLE @DATA(lt_full_orders)
  WHERE erdat IN @s_erdat.`,
    notes: [
      'Field lists make reports easier to understand.',
      'Avoid SELECT * in productive reports unless you need the full row.',
      'For DDIC table work areas, make sure selected fields match the target structure.',
    ],
    commonMistakes: [
      'Using SELECT * out of habit.',
      'Selecting many unused fields and then blaming ALV or loops for slowness.',
      'Changing field lists without updating target structures.',
    ],
    relatedTopics: ['Open SQL', 'ALV', 'ST05'],
  },
];
