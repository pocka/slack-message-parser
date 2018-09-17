import { Node, NodeType } from '~/types/Node'

export const root = (children: Node[]): Node => ({
  type: NodeType.Root,
  children
})

export const text = (t: string): Node => ({
  type: NodeType.Text,
  text: t
})

export const strike = (children: Node[]): Node => ({
  type: NodeType.Strike,
  children
})

export const italic = (children: Node[]): Node => ({
  type: NodeType.Italic,
  children
})

export const bold = (children: Node[]): Node => ({
  type: NodeType.Bold,
  children
})

export const code = (text: string): Node => ({
  type: NodeType.Code,
  text
})

export const pre = (text: string): Node => ({
  type: NodeType.PreText,
  text
})

export const user = (userID: string, label?: Node[]): Node => ({
  type: NodeType.UserLink,
  userID,
  label
})

export const channel = (channelID: string, label?: Node[]): Node => ({
  type: NodeType.ChannelLink,
  channelID,
  label
})

export const command = (
  name: string,
  args: string[],
  label?: Node[]
): Node => ({
  type: NodeType.Command,
  name,
  arguments: args,
  label
})

export const url = (link: string, label?: Node[]): Node => ({
  type: NodeType.URL,
  url: link,
  label
})

export const emoji = (name: string, variation?: string): Node => ({
  type: NodeType.Emoji,
  name,
  variation
})

export const quote = (children: Node[]): Node => ({
  type: NodeType.Quote,
  children
})
