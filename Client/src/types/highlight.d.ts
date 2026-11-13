// highlight.js ships types only for the package root. Its `exports` map has no
// `types` entry for these subpaths, so editors report TS7016 on the imports in
// `components/ui/CodeBlock.jsx`. These declarations describe the small surface
// we actually use.

declare module 'highlight.js/lib/core' {
  export interface HighlightOptions {
    language: string;
    ignoreIllegals?: boolean;
  }

  export interface HighlightResult {
    value: string;
    language?: string;
    relevance: number;
    illegal?: boolean;
    errorRaised?: Error;
  }

  export interface HighlightJS {
    registerLanguage(name: string, language: unknown): void;
    getLanguage(name: string): unknown;
    highlight(code: string, options: HighlightOptions): HighlightResult;
  }

  const hljs: HighlightJS;
  export default hljs;
}

declare module 'highlight.js/lib/languages/javascript' {
  const javascript: unknown;
  export default javascript;
}
