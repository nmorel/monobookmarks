import {Link} from 'react-router-dom'

export function Card({bookmark}: {bookmark: YoutubeBookmark}) {
  return (
    <Link to={`/youtube/${bookmark.slug}`}>
      <div>YouTube card | {bookmark.url}</div>
    </Link>
  )
}
