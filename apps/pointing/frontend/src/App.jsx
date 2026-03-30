import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Calibrate from './pages/Calibrate.jsx'

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calibrate" element={<Calibrate />} />
      </Routes>
    </BrowserRouter>
  )
}
