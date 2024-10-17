import { MemoryRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import { LoadGroups, LoadSchedule } from "./utils/ScheduleLoad";
import { useEffect, useRef, useState } from 'react';
import { LinearProgress } from '@mui/material';
import './App.css';


const LoadFunctions = [
  LoadGroups,
  LoadSchedule,
]
const LoadFunctionsMsg = [
  "загрузка списка групп",
  "Загрузка расписания групп",
]


function Event_keydown(event: KeyboardEvent)
{
  switch (event.key.toLowerCase())
  {
    case "r":
      window.location.reload();
      break;

    case "d":
      window.electron.openDevTools();
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

function CheckVersion()
{
  const { version } = require('../../release/app/package.json');

  if (localStorage.getItem("version")?.split(".")[0] == version.split(".")[0])
  {
    if (localStorage.getItem("version") != version)
    {
      localStorage.setItem("version", version);
    }
    return;
  }
  
  let uuid = localStorage.getItem("uuid") ?? ""
  localStorage.clear();
  
  localStorage.setItem("uuid", uuid);
  localStorage.setItem("version", version);
}

async function Load(handlerChangeText: Function, handleProgress: Function)
{
  for (let i = 0; i < LoadFunctions.length; i++)
  {
    handlerChangeText(LoadFunctionsMsg[i])

    let status = await LoadFunctions[i](handleProgress)
  }
}

export default function App()
{
  let loadRef = useRef(null);
  let [loadText, setLoadText] = useState("Загрузка");
  let [statusLoader, setStatusLoader] = useState(0);

  LoadUUID();
  CheckVersion();

  // async loads
  useEffect(() => {
    Load(setLoadText, setStatusLoader)
    .then((result) => {
      // @ts-ignore
      loadRef.current?.remove()
    })
  }, [])

  document.addEventListener("keydown", Event_keydown);

  return (
    <div>
      <div className='app__load' ref={loadRef}>
        <div className='app__loadbar absolute-center'>{loadText}
        <LinearProgress 
          className='MuiLinearProgress-bar--transition-off'
          variant='determinate' 
          value={statusLoader} 
          sx={{
            height:"20px", 
            borderRadius: "10px"
          }}
        /></div>
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
