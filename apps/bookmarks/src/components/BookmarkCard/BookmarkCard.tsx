import {MouseEventHandler, useState} from 'react'
import {fetchMetadata} from '../../helpers/fetchMetadata'
import {useBookmarksDispatch} from '../../store'

export function BookmarkCard({bookmark}: {bookmark: Bookmark}) {
  const dispatch = useBookmarksDispatch()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const onDelete: MouseEventHandler = evt => {
    evt.preventDefault()
    evt.stopPropagation()
    dispatch({type: 'delete', url: bookmark.url})
  }

  const onRefresh: MouseEventHandler = async evt => {
    evt.preventDefault()
    evt.stopPropagation()
    setIsRefreshing(true)
    try {
      const newData = await fetchMetadata(bookmark.url)
      dispatch({type: 'update', bookmark: newData})
    } catch (err) {
      window.alert(`${err}`)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <a
      href={bookmark.url}
      target="_blank"
      className="flex flex-column b--black ba br3 pa2 no-underline black"
      rel="noreferrer"
    >
      <h2>{bookmark.title}</h2>
      <div className="flex flex-1">
        <div className="bg-black" style={{width: '40%', height: 200}}>
          {!!bookmark.thumbnail && (
            <img
              src={bookmark.thumbnail.url}
              alt="Thumbnail"
              style={{
                objectFit: 'contain',
                width: '100%',
                height: '100%',
              }}
            />
          )}
        </div>
        <div className="flex-1">
          <ul>
            <li>Provider: {bookmark.provider}</li>
            <li>Author: {bookmark.author}</li>
          </ul>
        </div>
        <div className="flex flex-column ga1">
          <button type="button" onClick={onDelete}>
            Delete
          </button>
          <button type="button" onClick={onRefresh} disabled={isRefreshing}>
            Refresh
          </button>
        </div>
      </div>
    </a>
  )
}
