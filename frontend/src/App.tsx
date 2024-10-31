import './App.css'
import Navbar2 from './components/Navbar2'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Reading from './components/Reading'
import Cards from './components/Cards'

function App() {

  return (
    <>
    
    <Router>
    <Navbar2 />
      <Routes>
        <Route path="/" element={<Reading />} />
        <Route path="/cards" element={<Cards />} />
      </Routes>
    
    </Router>
    </>
  )
}

export default App
