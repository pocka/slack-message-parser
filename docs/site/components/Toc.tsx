/** @jsx h */
import { h, withStyles } from "../deps/nano_jsx.ts";

function cx(className: string): string {
  return `toc__${className}`;
}

type TocProps = {
  /**
   * Inner HTML.
   *
   * Must be `<nav><ol>...</ol></nav>`
   */
  children: unknown;
} | {
  /**
   * Inner HTML.
   *
   * Must be `<nav><ol>...</ol></nav>`
   */
  html: string;
};

/**
 * Table of Contents component.
 */
export const Toc = (props: TocProps) => {
  return withStyles(css)(
    "html" in props
      ? (
        <div
          class={cx("root")}
          dangerouslySetInnerHTML={{ __html: props.html }}
        />
      )
      : <div class={cx("root")}>{props.children}</div>,
  );
};

const css = `
  .${cx("root")} {
    min-width: 15rem;
  }

  .${cx("root")} ol {
    list-style: none;
  }
  .${cx("root")} ol ol {
    padding-left: var(--gutter-lg);

    list-style: square;
  }
  .${cx("root")} ol ol ol {
    list-style: circle;
  }

  .${cx("root")} a {
    font-size: var(--font-size-sm);
    color: hsl(var(--color-on-neutral));
    text-decoration: underline hsl(var(--color-border));

    opacity: 0.9;
  }
  .${cx("root")} a:hover {
    text-decoration: underline calc(var(--border-width) * 2) hsl(var(--color-primary));
  }
`;
