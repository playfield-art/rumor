import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSocket } from './hooks/useSocket'
import { SetLanguage } from './pages/SetLanguage';
import { StartCountdown } from './pages/StartCountdown';
import { ConnectionManager } from './components/ConnectionManager';
import { Setup } from './pages/Setup';
import { DuringPerformance } from './pages/DuringPerformance';
import { DoorIsOpen } from './pages/DoorIsOpen';
import { SessionFinished } from './pages/SessionFinished';

function App() {
  return (
    <div className='page-container'>
      <Router>
        <ConnectionManager />
        <Routes>
          <Route path="/" element={<SetLanguage />} />
          <Route path="/set-language" element={<SetLanguage />} />
          <Route path="/start-countdown" element={<StartCountdown />} />
          <Route path="/during-performance" element={<DuringPerformance />} />
          <Route path="/door-is-open" element={<DoorIsOpen />} />
          <Route path="/session-finished" element={<SessionFinished />} />
          <Route path="/setup" element={<Setup />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
