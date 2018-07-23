import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

const INITIAL_TIME = 10000;
const INCREMENT = 3000;
const INTERVAL = 10;
const PLAYER_1 = "player1";
const PLAYER_2 = "player2";

class App extends React.Component {
  state = {
    prevTime: null,
    [PLAYER_1]: INITIAL_TIME,
    [PLAYER_2]: INITIAL_TIME,
    currentPlayer: PLAYER_1,
    timer: undefined,
    isNewGame: true
  };

  render() {
    const { currentPlayer, timer } = this.state;

    return (
      <div className="App">
        <p className={currentPlayer === PLAYER_1 ? "Current" : undefined}>
          Player 1: <input value={this.state[PLAYER_1] / 1000} disabled />
        </p>
        <p className={currentPlayer === PLAYER_2 ? "Current" : undefined}>
          Player 2: <input value={this.state[PLAYER_2] / 1000} disabled />
        </p>
        <button
          onClick={() => {
            this.changePlayer(currentPlayer);
          }}
          disabled={timer == null}
        >
          Move
        </button>
        <button onClick={this.playPauseGame}>
          {timer == null ? "Play" : "Pause"}
        </button>
      </div>
    );
  }

  otherPlayer = player => (player === PLAYER_1 ? PLAYER_2 : PLAYER_1);

  changePlayer = player => {
    const otherPlayer = this.otherPlayer(player);

    this.setState(state => ({
      [otherPlayer]: state[otherPlayer] + INCREMENT,
      currentPlayer: otherPlayer
    }));
  };

  decreaseTime = player => {
    const current = Date.now();
    this.setState(
      state => ({
        [player]: Math.max(state[player] - (current - state.prevTime), 0),
        prevTime: current
      }),
      () => {
        if (this.state[player] === 0) {
          this.changePlayer(player);
        }
      }
    );
  };

  createTimer = () => {
    return setInterval(() => {
      this.decreaseTime(this.state.currentPlayer);
    }, INTERVAL);
  };

  playPauseGame = () => {
    this.setState(state => {
      const { timer: oldTimer, isNewGame } = state;

      const newState = isNewGame
        ? {
            [PLAYER_1]: state[PLAYER_1] + INCREMENT,
            isNewGame: false
          }
        : {};

      if (oldTimer == null) {
        return {
          ...newState,
          prevTime: Date.now(),
          timer: this.createTimer()
        };
      }

      clearInterval(oldTimer);
      return {
        ...newState,
        prevTime: null,
        timer: undefined
      };
    });
  };
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
