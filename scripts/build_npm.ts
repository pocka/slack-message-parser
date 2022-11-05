import { build, emptyDir } from "https://deno.land/x/dnt@0.31.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
  },
  compilerOptions: {
    lib: ["es2021"],
    target: "ES2021",
  },
  package: {
    "name": "slack-message-parser",
    version: Deno.args[0],
    "description": "Parser for Slack message",
    "repository": {
      "type": "git",
      "url": "git+https://github.com/pocka/slack-message-parser.git",
    },
    "keywords": [
      "slack",
    ],
    "author": "pocka",
    "license": "MIT",
    "bugs": {
      "url": "https://github.com/pocka/slack-message-parser/issues",
    },
    "homepage": "https://github.com/pocka/slack-message-parser#readme",
    "sideEffects": false,
  },
});

// Copy files
await Deno.mkdir("npm/docs");

await Promise.all(
  [
    "LICENSE",
    "README.md",
    "docs/api.md",
    "docs/installation.md",
    "docs/introduction.md",
  ].map(async (file) => {
    await Deno.copyFile(file, `npm/${file}`);
  }),
);
