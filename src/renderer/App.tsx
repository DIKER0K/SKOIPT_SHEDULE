import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import { AnimatePresence } from 'framer-motion';
import Home from './pages/Home/Home';
import Calls from './pages/Calls/Calls';
import News from './pages/News/News';
import Schedule from './pages/Schedule/Schedule';
import Background from './components/Background/Background';
import Navbar from './components/Navbar/Navbar';
import Head from './components/Head/Head';
import View from './pages/View/View';
import Other from './pages/Other/Other';
import Codes from './pages/Codes/Codes';
import Feedback from './pages/Feedback/Feedback';
import UpdateNotification from './components/UpdateNotification/UpdateNotification';

export default function App() 
{
  // generate uuid
  let uuid = localStorage.getItem("uuid")
  if (uuid == null)
  {
    localStorage.setItem("uuid", 
      Math.random().toString(16).substring(2, 18));
  }

  document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === 'r') {
      window.location.reload();
    }
  });

  return (
    <Router>
      <UpdateNotification />
      <Background />
      <Navbar />
      <Head />
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();

  return (
    <div>
      <AnimatePresence>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/calls" element={<Calls />} />
          <Route path="/news" element={<News />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/view" element={<View />} />
          <Route path="/other" element={<Other />} />
          <Route path="/codes" element={<Codes />} />
          <Route path="/feedback" element={<Feedback />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
