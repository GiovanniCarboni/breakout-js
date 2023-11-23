import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import state from "../game/gameState";
import * as draw from "../game/drawFncs";
import { useEvent } from "react-use";
import StartScreen from "./UI/StartScreen";
import PauseScreen from "./UI/PauseScreen";
import GameOverScreen from "./UI/GameOver";
import GameWonScreen from "./UI/GameWon";
import { pause } from "../assets/icons";

interface CanvasProps {}

const CanvasContainer = styled.div<CanvasProps>`
  margin: 6vh 0;
  position: relative;

  canvas {
    margin: 0 auto;
    background-color: #fff;
    display: block;
    &::after {
      content: "";
      width: 10px;
      height: 10px;
      background-color: red;
    }
  }

  #overlay {
    width: 920px;
    margin: 0 auto;
    position: absolute;
    /* background-color: #49dcfa57; */
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .pause-btn {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 30px;
    height: 30px;
    width: 30px;
    img {
      width: 100%;
    }
  }
`;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [animationFrame, setAnimationFrame] = useState<number | null>(null);
  const [startScreenVisible, setStartScreenVisible] = useState<boolean>(true);
  const [pauseScreenVisible, setPauseScreenVisible] = useState<boolean>(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isGameWon, setIsGameWon] = useState<boolean>(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
  }, []);

  const runGame = () => {
    setStartScreenVisible(false);
    setPauseScreenVisible(false);
    if (!ctx) return;
    const render = () => {
      ctx.clearRect(0, 0, state.canvasW, state.canvasH);
      draw.ball(ctx);
      draw.paddle(ctx);
      draw.bricks(ctx);
      // draw.score(ctx);
      draw.lives(ctx);
      draw.round(ctx);
      state.detectCollision();
      state.moveBall();
      state.movePaddle();

      if (state.gameOver) {
        window.cancelAnimationFrame(animationFrame!);
        setAnimationFrame(0);
        setIsGameOver(true);
        return;
      }
      if (state.won) {
        window.cancelAnimationFrame(animationFrame!);
        setAnimationFrame(0);
        setIsGameWon(true);
        return;
      }
      const frameId = window.requestAnimationFrame(render);
      setAnimationFrame(frameId);
    };
    render();
  };

  const stopGame = () => {
    if (animationFrame) window.cancelAnimationFrame(animationFrame);
    if (pauseScreenVisible) setPauseScreenVisible(false);
    setIsGameOver(false);
    setIsGameWon(false);
    setAnimationFrame(null);
    setStartScreenVisible(true);
    state.resetGame();
  };

  const pauseGame = () => {
    if (!animationFrame) return;
    window.cancelAnimationFrame(animationFrame);
    setAnimationFrame(null);
    setPauseScreenVisible(true);
  };

  const reloadGame = () => {
    state.resetGame();
    setIsGameOver(false);
    setIsGameWon(false);
    runGame();
  };

  useEvent("mousemove", (e: MouseEvent) => {
    const relativeX = e.clientX - canvasRef.current!.offsetLeft;
    if (relativeX > 0 && relativeX < state.canvasW) {
      state.paddleX = relativeX - state.paddleW / 2;
    }
  });

  useEvent("keydown", (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
      state.rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      state.leftPressed = true;
    }
    if (e.code === "Escape" || e.keyCode === 27) {
      pauseGame();
    }
  });

  useEvent("keyup", (e: KeyboardEvent) => {
    if (e.key === "Right" || e.key === "ArrowRight") {
      state.rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      state.leftPressed = false;
    }
  });

  return (
    <CanvasContainer>
      {startScreenVisible && !animationFrame && (
        <div id="overlay">
          <StartScreen runGame={runGame} />
        </div>
      )}
      {pauseScreenVisible && !animationFrame && !isGameOver && !isGameWon && (
        <div id="overlay">
          <PauseScreen
            runGame={runGame}
            stopGame={stopGame}
            reloadGame={reloadGame}
          ></PauseScreen>
        </div>
      )}
      {isGameOver && (
        <div id="overlay">
          <GameOverScreen reloadGame={reloadGame} stopGame={stopGame} />
        </div>
      )}
      {isGameWon && (
        <div id="overlay">
          <GameWonScreen reloadGame={reloadGame} stopGame={stopGame} />
        </div>
      )}
      {animationFrame && (
        <div id="overlay">
          <button className="pause-btn" onClick={pauseGame}>
            <img src={pause} alt="pause icon" />
          </button>
        </div>
      )}
      <canvas ref={canvasRef} width="920" height="580" />
    </CanvasContainer>
  );
}
