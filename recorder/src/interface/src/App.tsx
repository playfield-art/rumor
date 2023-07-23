import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSocket } from './hooks/useSocket'
import { SetLanguage } from './pages/SetLanguage';
import { StartCountdown } from './pages/StartCountdown';
import { ConnectionManager } from './components/ConnectionManager';
import { Setup } from './pages/Setup';

function App() {
  return (
    <div className='page-container'>
      <Router>
        <ConnectionManager />
        <Routes>
          <Route path="/" element={<SetLanguage />} />
          <Route path="/set-language" element={<SetLanguage />} />
          <Route path="/start-countdown" element={<StartCountdown />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
