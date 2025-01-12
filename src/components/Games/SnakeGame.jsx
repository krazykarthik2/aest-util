import React, { useState, useEffect } from "react";
const DEFAULT_SNAKE = [[5, 5]];
const DEFAULT_DIR = "RIGHT"
const gridSize = 20; // Can be 10, 20, 25
const initialSpeed = 200; // Base speed for "medium"

const SnakeGame = () => {
  // Configurable settings
  
  // Generate random food position
  const generateFood = () => {
    return [
      Math.floor(Math.random() * gridSize),
      Math.floor(Math.random() * gridSize),
    ];
  };

  // State variables
  const [snake, setSnake] = useState(DEFAULT_SNAKE); // Initial snake position
  const [food, setFood] = useState(generateFood()); // Initial food position
  const [direction, setDirection] = useState(DEFAULT_DIR); // Initial direction
  const [speed, setSpeed] = useState(initialSpeed); // Movement speed (ms)
  const [score, setScore] = useState(0); // Score
  const [gameOver, setGameOver] = useState(false); // Game over flag

  // Handle keyboard controls
  const handleKeyDown = (e) => {
    const keyMap = {
      ArrowUp: "UP",
      ArrowDown: "DOWN",
      ArrowLeft: "LEFT",
      ArrowRight: "RIGHT",
      w: "UP",
      s: "DOWN",
      a: "LEFT",
      d: "RIGHT",
      2: "DOWN",
      4: "LEFT",
      6: "RIGHT",
      8: "UP",
    };
    setDirection((dir) => {
      if (keyMap[e.key] && !isOppositeDirection(dir, keyMap[e.key])) {
        return keyMap[e.key];
      }else return dir
    });
  };

  // Check if the new direction is opposite to the current direction
  const isOppositeDirection = (direction, newDirection) => {
    const opposites = {
      UP: "DOWN",
      DOWN: "UP",
      LEFT: "RIGHT",
      RIGHT: "LEFT",
    };
    return opposites[direction] === newDirection;
  };

  // Move the snake
  const moveSnake = () => {
    const newSnake = [...snake];
    const head = newSnake[newSnake.length - 1];
    let newHead;

    switch (direction) {
      case "UP":
        newHead = [head[0] - 1, head[1]];
        break;
      case "DOWN":
        newHead = [head[0] + 1, head[1]];
        break;
      case "LEFT":
        newHead = [head[0], head[1] - 1];
        break;
      case "RIGHT":
        newHead = [head[0], head[1] + 1];
        break;
      default:
        return;
    }

    // Check for collisions
    if (
      newHead[0] < 0 ||
      newHead[1] < 0 ||
      newHead[0] >= gridSize ||
      newHead[1] >= gridSize ||
      snake.some(
        (segment) => segment[0] === newHead[0] && segment[1] === newHead[1]
      )
    ) {
      setGameOver(true);
      return;
    }

    newSnake.push(newHead);

    // Check if food is eaten
    if (newHead[0] === food[0] && newHead[1] === food[1]) {
      setScore((prev) => prev + 1);
      setFood(generateFood());
      setSpeed((prev) => Math.max(50, prev - 10));
    } else {
      newSnake.shift(); // Remove tail if no food eaten
    }

    setSnake(newSnake);
  };

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    const interval = setInterval(moveSnake, speed);
    return () => clearInterval(interval);
  }, [snake, direction, speed, gameOver]);

  // Keyboard event listener
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [direction]);

  // Render the grid
  const renderGrid = () => {
    const grid = [];
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const isSnake = snake.some(
          (segment) => segment[0] === row && segment[1] === col
        );
        const isFood = food[0] === row && food[1] === col;

        grid.push(
          <div
            key={`${row}-${col}`}
            style={{
              width: "20px",
              height: "20px",
              backgroundColor: isSnake ? "green" : isFood ? "red" : "black",
              border: "1px solid #333",
            }}
          ></div>
        );
      }
    }
    return grid;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginTop: "20px",
      }}
    >
      <h1>Snake Game</h1>
      <h2>Score: {score}</h2>
      {gameOver && <h3>Game Over! Refresh to restart.</h3>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${gridSize}, 20px)`,
          backgroundColor: "black",
        }}
      >
        {renderGrid()}
      </div>
      <div className="center gap-10">
        <button
          tabIndex={-1}
          onClick={() => {
            setSnake([[5, 5]]);
            setGameOver(false);
          }}
          accessKey="r"
        >
          <u>R</u>estart
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
