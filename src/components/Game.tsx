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
import background from "../assets/elements/background.png";
import heart from "../assets/icons/heart.svg";

interface CanvasProps {}

const CanvasContainer = styled.div<CanvasProps>`
  margin: 6vh 0;
  position: relative;

  canvas {
    margin: 0 auto;
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
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .ingame-interface {
    display: flex;
    color: #fff;
    width: 100%;
    justify-content: space-between;
    padding: 10px 30px;
    .stats {
      display: flex;
      align-items: center;
      gap: 10px;
      .lives {
        display: flex;
        gap: 3px;
        img {
          width: 15px;
        }
      }
    }
    .pause-btn {
      cursor: pointer;
      height: 30px;
      width: 30px;
      img {
        width: 100%;
      }
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
  const [backgroundImage, setBackgroundImage] =
    useState<CanvasImageSource | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
    const img = new Image();
    img.src = background;
    setBackgroundImage(img);
  }, []);

  const runGame = () => {
    state.playBackgroundSound();
    setStartScreenVisible(false);
    setPauseScreenVisible(false);
    if (!ctx) return;
    const render = () => {
      ctx.clearRect(0, 0, state.canvasW, state.canvasH);

      if (backgroundImage)
        ctx.drawImage(backgroundImage, 0, 0, state.canvasW, state.canvasH);

      draw.ball(ctx);
      draw.paddle(ctx);
      draw.bricks(ctx);
      // draw.score(ctx);
      // draw.lives(ctx);
      // draw.round(ctx);
      state.detectCollision();
      state.moveBall();
      state.movePaddle();

      if (state.gameOver) {
        Howler.stop();
        window.cancelAnimationFrame(animationFrame!);
        setAnimationFrame(null);
        setIsGameOver(true);
        return;
      }
      if (state.won) {
        Howler.stop();
        window.cancelAnimationFrame(animationFrame!);
        setAnimationFrame(null);
        setIsGameWon(true);
        return;
      }
      const frameId = window.requestAnimationFrame(render);
      setAnimationFrame(frameId);
    };
    render();
  };

  const stopGame = () => {
    Howler.stop();
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
    Howler.stop();
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
          <div className="ingame-interface">
            <div className="stats">
              <p>Round: {state.round}</p>
              <div className="lives">
                {Array.from(Array(state.lives).keys()).map(() => (
                  <img src={heart} alt="heart" />
                ))}
              </div>
            </div>
            <button className="pause-btn" onClick={pauseGame}>
              <img src={pause} alt="pause icon" />
            </button>
          </div>
        </div>
      )}
      <canvas ref={canvasRef} width="920" height="580" />
    </CanvasContainer>
  );
}
