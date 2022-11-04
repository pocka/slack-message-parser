/** @jsx h */
import { h, withStyles } from "../deps/nano_jsx.ts";

function cx(className: string): string {
  return `nav__${className}`;
}

interface NavProps {
  siteRoot?: URL;
}

export const Nav = (
  { siteRoot = new URL("https://example.com/") }: NavProps,
) => {
  const path = (relPath: string) => new URL(relPath, siteRoot).pathname;

  return withStyles(css)(
    <ul class={cx("list")}>
      <li>
        <a class={cx("link")} href={path("./")}>Intro</a>
      </li>
      <li>
        <a class={cx("link")} href={path("installation/")}>Install</a>
      </li>
      <li>
        <a class={cx("link")} href={path("api/")}>API</a>
      </li>
      <li>
        <a class={cx("link")} href={path("examples/")}>Examples</a>
      </li>
      <li>
        <a
          class={cx("link")}
          href="https://github.com/pocka/slack-message-parser"
        >
          GitHub
        </a>
      </li>
    </ul>,
  );
};

const css = `
  .${cx("list")} {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: var(--font-size-sm);

    list-style: none;
  }

  .${cx("link")} {
    padding: var(--gutter-md) var(--gutter-lg);
    border: var(--border-width) solid transparent;

    border-radius: 3px;
    color: inherit;
    text-decoration: none;
  }
  .${cx("link")}:hover {
    background-color: hsla(var(--color-primary), 0.3);
    border-color: hsl(var(--color-primary));
  }
  .${cx("link")}:focus-visible {
    outline: none;
    text-decoration: underline;
  }
`;
