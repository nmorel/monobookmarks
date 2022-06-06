import {Suspense} from 'react'
import {getRemoteComponent} from '../../helpers/loadRemote'
import {useBookmarks} from '../../store'
import {BookmarkCard} from '../BookmarkCard'

export function BookmarkList() {
  const bookmarks = useBookmarks()
  return (
    <section>
      <ul className="flex flex-column ga2 pa2 ma0" style={{listStyleType: 'none'}}>
        {bookmarks.map(bookmark => {
          if (bookmark.provider === 'YouTube') {
            const Component = getRemoteComponent('youtube', 'Card')
            return (
              <li key={bookmark.url}>
                <Suspense fallback={null}>
                  <Component bookmark={bookmark} />
                </Suspense>
              </li>
            )
          } else {
            return (
              <li key={bookmark.url}>
                <BookmarkCard bookmark={bookmark} />
              </li>
            )
          }
        })}
      </ul>
    </section>
  )
}
