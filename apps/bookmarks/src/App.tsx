import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {Home} from './views'

export function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}
