import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Bookmark, Home} from './views'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:provider/:slug" element={<Bookmark />} />
      </Routes>
    </Router>
  )
}
