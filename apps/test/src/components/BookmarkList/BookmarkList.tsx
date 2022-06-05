import {useBookmarks} from '../../store'
import {BookmarkCard} from '../BookmarkCard'

export function BookmarkList() {
  const bookmarks = useBookmarks()
  return (
    <section>
      <ul className="flex flex-column ga2 pa2 ma0" style={{listStyleType: 'none'}}>
        {bookmarks.map(bookmark => (
          <li key={bookmark.url}>
            <BookmarkCard bookmark={bookmark} />
          </li>
        ))}
      </ul>
    </section>
  )
}
