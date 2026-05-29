import { useMemo, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import hljs from 'highlight.js/lib/core';

function abapLanguage(hljsInstance) {
  return {
    name: 'ABAP',
    case_insensitive: true,
    lexemes: '[A-Za-z_][A-Za-z0-9_-]*',
    keywords: {
      keyword:
        'ADD ALIASES APPEND AS ASSIGN AUTHORITY-CHECK BACK CALL CASE CATCH CHANGING CHECK CLASS CLEAR COMMIT ' +
        'CONSTANTS CONTINUE CREATE DATA DEFAULT DEFINE DELETE DO ELSE ELSEIF ENDCASE ENDCLASS ENDDO ENDFORM ' +
        'ENDIF ENDLOOP ENDMETHOD ENDSELECT ENDTRY ENDWHILE EXIT EXPORTING FIELD-SYMBOLS FOR FORM FROM FUNCTION IF IMPORTING ' +
        'IN INCLUDE INNER INSERT INTO JOIN LEFT LOOP MESSAGE METHOD METHODS MODIFY MOVE NEW OBJECT ON PARAMETERS ' +
        'PERFORM PRIVATE PROTECTED PUBLIC RAISE READ REFRESH REPORT RETURN ROLLBACK SELECT SELECT-OPTIONS SET ' +
        'SORT SPLIT START-OF-SELECTION SWITCH TABLE TABLES THEN TIMES TRY TYPE TYPES USING VALUE WHEN WHERE WHILE WITH WRITE',
      literal: 'abap_true abap_false true false space initial',
      built_in:
        'sy-subrc sy-datum sy-uzeit sy-uname sy-repid sy-tabix sy-langu lines strlen cond corresponding ' +
        'cl_salv_table cl_salv_column cl_salv_columns_table cx_root cx_salv_msg',
    },
    contains: [
      hljsInstance.COMMENT('"', '$'),
      hljsInstance.COMMENT('\\*', '$'),
      {
        scope: 'string',
        begin: "'",
        end: "'",
        contains: [{ begin: "''" }],
      },
      {
        scope: 'string',
        begin: '\\|',
        end: '\\|',
        contains: [{ scope: 'subst', begin: '\\{', end: '\\}' }],
      },
      hljsInstance.C_NUMBER_MODE,
      {
        scope: 'symbol',
        begin: '@[A-Za-z_][A-Za-z0-9_]*',
      },
      {
        scope: 'title',
        begin: '\\b[clzif]?[cx]?_[A-Za-z0-9_]+\\b',
      },
    ],
  };
}

hljs.registerLanguage('abap', abapLanguage);

function CodeBlock({ code, compatibility = [], difficulty }) {
  const [copied, setCopied] = useState(false);

  const highlightedLines = useMemo(() => {
    const highlighted = hljs.highlight(code, { language: 'abap', ignoreIllegals: true }).value;
    return highlighted.split('\n');
  }, [code]);

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="overflow-hidden rounded-md border border-ink-200 bg-ink-950 dark:border-ink-700">
      <div className="flex flex-col gap-3 border-b border-white/10 bg-ink-900 px-3 py-3 text-xs text-ink-200 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="rounded-md bg-white/10 px-2.5 py-1 font-mono font-semibold text-white">ABAP</span>
          {difficulty ? (
            <span className="rounded-md bg-ink-800 px-2.5 py-1 font-semibold text-ink-100">{difficulty}</span>
          ) : null}
          {compatibility.map((item) => (
            <span className="rounded-md bg-sap-500/15 px-2.5 py-1 font-semibold text-sap-100" key={item}>
              {item}
            </span>
          ))}
        </div>
        <button
          className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md px-3 py-2 font-semibold text-ink-100 hover:bg-white/10 sm:w-fit"
          onClick={copyCode}
          type="button"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div className="code-scrollbar max-h-[28rem] overflow-auto bg-white dark:bg-ink-950 sm:max-h-[34rem]">
        <pre className="min-w-max p-0 font-mono text-[0.78rem] leading-6 text-ink-800 dark:text-ink-100 sm:text-[0.84rem]">
          <code className="hljs language-abap block py-4">
            {highlightedLines.map((line, index) => (
              <span className="code-line grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[3.25rem_minmax(0,1fr)]" key={`${index}-${line}`}>
                <span className="select-none border-r border-ink-200 px-2 text-right text-ink-400 dark:border-ink-800 dark:text-ink-600 sm:px-3">
                  {index + 1}
                </span>
                <span
                  className="px-3 sm:px-4"
                  dangerouslySetInnerHTML={{
                    __html: line.length > 0 ? line : '&nbsp;',
                  }}
                />
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

export default CodeBlock;
