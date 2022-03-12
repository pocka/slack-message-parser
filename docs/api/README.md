# API

[[toc]]

## `function parse(message)`

Parses Slack message and returns a tree ([`Node`](#interface-node)).

### Arguments

| Name    | Type   | Description              |
| ------- | ------ | ------------------------ |
| message | String | a Slack message to parse |

### Returns

| Type | Description                            |
| ---- | -------------------------------------- |
| Root | A root node of the parsed message tree |

## `interface Node`

Represents each parts of the message, its type and properties.

Every node at least have one property, `type`.

| Name   | Type             | Description            |
| ------ | ---------------- | ---------------------- |
| type   | Number(NodeType) | Type of the node       |
| source | String           | Raw string of the node |

You can test the type with `NodeType` object (which is actually TypeScript enum).

```js
import { NodeType } from 'slack-message-parser'

switch (node.type) {
  case NodeType.Text:
  // ...
  case NodeType.ChannelLink:
  // ...
}
```

The names of Node and NodeType are one-to-one equivalent (e.g. `Text` node have `type` property that the value is `NodeType.Text`).

### `Root` node

A node sits on top of the tree. Every parse result have this node as its root node.

#### Properties

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| children | Node[] | Child nodes |

### `Text` node

Texts.

#### Properties

| Name | Type   | Description  |
| ---- | ------ | ------------ |
| text | String | Text content |

### `ChannelLink` node

Link to a channel.

#### Properties

| Name      | Type                | Description                |
| --------- | ------------------- | -------------------------- |
| channelID | String              | An ID of the channel       |
| label     | Node[] \| undefined | Display texts for the link |

### `UserLink` node

Link to a user.

#### Properties

| Name   | Type                | Description                |
| ------ | ------------------- | -------------------------- |
| userId | String              | An ID of the user          |
| label  | Node[] \| undefined | Display texts for the user |

### `URL` node

Link other than channels and users (e.g. `https://foo.bar`, `mailto:foo@bar`).

#### Properties

| Name  | Type                | Description                |
| ----- | ------------------- | -------------------------- |
| url   | String              | A link url                 |
| label | Node[] \| undefined | Display texts for the link |

### `Command` node

Special commands like `<!date>`, `<!everyone>`, `<!subteam^id|@handle>`, and more.
For more details, please refer [Formatting messages | Slack](https://api.slack.com/docs/message-formatting).

#### Properties

| Name      | Type                | Description                                                                |
| --------- | ------------------- | -------------------------------------------------------------------------- |
| name      | String              | A name of the command                                                      |
| arguments | String[]            | Command arguments(prefixed by `^`, `ID` is an argument of `<!subteam^ID>`) |
| label     | Node[] \| undefined | Display texts for the link                                                 |

### `Emoji` node

Emojis!

#### Properties

| Name      | Type                | Description                                      |
| --------- | ------------------- | ------------------------------------------------ |
| name      | String              | A name of the emoji (the text between both `:`s) |
| variation | String \| undefined | Emoji variation, currently `skin-tone-` only     |

### `PreText` node

Code block. Multi-line codes.

#### Properties

| Name | Type   | Description  |
| ---- | ------ | ------------ |
| text | String | Text content |

### `Code` node

Inline code.

#### Properties

| Name | Type   | Description  |
| ---- | ------ | ------------ |
| text | String | Text content |

### `Italic`/`Bold`/`Strike`/`Quote` node

Represents text decorations. Each nodes just have decoration information, so it acts as container (does not hold texts directly).

#### Properties

| Name     | Type   | Description |
| -------- | ------ | ----------- |
| children | Node[] | Child nodes |
