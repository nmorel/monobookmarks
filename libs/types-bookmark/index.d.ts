interface BaseBookmark {
  url: string
  provider: string
  type: string
  title: string
}

interface PhotoVideoBookmark extends BaseBookmark {
  type: 'photo' | 'video'
  author: string
  preview: string
  width: number
  height: number
  thumbnail: {
    url: string
    width: number
    height: number
  } | null
}

declare interface YoutubeBookmark extends PhotoVideoBookmark {
  provider: 'YouTube'
  type: 'video'
}

declare interface VimeoBookmark extends PhotoVideoBookmark {
  provider: 'Vimeo'
  type: 'video'
}

declare interface FlickrBookmark extends PhotoVideoBookmark {
  provider: 'Flickr'
  type: 'photo'
}

declare interface DefaultBookmark extends PhotoVideoBookmark {
  provider: string
}

declare type Bookmark = YoutubeBookmark | VimeoBookmark | FlickrBookmark | DefaultBookmark
