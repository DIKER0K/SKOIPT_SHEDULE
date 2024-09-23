import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from 'react-compare-slider';
import { Carousel } from 'react-responsive-carousel';
import useInactivityRedirect from '../../components/Scripts/useInactivityRedirect';
import before1 from './Temp/before_1.png';
import after1 from './Temp/after_1.png';
import before2 from './Temp/before_2.png';
import after2 from './Temp/after_2.png';
import after_new_1 from './Temp/after_new_1.png';
import after_new_2 from './Temp/after_new_2.png';
import new_backround_1 from './Temp/Background_1.png';
import new_backround_2 from './Temp/Background_2.png';
import new_backround_3 from './Temp/Background_3.png';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import LastNews from '../../components/LastNews/LastNews';




function News() 
{
  const motionVariants = useMemo(
    () => ({
      initial: { opacity: 0, scale: 0, y: 500 },
      animate: { opacity: 1, scale: 1, y: 0 },
      exit: { opacity: 0, scale: 0, y: -500 },
      transition: { type: 'spring', stiffness: 50 },
    }),
    []
  );
  
  useInactivityRedirect();

  return (
    <Box
      className="absolute-center"
      sx={{
        width: '900px',
        maxHeight: '600px',
      }}
    >
      <motion.div
        initial={motionVariants.initial}
        animate={motionVariants.animate}
        exit={motionVariants.exit}
        transition={motionVariants.transition}
      >
        <Paper
          elevation={5}
          sx={{
            width: '900px',
            maxHeight: '600px',
            height: 'fit-content',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexWrap: 'wrap',
          }}
        >
          <Box
            sx={{
              marginLeft: '15px',
              marginRight: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <LastNews />
          </Box>
        </Paper>
      </motion.div>
    </Box>
  );
}

export default React.memo(News);
