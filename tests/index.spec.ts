import { parse } from '../src'

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
  user
} from './helpers'

describe('Text parser', () => {
  it('Should parse "foo bar" as text', () => {
    expect(parse('foo bar')).toEqual(root([text('foo bar')]))
  })
})

describe('Code parser', () => {
  it('Should parse "`foo`" as code', () => {
    expect(parse('`foo`')).toEqual(root([code('foo')]))
  })

  it('Should parse "` foo `" as code', () => {
    expect(parse('` foo `')).toEqual(root([code(' foo ')]))
  })
})

describe('PreText parser', () => {
  it('Should parse "```foo```" as pretext', () => {
    expect(parse('```foo```')).toEqual(root([pre('foo')]))
  })

  it('Should parse "``` foo ```" as pretext', () => {
    expect(parse('``` foo ```')).toEqual(root([pre(' foo ')]))
  })

  it('Should parse "``` foo ``` bar ``` baz ```" as two pretexts', () => {
    expect(parse('``` foo ``` bar ``` baz ```')).toEqual(
      root([pre(' foo '), text(' bar '), pre(' baz ')])
    )
  })

  it('Should not parse "``` ```" as pretext', () => {
    expect(parse('``` ```')).toEqual(root([text('``` ```')]))
  })

  it('Should not parse "foo```bar```baz" as pretext', () => {
    expect(parse('foo```bar```baz')).toEqual(root([text('foo```bar```baz')]))
  })
})

describe('Bold parser', () => {
  it('Should parse "*foo*" as bold', () => {
    expect(parse('*foo*')).toEqual(root([bold([text('foo')])]))
  })

  it('Should parse "foo *bar* baz" as bold', () => {
    expect(parse('foo *bar* baz')).toEqual(
      root([text('foo '), bold([text('bar')]), text(' baz')])
    )
  })

  it('Should not parse "foo*bar*baz" as bold', () => {
    expect(parse('foo*bar*baz')).toEqual(root([text('foo*bar*baz')]))
  })

  it('Should not parse "*foo*bar" as bold', () => {
    expect(parse('*foo*bar')).toEqual(root([text('*foo*bar')]))
  })

  it('Should not parse "foo * bar * baz" as bold', () => {
    expect(parse('foo * bar * baz')).toEqual(root([text('foo * bar * baz')]))
  })
})

describe('Link parser', () => {
  it('Should parse "Hey, <@FOO>!" as user link', () => {
    expect(parse('Hey, <@FOO>!')).toEqual(
      root([text('Hey, '), user('FOO'), text('!')])
    )
  })

  it('Should parse "Goto <#FOO>?" as channel link', () => {
    expect(parse('Goto <#FOO>?')).toEqual(
      root([text('Goto '), channel('FOO'), text('?')])
    )
  })

  it('Should parse "foo <!bar> baz" as command', () => {
    expect(parse('foo <!bar> baz')).toEqual(
      root([text('foo '), command('bar', []), text(' baz')])
    )
  })

  it('Should parse command arguments', () => {
    expect(parse('<!foo^bar>')).toEqual(root([command('foo', ['bar'])]))
  })

  it('Should parse "Visit <http://foo.bar> or email to <mailto:foo@bar>" as url', () => {
    const expected = root([
      text('Visit '),
      url('http://foo.bar'),
      text(' or email to '),
      url('mailto:foo@bar')
    ])

    expect(
      parse('Visit <http://foo.bar> or email to <mailto:foo@bar>')
    ).toEqual(expected)
  })

  // https://github.com/pocka/slack-message-parser/issues/1
  it('Should parse url contains underscore', () => {
    expect(parse('<http://foo/bar_baz>')).toEqual(
      root([url('http://foo/bar_baz')])
    )
  })

  it('Should not allow nested link', () => {
    expect(parse('<http://foo|<http://bar>>')).toEqual(
      root([text('<http://foo|'), url('http://bar'), text('>')])
    )
  })

  it('Should parse label', () => {
    expect(parse('<http://foo|bar>')).toEqual(
      root([url('http://foo', [text('bar')])])
    )
  })

  it('Should allow formated text in label', () => {
    const expected = root([
      url('http://foo', [bold([text('bar '), strike([text('baz')])])])
    ])

    expect(parse('<http://foo|*bar ~baz~*>')).toEqual(expected)
  })
})

describe('Emoji parser', () => {
  it('Should parse "foo :bar: baz" as emoji', () => {
    expect(parse('foo :bar: baz')).toEqual(
      root([text('foo '), emoji('bar'), text(' baz')])
    )
  })

  it('Should parse emoji with skin-tone variation', () => {
    expect(parse(':foo::skin-tone-1:')).toEqual(
      root([emoji('foo', 'skin-tone-1')])
    )
  })

  it('Should parse sequential emojis', () => {
    expect(parse('ab:cd::ef::skin-tone-1:g:h::i:jk')).toEqual(
      root([
        text('ab'),
        emoji('cd'),
        emoji('ef', 'skin-tone-1'),
        text('g'),
        emoji('h'),
        emoji('i'),
        text('jk')
      ])
    )
  })

  it('Should parse "foo:bar:baz" as emoji', () => {
    expect(parse('foo:bar:baz')).toEqual(
      root([text('foo'), emoji('bar'), text('baz')])
    )
  })

  it('Should not parse invalid emoji names', () => {
    expect(parse('(11/3 - 4:30pm): ok')).toEqual(
      root([text('(11/3 - 4:30pm): ok')])
    )
  })
})

describe('Quote parser', () => {
  it('Should parse quote text', () => {
    expect(parse('&gt; foo *bar*')).toEqual(
      root([quote([text(' foo '), bold([text('bar')])])])
    )
  })

  it('Should parse quote locate in second line', () => {
    expect(parse('foo\n&gt;bar')).toEqual(
      root([text('foo\n'), quote([text('bar')])])
    )
  })

  it('Should parse multiline quote', () => {
    expect(parse('foo\n&gt;&gt;&gt;bar\n\nbaz')).toEqual(
      root([text('foo\n'), quote([text('bar\n\nbaz')])])
    )
  })

  it('Should not parse "foo&gt;bar" as quote', () => {
    expect(parse('foo&gt;bar')).toEqual(root([text('foo&gt;bar')]))
  })

  it('Should parse "&gt;&gt;&gt;" as quoted "&gt;&gt;"', () => {
    expect(parse('&gt;&gt;&gt;')).toEqual(root([quote([text('&gt;&gt;')])]))
  })
})

describe('Punctuations', () => {
  it('Should delimit with "?"', () => {
    expect(parse('*foo*?')).toEqual(root([bold([text('foo')]), text('?')]))
  })

  it('Should delimit with "!"', () => {
    expect(parse('*foo*!')).toEqual(root([bold([text('foo')]), text('!')]))
  })

  it('Should delimit with "."', () => {
    expect(parse('*foo*.')).toEqual(root([bold([text('foo')]), text('.')]))
  })

  it('Should delimit with "()"', () => {
    expect(parse('(*foo*)')).toEqual(
      root([text('('), bold([text('foo')]), text(')')])
    )
    expect(parse(')*foo*(')).toEqual(root([text(')*foo*(')]))
  })

  it('Should delimit with "[]"', () => {
    expect(parse('[*foo*]')).toEqual(
      root([text('['), bold([text('foo')]), text(']')])
    )
    expect(parse(']*foo*[')).toEqual(root([text(']*foo*[')]))
  })

  it('Should delimit with "{}"', () => {
    expect(parse('{*foo*}')).toEqual(
      root([text('{'), bold([text('foo')]), text('}')])
    )
    expect(parse('}*foo*{')).toEqual(root([text('}*foo*{')]))
  })

  it('Should delimit with "-" or "="', () => {
    expect(parse('-*foo*=')).toEqual(
      root([text('-'), bold([text('foo')]), text('=')])
    )
  })
})

describe('Root parser', () => {
  it('Should parse slack message', () => {
    const expected = root([
      user('FOO', [
        text('abc '),
        strike([
          text('def '),
          italic([
            text('ghi '),
            bold([text('jkl '), emoji('+1')]),
            text(' mno')
          ]),
          text(' pqr')
        ]),
        text(' stu '),
        pre('vwx')
      ])
    ])

    expect(
      parse('<@FOO|abc ~def _ghi *jkl :+1:* mno_ pqr~ stu ```vwx```>')
    ).toEqual(expected)
  })
})
