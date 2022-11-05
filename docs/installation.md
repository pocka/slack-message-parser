# Installation

This library is available for Node.js, Deno, and browser (or other ESM environment).

## Node.js

Install `slack-message-parser` package hosted on NPM.

```sh
# Use your package manager's install command
npm i slack-message-parser
```

```ts
import { parse } from "slack-message-parser";

console.dir(parse("Slack *message* ~to~ _parse_"));
```

## Deno

Import from `https://deno.land/x/slack_message_parser@<VERSION>/mod.ts`.

```js
import { parse } from "https://deno.land/x/slack_message_parser@v3.0.0/mod.ts";

console.dir(parse("Slack *message* ~to~ _parse_"));
```

## Browser

Use NPM-to-ESM service such as [Skypack](https://www.skypack.dev/).

```js
import { parse } from "https://cdn.skypack.dev/slack-message-parser@^3.0.0";

console.dir(parse("Slack *message* ~to~ _parse_"));
```
