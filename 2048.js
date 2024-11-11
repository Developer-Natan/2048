// --- Game Variables ---
let board;
let score = 0;
const rows = 4;
const columns = 4;

// --- Initialize Game on Window Load ---
window.onload = function () {
  initializeGame();
};

// --- Game Initialization ---
function initializeGame() {
  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  setupBoard();
  addControlListeners();

  // Start game with two initial tiles
  setTwo();
  setTwo();
}

// --- Board Setup ---
function setupBoard() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      updateTile(tile, board[r][c]);
      document.getElementById("board").append(tile);
    }
  }
}

// --- Control Listeners Setup ---
function addControlListeners() {
  document.addEventListener("keyup", handleKeyboardInput);

  // Set up control button event listeners
  document
    .getElementById("upBtn")
    .addEventListener("click", () => handleMove("up"));
  document
    .getElementById("downBtn")
    .addEventListener("click", () => handleMove("down"));
  document
    .getElementById("leftBtn")
    .addEventListener("click", () => handleMove("left"));
  document
    .getElementById("rightBtn")
    .addEventListener("click", () => handleMove("right"));
}

function handleKeyboardInput(e) {
  const directionMap = {
    ArrowLeft: "left",
    ArrowRight: "right",
    ArrowUp: "up",
    ArrowDown: "down",
  };
  if (directionMap[e.code]) handleMove(directionMap[e.code]);
}

// --- Handle Moves and Update Score ---
function handleMove(direction) {
  const slideFunctions = {
    up: slideUp,
    down: slideDown,
    left: slideLeft,
    right: slideRight,
  };

  if (slideFunctions[direction]) {
    slideFunctions[direction]();
    setTwo();
    document.getElementById("score").innerText = score;
  }
}

// --- Tile Update ---
function updateTile(tile, num) {
  tile.innerText = "";
  tile.className = ""; // Clear classes
  tile.classList.add("tile", "tile-new", "tile-new-bounce");

  // Add the number only if > 0
  if (num > 0) {
    const numberElement = document.createElement("span");
    numberElement.classList.add("tile-number");
    numberElement.innerText = num.toString();
    tile.appendChild(numberElement);
    tile.classList.add(`x${num}`);
  }
}

// --- Sliding Functions ---
function slideLeft() {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    board[r] = slide(row);
    updateRowTiles(r);
  }
}

function slideRight() {
  for (let r = 0; r < rows; r++) {
    let row = board[r].reverse();
    board[r] = slide(row).reverse();
    updateRowTiles(r);
  }
}

function slideUp() {
  for (let c = 0; c < columns; c++) {
    let column = board.map((row) => row[c]);
    column = slide(column);
    updateColumnTiles(c, column);
  }
}

function slideDown() {
  for (let c = 0; c < columns; c++) {
    let column = board.map((row) => row[c]).reverse();
    column = slide(column).reverse();
    updateColumnTiles(c, column);
  }
}

// --- Update Tile Functions ---
function updateRowTiles(r) {
  for (let c = 0; c < columns; c++) {
    updateTile(document.getElementById(`${r}-${c}`), board[r][c]);
  }
}

function updateColumnTiles(c, column) {
  for (let r = 0; r < rows; r++) {
    board[r][c] = column[r];
    updateTile(document.getElementById(`${r}-${c}`), board[r][c]);
  }
}

// --- Utility Functions ---
function filterZero(row) {
  return row.filter((num) => num !== 0);
}

function slide(row) {
  row = filterZero(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  row = filterZero(row);
  while (row.length < columns) row.push(0);
  return row;
}

function setTwo() {
  if (!hasEmptyTile()) return;

  let found = false;
  while (!found) {
    let r = Math.floor(Math.random() * rows);
    let c = Math.floor(Math.random() * columns);
    if (board[r][c] === 0) {
      board[r][c] = 2;
      updateTile(document.getElementById(`${r}-${c}`), 2);
      found = true;
    }
  }
}

function hasEmptyTile() {
  return board.some((row) => row.includes(0));
}
