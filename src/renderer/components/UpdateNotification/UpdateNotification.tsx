import React, { useEffect, useState } from 'react';
import { Snackbar, Button } from '@mui/material';

function UpdateNotification() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Слушаем событие 'update-downloaded' от основного процесса
    window.electron.ipcRenderer.on('update-downloaded', () => {
      setOpen(true);
    });

    return () => {
      window.electron.ipcRenderer.removeAllListeners('update-downloaded');
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleRestart = () => {
    window.electron.ipcRenderer.sendMessage('restart-app'); // Отправляем событие на перезапуск
  };

  const handleLater = () => {
    setOpen(false);
    // Устанавливаем таймер для повторного показа через час (3600000 мс = 1 час)
    setTimeout(() => {
      setOpen(true);
    }, 3600000);
  };

  return (
    <Snackbar
    autoHideDuration={600000}
      open={open}
      message="Обновление загружено. Перезагрузите приложение для применения обновлений."
      action={
        <>
          <Button color="primary" size="small" onClick={handleRestart}>
            Перезагрузить
          </Button>
          <Button color="secondary" size="small" onClick={handleLater}>
            Позже
          </Button>
        </>
      }
      onClose={handleClose}
    />
  );
}

export default UpdateNotification;
