import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import HomeIcon from '@mui/icons-material/Home';
import FeedIcon from '@mui/icons-material/Feed';
import TodayIcon from '@mui/icons-material/Today';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Paper } from '@mui/material';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [value, setValue] = React.useState(location.pathname);

  // Update value when location changes
  React.useEffect(() => {
    switch (location.pathname)
    {
      case '/':
        setValue('Main');
        break;
      case '/news':
        setValue('News');
        break;
      case '/schedule':
        setValue('Schedule');
        break;
      case '/calls':
        setValue('Calls');
        break;
      case '/other':
        setValue('Other');
        break;
    }
  }, [location.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: '25px',
        position: 'absolute',
        zIndex: '1',
        bottom: '20px',
        left: '50%',
        transform: 'translate(-50%)',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <BottomNavigation
        sx={{
          width: 700,
          height: 100,
          borderRadius: '25px',
          '& .MuiBottomNavigationAction-root': {
            minWidth: 'auto',
            padding: '6px 0',
          },
        }}
        showLabels
        value={value}
        onChange={handleChange}
      >
        <BottomNavigationAction
          label="Главная"
          value="Main"
          onClick={() => navigate('/')}
          icon={<HomeIcon sx={{ fontSize: 36 }} />}
        />
        <BottomNavigationAction
          label="Новости"
          value="News"
          onClick={() => navigate('/news')}
          icon={<FeedIcon sx={{ fontSize: 36 }} />}
        />
        <BottomNavigationAction
          label="Расписание"
          value="Schedule"
          onClick={() => navigate('/schedule')}
          icon={<TodayIcon sx={{ fontSize: 36 }} />}
        />
        <BottomNavigationAction
          label="Звонки"
          value="Calls"
          onClick={() => navigate('/calls')}
          icon={<NotificationsActiveIcon sx={{ fontSize: 36 }} />}
        />
        <BottomNavigationAction
          label="Прочее"
          value="Other"
          onClick={() => navigate('/other')}
          icon={<MoreHorizIcon sx={{ fontSize: 36 }} />}
        />
      </BottomNavigation>
    </Paper>
  );
}

export default Navbar;
