import { Node } from "./types/Node.ts";
import { Parser, ParseText } from "./types/Parser.ts";

export const or = (parsers: Parser[]): Parser => {
  const { length } = parsers;

  return (text, position, rootParser) => {
    for (let i = 0; i < length; i++) {
      const match = parsers[i](text, position, rootParser);

      if (match) {
        return match;
      }
    }

    return null;
  };
};

export const oneOrMore = <A extends Node, B extends Node>(
  parser: Parser<A>,
  andThen: (nodes: readonly A[]) => B,
): Parser<B> => {
  const rec = (
    text: string,
    position: number,
    rootParser: ParseText,
  ): readonly NonNullable<ReturnType<typeof parser>>[] => {
    const match = parser(text, position, rootParser);
    if (!match) {
      return [];
    }

    const [, nextPosition] = match;

    return [match, ...rec(text, nextPosition, rootParser)];
  };

  return (text, position, rootParser) => {
    const ret = rec(text, position, rootParser);

    if (ret.length === 0) {
      return null;
    }

    const [, lastPosition] = ret[ret.length - 1];

    return [andThen(ret.map(([a]) => a)), lastPosition];
  };
};

export const regexp = <T extends Node = Node>(
  pattern: RegExp,
  callback: (
    match: string[],
    text: string,
    position: number,
    parseText: ParseText,
  ) => [T, number] | null,
): Parser<T> =>
(text, position, parseText) => {
  const match = text.substring(position).match(pattern);

  if (!match) {
    return null;
  }

  return callback(match, text, position, parseText);
};

export const explicit = (parser: Parser): Parser =>
(
  text,
  position,
  parseText,
) => {
  const prevChar = text.charAt(position - 1);

  if (prevChar && !prevChar.match(/[\s.,([{!?\-=]/)) {
    return null;
  }

  return parser(text, position, parseText);
};

export const topOfLine =
  <T extends Node = Node>(parser: Parser<T>): Parser<T> =>
  (
    text,
    position,
    parseText,
  ) => {
    if (position > 0 && text.charAt(position - 1) !== "\n") {
      return null;
    }

    return parser(text, position, parseText);
  };
