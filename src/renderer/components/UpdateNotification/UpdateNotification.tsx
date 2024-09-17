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

  return (
    <Snackbar
      open={open}
      message="Обновление загружено. Перезагрузите приложение для применения обновлений."
      action={
        <Button color="primary" size="small" onClick={handleRestart}>
          Перезагрузить
        </Button>
      }
      onClose={handleClose}
    />
  );
}

export default UpdateNotification;
