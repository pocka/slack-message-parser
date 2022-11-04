# Introduction

slack-message-parser is a JavaScript library to parse a message returned by Slack API then give you an AST-like tree object.
You can use the result tree to create a message viewer (HTML, React component, etc...) or whatever you want.

## Important note

There are some cases it's impossible to correctly parse a message composed by [Slack's WYSIWYG message editor][slack-wyswig], especially when an inline code block is involved (see [#26]).
Please consider traversing Blocks (`blocks` property) first.
This library is suitable for fallback purpose or for when Blocks are not available.

[slack-wyswig]: https://api.slack.com/changelog/2019-09-what-they-see-is-what-you-get-and-more-and-less
[#26]: https://github.com/pocka/slack-message-parser/issues/26

## Quick glance

```ts
import slackMessageParser from "slack-message-parser";

const tree = slackMessageParser("Slack *message* ~to~ _parse_");

console.dir(tree);
```

<details>
  <summary>Output</summary>

```js
({
  type: NodeType.Root,
  children: [
    {
      type: NodeType.Text,
      text: "Slack ",
      source: "Slack ",
    },
    {
      type: NodeType.Bold,
      children: [
        {
          type: NodeType.Text,
          text: "message",
          source: "message",
        },
      ],
      source: "*message*",
    },
    {
      type: NodeType.Text,
      text: " ",
      source: " ",
    },
    {
      type: NodeType.Strike,
      children: [
        {
          type: NodeType.Text,
          text: "to",
          source: "to",
        },
      ],
      source: "~to~",
    },
    {
      type: NodeType.Text,
      text: " ",
      source: " ",
    },
    {
      type: NodeType.Italic,
      children: [
        {
          type: NodeType.Text,
          text: "parse",
          source: "parse",
        },
      ],
      source: "_parse_",
    },
  ],
  source: "Slack *message* ~to~ _parse_",
});
```

</details>

## Available Syntax

- Plain text
- Links
  - Channels (`#channel`)
  - User (`@someone`)
  - URL (`https://foo.bar`, `mailto:foo@bar`)
  - Commands (Represented as `<!foo>`, more details [here](https://api.slack.com/docs/message-formatting))
- Emojis 😍
- Code block
- Inline code (<code>\`foo\`</code>)
- Italic (`_foo_`)
- Bold (`*foo*`)
- Strikethrough (`~foo~`)
- Quotes (`> foo`)
