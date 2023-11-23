import styled from "styled-components";
import { home, replay } from "../../assets/icons";

const GameOverContainer = styled.div`
  background-color: #4bb3a2d1;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;

  h2 {
    font-size: 3.2rem;
  }

  .btns-container {
    display: flex;
    gap: 2rem;
  }

  button {
    background-color: #fff;
    padding: 0.6rem;
    border-radius: 8px;
    transition: 0.1s;
    cursor: pointer;
    &:hover {
      transform: scale(110%);
    }
  }

  img {
    width: 50px;
    height: 50px;
  }
`;

interface GameOverScreenProps {
  reloadGame: () => void;
  stopGame: () => void;
}

const GameOverScreen: React.FC<GameOverScreenProps> = ({ ...action }) => {
  return (
    <GameOverContainer>
      <h2>Game Over</h2>
      <div className="btns-container">
        <button onClick={action.stopGame}>
          <img src={home} alt="home" />
        </button>
        <button onClick={action.reloadGame}>
          <img src={replay} alt="home" />
        </button>
      </div>
    </GameOverContainer>
  );
};

export default GameOverScreen;
