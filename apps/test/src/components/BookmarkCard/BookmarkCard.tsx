export function BookmarkCard({bookmark}: {bookmark: Bookmark}) {
  return (
    <div>
      <h2>{bookmark.title}</h2>
      {!!bookmark.preview && <div dangerouslySetInnerHTML={{__html: bookmark.preview}} />}
    </div>
  )
}
