// deno-lint-ignore-file no-explicit-any
import { Plugin, Transformer, unified } from "./deps/unified.ts";
import { remarkGfm, remarkParse, remarkRehype } from "./deps/remark.ts";
import {
  rehypePrism,
  rehypeSlug,
  rehypeStringify,
  rehypeToc,
} from "./deps/rehype.ts";
import { SKIP, visit } from "./deps/unist_util_visit.ts";

const rehypeNavOnly: Plugin = () => {
  const transformer: Transformer = (tree) => {
    visit(tree, "element", (node: any, index: number, parent: any) => {
      if (parent?.type === "root" && node.tagName !== "nav") {
        parent.children.splice(index, 1);

        return [SKIP, index];
      }
    });

    visit(
      tree,
      (node: any) => ["text", "raw"].includes(node.type),
      (_node: any, index: number | null, parent: any) => {
        if (parent?.type === "root" && typeof index === "number") {
          parent.children.splice(index, 1);

          return [SKIP, index];
        }
      },
    );
  };

  return transformer;
};

interface ParseResult {
  /**
   * Parsed HTML
   */
  main: string;

  /**
   * Table of contents HTML
   */
  toc: string;
}

interface ParseOptions {
  path: URL | string;
}

const baseProcessor = () =>
  unified().use(remarkParse).use(remarkGfm).use(remarkRehype, {
    allowDangerousHtml: true,
  }).use(rehypeSlug);

const mainProcessor = baseProcessor().use(rehypePrism, {
  alias: {
    "shell": "sh",
  },
}).use(rehypeStringify, {
  allowDangerousHtml: true,
});

const tocProcessor = baseProcessor().use(rehypeToc, {
  headings: ["h1", "h2", "h3"],
}).use(rehypeNavOnly).use(
  rehypeStringify,
);

export async function parseMarkdownDocs(docsMd: string): Promise<string> {
  return (await mainProcessor.process(docsMd)).toString();
}

export async function parseMarkdownFile(
  { path }: ParseOptions,
): Promise<ParseResult> {
  const content = new TextDecoder("utf-8").decode(await Deno.readFile(path));

  const [main, toc] = await Promise.all([
    mainProcessor.process(content),
    tocProcessor.process(content),
  ]);

  return {
    main: main.toString(),
    toc: toc.toString(),
  };
}
