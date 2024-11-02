import './App.css'
import Navbar2 from './components/Navbar2'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

import Reading from './components/Reading'
import AllCards from './components/AllCards'

function App() {

  return (
    <>
    
    <Router>
    <Navbar2 />
      <Routes>
        <Route path="/" element={<Reading />} />
        <Route path="/cards" element={<AllCards />} />
      </Routes>
    
    </Router>
    </>
  )
}

export default App
