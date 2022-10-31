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

export interface Text extends NodeBase {
  type: NodeType.Text;
  text: string;
}

export interface ChannelLink extends NodeBase {
  type: NodeType.ChannelLink;
  channelID: string;
  label?: Node[];
}

export interface UserLink extends NodeBase {
  type: NodeType.UserLink;
  userID: string;
  label?: Node[];
}

export interface URL extends NodeBase {
  type: NodeType.URL;
  url: string;
  label?: Node[];
}

export interface Command extends NodeBase {
  type: NodeType.Command;
  name: string;
  arguments: string[];
  label?: Node[];
}

export interface Emoji extends NodeBase {
  type: NodeType.Emoji;
  name: string;
  variation?: string;
}

export interface PreText extends NodeBase {
  type: NodeType.PreText;
  text: string;
}

export interface Code extends NodeBase {
  type: NodeType.Code;
  text: string;
}

export interface Italic extends NodeBase {
  type: NodeType.Italic;
  children: Node[];
}

export interface Bold extends NodeBase {
  type: NodeType.Bold;
  children: Node[];
}

export interface Strike extends NodeBase {
  type: NodeType.Strike;
  children: Node[];
}

export interface Quote extends NodeBase {
  type: NodeType.Quote;
  children: Node[];
}

export interface Root extends NodeBase {
  type: NodeType.Root;
  children: Node[];
}
