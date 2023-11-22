const canvasH = 580;
const canvasW = 920;

// BALL
export function ball(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  ballRadius: number
) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// PADDLE
export function paddle(
  ctx: CanvasRenderingContext2D,
  paddleX: number,
  paddleH: number,
  paddleW: number
) {
  ctx.beginPath();
  ctx.rect(paddleX, canvasH - paddleH, paddleW, paddleH);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// BRICKS
export function bricks(
  ctx: CanvasRenderingContext2D,
  brickColumnCount: number,
  brickRowCount: number,
  bricks: { x: number; y: number; status: boolean }[][]
) {
  const brickWidth = 62;
  const brickHeight = 20;
  const brickPadding = 10;
  const brickOffsetTop = 30;
  const brickOffsetLeft = 30;

  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === false) continue;
      const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
      const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
      bricks[c][r].x = brickX;
      bricks[c][r].y = brickY;
      ctx.beginPath();
      ctx.rect(brickX, brickY, brickWidth, brickHeight);
      ctx.fillStyle = "#0095DD";
      ctx.fill();
      ctx.closePath();
    }
  }
}

// SCORE
export function score(ctx: CanvasRenderingContext2D, score: number) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Score: ${score}`, 8, 20);
}

// LIVES
export function lives(ctx: CanvasRenderingContext2D, lives: number) {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(`Lives: ${lives}`, canvasW - 65, 20);
}
