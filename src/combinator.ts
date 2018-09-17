import { Node } from '~/types/Node'
import { Parser, ParseText } from '~/types/Parser'

export const or = (parsers: Parser[]): Parser => {
  const { length } = parsers

  return (text, position, rootParser) => {
    for (let i = 0; i < length; i++) {
      const match = parsers[i](text, position, rootParser)

      if (match) {
        return match
      }
    }

    return null
  }
}

export const regexp = (
  pattern: RegExp,
  callback: (
    match: string[],
    text: string,
    position: number,
    parseText: ParseText
  ) => [Node, number] | null
): Parser => (text, position, parseText) => {
  const match = text.substring(position).match(pattern)

  if (!match) {
    return null
  }

  return callback(match, text, position, parseText)
}

export const explicit = (parser: Parser): Parser => (
  text,
  position,
  parseText
) => {
  const prevChar = text.charAt(position - 1)

  if (prevChar && !prevChar.match(/\s/)) {
    return null
  }

  return parser(text, position, parseText)
}

export const topOfLine = (parser: Parser): Parser => (
  text,
  position,
  parseText
) => {
  if (position > 0 && text.charAt(position - 1) !== '\n') {
    return null
  }

  return parser(text, position, parseText)
}
