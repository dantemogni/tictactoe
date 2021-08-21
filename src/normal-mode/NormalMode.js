import React from 'react';
import './NormalMode.css'

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  function GameButtons(props) {
    return (
      <button
        id={props.id}
        disabled={props.isDisabled}
        onClick={props.onClick}
      > {props.placeholder} </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      return (
        <div className="game-board">
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class NormalMode extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null), //array con los cuadradtios
        }],
        stepNumber: 0,
        xIsNext: true,
        maxSteps: 0,
      };
  
      this.handleClick = this.handleClick.bind(this);
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1); //copia el array history
      const current = history[history.length - 1];
      const squares = current.squares.slice();
  
      if (calculateWinner(squares) || squares[i]) return;
  
      squares[i] = this.state.xIsNext ? 'X' : 'O';
  
      this.setState((state) => ({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !state.xIsNext,
        maxSteps: state.stepNumber + 1
      }));
  
    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
  
    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
  
      let status;
      if (winner) {
        status = 'Winner: ' + winner;
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
  
      return (
        <div className="game">
          <h1>TicTacToe</h1>
          <Board
            squares={current.squares}
            onClick={this.handleClick}
          />
          <div className="game-info">
            <div className="status">{status}</div>
            <div className="game-controls">
              <GameButtons
                id="undo-button"
                isDisabled={this.state.stepNumber === 0}
                placeholder={'←'}
                onClick={() => this.jumpTo(this.state.stepNumber - 1)}
              />
              <GameButtons
                id="redo-button"
                isDisabled={this.state.stepNumber === this.state.maxSteps}
                placeholder={'→'}
                onClick={() => this.jumpTo(this.state.stepNumber + 1)}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }

  export default NormalMode;