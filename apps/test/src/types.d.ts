declare type Bookmark = {
  url: string
  provider: string
  title: string
  author: string
  type: 'photo' | 'video'
  preview: string
  width: number
  height: number
  thumbnail: {
    url: string
    width: number
    height: number
  } | null
}
