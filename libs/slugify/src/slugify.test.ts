import {slugify, uniqSlug} from '.'

describe('slugify', () => {
  it('should return a slug with correct format', () => {
    expect(slugify('Grenzo VS Grist - MTG EDH Duel Commander Cartes Magic')).toEqual(
      'grenzo-vs-grist-mtg-edh-duel-commander-cartes-magic'
    )
    expect(slugify('Jurassic Park III, 2001 - ★★★')).toEqual('jurassic-park-iii-2001')
    expect(slugify(`Breizhcamp - La conférence à l'ouest`)).toEqual(
      'breizhcamp-la-conference-a-louest'
    )
  })
})

describe('uniqSlug', () => {
  it('should return a slug ending with "-1" when no duplicate', () => {
    expect(uniqSlug('Conférence', [], t => t)).toEqual('conference-1')
    expect(uniqSlug('Conférence', ['conference-a-louest-1', 'test-1'], t => t)).toEqual(
      'conference-1'
    )
  })
  it('should return an unique slug when duplicate', () => {
    expect(
      uniqSlug(
        'Conférence',
        ['conference-1', 'test-1', 'conference-a-louest-1', 'conference-2'],
        t => t
      )
    ).toEqual('conference-3')
  })
  it('should return an unique slug when duplicate with hole in number', () => {
    expect(
      uniqSlug(
        'Conférence',
        ['conference-3', 'test-1', 'conference-a-louest-1', 'conference-2'],
        t => t
      )
    ).toEqual('conference-4')
  })
  it('should return an unique slug suffixed with highest number', () => {
    expect(
      uniqSlug(
        'Conférence',
        ['conference-3', 'test-1', 'conference-a-louest-1', 'conference-20'],
        t => t
      )
    ).toEqual('conference-21')
  })
})
