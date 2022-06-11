import {uniqSlug} from '@nimo/slugify'
import {createContext, Dispatch, PropsWithChildren, useContext, useReducer} from 'react'

type Action =
  | {
      type: 'add'
      bookmark: BookmarkData
    }
  | {
      type: 'update'
      bookmark: BookmarkData
    }
  | {
      type: 'delete'
      url: string
    }

const BookmarksContext = createContext<Bookmark[] | null>(null)
const BookmarksDispatchContext = createContext<Dispatch<Action> | null>(null)

function reducer(state: Bookmark[], action: Action) {
  switch (action.type) {
    case 'add': {
      const alreadyPresentBookmark = state.find(bk => bk.url === action.bookmark.url)
      const otherBookmarks = state.filter(bk => bk.url !== action.bookmark.url)
      let slug: string
      if (alreadyPresentBookmark) {
        slug = alreadyPresentBookmark.slug
      } else {
        slug = uniqSlug(action.bookmark.title, otherBookmarks, bk => bk.slug)
      }
      return [{...action.bookmark, slug}, ...otherBookmarks]
    }
    case 'update': {
      return state.map(bk => {
        if (bk.url !== action.bookmark.url) return bk
        return {
          ...bk,
          ...action.bookmark,
        }
      })
    }
    case 'delete': {
      return state.filter(bk => bk.url !== action.url)
    }
  }
}

export function Store({
  initialValues = [],
  children,
}: PropsWithChildren<{initialValues?: Bookmark[]}>) {
  const [bookmarks, dispatch] = useReducer(reducer, initialValues)
  return (
    <BookmarksDispatchContext.Provider value={dispatch}>
      <BookmarksContext.Provider value={bookmarks}>{children}</BookmarksContext.Provider>
    </BookmarksDispatchContext.Provider>
  )
}

export function useBookmarks(): Bookmark[] {
  const bookmarks = useContext(BookmarksContext)
  if (!bookmarks) throw new Error('Use Store before calling this hook')
  return bookmarks
}

export function useBookmarksDispatch(): Dispatch<Action> {
  const dispatch = useContext(BookmarksDispatchContext)
  if (!dispatch) throw new Error('Use Store before calling this hook')
  return dispatch
}
