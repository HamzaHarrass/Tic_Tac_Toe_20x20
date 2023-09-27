document.addEventListener('DOMContentLoaded', () => {
  const boardSize = 20;
  const winLength = 5; // Number of symbols in a row to win
  const board = document.querySelector(".board");
  const squares = [];
  let turn = 'X';
  let playerXScore = 0; // Initialize scores for Player X
  let playerOScore = 0; // Initialize scores for Player O

  // Create the game board
  for (let i = 0; i < boardSize * boardSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add("cell");
    board.append(cell);
  }



  
  // Function to check if there's a winner
  function checkWinner(turn, row, col) {
    function checkDirection(dx, dy) {
      let count = 0;
      for (let i = -winLength + 1; i < winLength; i++) {
        const r = row + i * dx;
        const c = col + i * dy;
        if (r >= 0 && r < boardSize && c >= 0 && c < boardSize && squares[r][c] === turn) {
          count++;
          if (count === winLength){
            displayWinMessage(turn);
            return true;
          }
        } else {
          count = 0;
        }
      }
      return false;
    }
  
    if (checkDirection(0, 1) || checkDirection(1, 0) || checkDirection(1, 1) || checkDirection(1, -1)) {
      if (turn === 'X') {
        playerXScore++; // Increment Player X's score
      } else {
        playerOScore++; // Increment Player O's score
      }
      updateScores(); // Update the displayed scores

      highlightWinningCells(row, col, 'row'); // To highlight the winning row
      highlightWinningCells(row, col, 'column'); // To highlight the winning column
      highlightWinningCells(row, col, 'diagonal'); // To highlight the winning diagonal
      
      /*restartGame();*/
      return true;
    }
    return (
      checkDirection(0, 1) || // Horizontal
      checkDirection(1, 0) || // Vertical
      checkDirection(1, 1) || // Diagonal (top-left to bottom-right)
      checkDirection(1, -1) // Diagonal (top-right to bottom-left)
    );

  }



  function highlightWinningCells(row, col, direction) {
    // Reset all cell styles
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.style.backgroundColor = '';
      cell.style.color = '';
    });
  
    // Highlight the winning cells based on the given direction
    for (let i = 0; i < winLength; i++) {
      let r, c;
      if (direction === 'row') {
        r = row;
        c = col + i;
      } else if (direction === 'column') {
        r = row + i;
        c = col;
      } else if (direction === 'diagonal') {
        r = row + i;
        c = col + i;
      }
  
      if (r >= 0 && r < boardSize && c >= 0 && c < boardSize) {
        const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"]`);
        cell.style.backgroundColor = 'green';
        cell.style.color = 'white';
      }
    }
  }
  



  function displayWinMessage(player) {
    const winMessage = document.getElementById("win-message");
    const messageParagraph = winMessage.querySelector("p");
    messageParagraph.textContent = `${player} wins!`;
    winMessage.classList.remove("hidden");
  }

  function restartGame() {
    // Clear the board visually and reset the squares array
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.innerHTML = '';
      cell.classList.remove('winning');
    });
  
    for (let i = 0; i < boardSize; i++) {
      squares[i] = new Array(boardSize).fill('');
    }
  
    // Reset the turn to 'X'
    turn = 'X';
    localStorage.clear();
  }



  function updateScores() {
    const playerXScoreElement = document.querySelector(".playerX-score:nth-child(1)");
    const playerOScoreElement = document.querySelector(".playerO-score:nth-child(2)");
  
    playerXScoreElement.textContent = `Player X: ${playerXScore}`;
    playerOScoreElement.textContent = `Player O: ${playerOScore}`;
  }
  



  function saveGameState() {
    localStorage.setItem('squares', JSON.stringify(squares));
    localStorage.setItem('turn', turn);
  }

  // Function to load the game state from localStorage
  function loadGameState() {
    const savedSquares = localStorage.getItem('squares');
    const savedTurn = localStorage.getItem('turn');

    if (savedSquares && savedTurn) {
      squares.length = 0; // Clear the current game board
      const parsedSquares = JSON.parse(savedSquares);
      for (let i = 0; i < boardSize; i++) {
        squares.push([...parsedSquares[i]]);
      }
      turn = savedTurn;

      // Update the visual board based on the loaded game state
      const cells = document.querySelectorAll('.cell');
      cells.forEach((cell, index) => {
        const row = Math.floor(index / boardSize);
        const col = index % boardSize;
        cell.innerHTML = squares[row][col];
      });
    }
  }


  loadGameState();




  if (squares.length === 0) {
    for (let i = 0; i < boardSize; i++) {
      squares.push(new Array(boardSize).fill(''));
    }
  }

  // Save the game state when any move is made
  saveGameState();





  // Event listener for cell clicks
  board.addEventListener('click', (event) => {
    const cell = event.target;
    if (!cell.classList.contains('cell') || cell.innerHTML !== '') {
      return; // Cell is already taken or not a valid cell
    }

    cell.innerHTML = turn; // Mark the cell with X or O
    const row = Math.floor(Array.from(cell.parentNode.children).indexOf(cell) / boardSize);
    const col = Array.from(cell.parentNode.children).indexOf(cell) % boardSize;
    squares[row][col] = turn; // Update the game state

    if (checkWinner(turn, row, col)) {
      /µrestartGame();*/
    } else {
      turn = turn === 'X' ? 'O' : 'X'; // Switch player's turn
    }
  });

  // Initialize the board as an empty 2D array
  for (let i = 0; i < boardSize; i++) {
    squares.push(new Array(boardSize).fill(''));
  }
});
