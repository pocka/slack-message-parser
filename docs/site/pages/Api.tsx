/** @jsx h */
import { Fragment, h, Helmet } from "../deps/nano_jsx.ts";

import { Markdown } from "../components/Markdown.tsx";
import { Title } from "../components/Title.tsx";
import { Toc } from "../components/Toc.tsx";
import { parseMarkdownFile } from "../markdown.ts";

const { toc, main } = await parseMarkdownFile({
  path: new URL("../../api.md", import.meta.url),
});

export const ApiToc = () => <Toc html={toc} />;

export const Api = () => (
  <Fragment>
    <Helmet>
      <Title>API</Title>
    </Helmet>
    <Markdown html={main} />
  </Fragment>
);
