# Guide

slack-message-parser is a JavaScript library which parses the message returned by Slack API and give you a tree object (imagine AST).
You could use the result tree to create a message viewer (HTML, React component, etc...) or whatever you want :)

## Installation

The package is available as `slack-message-parser` on npm.

```sh
yarn add slack-message-parser
# npm i --save slack-message-parser
```

## Quick Start

Just parse the message!

```ts
import slackMessageParser from "slack-message-parser";

const tree = slackMessageParser("Slack *message* ~to~ _parse_");

console.dir(tree);
```

## Supported Message Features

- Plain text
- Links
  - Channels (`#channel`)
  - User (`@someone`)
  - URL (`https://foo.bar`, `mailto:foo@bar`)
  - Commands (Represented as `<!foo>`, more detail [here](https://api.slack.com/docs/message-formatting))
- Emojis :heart_eyes:
- Code block
- Inline code (<code>\`foo\`</code>)
- Italic (`_foo_`)
- Bold (`*foo*`)
- Strikethrough (`~foo~`)
- Quotes (`> foo`)

## Examples

### Plain HTML with TypeScript

<iframe src="https://codesandbox.io/embed/gracious-rgb-kmqbu?fontsize=14&module=%2Fsrc%2Findex.ts&view=editor" title="slack-message-parser--ts-vanilla" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

### React with TypeScript

<iframe src="https://codesandbox.io/embed/condescending-heyrovsky-y5jw3?fontsize=14&module=%2Fsrc%2FSlackMessage.tsx" title="slack-message-parser--react-ts" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
