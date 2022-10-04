import { useEffect, useState } from "react";
import "./App.css";
import GameField from "./Components/GameField/GameField";
import Subtitle from "./Components/Subtitle/Subtitle";
import Title from "./Components/Title/Title";

interface IGame {
  started: boolean;
  subtitle: {
    textContent: string;
    color: string;
  };
  currentTurnPlayer: IPlayer;
  winner: IPlayer | null;
}

interface IPlayer {
  id: number;
  nick: string;
  symbol: "X" | "O";
  color: string;
  claims: number[];
}

interface IGameField {
  position: number;
  value?: "X" | "O" | "";
  color?: string | null;
  claimed: boolean;
  claimerId?: number | null;
}

const App = () => {
  //STATES
  //Players State
  const [players, setPlayers] = useState<IPlayer[]>([
    {
      id: Math.floor(Math.random() * 999999),
      nick: "Player 1",
      symbol: "X",
      color: "red",
      claims: [0, 0, 0, 0, 0, 0, 0],
    },
    {
      id: Math.floor(Math.random() * 999999),
      nick: "Player 2",
      symbol: "O",
      color: "blue",
      claims: [0, 0, 0, 0, 0, 0, 0],
    },
  ]);
  //Game State
  const [game, setGame] = useState<IGame>({
    started: false,
    currentTurnPlayer: players[0],
    subtitle: {
      textContent: "Click anywhere to get started",
      color: "green",
    },
    winner: null,
  });
  //GameFields State
  const [gameFields, setGameFields] = useState<IGameField[]>([
    {
      position: 0,
      claimed: false,
    },
    {
      position: 1,
      claimed: false,
    },
    {
      position: 2,
      claimed: false,
    },
    {
      position: 3,
      claimed: false,
    },
    {
      position: 4,
      claimed: false,
    },
    {
      position: 5,
      claimed: false,
    },
    {
      position: 6,
      claimed: false,
    },
    {
      position: 7,
      claimed: false,
    },
    {
      position: 8,
      claimed: false,
    },
  ]);

  //Main function to start the game
  const startGame = () => {
    //Only runs the function if the game has not started yet
    if (game.started) return;

    //Clear every game field
    setGameFields((currentGameFields) => {
      return currentGameFields.map((field) => {
        return {
          ...field,
          value: "",
          color: null,
          claimed: false,
          claimerId: null,
        };
      });
    });

    //Clear players claims
    setPlayers((players) => {
      return players.map((player) => {
        return {
          ...player,
          claims: [],
        };
      });
    });

    //Set the new Game State data
    setGame({
      started: true,
      currentTurnPlayer: players[0],
      subtitle: {
        textContent: `${players[0].nick}'s Turn`,
        color: players[0].color,
      },
      winner: null,
    });
  };

  //Function that will be triggered when a GameField gets clicked on
  const handleGameFieldClick = (fieldPosition: number) => {
    //Check if the field that was clicked isn't already claimed
    const getField = gameFields.filter(
      (field) => field.position === fieldPosition
    )[0];
    if (getField.claimed) return;

    //Add the field position number at the Array of the player's claims
    setPlayers((currentValue) => {
      return currentValue.map((player) => {
        if (player.id !== game.currentTurnPlayer.id) return player;
        const getPlayerClaims = player.claims;
        getPlayerClaims[fieldPosition] = 1;
        return {
          ...player,
          claims: getPlayerClaims,
        };
      });
    });

    //Set the GameField state as claimed and set its value
    setGameFields((currentFields) => {
      return currentFields.map((field) => {
        if (field.position !== fieldPosition) return field;
        return {
          ...field,
          color: game.currentTurnPlayer.color,
          value: game.currentTurnPlayer.symbol,
          claimed: true,
          claimerId: game.currentTurnPlayer.id,
        };
      });
    });

    //Switch turns
    const getOtherPlayer = players.filter(
      (player) => player.id !== game.currentTurnPlayer.id
    )[0];
    setGame((currentValue) => {
      return {
        ...currentValue,
        currentTurnPlayer: getOtherPlayer,
        subtitle: {
          textContent: `${getOtherPlayer.nick}'s Turn`,
          color: getOtherPlayer.color,
        },
      };
    });
  };

  //useEffect function to watch every change in the gameField, and whenver a change is detected, check if there's a winner
  useEffect(() => {
    //Function that will check if any player has won
    const checkWinner = () => {
      let winner: IPlayer | undefined;

      const checkHorizontalWinning = (fields: number[], player: IPlayer) => {
        fields.forEach((fieldPosition, pos) => {
          if (fieldPosition !== 1 || pos % 3 !== 0) return;
          if (fields[pos + 1] === 1 && fields[pos + 2] === 1) {
            winner = player;
          }
        });
      };

      const checkVerticalWinning = (fields: number[], player: IPlayer) => {
        fields.forEach((fieldPosition, pos) => {
          if (fieldPosition !== 1 || pos >= 3) return;
          if (fields[pos + 3] === 1 && fields[pos + 6] === 1) {
            winner = player;
          }
        });
      };

      const checkDiagonalWinning = (fields: number[], player: IPlayer) => {
        if (fields[4] !== 1) return;
        fields.forEach((fieldPosition, pos) => {
          if (fieldPosition !== 1 || (pos !== 0 && pos !== 2)) return;
          if (pos === 0 && fields[8] === 1) {
            return (winner = player);
          }
          if (pos === 2 && fields[6] === 1) {
            return (winner = player);
          }
        });
      };

      players.forEach((player) => {
        checkHorizontalWinning(player.claims, player);
        checkVerticalWinning(player.claims, player);
        checkDiagonalWinning(player.claims, player);
      });

      if (!winner) {
        //If every single GameField have already been claimed, then it's game over
        const getUnclaimedGameFields = gameFields.filter(
          (field) => !field.claimed
        );

        if (getUnclaimedGameFields.length === 0) {
          return setGame((currentValue) => {
            return {
              ...currentValue,
              subtitle: {
                textContent: "It's a tie! (Click anywhere to play again)",
                color: "black",
              },
              started: false,
            };
          });
        }
        return;
      }
      setGame({
        currentTurnPlayer: players[0],
        subtitle: {
          textContent: `${winner.nick} is the winner!`,
          color: winner.color,
        },
        winner: winner,
        started: false,
      });
    };
    checkWinner();
  }, [gameFields, players]);

  const returnGameFields = () => {
    return gameFields.map((field) => {
      return (
        <GameField
          key={field.position}
          onClick={handleGameFieldClick.bind(this, field.position)}
          color={field.color === null ? "" : field.color}
        >
          {field.value || ""}
        </GameField>
      );
    });
  };

  return (
    <div
      onClick={startGame}
      style={{ cursor: game.started ? "default" : "pointer" }}
      className="main-wrapper"
    >
      <Title>Tic Tac Toe</Title>
      <Subtitle color={game.subtitle.color}>
        {game.subtitle.textContent}
      </Subtitle>
      {game.started && (
        <div className="game-container">{returnGameFields()}</div>
      )}
    </div>
  );
};

export default App;
