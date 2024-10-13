import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  ButtonProps,
  styled,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { motion } from 'framer-motion';
import useInactivityRedirect from '../../components/Scripts/useInactivityRedirect';

const CustomButton = styled(Button)<ButtonProps>(() => ({
  backgroundColor: 'white',
  boxShadow:
    '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 5px 8px 0px rgba(0,0,0,0.14), 0px 1px 14px 0px rgba(0,0,0,0.12)',
  margin: '15px',
  color: 'black',
  fontSize: '18px',
}));

type GameMode = 'player' | 'ai';
type Difficulty = 'easy' | 'medium' | 'hard';

function TicTacToe() {
  useInactivityRedirect();
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winLine, setWinLine] = useState<number[] | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('player');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const winner = calculateWinner(board);

  useEffect(() => {
    if (gameMode === 'ai' && !xIsNext && !winner) {
      const timer = setTimeout(() => {
        makeAIMove();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [board, xIsNext, gameMode, winner]);

  const handleClick = (i: number) => {
    if (winner || board[i] || (gameMode === 'ai' && !xIsNext)) return;
    const newBoard = board.slice();
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);

    const newWinner = calculateWinner(newBoard);
    if (newWinner) {
      setWinLine(newWinner.line);
    }
  };

  const makeAIMove = () => {
    let move: number;
    switch (difficulty) {
      case 'easy':
        move = makeRandomMove(board);
        break;
      case 'medium':
        move = Math.random() < 0.7 ? findBestMove(board) : makeRandomMove(board);
        break;
      case 'hard':
        move = findBestMove(board);
        break;
      default:
        move = makeRandomMove(board);
    }

    if (move !== -1) {
      const newBoard = board.slice();
      newBoard[move] = 'O';
      setBoard(newBoard);
      setXIsNext(true);

      const newWinner = calculateWinner(newBoard);
      if (newWinner) {
        setWinLine(newWinner.line);
      }
    }
  };

  const makeRandomMove = (board: Array<string | null>): number => {
    const emptySquares = board.reduce((acc: number[], square, index) => {
      if (!square) acc.push(index);
      return acc;
    }, []);
    return emptySquares[Math.floor(Math.random() * emptySquares.length)];
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
    if (startX === endX) {
      // В��ртикальная линия
      startY -= offset;
      endY += offset;
    } else if (startY === endY) {
      // Горизонтальная линия
      startX -= offset;
      endX += offset;
    } else {
      // Диагональная линия
      const angle = Math.atan2(endY - startY, endX - startX);
      startX -= Math.cos(angle) * offset;
      startY -= Math.sin(angle) * offset;
      endX += Math.cos(angle) * offset;
      endY += Math.sin(angle) * offset;
    }

    return { x1: startX, y1: startY, x2: endX, y2: endY };
  };

  const handleGameModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGameMode(event.target.value as GameMode);
    resetGame();
  };

  const handleDifficultyChange = (event: SelectChangeEvent<Difficulty>) => {
    setDifficulty(event.target.value as Difficulty);
    resetGame();
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinLine(null);
    setXIsNext(true);
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
          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Режим игры</FormLabel>
            <RadioGroup
              row
              aria-label="game-mode"
              name="game-mode"
              value={gameMode}
              onChange={handleGameModeChange}
            >
              <FormControlLabel
                value="player"
                control={<Radio />}
                label="Игрок против игрока"
              />
              <FormControlLabel
                value="ai"
                control={<Radio />}
                label="Игрок против ИИ"
              />
            </RadioGroup>
          </FormControl>
          {gameMode === 'ai' && (
            <FormControl sx={{ mb: 2, minWidth: 120 }}>
              <FormLabel component="legend">Сложность ИИ</FormLabel>
              <Select
                value={difficulty}
                onChange={handleDifficultyChange}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value="easy">Легкий</MenuItem>
                <MenuItem value="medium">Средний</MenuItem>
                <MenuItem value="hard">Сложный</MenuItem>
              </Select>
            </FormControl>
          )}
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">{status}</Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Box sx={{ position: 'relative', width: '200px', height: '190px' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  width: '100%',
                  height: '100%',
                }}
              >
                {board.map((square, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: '33.33%',
                      height: '33.33%',
                      boxSizing: 'border-box',
                    }}
                  >
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
          <CustomButton variant="contained" onClick={resetGame} sx={{ mt: 2 }}>
            Начать заново
          </CustomButton>
        </Paper>
      </motion.div>
    </Box>
  );
}

function calculateWinner(
  squares: Array<string | null>,
): { winner: string; line: number[] } | null {
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

function findBestMove(board: Array<string | null>): number {
  let bestScore = -Infinity;
  let bestMove = -1;

  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'O';
      const score = minimax(board, 0, false);
      board[i] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }

  return bestMove;
}

function minimax(
  board: Array<string | null>,
  depth: number,
  isMaximizing: boolean,
): number {
  const result = calculateWinner(board);

  if (result) {
    return result.winner === 'O' ? 10 - depth : depth - 10;
  }

  if (board.every(Boolean)) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (!board[i]) {
        board[i] = 'O';
        const score = minimax(board, depth + 1, false);
        board[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  }
  let bestScore = Infinity;
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      board[i] = 'X';
      const score = minimax(board, depth + 1, true);
      board[i] = null;
      bestScore = Math.min(score, bestScore);
    }
  }
  return bestScore;
}

export default TicTacToe;
