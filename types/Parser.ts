import { Node } from "./Node.ts";

export type Parser = (
  text: string,
  position: number,
  parseText: ParseText,
) => [Node, number] | null;

export type ParseText = (text: string) => Node[];
