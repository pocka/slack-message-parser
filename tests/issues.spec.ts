import { parse } from '../src'

import { bold, code, italic, root, strike, text } from './helpers'

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
