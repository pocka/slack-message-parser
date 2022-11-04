/** @jsx h */
import { Fragment, h, withStyles } from "../deps/nano_jsx.ts";

function cx(...classNames: string[]): string {
  return classNames.map((className) => `layout__${className}`).join("  ");
}

interface LayoutProps {
  navigation: unknown;

  toc: unknown;

  children: unknown;

  siteRoot?: URL;
}

export const Layout = (
  { children, navigation, toc, siteRoot = new URL("https://example.com/") }:
    LayoutProps,
) => {
  return withStyles(css)(
    <Fragment>
      <div class={cx("logo-wrapper", "header")}>
        <a class={cx("logo")} href={new URL("./", siteRoot).pathname}>
          slack<br />message<br />parser
        </a>
      </div>
      <nav class={cx("nav", "header")}>{navigation}</nav>
      <div class={cx("header-fill", "header")} />
      <aside class={cx("toc")}>{toc}</aside>
      <main class={cx("main")}>
        {children}
      </main>
    </Fragment>,
  );
};

const css = `
  html {
    --_scroll-padding-top: 7rem;

    scroll-padding-top: var(--_scroll-padding-top);
    scroll-behavior: smooth;
  }

  body {
    display: grid;
    grid-template-columns: min-content minmax(0, 1fr);
    grid-template-rows: min-content max-content minmax(0, 1fr);
    grid-template-areas:
      "logo nav"
      "toc toc"
      "main main";
    width: 100%;

    background-color: hsl(var(--color-neutral));
    color: hsl(var(--color-on-neutral));
    overflow-y: auto;
  }

  .${cx("header")} {
    position: sticky;
    top: 0;
    border-bottom: var(--border-width) solid hsl(var(--color-border));

    background-color: hsl(var(--color-panel));
    z-index: 666;
  }

  .${cx("logo-wrapper")} {
    grid-area: logo;
    border-right: var(--border-width) solid hsl(var(--color-border));
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: var(--gutter-md) var(--gutter-lg);
  }

  .${cx("logo")} {
    display: block;
    font-size: var(--font-size-sm);
    line-height: 1;

    color: inherit;
    font-weight: bold;
    text-align: right;
    text-decoration: none;
  }
  .${cx("logo")}:hover,
  .${cx("logo")}:focus-visible {
    outline: none;
    text-decoration: underline;
  }

  .${cx("nav")} {
    grid-area: nav;
    display: flex;
    justify-content: flex-start;
    align-items: stretch;
    flex-wrap: nowrap;
    padding: var(--gutter-sm) var(--gutter-lg);

    overflow-x: auto;
  }

  .${cx("header-fill")} {
    grid-area: fill;
    display: none;
  }

  .${cx("toc")} {
    grid-area: toc;
    display: block;
    border-bottom: var(--border-width) solid hsl(var(--color-border));
    padding: var(--gutter-md);
  }

  .${cx("main")} {
    grid-area: main;
    display: block;
    padding: var(--gutter-md);
  }

  @media (min-width: 800px) {
    body {
      grid-template-columns: 20rem minmax(0, 1fr);
      grid-template-rows: min-content minmax(0, 1fr);
      grid-template-areas:
        "logo nav"
        "toc main";
    }

    .${cx("toc")} {
      align-self: start;
      position: sticky;
      top: var(--_scroll-padding-top);
      display: flex;
      justify-content: flex-end;
      border: 0;
    }

    .${cx("main")} {
      flex: 1;
      padding: var(--gutter-lg);
    }

    .${cx("nav")} {
      justify-content: center;
    }
  }

  @media (min-width: 1100px) {
    body {
      grid-template-columns: minmax(0, 1fr) 70rem minmax(0, 1fr);
      grid-template-areas:
        "logo nav fill"
        "toc main unused";
    }

    .${cx("header-fill")} {
      display: block;
    }
  }
`;
