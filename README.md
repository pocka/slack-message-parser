# slack-message-parser

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
//   "type": NodeType.Root,
//   "children": [
//     {
//       "type": NodeType.Text,
//       "text": "Slack "
//     },
//     {
//       "type": NodeType.Bold,
//       "children": [
//         {
//           "type": NodeType.Text,
//           "text": "message"
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
      return `<span>${node.text}</span>`
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
// '<p><span>Slack </span><strong><span>message</span></strong><span> </span><del><span>to</span></del><span> </span><i><span>parse</span></i></p>'
```
