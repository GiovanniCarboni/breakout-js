import state from "./gameState";

// BALL /////////////////////////////////////////////////////////////////////////////////////
export function ball(ctx: CanvasRenderingContext2D) {
  const img = new Image();
  img.src = require("../assets/elements/ball.png");
  // ctx.beginPath();
  // ctx.arc(state.x, state.y, state.ballRadius, 0, Math.PI * 2);
  // ctx.closePath();
  ctx.drawImage(img, state.x - 5, state.y - 5);
}

// PADDLE /////////////////////////////////////////////////////////////////////////////////////
export function paddle(ctx: CanvasRenderingContext2D) {
  const img = new Image();
  img.src = require("../assets/elements/paddle.png");
  ctx.beginPath();
  ctx.rect(
    state.paddleX,
    state.canvasH - state.paddleH,
    state.paddleW,
    state.paddleH
  );
  ctx.fillStyle = "#333";
  // const pattern = ctx.createPattern(img, "no-repeat");
  // if (pattern) ctx.fillStyle = pattern;
  ctx.fill();
  ctx.closePath();

  ctx.drawImage(
    img,
    state.paddleX,
    state.canvasH - state.paddleH,
    state.paddleW,
    state.paddleH
  );
}

// BRICKS /////////////////////////////////////////////////////////////////////////////////////
export function bricks(ctx: CanvasRenderingContext2D) {
  const brickWidth = 62;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 50;
  const brickOffsetLeft = 30;

  for (let c = 0; c < state.brickColumnCount; c++) {
    for (let r = 0; r < state.brickRowCount; r++) {
      if (state.bricks[c][r].status === false) continue;
      const img = new Image();
      img.src = require("../assets/elements/blocks.png");
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      state.bricks[c][r].x = brickX;
      state.bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = "#333";
      ctx.fill();
      // const pattern = ctx.createPattern(img, "repeat");
      // if (pattern) ctx.fillStyle = pattern;
      // ctx.fill();
      ctx.closePath();

      // const possibleValue = [0, 61, 122, 183, 244, 305, 366, 432];

      // ctx.drawImage(
      //   img,
      //   // possibleValue[Math.ceil(Math.random() * 10) - 1],
      //   61,
      //   0,
      //   61,
      //   28,
      //   brickX,
      //   brickY,
      //   brickWidth,
      //   brickHeight
      // );
    }
  }
}

// SCORE /////////////////////////////////////////////////////////////////////////////////////
export function score(ctx: CanvasRenderingContext2D) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText(`Score: ${state.score}`, 8, 20);
}

// LIVES /////////////////////////////////////////////////////////////////////////////////////
export function lives(ctx: CanvasRenderingContext2D) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText(`Lives: ${state.lives}`, state.canvasW - 135, 30);
}

// ROUND /////////////////////////////////////////////////////////////////////////////////////
export function round(ctx: CanvasRenderingContext2D) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333";
  ctx.fillText(`Round: ${state.round}`, state.canvasW - 220, 30);
}
