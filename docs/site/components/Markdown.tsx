/** @jsx h */
import { h, withStyles } from "../deps/nano_jsx.ts";

function cx(className: string): string {
  return `markdown__${className}`;
}

interface MarkdownProps {
  /**
   * Parsed HTML string.
   */
  html: string;
}

/**
 * Component to render parsed markdown content.
 */
export const Markdown = ({ html }: MarkdownProps) => {
  return withStyles(css)(
    <div class={cx("root")} dangerouslySetInnerHTML={{ __html: html }} />,
  );
};

const css = `
  .${cx("root")} h1 {
    font-size: var(--font-size-xl);
    font-weight: bold;
  }

  .${cx("root")} h2 {
    font-size: var(--font-size-lg);
    font-weight: bold;
    margin-top: 2em;
  }

  .${cx("root")} h3 {
    font-size: var(--font-size-md);
    font-weight: bold;
    margin-top: 1.5em;
  }

  .${cx("root")} h4 {
    font-size: var(--font-size-md);
    font-weight: bold;
    margin-top: 1em;
  }

  @keyframes ${cx("blink")} {
    from {
      color: hsl(var(--color-on-neutral));
    }

    to {
      color: hsl(var(--color-primary));
    }
  }

  .${cx("root")} h1:target,
  .${cx("root")} h2:target,
  .${cx("root")} h3:target {
    animation: 0.3s 0s linear alternate 4 ${cx("blink")};
  }

  .${cx("root")} p {
    line-height: var(--line-height-normal);
    margin-top: 0.5em;
  }

  .${cx("root")} a {
    color: hsl(var(--color-primary));
    text-decoration: none;
  }
  .${cx("root")} a:hover,
  .${cx("root")} a:focus-visible {
    text-decoration: underline;
  }

  .${cx("root")} code:not(pre > code),
  .${cx("root")} pre {
    padding: var(--gutter-xs) var(--gutter-md);
    font-family: var(--font-family-mono);

    background-color: hsl(var(--color-panel));
    border-radius: var(--radius);
    color: hsl(var(--color-on-panel));
  }

  .${cx("root")} pre {
    margin-top: 1em;
    width: 100%;
    padding: var(--gutter-md) var(--gutter-lg);
    border: var(--border-width) solid hsla(var(--color-border));
    line-height: var(--line-height-dense);

    overflow-x: auto;
  }

  .${cx("root")} details {
    margin-top: 1em;
  }

  .${cx("root")} [class^="language-"] .token.keyword {
    color: hsl(var(--color-code-keyword));
  }
  .${cx("root")} [class^="language-"] .token.string {
    color: hsl(var(--color-code-string));
  }
  .${cx("root")} [class^="language-"] .token.operator {
    color: hsl(var(--color-code-operator));
  }
  .${cx("root")} [class^="language-"] .token.function {
    color: hsl(var(--color-code-function));
  }
  .${cx("root")} [class^="language-"] .token.comment {
    color: hsl(var(--color-code-comment));
    font-style: italic;
  }

  .${cx("root")} ul {
    margin-top: 0.5em;
    padding-left: 1em;
  }
  .${cx("root")} ul ul {
    margin-top: 0;
  }

  .${cx("root")} iframe {
    margin-top: 1em;
    width: 100%;
    aspect-ratio: 4 / 3;
    border: var(--border-width) solid hsla(var(--color-border));

    border-radius: var(--radius);
  }

  .${cx("root")} table {
    width: 100%;
    margin-top: 1em;
    /*
    border-collapse: collapse;
    */
    border-spacing: 0;
    border: var(--border-width) solid hsla(var(--color-border));

    border-radius: var(--radius);
  }

  .${cx("root")} thead {
    background-color: hsl(var(--color-panel));
    color: hsl(var(--color-on-panel));
  }

  .${cx("root")} th,
  .${cx("root")} tr:not(:last-child) > td {
    border-bottom: var(--border-width) solid hsla(var(--color-border));
  }

  .${cx("root")} th,
  .${cx("root")} td {
    padding: var(--gutter-sm) var(--gutter-md);
  }
`;
