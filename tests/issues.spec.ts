import { parse } from '../src'

import { bold, code, emoji, italic, url, root, strike, text } from './helpers'

describe('#4', () => {
  it('Should parse correctly', () => {
    const test =
      'This is _the_ *first* ~program~ `code of the rest of this` *file*, err, _file_, and by ~file~, I mean *file*.'

    const expected = root([
      text('This is '),
      italic([text('the')]),
      text(' '),
      bold([text('first')]),
      text(' '),
      strike([text('program')]),
      text(' '),
      code('code of the rest of this'),
      text(' '),
      bold([text('file')]),
      text(', err, '),
      italic([text('file')]),
      text(', and by '),
      strike([text('file')]),
      text(', I mean '),
      bold([text('file')]),
      text('.')
    ])

    expect(parse(test)).toEqual(expected)
  })
})

describe('#6', () => {
  it('Treat only "skin-tone-*" as variations', () => {
    expect(parse(':a::b:')).toEqual(root([emoji('a'), emoji('b')]))
  })
})

// https://github.com/pocka/slack-message-parser/issues/13
describe('#13', () => {
  // According to RFC 2368, spaces in mailto URL should be encoded
  // but Slack accpets unencoded spaces.
  it('Parse mailto link contains spaces', () => {
    expect(
      parse('<mailto:foo@bar.baz?subject=Hello, World&body=https://foo.bar>')
    ).toEqual(
      root([
        url('mailto:foo@bar.baz?subject=Hello, World&body=https://foo.bar')
      ])
    )
  })
})

describe('#22', () => {
  it('doesnt match colons and new lines as emojis', () => {
    expect(parse('Test:\nTest 2:\nTest 3:')).toEqual(
      root([text('Test:\nTest 2:\nTest 3:')])
    )
  })
})
