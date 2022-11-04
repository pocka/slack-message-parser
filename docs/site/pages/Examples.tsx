/** @jsx h */
import { Fragment, h, Helmet, withStyles } from "../deps/nano_jsx.ts";

import { Markdown } from "../components/Markdown.tsx";
import { Title } from "../components/Title.tsx";
import { Toc } from "../components/Toc.tsx";
import { parseMarkdownFile } from "../markdown.ts";

const { toc, main } = await parseMarkdownFile({
  path: new URL("../../examples.md", import.meta.url),
});

function cx(className: string): string {
  return `pages_examples__${className}`;
}

export const ExamplesToc = () => {
  return <Toc html={toc} />;
};

export const Examples = () => {
  return withStyles(css)(
    <Fragment>
      <Helmet>
        <Title>Examples</Title>
      </Helmet>
      <div>
        <noscript>
          <div class={cx("alert")}>
            This page does not work with JavaScript disabled.
          </div>
        </noscript>
        <Markdown html={main} />
      </div>
    </Fragment>,
  );
};

const css = `
  .${cx("alert")} {
    padding: var(--gutter-md);
    border: var(--border-width) solid hsl(var(--color-danger));
    margin-bottom: 1em;

    background-color: hsla(var(--color-danger), 0.3);
    border-radius: var(--radius);
    color: hsl(var(--color-on-neutral));
  }
`;
