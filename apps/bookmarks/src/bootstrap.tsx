import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {App} from './App'
import {getBookmarks, StorageSync} from './storage'
import {Store} from './store'

const container = document.getElementById('root')
if (!container) {
  throw new Error('Element with id "root" not found, please define one in your HTML')
}

const initialValues = getBookmarks()

const root = createRoot(container)
root.render(
  <StrictMode>
    <Store initialValues={initialValues}>
      <StorageSync />
      <App />
    </Store>
  </StrictMode>
)
