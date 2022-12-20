# slack-message-parser

[![npm](https://img.shields.io/npm/v/slack-message-parser)](https://www.npmjs.com/package/slack-message-parser)
[![Deno](https://deno.land/badge/slack_message_parser/version)](https://deno.land/x/slack_message_parser)
[![Lint Workflow Status](https://img.shields.io/github/actions/workflow/status/pocka/slack-message-parser/lint.yml?label=lint&branch=master)](https://github.com/pocka/slack-message-parser/actions/workflows/lint.yml)
[![Test Workflow Status](https://img.shields.io/github/actions/workflow/status/pocka/slack-message-parser/test.yml?label=test&branch=master)](https://github.com/pocka/slack-message-parser/actions/workflows/test.yml)
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/pocka/slack-message-parser/docs-deploy.yml?label=docs%20deploy&branch=master)](https://github.com/pocka/slack-message-parser/actions/workflows/docs-deploy.yml)
[![codecov](https://img.shields.io/codecov/c/github/pocka/slack-message-parser)](https://codecov.io/gh/pocka/slack-message-parser)

Parser library for [Slack message format](https://api.slack.com/docs/message-formatting).

[[Document](https://pocka.github.io/slack-message-parser/)]

## Install

Requires Node.js >=v16.

```sh
npm i --save slack-message-parser
# yarn add slack-message-parser
```

## Usage

Usage with Typescript (recommended).

```ts
import slackMessageParser, { Node, NodeType } from "slack-message-parser";

const tree = slackMessageParser("Slack *message* ~to~ _parse_");

// tree is:
// {
//   type: NodeType.Root,
//   children: [
//     {
//       type: NodeType.Text,
//       text: "Slack ",
// .     source: "Slack "
//     },
//     {
//       type: NodeType.Bold,
//       children: [
//         {
//           type: NodeType.Text,
//           text: "message"
//         }
//       ],
// .     source: "*message*"
//     },
//     ...
//   ],
//   source: "Slack *message* ~to~ _parse_"
// }

// Write your own!
const toHTML = (node: Node): string => {
  switch (node.type) {
    case NodeType.Root:
      return `<p>${node.children.map(toHTML).join("")}</p>`;
    case NodeType.Text:
      return node.text;
    case NodeType.Bold:
      return `<strong>${node.children.map(toHTML).join("")}</strong>`;
    case NodeType.Italic:
      return `<i>${node.children.map(toHTML).join("")}</i>`;
    case NodeType.Strike:
      return `<del>${node.children.map(toHTML).join("")}</del>`;
    default:
      // You can use `source` property, which every nodes have, to serialize unknown nodes as-is
      return node.source;
  }
};

console.log(toHTML(tree));

// Output:
// '<p>Slack <strong>message</strong> <del>to</del> <i>parse</i></p>'
```
