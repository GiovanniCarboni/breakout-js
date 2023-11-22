import { useEffect, useRef } from "react";
import styled from "styled-components";
import * as draw from "../game/drawFncs";

const StyledCanvas = styled.canvas`
  background-color: #fff;
  margin: 6vh auto;
  display: block;
`;

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    let animationFrameId: number;

    let score = 0;
    let lives = 3;

    let x = canvas.width / 2;
    let y = canvas.height - 30;

    let dx = 2;
    let dy = -2;

    const ballRadius = 10;

    const paddleHeight = 10;
    const paddleWidth = 75;

    let paddleX = (canvas.width - paddleWidth) / 2;

    let rightPressed = false;
    let leftPressed = false;

    const brickRowCount = 8;
    const brickColumnCount = 12;
    const brickWidth = 62;
    const brickHeight = 20;

    const bricks: { x: number; y: number; status: boolean }[][] = [];
    for (let c = 0; c < brickColumnCount; c++) {
      bricks[c] = [];
      for (let r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: true };
      }
    }

    if (!ctx) return;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      draw.ball(ctx, x, y, ballRadius);
      draw.paddle(ctx, paddleX, paddleHeight, paddleWidth);
      draw.bricks(ctx, brickColumnCount, brickRowCount, bricks);
      draw.score(ctx, score);
      draw.lives(ctx, lives);
      collisionDetection();

      // ball movement
      if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
          dy = -dy;
        } else {
          lives--;
          if (!lives) {
            alert("Game Over");
            document.location.reload();
          } else {
            x = canvas.width / 2;
            y = canvas.height - 30;
            dx = 2;
            dy = -2;
            paddleX = (canvas.width - paddleWidth) / 2;
          }
        }
      }
      if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
      }
      x += dx;
      y += dy;

      // paddle movement
      if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
      } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
      }
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    function collisionDetection() {
      for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
          const b = bricks[c][r];
          if (b.status === false) continue;
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = false;
            score++;
            if (score === brickRowCount * brickColumnCount) {
              alert("You win!");
              document.location.reload();
            }
          }
        }
      }
    }

    function mouseMoveHandler(e: MouseEvent) {
      const relativeX = e.clientX - canvas.offsetLeft;
      if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
      }
    }

    function keyDownHandler(e: KeyboardEvent) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = true;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = true;
      }
    }

    function keyUpHandler(e: KeyboardEvent) {
      if (e.key === "Right" || e.key === "ArrowRight") {
        rightPressed = false;
      } else if (e.key === "Left" || e.key === "ArrowLeft") {
        leftPressed = false;
      }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      document.removeEventListener("keydown", keyDownHandler, false);
      document.removeEventListener("keyup", keyUpHandler, false);
      document.removeEventListener("mousemove", mouseMoveHandler, false);
    };
  }, []);

  return <StyledCanvas ref={canvasRef} width="920" height="580" />;
}
