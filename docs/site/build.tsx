/** @jsx h */
import initLightningCss, {
  transform as transformCss,
} from "./deps/lightning_css.ts";
import { Fragment, h, Helmet, renderSSR, withStyles } from "./deps/nano_jsx.ts";

import { Layout } from "./components/Layout.tsx";
import { Nav } from "./components/Nav.tsx";
import * as csp from "./csp.ts";
import { Api, ApiToc } from "./pages/Api.tsx";
import { Examples, ExamplesToc } from "./pages/Examples.tsx";
import { Installation, InstallationToc } from "./pages/Installation.tsx";
import { Introduction, IntroductionToc } from "./pages/Introduction.tsx";

const baseURL = new URL(Deno.args[0] || "http://localhost:4507");

const pages = {
  intro: "",
  install: "installation/",
  examples: "examples/",
  api: "api/",
} as const;

const globalStyles = await Deno.readTextFile(
  new URL("global.css", import.meta.url),
);

interface AppProps {
  baseURL: URL;

  page: keyof typeof pages;
}

const App = ({ baseURL, page }: AppProps) => {
  const { content, toc } = (() => {
    switch (page) {
      case "intro":
        return {
          toc: <IntroductionToc />,
          content: <Introduction />,
        };
      case "install":
        return {
          toc: <InstallationToc />,
          content: <Installation />,
        };
      case "examples":
        return {
          toc: <ExamplesToc />,
          content: <Examples />,
        };
      case "api":
        return {
          toc: <ApiToc />,
          content: <Api />,
        };
    }
  })();

  return (
    <Fragment>
      <Helmet>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/hack-font@3.3.0/build/web/hack-subset.css"
        />
      </Helmet>
      <Layout
        siteRoot={baseURL}
        navigation={<Nav siteRoot={baseURL} />}
        toc={toc}
      >
        {content}
      </Layout>
    </Fragment>
  );
};

const tagPattern = /^<([^>]+)>([\s\S]*)<\/[^>]+>$/m;

function separateInnerHTML(outerHTML: string): {
  tagName: string;
  innerHTML: string;
  outerHTML: string;
} | {
  outerHTML: string;
} {
  const match = outerHTML.match(tagPattern);
  if (!match) {
    return {
      outerHTML,
    };
  }

  return {
    tagName: match[1],
    innerHTML: match[2],
    outerHTML,
  };
}

const policies: csp.Policies = {
  "default-src": [csp.SELF],
  "frame-src": ["https://codesandbox.io"],
  "style-src": [
    new URL("styles.css", baseURL).toString(),
    "https://rsms.me/inter/",
    "https://cdn.jsdelivr.net/npm/hack-font@3.3.0/",
  ],
  "font-src": [
    "https://rsms.me/inter/",
    "https://cdn.jsdelivr.net/npm/hack-font@3.3.0/",
  ],
};

interface GenerateParams {
  baseURL: URL;

  page: keyof typeof pages;

  buildDir: URL;

  styles: Map<string, boolean>;
}

async function generatePage(
  { baseURL, page, buildDir, styles }: GenerateParams,
) {
  const app = renderSSR(
    withStyles(globalStyles)(<App baseURL={baseURL} page={page} />),
  );

  const { body, head, footer } = Helmet.SSR(app);

  const [headTags, styleTags] = head.map(separateInnerHTML).reduce<
    [
      ReturnType<typeof separateInnerHTML>[],
      Extract<ReturnType<typeof separateInnerHTML>, { tagName: string }>[],
    ]
  >(
    ([rest, styles], tag) =>
      "tagName" in tag && tag.tagName === "style"
        ? [rest, [...styles, tag]]
        : [[...rest, tag], styles],
    [[], []],
  );

  styleTags.forEach(({ innerHTML }) => {
    styles.set(innerHTML, true);
  });

  const cssPath = new URL("styles.css", baseURL).pathname;

  const html = `
    <!DOCTYPE html>
    <html lang="en-US">
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="Content-Security-Policy" content="${
    csp.build(policies)
  }" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        ${headTags.map(({ outerHTML }) => outerHTML).join("\n")}
        <link rel="stylesheet" href="${cssPath}" />
      </head>
      <!--
        This site is generated using nano-jsx SSR, lightning-css, remark/rehype, Prism, and Deno.
        Source code at https://github.com/pocka/slack-message-parser/tree/master/docs/site/
      -->
      <body>
        ${body}
        ${footer.join("\n")}
      </body>
    </html>
  `;

  const targetPath = new URL(`${pages[page]}index.html`, buildDir);
  const parentDir = new URL("./", targetPath);

  await Deno.mkdir(parentDir, { recursive: true });

  await Deno.writeTextFile(targetPath, html);
}

const buildDir = new URL("./build/", import.meta.url);

const styles = new Map<string, boolean>();

await Promise.all(
  (Object.keys(pages) as (keyof typeof pages)[]).map((page) =>
    generatePage({
      baseURL,
      page,
      buildDir,
      styles,
    })
  ),
);

await initLightningCss();

const css = Array.from(styles.keys()).join("\n");

const { code: transformedCss } = transformCss({
  filename: "styles.css",
  code: new TextEncoder().encode(css),
  minify: true,
  targets: {
    chrome: (105 << 16),
    safari: (14 << 16),
    firefox: (102 << 16),
  },
});

await Deno.writeFile(
  new URL("styles.css", buildDir),
  transformedCss,
);
