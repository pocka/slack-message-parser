import { Node, NodeType } from "../types/Node.ts";

function source(children: Node[]): string {
  return children.map((c) => c.source).join("");
}

export const root = (children: Node[]): Node => ({
  type: NodeType.Root,
  children,
  source: source(children),
});

export const text = (t: string): Node => ({
  type: NodeType.Text,
  text: t,
  source: t,
});

export const strike = (children: Node[]): Node => ({
  type: NodeType.Strike,
  children,
  source: `~${source(children)}~`,
});

export const italic = (children: Node[]): Node => ({
  type: NodeType.Italic,
  children,
  source: `_${source(children)}_`,
});

export const bold = (children: Node[]): Node => ({
  type: NodeType.Bold,
  children,
  source: `*${source(children)}*`,
});

export const code = (text: string): Node => ({
  type: NodeType.Code,
  text,
  source: "`" + text + "`",
});

export const pre = (text: string): Node => ({
  type: NodeType.PreText,
  text,
  source: "```" + text + "```",
});

export const user = (userID: string, label?: Node[]): Node => ({
  type: NodeType.UserLink,
  userID,
  label,
  source: `<@${userID}${label ? "|" + source(label) : ""}>`,
});

export const channel = (channelID: string, label?: Node[]): Node => ({
  type: NodeType.ChannelLink,
  channelID,
  label,
  source: `<#${channelID}${label ? "|" + source(label) : ""}>`,
});

export const command = (
  name: string,
  args: string[],
  label?: Node[],
): Node => ({
  type: NodeType.Command,
  name,
  arguments: args,
  label,
  source: `<!${name}${args.map((c) => `^${c}`).join("")}${
    label ? "|" + source(label) : ""
  }>`,
});

export const url = (link: string, label?: Node[]): Node => ({
  type: NodeType.URL,
  url: link,
  label,
  source: `<${link}${label ? "|" + source(label) : ""}>`,
});

export const emoji = (name: string, variation?: string): Node => ({
  type: NodeType.Emoji,
  name,
  variation,
  source: `:${name}${variation ? "::" + variation : ""}:`,
});

export const quote = (children: Node[], inline?: boolean): Node => ({
  type: NodeType.Quote,
  children,
  source: `${"&gt;".repeat(inline ? 1 : 3)}${source(children)}`,
});
