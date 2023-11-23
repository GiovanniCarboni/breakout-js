export class GameState {
  readonly canvasH: number = 580;
  readonly canvasW: number = 920;

  round: number = 1;

  score: number = 0;
  lives: number = 1;

  gameOver: boolean = false;
  won: boolean = false;

  x: number = this.canvasW / 2;
  y: number = this.canvasH - 30;

  dx: number = -3;
  dy: number = -3;

  ballRadius: number = 10;

  paddleH: number = 10;
  paddleW: number = 75;

  paddleX: number = (this.canvasW - this.paddleW) / 2;

  rightPressed: boolean = false;
  leftPressed: boolean = false;

  brickRowCount: number = 3;
  brickColumnCount: number = 12;
  brickWidth: number = 62;
  brickHeight: number = 20;

  bricks: { x: number; y: number; status: boolean }[][] = [];

  constructor() {
    this.defineBricks();
  }

  private defineBricks() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      this.bricks[c] = [];
      for (let r = 0; r < this.brickRowCount; r++) {
        this.bricks[c][r] = { x: 0, y: 0, status: true };
      }
    }
  }

  resetGame(rows = 3, roundReset = true) {
    if (roundReset) this.round = 1;
    this.score = 0;
    this.lives = 1;
    this.gameOver = false;
    this.won = false;

    this.x = this.canvasW / 2;
    this.y = this.canvasH - 30;

    this.dx = -3;
    this.dy = -3;

    this.ballRadius = 10;

    this.paddleH = 10;
    this.paddleW = 75;

    this.paddleX = (this.canvasW - this.paddleW) / 2;

    this.rightPressed = false;
    this.leftPressed = false;

    this.brickRowCount = rows;
    this.brickColumnCount = 12;
    this.brickWidth = 62;
    this.brickHeight = 20;

    this.defineBricks();
  }

  advanceLevel() {
    this.round += 1;
    switch (this.round) {
      case 2:
        this.resetGame(6, false);
        break;
      default:
        this.won = true;
        this.round = 1;
    }
  }

  detectCollision() {
    for (let c = 0; c < this.brickColumnCount; c++) {
      for (let r = 0; r < this.brickRowCount; r++) {
        const b = this.bricks[c][r];
        if (b.status === false) continue;
        if (
          this.x > b.x &&
          this.x < b.x + this.brickWidth &&
          this.y > b.y &&
          this.y < b.y + this.brickHeight
        ) {
          this.dy = -this.dy;
          b.status = false;
          this.score++;
          // WIN ROUND
          if (this.score === this.brickRowCount * this.brickColumnCount) {
            this.advanceLevel();
          }
        }
      }
    }
  }

  moveBall() {
    // if it touches the top edge
    if (this.y + this.dy < this.ballRadius) {
      this.dy = -this.dy;
      // if it touches the bottom edge
    } else if (this.y + this.dy > this.canvasH - this.ballRadius) {
      // if it fell on the paddle
      if (this.x > this.paddleX && this.x < this.paddleX + this.paddleW) {
        this.dy = -this.dy;
        // if it fell out of the paddle
      } else {
        this.lives--;
        // no more lives, GAME OVER
        if (!this.lives) {
          this.gameOver = true;
          this.round = 1;
          // there are lives, reset position
        } else {
          this.x = this.canvasW / 2;
          this.y = this.canvasH - 30;
          this.dx = 2;
          this.dy = -2;
          this.paddleX = (this.canvasW - this.paddleW) / 2;
        }
      }
    }
    // if it touches one of the other edges
    if (
      this.x + this.dx > this.canvasW - this.ballRadius ||
      this.x + this.dx < this.ballRadius
    ) {
      this.dx = -this.dx;
    }
    // the ball moves
    this.x += this.dx;
    this.y += this.dy;
  }

  movePaddle() {
    if (this.rightPressed) {
      this.paddleX = Math.min(this.paddleX + 7, this.canvasW - this.paddleW);
    } else if (this.leftPressed) {
      this.paddleX = Math.max(this.paddleX - 7, 0);
    }
  }
}

let state = new GameState();
export default state;
