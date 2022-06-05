import {useBookmarks} from '../../store'
import {BookmarkCard} from '../BookmarkCard'

export function BookmarkList() {
  const bookmarks = useBookmarks()
  return (
    <section>
      <ul className="pa0 ma0" style={{listStyleType: 'none'}}>
        {bookmarks.map(bookmark => (
          <li key={bookmark.url}>
            <BookmarkCard bookmark={bookmark} />
          </li>
        ))}
      </ul>
    </section>
  )
}
