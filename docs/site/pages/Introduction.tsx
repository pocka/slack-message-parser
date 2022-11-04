/** @jsx h */
import { Fragment, h, Helmet } from "../deps/nano_jsx.ts";

import { Markdown } from "../components/Markdown.tsx";
import { Title } from "../components/Title.tsx";
import { Toc } from "../components/Toc.tsx";
import { parseMarkdownFile } from "../markdown.ts";

const { toc, main } = await parseMarkdownFile({
  path: new URL("../../introduction.md", import.meta.url),
});

export const IntroductionToc = () => <Toc html={toc} />;

export const Introduction = () => (
  <Fragment>
    <Helmet>
      <Title>Introduction</Title>
    </Helmet>
    <Markdown html={main} />
  </Fragment>
);
