import React, { useState, useEffect } from "react";
import "./MazeGame.css";

// Maze Generation using Recursive Backtracking
const generateMaze = (rows, cols) => {
  let grid = Array.from(
    { length: rows },
    () => Array.from({ length: cols }, () => 1) // 1 is wall, 0 is path
  );

  // Helper functions to get random neighbors for maze generation
  const getNeighbors = (x, y) => {
    let neighbors = [];
    const directions = [
      [-2, 0],
      [2, 0],
      [0, -2],
      [0, 2], // 4 possible directions
    ];
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && nx < rows && ny >= 0 && ny < cols) {
        neighbors.push([nx, ny]);
      }
    }
    return neighbors;
  };

  // Recursive backtracking maze generation
  const carvePath = (x, y) => {
    grid[x][y] = 0; // 0 is path
    const neighbors = getNeighbors(x, y);
    // Shuffle neighbors to randomize the path generation
    const shuffledNeighbors = neighbors.sort(() => Math.random() - 0.5);
    for (const [nx, ny] of shuffledNeighbors) {
      if (grid[nx][ny] === 1) {
        grid[(x + nx) / 2][(y + ny) / 2] = 0; // Carve the path between cells
        carvePath(nx, ny);
      }
    }
  };

  // Start carving from a random cell
  carvePath(1, 1);
  grid[0][1] = 0; // Make sure start is a path
  grid[rows - 1][cols - 2] = 0; // Make sure end is a path
  return grid;
};

const generateDark = (rows, cols) => {
  let grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => false)
  );
  return grid;
};

// Randomly place a prize
const placePrize = (grid) => {
  let prizePlaced = false;
  let prizePos = { x: 0, y: 0 };
  while (!prizePlaced) {
    const x = Math.floor(Math.random() * grid.length);
    const y = Math.floor(Math.random() * grid[0].length);
    if (grid[x][y] === 0) {
      prizePos = { x, y };
      prizePlaced = true;
    }
  }
  return prizePos;
};

// Get illuminated area based on hero's position
const addIlluminated = (_ill, heroPos, grid, visionRange) => {
  const illuminated = _ill;
  for (let x = heroPos.x - visionRange; x <= heroPos.x + visionRange; x++) {
    for (let y = heroPos.y - visionRange; y <= heroPos.y + visionRange; y++) {
      if (x >= 0 && x < grid.length && y >= 0 && y < grid[0].length) {
        _ill[x][y] = true;
      }
    }
  }
  return illuminated;
};

const GridGame = () => {
  const rows = 50; // Huge maze size
  const cols = 50;
  const visionRange = 5; // Range of visibility around the hero

  const [grid, setGrid] = useState(generateMaze(rows, cols));
  const [gridT, setGridT] = useState([]);
  const [heroPos, setHeroPos] = useState({ x: 1, y: 1 });
  const [prizePos, setPrizePos] = useState(placePrize(grid));
  const [illGrid, setIllGrid] = useState(generateDark(rows, cols));
  useEffect(() => {
    // Update illuminated area when hero moves
    setIllGrid((x) => addIlluminated(x, heroPos, grid, visionRange));
  }, [heroPos, grid]);

  useEffect(() => {
    let _x_start = Math.max(heroPos.x - visionRange, 0);
    let _y_start = Math.max(heroPos.y - visionRange, 0);
    let _x_end = Math.min(heroPos.x + visionRange, rows - 1);
    let _y_end = Math.min(heroPos.y + visionRange, cols - 1);
    let _grid = grid.slice(_x_start, _x_end + 1);
    _grid = _grid.map((row) => row.slice(_y_start, _y_end + 1));
    for (let i = _x_start; i <= _x_end; i++) {
      for (let j = _y_start; j <= _y_end; j++) {
        _grid[i - _x_start][j - _y_start] = [
          _grid[i - _x_start][j - _y_start],
          i,
          j,
        ];
      }
    }
    setGridT(_grid);
  }, [grid,heroPos, visionRange]);
  // Handle hero movement
  const moveHero = (direction) => {
    const newPos = { ...heroPos };
    switch (direction) {
      case "up":
        if (newPos.x > 0 && grid[newPos.x - 1][newPos.y] === 0) newPos.x -= 1;
        break;
      case "down":
        if (newPos.x < rows - 1 && grid[newPos.x + 1][newPos.y] === 0)
          newPos.x += 1;
        break;
      case "left":
        if (newPos.y > 0 && grid[newPos.x][newPos.y - 1] === 0) newPos.y -= 1;
        break;
      case "right":
        if (newPos.y < cols - 1 && grid[newPos.x][newPos.y + 1] === 0)
          newPos.y += 1;
        break;
      default:
        break;
    }
    setHeroPos(newPos);
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
          moveHero("up");
          break;
        case "s":
        case "ArrowDown":
          moveHero("down");
          break;
        case "a":
        case "ArrowLeft":
          moveHero("left");
          break;
        case "d":
        case "ArrowRight":
          moveHero("right");
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [heroPos]);

  // Check if the hero reaches the prize
  useEffect(() => {
    if (heroPos.x === prizePos.x && heroPos.y === prizePos.y) {
      alert("You reached the prize!");
      setGrid(generateMaze(rows, cols)); // Regenerate maze on prize reach
      setIllGrid(generateDark(rows, cols));
      setHeroPos({ x: 1, y: 1 }); // Reset hero position
      setPrizePos(placePrize(grid)); // Place a new prize
    }
  }, [heroPos, prizePos, grid]);

  // Render the grid and mini map
  return (
    <div className="game-container">
      <div className="map-container">
        <div className="full-map">
          <MiniMap grid={grid} illGrid={illGrid} heroPos={heroPos} />
        </div>
        <div className="current-map">
          {gridT.map((row,rowIndex) => (
            <div key={rowIndex} className="row">
              {row.map(([cell,i,j], colIndex) => (
                <div
                  key={colIndex}
                  className={`cell ${cell === 0 ? "path" : "wall"} ${
                    heroPos.x === i && heroPos.y === j
                      ? "hero"
                      : ""
                  } ${
                    prizePos.x === i && prizePos.y === j
                      ? "prize"
                      : ""
                  }`}
                >
                  {heroPos.x === i && heroPos.y === j ? "d" : ""}
                  {prizePos.x === i && prizePos.y === j
                    ? "💎"
                    : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MiniMap = ({ grid, illGrid, heroPos }) => {
  return (
    <div className="mini-map">
      {grid.map((row, rowIndex) => (
        <div key={rowIndex} className="mini-row">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className={`mini-cell ${
                illGrid[rowIndex][colIndex] ? "illuminated" : ""
              } ${
                heroPos.x === rowIndex && heroPos.y === colIndex ? "hero" : ""
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridGame;
