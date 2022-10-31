import { Node, NodeType, Root } from "./types/Node.ts";
import { ParseText } from "./types/Parser.ts";

import parser from "./parser.ts";

const parseText: ParseText = (text) => {
  const children: Node[] = [];
  let textBuffer = "";

  const flush = () => {
    if (!textBuffer) {
      return;
    }

    children.push({
      type: NodeType.Text,
      text: textBuffer,
      source: textBuffer,
    });

    textBuffer = "";
  };

  let i = 0;
  const l = text.length;

  while (i < l) {
    const match = parser(text, i, parseText);

    if (match) {
      flush();

      const [node, position] = match;
      children.push(node);
      i = position;
      continue;
    }

    textBuffer += text.charAt(i);
    i += 1;
  }

  flush();

  return children;
};

export const parse = (message: string): Root => {
  return {
    type: NodeType.Root,
    children: parseText(message),
    source: message,
  };
};

export default parse;

export * from "./types/Node.ts";
