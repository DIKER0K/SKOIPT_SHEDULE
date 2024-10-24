import { Button, ButtonProps, CircularProgress, Paper, styled } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import './ViewStudentSchedule.css';
import useInactivityRedirect from '../../components/Scripts/useInactivityRedirect';
import "../../App.css"

const CustomButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: 'white',
  boxShadow:
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
  color: 'black',
  width: '150px',
  fontSize: '18px',
}));



function Load(group: string, handleChange: Function) {
  let schedules: any;

  schedules = JSON.parse(localStorage.getItem('schedules') ?? '0');

  if (schedules.students != null && schedules.students[group] != null)
  {
    handleChange(schedules.students[group]);
  }
  else
  {
    console.log(1)
    handleChange([[["таблица не найдена"]]]);
  }
  
}

export default function ViewStudentSchedule() {
  useInactivityRedirect();
  const [schedule, setSchedule] = React.useState(
    <CircularProgress sx={{ marginTop: '280px' }} />
  );
  const ref = useRef(null);
  const [scale, setScale] = useState(1);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  function changeSchedule(newSchedule) {
    const rows = [];

    newSchedule.forEach((trs, i) => {
      const tr = [];

      trs.forEach((td, j) => {
        tr.push(
          <motion.td
            key={j}
            colSpan={td[3]}
            rowSpan={td[4]}
            style={{
              width: td[1],
              height: td[2],
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ delay: i * 0.1 + j * 0.05 }}
          >
            {td[0]}
          </motion.td>
        );
      });

      rows.push(
        <motion.tr key={i}>
          {tr}
        </motion.tr>
      );
    });

    setSchedule(<tbody className="View__table">{rows}</tbody>);
  }

  useEffect(() => {
    Load(searchParams.get('group') ?? '', changeSchedule);
  }, []);

  useEffect(() => {
    if (ref.current) {
      const elementHeight = ref.current.offsetHeight;  // Получение высоты элемента

      // Проверка высоты и изменение scale
      if (elementHeight > 500) {
        setScale(1.1);
      } else {
        setScale(1.5);
      }
    }
  }, [schedule]);

  return (
    <motion.div
      initial={{ opacity: '0' }}
      animate={{ opacity: '1' }}
      exit={{ opacity: '0' }}
      transition={{ type: 'spring', stiffness: 50, delay: '0.1' }}
    >
      <Paper
        className='absolute-center'
        ref={ref}
        sx={{
          minWidth: '1030px',
          minHeight: '200px',
          height: 'fit-content',
          textAlign: 'center',
          padding: '15px',
          transform: `translate(-50%, -50%) scale(${scale})`,
        }}
      >
        {schedule}
      </Paper>
      <motion.div
        initial={{ opacity: '0' }}
        animate={{ opacity: '1' }}
        transition={{ type: 'spring', stiffness: 50, delay: '0.1' }}
      >
        <CustomButton
          onClick={() => navigate('/schedule')}
          variant="contained"
          sx={{
            position: 'absolute',
            width: 240,
            height: 100,
            borderRadius: '15px',
            left: 'calc(50% - 700px)',
            bottom: '20px',
          }}
        >
          Назад
        </CustomButton>
      </motion.div>
    </motion.div>
  );
}
