import { assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts";

import { parse } from "../mod.ts";

import {
  bold,
  code,
  emoji,
  italic,
  quote,
  root,
  strike,
  text,
  url,
} from "./helpers.ts";

// https://github.com/pocka/slack-message-parser/issues/1
Deno.test(`#1 / Should parse url contains underscore`, () => {
  assertEquals(
    parse("<http://foo/bar_baz>"),
    root([url("http://foo/bar_baz")]),
  );
});

// https://github.com/pocka/slack-message-parser/issues/4
Deno.test(`#4 / Should parse correctly`, () => {
  const test =
    "This is _the_ *first* ~program~ `code of the rest of this` *file*, err, _file_, and by ~file~, I mean *file*.";

  const expected = root([
    text("This is "),
    italic([text("the")]),
    text(" "),
    bold([text("first")]),
    text(" "),
    strike([text("program")]),
    text(" "),
    code("code of the rest of this"),
    text(" "),
    bold([text("file")]),
    text(", err, "),
    italic([text("file")]),
    text(", and by "),
    strike([text("file")]),
    text(", I mean "),
    bold([text("file")]),
    text("."),
  ]);

  assertEquals(parse(test), expected);
});

// https://github.com/pocka/slack-message-parser/issues/6
Deno.test(`#6 / Treat only "skin-tone-*" as variations`, () => {
  assertEquals(parse(":a::b:"), root([emoji("a"), emoji("b")]));
});

// https://github.com/pocka/slack-message-parser/issues/13
// According to RFC 2368, spaces in mailto URL should be encoded
// but Slack accpets unencoded spaces.
Deno.test(`#13 / Parse mailto link contains spaces`, () => {
  assertEquals(
    parse("<mailto:foo@bar.baz?subject=Hello, World&body=https://foo.bar>"),
    root([
      url("mailto:foo@bar.baz?subject=Hello, World&body=https://foo.bar"),
    ]),
  );
});

// https://github.com/pocka/slack-message-parser/issues/22
Deno.test(`#22 / doesnt match colons and new lines as emojis`, () => {
  assertEquals(
    parse("Test:\nTest 2:\nTest 3:"),
    root([text("Test:\nTest 2:\nTest 3:")]),
  );
});

// https://github.com/pocka/slack-message-parser/issues/34
Deno.test(`#34 / parses bold formatting properly with various punctuation suffixes`, () => {
  assertEquals(
    parse(
      "*Y*~ *N*` *Y*! *N*@ *Y*# *Y*$ *Y*% *Y*^ *N*& *N** *N*( *Y*) *N*_ *Y*- *Y*+ *Y*= *Y*{ *Y*} *Y*[ *Y*] *N*| *N*\\ *Y*; *Y*: *Y*' *Y*\" *N*< *Y*, *N*> *Y*. *Y*? *Y*/ *Y*",
    ),
    root([
      bold([text("Y")]),
      text("~ *N*` "),
      bold([text("Y")]),
      text("! *N*@ "),
      bold([text("Y")]),
      text("# "),
      bold([text("Y")]),
      text("$ "),
      bold([text("Y")]),
      text("% "),
      bold([text("Y")]),
      text("^ *N*& *N** *N*( "),
      bold([text("Y")]),
      text(") *N*_ "),
      bold([text("Y")]),
      text("- "),
      bold([text("Y")]),
      text("+ "),
      bold([text("Y")]),
      text("= "),
      bold([text("Y")]),
      text("{ "),
      bold([text("Y")]),
      text("} "),
      bold([text("Y")]),
      text("[ "),
      bold([text("Y")]),
      text("] *N*| *N*\\ "),
      bold([text("Y")]),
      text("; "),
      bold([text("Y")]),
      text(": "),
      bold([text("Y")]),
      text("' "),
      bold([text("Y")]),
      text('" *N*< '),
      bold([text("Y")]),
      text(", *N*> "),
      bold([text("Y")]),
      text(". "),
      bold([text("Y")]),
      text("? "),
      bold([text("Y")]),
      text("/ "),
      bold([text("Y")]),
    ]),
  );
});

// https://github.com/pocka/slack-message-parser/issues/38
Deno.test(`#38 / parse multiline quote without >>>`, () => {
  const actual = parse(
    "This is unquoted text\n&gt; This is quoted text\n&gt; This is still quoted text\nThis is unquoted text again",
  );

  assertEquals(
    actual,
    root([
      text("This is unquoted text\n"),
      {
        ...quote([
          text(" This is quoted text\n"),
          text(" This is still quoted text"),
        ], true),
        source: "&gt; This is quoted text\n&gt; This is still quoted text\n",
      },
      text("This is unquoted text again"),
    ]),
  );
});
