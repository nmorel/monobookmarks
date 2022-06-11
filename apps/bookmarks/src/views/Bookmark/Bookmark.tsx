import {Suspense} from 'react'
import {useParams} from 'react-router-dom'
import {getRemoteComponent} from '../../helpers/loadRemote'
import {useBookmarks} from '../../store'

export function Bookmark() {
  const {provider, slug} = useParams<{provider: string; slug: string}>()
  const bookmarks = useBookmarks()

  if (!provider || !slug) return null

  const bookmark = bookmarks.find(bk => bk.slug === slug)
  if (!bookmark) return null

  const Component = getRemoteComponent(provider, 'Card')
  return (
    <Suspense fallback={null}>
      <Component bookmark={bookmark} />
    </Suspense>
  )
}
