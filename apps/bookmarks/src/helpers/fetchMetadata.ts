export async function fetchMetadata(url: string): Promise<BookmarkData> {
  let response: any = null
  try {
    response = await (
      await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`)
    ).json()
  } catch (err) {
    console.error(err)
    throw new Error('Sorry, an error occured while fetching the data. Please try again later.')
  }

  if (
    !response ||
    response.error ||
    !['photo', 'video'].includes(response.type) ||
    !response.width ||
    !response.height ||
    !response.html
  ) {
    throw new Error('Invalid link. Only photo and video providers is supported')
  }

  let thumbnail: Bookmark['thumbnail'] = null
  if (response.thumbnail_url && response.thumbnail_width && response.thumbnail_height) {
    thumbnail = {
      url: response.thumbnail_url,
      width: response.thumbnail_width,
      height: response.thumbnail_height,
    }
  }
  return {
    url: response.url,
    provider: response.provider_name,
    title: response.title,
    author: response.author_name,
    type: response.type,
    preview: response.html,
    width: response.width,
    height: response.height,
    thumbnail,
  }
}
