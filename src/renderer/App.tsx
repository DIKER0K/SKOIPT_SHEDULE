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
import TicTacToe from './pages/TicTacToe/TicTacToe';
import UpdateNotification from './components/UpdateNotification/UpdateNotification';
import { LoadGroups } from "./utils/ScheduleLoad";
import { createRef, useEffect, useRef, useState } from 'react';


const LoadFunctions = [
  LoadGroups,
]
const LoadFunctionsMsg = [
  "загрузка списка групп",
]

function Event_keydown(event: KeyboardEvent)
{
  switch (event.key.toLowerCase())
  {
    case "r":
      window.location.reload();
      break;
  }
}

function LoadUUID()
{
  let uuid = localStorage.getItem("uuid")
  if (uuid == null)
  {
    localStorage.setItem("uuid",
      Math.random().toString(16).substring(2, 18));
  }
}

async function Load(handlerChangeText: Function)
{
  for (let i = 0; i < LoadFunctions.length; i++)
  {
    handlerChangeText(LoadFunctionsMsg[i] + `(${i+1}/${LoadFunctions.length})`)

    let status = await LoadFunctions[i]()

    
  }
}

export default function App()
{
  let loadRef = useRef(null);
  let [loadText, setLoadText] = useState("Загрузка");

  LoadUUID();

  // async loads
  useEffect(() => {
    Load(setLoadText)
    .then((result) => {
      // @ts-ignore
      loadRef.current?.remove()
    })
  }, [])

  document.addEventListener("keydown", Event_keydown);

  return (
    <div>
      <div className='app__load' ref={loadRef}>
        <div className='app__loadbar absolute-center'>{loadText}</div>
      </div>
      <Router>
        <UpdateNotification />
        <Background />
        <Navbar />
        <Head />
        <AppContent />
      </Router>
    </div>
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
          <Route path="/tic-tac-toe" element={<TicTacToe />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}
