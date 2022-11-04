/** @jsx h */
import { Fragment, h, Helmet } from "../deps/nano_jsx.ts";

import { Markdown } from "../components/Markdown.tsx";
import { Title } from "../components/Title.tsx";
import { Toc } from "../components/Toc.tsx";
import { parseMarkdownFile } from "../markdown.ts";

const { toc, main } = await parseMarkdownFile({
  path: new URL("../../installation.md", import.meta.url),
});

export const InstallationToc = () => <Toc html={toc} />;

export const Installation = () => (
  <Fragment>
    <Helmet>
      <Title>Installation</Title>
    </Helmet>
    <Markdown html={main} />
  </Fragment>
);
