import { type Node, NodeType, type Quote } from "./types/Node.ts";

import { explicit, oneOrMore, or, regexp, topOfLine } from "./combinator.ts";

const parseBold = explicit(
  regexp(
    /^\*(\S([^*\n]*?|[^*\n]*? `.*?` )[^\s*]|\S)\*(?=[\s~!#$%^)\-+={}[\];:'",.?/]|$)/,
    (match, _text, position, parseText) => {
      const [matchedText, content] = match;

      return [
        {
          type: NodeType.Bold,
          children: parseText(content),
          source: matchedText,
        },
        position + matchedText.length,
      ];
    },
  ),
);

const parseCode = explicit(
  regexp(/^`([^`]+?)`(?=[\s.,\])}!?\-=]|$)/, (match, _text, position) => {
    const [matchedText, content] = match;

    return [
      {
        type: NodeType.Code,
        text: content,
        source: matchedText,
      },
      position + matchedText.length,
    ];
  }),
);

const parsePreText = explicit(
  regexp(
    /^```(\s*\S[\s\S]*?\s*)```(?=[\s.,\])}!?\-=]|$)/,
    (match, _text, position) => {
      const [matchedText, content] = match;

      return [
        {
          type: NodeType.PreText,
          text: content,
          source: matchedText,
        },
        position + matchedText.length,
      ];
    },
  ),
);

const parseItalic = explicit(
  regexp(
    /^_(\S([^_\n]*?|[^_\n]*? `.*?` )\S|\S)\_(?=[\s.,\])}!?\-=]|$)/,
    (match, _text, position, parseText) => {
      const [matchedText, content] = match;

      return [
        {
          type: NodeType.Italic,
          children: parseText(content),
          source: matchedText,
        },
        position + matchedText.length,
      ];
    },
  ),
);

const parseStrike = explicit(
  regexp(
    /^~(\S([^~\n]*?|[^~\n]*? `.*?` )\S|\S)\~(?=[\s.,\])}!?\-=]|$)/,
    (match, _text, position, parseText) => {
      const [matchedText, content] = match;

      return [
        {
          type: NodeType.Strike,
          children: parseText(content),
          source: matchedText,
        },
        position + matchedText.length,
      ];
    },
  ),
);

const parseQuoteLine = topOfLine(
  regexp(/^&gt;(.*)(\n&gt;|\n|$)/, (match, _text, position, parseText) => {
    const [matchedText, content] = match;

    const repeatedGt = content.match(/^((&gt;)+)(.*)$/);

    // If the next line is also starts with ">", do not include the character
    // (simulating RegExp's non-capturing group)
    const source = matchedText.replace(/\n&gt;$/, "\n");

    // `source` and `matchedText` are same unless the next line starts with ">"
    // due to the above line removes the ">".
    const isNextLineStartsWithGt = source !== matchedText;

    return [
      {
        type: NodeType.Quote,
        children: repeatedGt
          ? [
            {
              type: NodeType.Text,
              text: repeatedGt[1],
              source: repeatedGt[1],
            },
            ...parseText(repeatedGt[3]),
          ]
          // Only the last LF could be a terminator character of quote.
          // Non-last LFs should be parsed as well as `content`.
          : parseText(isNextLineStartsWithGt ? content + "\n" : content),
        source,
      },
      position + source.length,
    ];
  }),
);

const parseQuote = or([
  topOfLine(
    regexp(/^&gt;&gt;&gt;([\s\S]+)$/, (match, _text, position, parseText) => {
      const [matchedText, content] = match;

      return [
        {
          type: NodeType.Quote,
          children: parseText(content),
          source: matchedText,
        },
        position + matchedText.length,
      ];
    }),
  ),
  oneOrMore<Quote, Quote>(parseQuoteLine, (quotes) => {
    return {
      type: NodeType.Quote,
      children: quotes.map((quote) => quote.children).flat(),
      source: quotes.map((quote) => quote.source).join(""),
    };
  }),
]);

const parseEmoji = regexp(
  /^:([^:<`*#@!\s()$%]+):(:(skin-tone-.+?):)?/,
  (match, _text, position) => {
    const [matchedText, name, _, variation] = match;

    return [
      {
        type: NodeType.Emoji,
        name,
        variation,
        source: matchedText,
      },
      position + matchedText.length,
    ];
  },
);

const parseLink = regexp<Node>(
  /^<([^\s<>][^\n<>]*?)(\|([^<>]+?))?>/,
  (match, _text, position, parseText) => {
    const [matchedText, link, _, label] = match;
    const nextPosition = position + matchedText.length;
    const labelNodes = label ? parseText(label) : undefined;

    switch (link.charAt(0)) {
      case "@":
        return [
          {
            type: NodeType.UserLink,
            userID: link.slice(1),
            label: labelNodes,
            source: matchedText,
          },
          nextPosition,
        ];
      case "#":
        return [
          {
            type: NodeType.ChannelLink,
            channelID: link.slice(1),
            label: labelNodes,
            source: matchedText,
          },
          nextPosition,
        ];
      case "!": {
        const [commandName, ...args] = link.slice(1).split("^");

        return [
          {
            type: NodeType.Command,
            name: commandName,
            arguments: args,
            label: labelNodes,
            source: matchedText,
          },
          nextPosition,
        ];
      }
      default:
        return [
          {
            type: NodeType.URL,
            url: link,
            label: labelNodes,
            source: matchedText,
          },
          nextPosition,
        ];
    }
  },
);

export default or([
  parseBold,
  parsePreText,
  parseCode,
  parseEmoji,
  parseItalic,
  parseQuote,
  parseLink,
  parseStrike,
]);
