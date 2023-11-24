import { Howl } from "howler";

export class GameState {
  readonly bounceSound = new Howl({
    src: require("../assets/sounds/bounce.wav"),
    volume: 3,
  });
  readonly brickbreakSound = new Howl({
    src: require("../assets/sounds/brickbreak.wav"),
    volume: 3,
  });
  readonly background1 = new Howl({
    src: require("../assets/sounds/background1.mp3"),
    loop: true,
    volume: 0.6,
  });
  readonly background2 = new Howl({
    src: require("../assets/sounds/background2.mp3"),
    loop: true,
    volume: 0.6,
  });

  readonly canvasH: number = 580;
  readonly canvasW: number = 920;

  round: number = 1;

  score: number = 0;
  lives: number = 3;

  gameOver: boolean = false;
  won: boolean = false;

  x: number = this.canvasW / 2;
  y: number = this.canvasH - 30;

  dx: number = 5;
  dy: number = -4;

  ballRadius: number = 8;

  paddleH: number = 10;
  paddleW: number = 75;

  paddleX: number = (this.canvasW - this.paddleW) / 2;

  rightPressed: boolean = false;
  leftPressed: boolean = false;

  brickRowCount: number = 1;
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

  playBackgroundSound() {
    console.log("play backgroud sound");
    // console.log(this.round, this.background1.playing);
    if (this.round === 1 && !this.background1.playing()) {
      console.log("background-one");
      this.background1.play();
    }
    if (this.round === 2 && !this.background2.playing()) {
      this.background2.play();
    }
  }

  resetGame(rows = 1, roundReset = true) {
    if (roundReset) this.round = 1;
    this.score = 0;
    this.lives = 3;
    this.gameOver = false;
    this.won = false;

    this.x = this.canvasW / 2;
    this.y = this.canvasH - 30;

    this.dx = 5;
    this.dy = -4;

    this.ballRadius = 8;

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
        Howler.stop();
        this.background2.play();
        this.resetGame(6, false);
        break;
      case 3:
        this.resetGame(8, false);
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
          this.brickbreakSound.play();
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
        this.bounceSound.play();
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
          this.dx = 5;
          this.dy = -4;
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
