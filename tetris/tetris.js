const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 게임 설정
const ROWS = 20;
const COLUMNS = 10;
const BLOCK_SIZE = 30; // 블록 크기

// 테트리미노 모양 정의
const TETROMINOS = [
  [[1, 1, 1], [0, 1, 0]], // T
  [[1, 1, 0], [0, 1, 1]], // Z
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1], [1, 1]],       // O
  [[1, 1, 1, 1]],         // I
  [[1, 1, 1], [1, 0, 0]], // L
  [[1, 1, 1], [0, 0, 1]]  // J
];

// 게임 상태 변수
let board = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0)); // 빈 보드
let currentPiece = generatePiece();
let gameOver = false;
let gameInterval; // 게임 속도 조절을 위한 변수

// 랜덤으로 테트리미노 생성
function generatePiece() {
  const shape = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
  return {
    shape: shape,
    x: Math.floor(COLUMNS / 2) - Math.floor(shape[0].length / 2),
    y: 0
  };
}

// 블록 그리기
function drawBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 보드 그리기
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLUMNS; col++) {
      if (board[row][col] !== 0) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(col * BLOCK_SIZE, row * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }

  // 현재 테트리미노 그리기
  const { shape, x, y } = currentPiece;
  ctx.fillStyle = 'red';
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        ctx.fillRect((x + col) * BLOCK_SIZE, (y + row) * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
      }
    }
  }
}

// 테트리미노가 내려갈 수 있는지 확인
function canMove(dx, dy, shape) {
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        const newX = currentPiece.x + col + dx;
        const newY = currentPiece.y + row + dy;

        if (newX < 0 || newX >= COLUMNS || newY >= ROWS || board[newY] && board[newY][newX] !== 0) {
          return false;
        }
      }
    }
  }
  return true;
}

// 테트리미노를 내려보내기
function dropPiece() {
  if (canMove(0, 1, currentPiece.shape)) {
    currentPiece.y++;
  } else {
    placePiece();
    currentPiece = generatePiece();
    if (!canMove(0, 0, currentPiece.shape)) {
      gameOver = true; // 게임 오버
    }
  }
}

// 테트리미노를 보드에 고정
function placePiece() {
  const { shape, x, y } = currentPiece;
  for (let row = 0; row < shape.length; row++) {
    for (let col = 0; col < shape[row].length; col++) {
      if (shape[row][col] !== 0) {
        board[y + row][x + col] = 1;
      }
    }
  }

  // 라인 제거
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row].every(cell => cell !== 0)) {
      board.splice(row, 1);
      board.unshift(Array(COLUMNS).fill(0)); // 새로운 빈 라인 추가
    }
  }
}

// 키 입력 처리
function movePiece(event) {
  if (gameOver) return;

  switch (event.key) {
    case 'ArrowLeft':
      if (canMove(-1, 0, currentPiece.shape)) {
        currentPiece.x--;
      }
      break;
    case 'ArrowRight':
      if (canMove(1, 0, currentPiece.shape)) {
        currentPiece.x++;
      }
      break;
    case 'ArrowDown':
      dropPiece();
      break;
    case 'ArrowUp':
      const rotatedShape = rotate(currentPiece.shape);
      if (canMove(0, 0, rotatedShape)) {
        currentPiece.shape = rotatedShape;
      }
      break;
  }
}

// 테트리미노 회전
function rotate(shape) {
  return shape[0].map((_, index) => shape.map(row => row[index])).reverse();
}

// 게임 루프
function gameLoop() {
  if (gameOver) {
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over!', canvas.width / 4, canvas.height / 2);
    clearInterval(gameInterval); // 게임 오버 시 인터벌 멈추기
    return;
  }

  dropPiece();
  drawBoard();
}

// 게임 속도를 조절하는 함수 (1초마다 블록이 내려오도록 설정)
function startGame() {
  gameInterval = setInterval(gameLoop, 1000); // 1000ms (1초) 간격으로 dropPiece 실행
}

// 게임 시작
document.addEventListener('keydown', movePiece);
startGame();
