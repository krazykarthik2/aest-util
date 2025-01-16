import React, { useState, useEffect } from "react";
import "./MazeGame.css";

const DIRECTIONS = ["up", "down", "left", "right"];
const OPPOSITE = {
  up: "down",
  down: "up",
  left: "right",
  right: "left",
};
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

const placePrize = (grid) => {
  if (!grid) return;
  let prizePlaced = false;
  let prizePos = { x: 0, y: 0 };
  window.dft = (r, c) => dft(r, c, grid);
  window.grid = grid;
  let visited = generateDark(grid.length, grid[0].length);
  function dft(row, col, grid) {
    if (row < 0 || col < 0 || row >= grid.length || col >= grid[0].length) {
      return [];
    }
    if (visited[row][col]) return [];
    visited[row][col] = true;
    if (grid[row][col] == 0) {
      return [
        [row, col],
        ...dft(row - 1, col, grid),
        ...dft(row + 1, col, grid),
        ...dft(row, col - 1, grid),
        ...dft(row, col + 1, grid),
      ];
    }
    return [];
  }
  const all_reachable = dft(1, 1, grid);
  if (all_reachable.length == 0) {
    return null;
  }
  const ind = Math.floor(Math.random() * all_reachable.length);
  console.log(all_reachable[ind], ind, all_reachable);
  prizePos.x = all_reachable[ind][0];
  prizePos.y = all_reachable[ind][1];

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
  const [prizePos, setPrizePos] = useState(null);
  const [illGrid, setIllGrid] = useState(generateDark(rows, cols));
  const [gameOver, setGameOver] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [timeoutPlayObj, setTimeoutPlayObj] = useState(null);

  window.prizePos = prizePos;
  useEffect(() => {
    setPrizePos(placePrize(grid));
  }, [grid]);

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
  }, [grid, heroPos, visionRange]);
  // Handle hero movement
  const moveHero = (direction) => {
    const newPos = { ...heroPos };
    switch (direction) {
      case "up":
        if (newPos.x > 0 && grid[newPos.x - 1][newPos.y] === 0) newPos.x -= 1;
        else return false;
        break;
      case "down":
        if (newPos.x < rows - 1 && grid[newPos.x + 1][newPos.y] === 0)
          newPos.x += 1;
        else return false;
        break;
      case "left":
        if (newPos.y > 0 && grid[newPos.x][newPos.y - 1] === 0) newPos.y -= 1;
        else return false;
        break;
      case "right":
        if (newPos.y < cols - 1 && grid[newPos.x][newPos.y + 1] === 0)
          newPos.y += 1;
        else return false;
        break;
      default:
        return false;
        break;
    }
    setHeroPos(newPos);
    return true;
  };

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case "w":
        case "ArrowUp":
        case "8":
          moveHero("up");
          break;
        case "s":
        case "ArrowDown":
        case "2":
          moveHero("down");
          break;
        case "a":
        case "ArrowLeft":
        case "4":
          moveHero("left");
          break;
        case "d":
        case "ArrowRight":
        case "6":
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

  useEffect(() => {
    if (!autoPlay || gameOver || !prizePos) return;

    let dfsPath = [];
    const visited = Array(rows)
      .fill(null)
      .map(() => Array(cols).fill(false));

    const directions = [
      { dx: -1, dy: 0, dir: "up" },
      { dx: 1, dy: 0, dir: "down" },
      { dx: 0, dy: -1, dir: "left" },
      { dx: 0, dy: 1, dir: "right" },
    ];

    // DFS function
    const dfs = (x, y, prevDir = null) => {
      if (
        x < 0 ||
        y < 0 ||
        x >= rows ||
        y >= cols ||
        visited[x][y] ||
        grid[x][y] === 1
      ) {
        return false;
      }

      visited[x][y] = true;

      // Count this as a step only if it's a junction or a change in direction
      const validChoices = directions.filter(
        ({ dx, dy }) =>
          x + dx >= 0 &&
          y + dy >= 0 &&
          x + dx < rows &&
          y + dy < cols &&
          !visited[x + dx][y + dy] &&
          grid[x + dx][y + dy] === 0
      );

      // Add to the path if it's a junction or direction changes
      const currentDir = validChoices[0]?.dir || prevDir;

      dfsPath.push({ x, y, type: "explore", dir: currentDir });

      if (x === prizePos.x && y === prizePos.y) {
        dfsPath.push({ x, y, type: "prize", dir: currentDir });
        return true;
      }

      for (const { dx, dy, dir } of directions) {
        if (dfs(x + dx, y + dy, dir)) {
          return true;
        }
      }
      dfsPath.push({ x, y, type: "backtrack", dir: OPPOSITE[prevDir] });


      return false;
    };

    // Start DFS from the hero's position
    dfs(heroPos.x, heroPos.y);
    console.log('--->',heroPos.x,heroPos.y)
    console.log(dfsPath);
    let currentStep = 0;

    // Interval to move the hero
    const interval = setInterval(() => {
      if (currentStep >= dfsPath.length) {
        clearInterval(interval);
        return;
      }

      const { x, y, type, dir } = dfsPath[currentStep];
      if (type === "explore" || type === "backtrack" || type === "prize") {
        console.log("out-", moveHero(dir));
      }
      console.log("@step:", currentStep);
      currentStep++;
    }, 100);

    // Cleanup on component unmount or state change
    return () => clearInterval(interval);
  }, [autoPlay, prizePos, grid, gameOver]);

  // Check if the hero reaches the prize
  useEffect(() => {
    if (!heroPos || !prizePos) return;
    if (heroPos.x === prizePos.x && heroPos.y === prizePos.y) {
      setGameOver(true);
    }
  }, [heroPos, prizePos, grid]);

  useEffect(() => {
    if (gameOver) {
      setGrid(generateMaze(rows, cols)); // Regenerate maze on prize reach
      setIllGrid(generateDark(rows, cols));
      setHeroPos({ x: 1, y: 1 }); // Reset hero position
    }
  }, [gameOver]);
  // Render the grid and mini map
  return (
    <div className="game-container h-full">
      <div className="map-container h-full">
        {gameOver || (
          <div className="stack items-center justify-between h-full">
            <div className="full-map">
              <MiniMap
                grid={grid}
                illGrid={illGrid}
                heroPos={heroPos}
                prizePos={prizePos}
              />
            </div>
            <div className="current-map">
              {gridT.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                  {row.map(([cell, i, j], colIndex) => (
                    <div
                      key={colIndex}
                      className={`cell ${cell === 0 ? "path" : "wall"} ${
                        heroPos?.x === i && heroPos?.y === j ? "hero" : ""
                      } ${
                        prizePos?.x === i && prizePos?.y === j ? "prize" : ""
                      }`}
                    >
                      {heroPos?.x === i && heroPos?.y === j ? "d" : ""}
                      {prizePos?.x === i && prizePos?.y === j ? "💎" : ""}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="options">
              <button
                className="p-3 rounded-full bg-gray-800"
                onClick={() => setAutoPlay((e) => !e)}
              >
                AUTO:{autoPlay ? "on" : "off"}
              </button>
              heropos {heroPos.x} {heroPos.y}
            </div>
          </div>
        )}
        {gameOver && (
          <div className="overview">
            {grid.map((row, i) => (
              <div key={i} className="row">
                {row.map((cell, j) => (
                  <div
                    key={j}
                    className={`cell ${cell === 0 ? "path" : "wall"} ${
                      prizePos?.x === i && prizePos?.y === j ? "prize" : ""
                    }`}
                  >
                    {heroPos?.x === i && heroPos?.y === j ? "d" : ""}
                    {prizePos?.x === i && prizePos?.y === j ? "💎" : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const MiniMap = ({ grid, illGrid, heroPos, prizePos }) => {
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
              } ${
                prizePos?.x === rowIndex && prizePos?.y === colIndex
                  ? "prize"
                  : ""
              }`}
            ></div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GridGame;
