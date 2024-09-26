import React, { useState } from 'react';
import { Box, Paper, TextField, Snackbar, Alert } from '@mui/material';
import Keyboard from 'react-simple-keyboard';
import { motion } from 'framer-motion';
import Grow, { GrowProps } from '@mui/material/Grow';
import './Feedback.css';



const token = '6560320345:AAEAhLn5ZD9pnZ5hSIYS4VUb_WjGW6xrK1Q';
const chatIds = ['965614231', '5065103578', '1044229010'];
const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;



function GrowTransition(props: GrowProps) {
  return <Grow {...props} />;
}

function onKeyPress(
  button: string,
  setInput: (value: string) => void,
  input: string,
  lastSendTime: number,
  setLastSendTime: (time: number) => void,
  setSnackbar: (message: string) => void,
  setSnackbarSeverity: (
    severity: 'success' | 'info' | 'warning' | 'error',
  ) => void,) 
  {
  console.log('Button pressed: ', button);

  switch (button)
  {
    case '{bksp}':
      setInput(input.slice(0, -1));
      break;
      
    case '{space}':
      setInput(input + " ");
      break;
    
    case '{enter}':
      const currentTime = Date.now();
      const timeSinceLastSend = currentTime - lastSendTime;

      if (timeSinceLastSend < 1000 * 60 * 10)
      {
        setSnackbar('Сообщение можно отправить только раз в 10 минут.');
        setSnackbarSeverity('warning');
        return;
      }

      if (!input.trim()) 
      {
        setSnackbar('Сообщение не может быть пустым');
        setSnackbarSeverity('warning');
        return;
      }

      if (input.trim().split(' ').length < 6 ||
        input.length < 30)
      {
        setSnackbar('Ваш текст должен быть более развернутым. Пожалуйста, добавьте больше деталей.');
        setSnackbarSeverity('warning');
        return;
      }
      chatIds.forEach(async (chatId) => {
        const res = await fetch(telegramUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: text,
          }),
        });

        if (!res.ok) {
          console.error(`Ошибка при отправке сообщения в чат ${chatId}`);
        }
      });

      setInput('');
      setSnackbar('Сообщение отправлено');
      setSnackbarSeverity('success');
      setLastSendTime(currentTime);
      break;
    
    case '{shift}' || '{lock}':

      break;

    default:
      setInput(input + button);
      break;
  }
}

function Feedback() {
  const [input, setInput] = useState<string>('');
  const [lastSendTime, setLastSendTime] = useState<number>(0); // Время последней отправки
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    'success' | 'info' | 'warning' | 'error'
  >('info');
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null); // Для сообщений в Snackbar

  return (
    <Box
      className="absolute-center"
      sx={{
        width: '600px',
        height: '400px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 500 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: -500 }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <Paper
          elevation={5}
          sx={{
            width: '600px',
            height: '400px',
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            flexWrap: 'wrap',
            padding: '20px',
          }}
        >
          <TextField
            disabled
            label="Опишите проблему с приложением"
            // @ts-ignore
            inputProps={{ style: { fontSize: '1.5rem', '-webkit-text-fill-color': 'rgba(0, 0, 0, 0.87)' } }}
            InputLabelProps={{ style: { fontSize: '1rem', color: 'rgba(0, 0, 0, 0.87)' } }}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            required
          />
          <Keyboard
            display={{
              '{bksp}': 'Стереть',
              '{space}': 'Пробел',
              '{enter}': 'Готово',
            }}
            onKeyReleased={(button) =>
              onKeyPress(
                button,
                setInput,
                input,
                lastSendTime,
                setLastSendTime,
                setSnackbarMessage,
                setSnackbarSeverity,
              )
            }
            layout={{
              default: [
                '\u0451 1 2 3 4 5 6 7 8 9 0 {bksp}',
                '\u0439 \u0446 \u0443 \u043a \u0435 \u043d \u0433 \u0448 \u0449 \u0437 \u0445 \u044a \\',
                '\u0444 \u044b \u0432 \u0430 \u043f \u0440 \u043e \u043b \u0434 \u0436 \u044d {enter}',
                '/ \u044f \u0447 \u0441 \u043c \u0438 \u0442 \u044c \u0431 \u044e .',
                '{space}',
              ],
            }}
          />
        </Paper>
      </motion.div>

      {/* Snackbar для отображения сообщений */}
      <Snackbar
        sx={{ width: '100%', position: 'absolute', marginBottom: '-180px' }}
        open={!!snackbarMessage}
        autoHideDuration={4000}
        onClose={() => setSnackbarMessage(null)}
        TransitionComponent={GrowTransition}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarMessage(null)}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Feedback;
