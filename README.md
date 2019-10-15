# slack-message-parser

[![npm](https://flat.badgen.net/npm/v/slack-message-parser?icon=npm)](https://www.npmjs.com/package/slack-message-parser)
[![code style: prettier](https://flat.badgen.net/badge/code%20style/prettier/ff69b4)](https://github.com/prettier/prettier)
[![travis](https://flat.badgen.net/travis/pocka/slack-message-parser?icon=travis)](https://travis-ci.com/pocka/slack-message-parser#)
[![codecov](https://flat.badgen.net/codecov/c/github/pocka/slack-message-parser?icon=codecov)](https://codecov.io/gh/pocka/slack-message-parser)
[![Status for docs deploying](https://github.com/pocka/slack-message-parser/workflows/Deploy%20Docs/badge.svg)](https://github.com/pocka/slack-message-parser/actions)

Parser library for [Slack message format](https://api.slack.com/docs/message-formatting).

## Install

```sh
npm i --save slack-message-parser
# yarn add slack-message-parser
```

## Usage

Usage with Typescript (recommended).

```ts
import slackMessageParser, { Node, NodeType } from 'slack-message-parser'

const tree = slackMessageParser('Slack *message* ~to~ _parse_')

// tree is:
// {
//   type: NodeType.Root,
//   children: [
//     {
//       type: NodeType.Text,
//       text: "Slack "
//     },
//     {
//       type: NodeType.Bold,
//       children: [
//         {
//           type: NodeType.Text,
//           text: "message"
//         }
//       ]
//     },
//     ...
//   ]
// }

// Write your own!
const toHTML = (node: Node): string => {
  switch (node.type) {
    case NodeType.Root:
      return `<p>${node.children.map(toHTML).join('')}</p>`
    case NodeType.Text:
      return node.text
    case NodeType.Bold:
      return `<strong>${node.children.map(toHTML).join('')}</strong>`
    case NodeType.Italic:
      return `<i>${node.children.map(toHTML).join('')}</i>`
    case NodeType.Strike:
      return `<del>${node.children.map(toHTML).join('')}</del>`
    default:
      return ''
  }
}

console.log(toHTML(tree))

// Output:
// '<p>Slack <strong>message</strong> <del>to</del> <i>parse</i></p>'
```
