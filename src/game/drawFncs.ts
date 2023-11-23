import state from "./gameState";

// BALL /////////////////////////////////////////////////////////////////////////////////////
export function ball(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(state.x, state.y, state.ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// PADDLE /////////////////////////////////////////////////////////////////////////////////////
export function paddle(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.rect(
    state.paddleX,
    state.canvasH - state.paddleH,
    state.paddleW,
    state.paddleH
  );
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
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
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      state.bricks[c][r].x = brickX;
      state.bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  }
}

// SCORE /////////////////////////////////////////////////////////////////////////////////////
export function score(ctx: CanvasRenderingContext2D) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${state.score}`, 8, 20);
}

// LIVES /////////////////////////////////////////////////////////////////////////////////////
export function lives(ctx: CanvasRenderingContext2D) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${state.lives}`, state.canvasW - 135, 30);
}

// ROUND /////////////////////////////////////////////////////////////////////////////////////
export function round(ctx: CanvasRenderingContext2D) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Round: ${state.round}`, state.canvasW - 220, 30);
}
