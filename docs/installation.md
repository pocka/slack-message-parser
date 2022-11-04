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

This library is not registered to `deno.land` yet.
Please use `raw.githubusercontent.com` for a moment.

```js
import { parse } from "https://raw.githubusercontent.com/pocka/slack-message-parser/master/mod.ts";

console.dir(parse("Slack *message* ~to~ _parse_"));
```

## Browser

Use NPM-to-ESM service such as [Skypack](https://www.skypack.dev/).

```js
import { parse } from "https://cdn.skypack.dev/slack-message-parser@^2.0.2";

console.dir(parse("Slack *message* ~to~ _parse_"));
```
