import { NodeType } from "./types/Node.ts";

import { explicit, or, regexp, topOfLine } from "./combinator.ts";

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

const parseSingleLineQuote = topOfLine(
  regexp(/^&gt;(.*)(\n|$)/, (match, _text, position, parseText) => {
    const [matchedText, content] = match;

    const repeatedGt = content.match(/^((&gt;)+)(.*)$/);

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
          : parseText(content),
        source: matchedText,
      },
      position + matchedText.length,
    ];
  }),
);

const parseMultilineQuote = topOfLine(
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
);

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

const parseLink = regexp(
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
  parseMultilineQuote,
  parseSingleLineQuote,
  parseLink,
  parseStrike,
]);
