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
})

describe('Emoji parser', () => {
  it('Should parse "foo :bar: baz" as emoji', () => {
    expect(parse('foo :bar: baz')).toEqual(
      root([text('foo '), emoji('bar'), text(' baz')])
    )
  })

  it('Should parse emoji with variation', () => {
    expect(parse(':foo::bar:')).toEqual(root([emoji('foo', 'bar')]))
  })

  it('Should parse "foo:bar:baz" as emoji', () => {
    expect(parse('foo:bar:baz')).toEqual(
      root([text('foo'), emoji('bar'), text('baz')])
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
