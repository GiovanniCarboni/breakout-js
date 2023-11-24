import styled from "styled-components";

const Menu = styled.ul`
  padding-top: 30%;
  height: 100%;
  background-color: #333;

  li {
    text-align: center;
    list-style: none;
    margin-bottom: 1rem;
  }

  button {
    cursor: pointer;
    padding: 0.6rem 2rem;
    border-radius: 8px;
    background-color: #fff;
    font-size: 2.8rem;
    transition: 100ms;

    &:hover {
      transform: scale(110%);
    }

    &.start-btn {
      font-size: 3.8rem;
    }
  }
`;

interface StartScreenProps {
  runGame: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ runGame }) => {
  return (
    <Menu>
      <li>
        <button className="start-btn" onClick={runGame}>
          Play
        </button>
      </li>
      <li>
        <button>Options</button>
      </li>
    </Menu>
  );
};

export default StartScreen;
