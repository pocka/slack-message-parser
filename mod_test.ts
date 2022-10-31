import { assertEquals } from "https://deno.land/std@0.161.0/testing/asserts.ts";

import { parse } from "./mod.ts";

import {
  bold,
  channel,
  code,
  command,
  emoji,
  italic,
  pre,
  quote,
  root,
  strike,
  text,
  url,
  user,
} from "./tests/helpers.ts";

Deno.test(`Should parse "foo bar" as text`, () => {
  assertEquals(parse("foo bar"), root([text("foo bar")]));
});

Deno.test('Should parse "`foo`" as code', () => {
  assertEquals(
    parse("`foo`"),
    root([code("foo")]),
  );
});

Deno.test('Should parse "` foo `" as code', () => {
  assertEquals(
    parse("` foo `"),
    root([code(" foo ")]),
  );
});

Deno.test('Should parse "```foo```" as pretext', () => {
  assertEquals(
    parse("```foo```"),
    root([pre("foo")]),
  );
});

Deno.test('Should parse "``` foo ```" as pretext', () => {
  assertEquals(
    parse("``` foo ```"),
    root([pre(" foo ")]),
  );
});

Deno.test('Should parse "``` foo ``` bar ``` baz ```" as two pretexts', () => {
  assertEquals(
    parse("``` foo ``` bar ``` baz ```"),
    root([pre(" foo "), text(" bar "), pre(" baz ")]),
  );
});

Deno.test('Should not parse "``` ```" as pretext', () => {
  assertEquals(parse("``` ```"), root([text("``` ```")]));
});

Deno.test('Should not parse "foo```bar```baz" as pretext', () => {
  assertEquals(parse("foo```bar```baz"), root([text("foo```bar```baz")]));
});

Deno.test('Should parse "*foo*" as bold', () => {
  assertEquals(parse("*foo*"), root([bold([text("foo")])]));
});

Deno.test('Should parse "foo *bar* baz" as bold', () => {
  assertEquals(
    parse("foo *bar* baz"),
    root([text("foo "), bold([text("bar")]), text(" baz")]),
  );
});

Deno.test('Should not parse "foo*bar*baz" as bold', () => {
  assertEquals(parse("foo*bar*baz"), root([text("foo*bar*baz")]));
});

Deno.test('Should not parse "*foo*bar" as bold', () => {
  assertEquals(parse("*foo*bar"), root([text("*foo*bar")]));
});

Deno.test('Should not parse "foo * bar * baz" as bold', () => {
  assertEquals(parse("foo * bar * baz"), root([text("foo * bar * baz")]));
});

Deno.test('Should parse "Hey, <@FOO>!" as user link', () => {
  assertEquals(
    parse("Hey, <@FOO>!"),
    root([text("Hey, "), user("FOO"), text("!")]),
  );
});

Deno.test('Should parse "Goto <#FOO>?" as channel link', () => {
  assertEquals(
    parse("Goto <#FOO>?"),
    root([text("Goto "), channel("FOO"), text("?")]),
  );
});

Deno.test('Should parse "foo <!bar> baz" as command', () => {
  assertEquals(
    parse("foo <!bar> baz"),
    root([text("foo "), command("bar", []), text(" baz")]),
  );
});

Deno.test("Should parse command arguments", () => {
  assertEquals(parse("<!foo^bar>"), root([command("foo", ["bar"])]));
});

Deno.test('Should parse "Visit <http://foo.bar> or email to <mailto:foo@bar>" as url', () => {
  const expected = root([
    text("Visit "),
    url("http://foo.bar"),
    text(" or email to "),
    url("mailto:foo@bar"),
  ]);

  assertEquals(
    parse("Visit <http://foo.bar> or email to <mailto:foo@bar>"),
    expected,
  );
});

Deno.test("Should not allow nested link", () => {
  assertEquals(
    parse("<http://foo|<http://bar>>"),
    root([text("<http://foo|"), url("http://bar"), text(">")]),
  );
});

Deno.test("Should parse label", () => {
  assertEquals(
    parse("<http://foo|bar>"),
    root([url("http://foo", [text("bar")])]),
  );
});

Deno.test("Should allow formated text in label", () => {
  const expected = root([
    url("http://foo", [bold([text("bar "), strike([text("baz")])])]),
  ]);

  assertEquals(parse("<http://foo|*bar ~baz~*>"), expected);
});

Deno.test('Should parse "foo :bar: baz" as emoji', () => {
  assertEquals(
    parse("foo :bar: baz"),
    root([text("foo "), emoji("bar"), text(" baz")]),
  );
});

Deno.test("Should parse emoji with skin-tone variation", () => {
  assertEquals(
    parse(":foo::skin-tone-1:"),
    root([emoji("foo", "skin-tone-1")]),
  );
});

Deno.test("Should parse sequential emojis", () => {
  assertEquals(
    parse("ab:cd::ef::skin-tone-1:g:h::i:jk"),
    root([
      text("ab"),
      emoji("cd"),
      emoji("ef", "skin-tone-1"),
      text("g"),
      emoji("h"),
      emoji("i"),
      text("jk"),
    ]),
  );
});

Deno.test('Should parse "foo:bar:baz" as emoji', () => {
  assertEquals(
    parse("foo:bar:baz"),
    root([text("foo"), emoji("bar"), text("baz")]),
  );
});

Deno.test("Should not parse invalid emoji names", () => {
  assertEquals(
    parse("(11/3 - 4:30pm): ok"),
    root([text("(11/3 - 4:30pm): ok")]),
  );
});

Deno.test("Should parse quote text", () => {
  assertEquals(
    parse("&gt; foo *bar*"),
    root([quote([text(" foo "), bold([text("bar")])], true)]),
  );
});

Deno.test("Should parse quote located in second line", () => {
  assertEquals(
    parse("foo\n&gt;bar"),
    root([text("foo\n"), quote([text("bar")], true)]),
  );
});

Deno.test("Should parse multiline quote", () => {
  assertEquals(
    parse("foo\n&gt;&gt;&gt;bar\n\nbaz"),
    root([text("foo\n"), quote([text("bar\n\nbaz")])]),
  );
});

Deno.test('Should not parse "foo&gt;bar" as quote', () => {
  assertEquals(parse("foo&gt;bar"), root([text("foo&gt;bar")]));
});

Deno.test('Should parse "&gt;&gt;&gt;" as quoted "&gt;&gt;"', () => {
  assertEquals(parse("&gt;&gt;&gt;"), root([quote([text("&gt;&gt;")], true)]));
});

Deno.test('Should delimit with "?"', () => {
  assertEquals(parse("*foo*?"), root([bold([text("foo")]), text("?")]));
});

Deno.test('Should delimit with "!"', () => {
  assertEquals(parse("*foo*!"), root([bold([text("foo")]), text("!")]));
});

Deno.test('Should delimit with "."', () => {
  assertEquals(parse("*foo*."), root([bold([text("foo")]), text(".")]));
});

Deno.test('Should delimit with "()"', () => {
  assertEquals(
    parse("(*foo*)"),
    root([text("("), bold([text("foo")]), text(")")]),
  );

  assertEquals(parse(")*foo*("), root([text(")*foo*(")]));
});

Deno.test('Should delimit with "[]"', () => {
  assertEquals(
    parse("[*foo*]"),
    root([text("["), bold([text("foo")]), text("]")]),
  );

  assertEquals(parse("]*foo*["), root([text("]*foo*[")]));
});

Deno.test('Should delimit with "{}"', () => {
  assertEquals(
    parse("{*foo*}"),
    root([text("{"), bold([text("foo")]), text("}")]),
  );

  assertEquals(parse("}*foo*{"), root([text("}*foo*{")]));
});

Deno.test('Should delimit with "-" or "="', () => {
  assertEquals(
    parse("-*foo*="),
    root([text("-"), bold([text("foo")]), text("=")]),
  );
});

Deno.test("Should parse slack message", () => {
  const expected = root([
    user("FOO", [
      text("abc "),
      strike([
        text("def "),
        italic([
          text("ghi "),
          bold([text("jkl "), emoji("+1")]),
          text(" mno"),
        ]),
        text(" pqr"),
      ]),
      text(" stu "),
      pre("vwx"),
    ]),
  ]);

  assertEquals(
    parse("<@FOO|abc ~def _ghi *jkl :+1:* mno_ pqr~ stu ```vwx```>"),
    expected,
  );
});
