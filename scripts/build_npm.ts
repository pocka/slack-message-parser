import { build, emptyDir } from "https://deno.land/x/dnt@0.31.0/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  outDir: "./npm",
  shims: {
    deno: true,
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
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");
Deno.mkdirSync("npm/docs");
Deno.mkdirSync("npm/docs/api");
Deno.copyFileSync("docs/README.md", "npm/docs/README.md");
Deno.copyFileSync("docs/api/README.md", "npm/docs/api/README.md");
