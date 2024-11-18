import './Background.css';
import { IconButton } from '@mui/material';
import { useState } from 'react';
import ContrastIcon from '@mui/icons-material/Contrast';
import BackgroundCubics from './Backgrounds/Background-cubics';
import BackgroundGradient from './Backgrounds/Background-gradient';
//import BackGroundWave from './Backgrounds/Background_wave';
//import BackgroundCircle from './Backgrounds/Background-circle';

const BACKGROUNDS = [
  //<BackgroundCircle />, needs optimization
  //<BackGroundWave />, needs fixing: rendering doesn't complete when component is removed
  <BackgroundCubics />,
  <BackgroundGradient />
];

function Background() {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * BACKGROUNDS.length));

  const handleBackgroundChange = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % BACKGROUNDS.length);
  };

  return (
    <div className="Background">
      <IconButton
        aria-label="Theme"
        size="large"
        onClick={handleBackgroundChange}
        className="Background__Button-theme"
        sx={{
          borderRadius: '100%',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          boxShadow: '0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)',
          backgroundColor: 'rgba(255, 255, 255, 0.4)'
        }}
      >
        <ContrastIcon />
      </IconButton>
      <div className="Background__Background">
        <div style={{position: 'absolute', width: '100%', height: '100%'}}>
          {BACKGROUNDS[currentIndex]}
        </div>
      </div>
    </div>
  );
}

export default Background;
