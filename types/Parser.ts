import { Node } from "./Node.ts";

export type Parser<T extends Node = Node> = (
  text: string,
  position: number,
  parseText: ParseText,
) => [T, number] | null;

export type ParseText = (text: string) => Node[];
