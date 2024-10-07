import React, { useState } from 'react';
import { Box, Button, Typography, Paper, ButtonProps, styled } from '@mui/material';
import { motion } from 'framer-motion';

const CustomButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: 'white',
  boxShadow:
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
  margin: '15px',
  color: 'black',
  fontSize: '18px',
}));

function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winLine, setWinLine] = useState<number[] | null>(null);

  const winner = calculateWinner(board);

  const handleClick = (i: number) => {
    if (winner || board[i]) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinLine(newWinner.line);
    }
  };

  const renderSquare = (i: number) => (
    <Button
      variant="outlined"
      onClick={() => handleClick(i)}
      sx={{
        width: '60px',
        height: '60px',
        fontSize: '24px',
        fontWeight: 'bold',
        m: 0.5,
      }}
    >
      {board[i]}
    </Button>
  );

  const status = winner
    ? `Победитель: ${winner.winner}`
    : board.every(Boolean)
    ? 'Ничья!'
    : `Следующий ход: ${xIsNext ? 'X' : 'O'}`;

  const getWinLineCoordinates = () => {
    if (!winLine) return null;
    const start = winLine[0];
    const end = winLine[2];
    const cellSize = 63;
    const offset = 15; // Дополнительное расстояние для удлинения линии

    let startX = (start % 3) * cellSize + cellSize / 2;
    let startY = Math.floor(start / 3) * cellSize + cellSize / 2;
    let endX = (end % 3) * cellSize + cellSize / 2;
    let endY = Math.floor(end / 3) * cellSize + cellSize / 2;

    // Удлиняем линию в обоих направлениях
    if (startX === endX) { // Вертикальная линия
      startY -= offset;
      endY += offset;
    } else if (startY === endY) { // Горизонтальная линия
      startX -= offset;
      endX += offset;
    } else { // Диагональная линия
      const angle = Math.atan2(endY - startY, endX - startX);
      startX -= Math.cos(angle) * offset;
      startY -= Math.sin(angle) * offset;
      endX += Math.cos(angle) * offset;
      endY += Math.sin(angle) * offset;
    }

    return { x1: startX, y1: startY, x2: endX, y2: endY };
  };

  return (
    <Box className="absolute-center">
      <motion.div
        initial={{ opacity: 0, scale: 0, y: 500 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0, y: -500 }}
        transition={{ type: 'spring', stiffness: 50 }}
      >
        <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Крестики-нолики
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">{status}</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative', width: '190px', height: '190px' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%' }}>
                {board.map((square, i) => (
                  <Box key={i} sx={{ width: '33.33%', height: '33.33%', boxSizing: 'border-box' }}>
                    {renderSquare(i)}
                  </Box>
                ))}
              </Box>
              <svg
                width="190"
                height="190"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  pointerEvents: 'none',
                }}
              >
                {winLine && (
                  <line
                    {...getWinLineCoordinates()}
                    stroke="red"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </Box>
          </Box>
          <CustomButton
            variant="contained"
            onClick={() => {
              setBoard(Array(9).fill(null));
              setWinLine(null);
            }}
            sx={{ mt: 2 }}
          >
            Начать заново
          </CustomButton>
        </Paper>
      </motion.div>
    </Box>
  );
}

function calculateWinner(squares: Array<string | null>): { winner: string; line: number[] } | null {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

export default TicTacToe;
