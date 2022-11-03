/**
 * `Node` interface's `type` property.
 */
export enum NodeType {
  Text,
  ChannelLink,
  UserLink,
  URL,
  Command,
  Emoji,
  PreText,
  Code,
  Italic,
  Bold,
  Strike,
  Quote,
  Root,
}

/**
 * Represents each parts of the message, its type and properties.
 *
 * Every node has two common properties: `type` and `source`.
 * You can test the `type` against `NodeType` object (which is TypeScript enum) to narrow the node type down.
 *
 * ```ts
 * import { NodeType } from "slack-message-parser";
 * import type { Node } from "slack-message-parser";
 *
 * function logChannelOrUserId(node: Node): void {
 *   switch (node.type) {
 *     case NodeType.ChannelLink:
 *       console.log(node.channelID);
 *       return;
 *     case NodeType.UserLink:
 *       console.log(node.userID);
 *       return;
 *     default:
 *       return;
 *   }
 * }
 * ```
 *
 * The names of `Node` and `NodeType` are one-to-one mapped.
 * e.g., the `type` property of a `Text` node is always `NodeType.Text`.
 *
 * `source` property contains raw unformatted text for the node.
 */
export type Node =
  | Text
  | ChannelLink
  | UserLink
  | URL
  | Command
  | Emoji
  | PreText
  | Code
  | Italic
  | Bold
  | Strike
  | Quote
  | Root;

interface NodeBase {
  type: NodeType;

  /**
   * Raw node text.
   */
  source: string;
}

/**
 * Texts.
 *
 * This node itself does not have any style-related information.
 */
export interface Text extends NodeBase {
  type: NodeType.Text;

  /**
   * Text content.
   */
  text: string;
}

/**
 * Link to a Slack channel.
 */
export interface ChannelLink extends NodeBase {
  type: NodeType.ChannelLink;

  /**
   * An ID of the destination channel.
   */
  channelID: string;

  /**
   * Label text for the link.
   *
   * The channel's name will be displayed if the label is not set.
   */
  label?: Node[];
}

/**
 * Link to a Slack user.
 */
export interface UserLink extends NodeBase {
  type: NodeType.UserLink;

  /**
   * An ID of the target user.
   */
  userID: string;

  /**
   * Label text for the link.
   *
   * The user's name will be displayed if the label is not set.
   */
  label?: Node[];
}

/**
 * Generic link.
 *
 * e.g., `https://example.com/`, `mailto:user@example.com`
 */
export interface URL extends NodeBase {
  type: NodeType.URL;

  /**
   * A URL of the link.
   */
  url: string;

  /**
   * Label text for the link.
   *
   * The URL string itself will be displayed if the label is not set.
   */
  label?: Node[];
}

/**
 * Special commands such as `<!date>`, `<!everyone>`, or `<!subteam^id|@handle>`.
 *
 * For more details, please refer to [Formatting messages | Slack](https://api.slack.com/docs/message-formatting).
 *
 * @example
 * ```ts
 * import { parse, NodeType } from "slack-message-parser";
 *
 * const tree = parse("<!subteam^FOO>");
 *
 * // {
 * //   type: NodeType.Root,
 * //   children: [
 * //     {
 * //       type: NodeType.Command,
 * //       name: "subteam",
 * //       arguments: ["FOO"],
 * //     },
 * //   ],
 * // }
 * ```
 */
export interface Command extends NodeBase {
  type: NodeType.Command;

  /**
   * A name of the command.
   */
  name: string;

  /**
   * Command arguments, which are prefixed by `^`.
   */
  arguments: string[];

  /**
   * Label text for the command.
   */
  label?: Node[];
}

/**
 * Emojis!
 */
export interface Emoji extends NodeBase {
  type: NodeType.Emoji;

  /**
   * A name of the emoji (the text between two `:`s.)
   */
  name: string;

  /**
   * Emoji variant.
   *
   * Only `skin-tone-` is currently supported.
   */
  variation?: string;
}

/**
 * Code block, multi-line codes.
 */
export interface PreText extends NodeBase {
  type: NodeType.PreText;

  /**
   * Text content.
   *
   * This node cannot contain decorative texts.
   */
  text: string;
}

/**
 * Inline code
 */
export interface Code extends NodeBase {
  type: NodeType.Code;

  /**
   * Text content.
   *
   * This node cannot contain decorative texts.
   */
  text: string;
}

/**
 * Italic text decoration context.
 */
export interface Italic extends NodeBase {
  type: NodeType.Italic;

  children: Node[];
}

/**
 * Bold text decoration context.
 */
export interface Bold extends NodeBase {
  type: NodeType.Bold;
  children: Node[];
}

/**
 * Strike-through decoration text context.
 */
export interface Strike extends NodeBase {
  type: NodeType.Strike;
  children: Node[];
}

/**
 * Block quote.
 */
export interface Quote extends NodeBase {
  type: NodeType.Quote;
  children: Node[];
}

/**
 * A node sits top of the tree.
 *
 * Every parse result has this node as its root node.
 */
export interface Root extends NodeBase {
  type: NodeType.Root;

  /**
   * A list of child nodes.
   */
  children: Node[];
}
