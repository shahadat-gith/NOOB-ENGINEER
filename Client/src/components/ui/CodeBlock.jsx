/// <reference path="../../types/highlight.d.ts" />
import { useMemo } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Syntax-highlighted code sample. Colours come from the `.hljs-*` rules in
 * `index.css`, so it follows the light/dark theme instead of a fixed theme.
 */
export function CodeBlock({ code, language = 'javascript', label, className = '' }) {
  const highlighted = useMemo(() => {
    if (!code) return '';
    if (!hljs.getLanguage(language)) return escapeHtml(code);
    return hljs.highlight(code, { language, ignoreIllegals: true }).value;
  }, [code, language]);

  return (
    <div
      className={`overflow-hidden rounded-field border border-border-secondary bg-surface-secondary ${className}`}
    >
      {label && (
        <div className="flex items-center justify-between gap-3 border-b border-border-secondary px-4 py-2">
          <span className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-text-tertiary">
            {label}
          </span>
          <span className="text-[11.5px] font-medium text-text-tertiary">{language}</span>
        </div>
      )}
      <pre className="m-0 overflow-x-auto px-4 py-3 text-[12.5px] leading-relaxed">
        <code
          className={`hljs font-mono language-${language}`}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </pre>
    </div>
  );
}
