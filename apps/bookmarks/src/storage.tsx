import {useEffect} from 'react'
import {useBookmarks} from './store'

const localStorageKey = '@nimo/monobookmarks'

export function getBookmarks(): Bookmark[] {
  const value = localStorage.getItem(localStorageKey)
  if (!value) {
    return []
  }

  let list: Bookmark[]
  try {
    list = JSON.parse(value)
  } catch (err) {
    list = []
  }
  if (!Array.isArray(list)) {
    list = []
    localStorage.removeItem(localStorageKey)
  }

  return list
}

export function StorageSync() {
  const bookmarks = useBookmarks()
  useEffect(() => {
    try {
      const data = JSON.stringify(bookmarks)
      localStorage.setItem(localStorageKey, data)
    } catch (err) {
      console.error(err)
      window.alert('Error while saving the bookmarks')
    }
  }, [bookmarks])
  return null
}
