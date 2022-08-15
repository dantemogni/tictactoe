import React from 'react';
import './Multiplayer.css'
const { io } = require("socket.io-client");

const socket = io();

function Square(props) {
    return (
      <button disabled={props.isDisabled} className="square" onClick={props.onClick}>
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
          isDisabled={this.props.isDisabled}
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
  
  class Multiplayer extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null), //array con los cuadradtios
        }],
        stepNumber: 0,
        xIsNext: true,
        maxSteps: 0,
        multiplayerCode: generateCode(7).toUpperCase(),
        socketId: socket.id,
        events: {}
      };
      socket.emit("code", this.state.multiplayerCode)
      this.handleClick = this.handleClick.bind(this);
      this.handleMultiplaterInputChange = this.handleMultiplaterInputChange.bind(this);
      this.handleMultiplayerSubmit = this.handleMultiplayerSubmit.bind(this);
      this.ThirdPartyStuff = this.ThirdPartyStuff.bind(this);
      this.CodeMatchBanner = this.CodeMatchBanner.bind(this);
    }
    
  
    handleClick(i) {
      console.log(this.state)

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
        maxSteps: state.stepNumber + 1,
        myTurn: !state.myTurn,
      }));

      socket.emit("game", {
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        maxSteps: this.state.stepNumber + 1,
        guessSocketId: this.state.guessSocketId,
        meSocketId: socket.id,
        myTurn: !this.state.myTurn,
      })

    }
  
    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
      socket.emit("jump to", {
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      })
    }

    handleMultiplaterInputChange(e) { 
      this.setState({solicitedGame: e.target.value});
      this.setState({errorMatch: null})
      this.setState({matchRequested: false})
    }

    handleMultiplayerSubmit(e) {
      e.preventDefault();
      this.setState({matchRequested: true})
      socket.emit("multiplayerRequest", {'solicitedGame': this.state.solicitedGame, 'socketId': socket.id})
    }


    componentDidMount(){
      socket.on("connect", () => {
        console.log("Conectado"); // true
      });
      
      socket.on("match", (data) => {
        this.setState({matched: true})
        this.setState({thirdMultiplayerCode: data.third})
        this.setState({guessSocketId: data.thirdSocketId})
        this.setState({myTurn: data.myTurn})
        console.log("match found " + data.third);
      });
      
      socket.on("no match", (data) => {
        this.setState({matched: false})
        console.log("no match found " + data);
      });
      
      socket.on("error", (data) => {
        this.setState({errorMatch: data})
        this.setState({matched: false})
        console.log(data);
      });

      socket.on("user disconnected", (data) => {
        this.setState({events: {
          user_disconnected: data
        }})
      });

      // handles game changes
      socket.on("game", (data) => {
        this.setState(data)
      });

      socket.on("jump to", (data) => {
        this.setState(data)
      });
    }

    componentDidUpdate(){
      console.log(this.state)
    }

    ThirdPartyStuff(){
      if(this.state.events.user_disconnected){
        return (
          <div className="thirdPartyStuff">
            <span className='matchedBanner-error'>User {this.state.events.user_disconnected} has disconnected</span>
          </div>
        )
      }

      if(this.state.matched){
        return (
          <div className="thirdPartyStuff">
            <span className='matchedBanner-ok'>Connected with {this.state.thirdMultiplayerCode} !</span>
          </div>
        )
      }
      return (
        <div className='multiplayer-info'>
          <div className='my-code'>
              <span>My Code:</span><br></br>
              <strong>{this.state.multiplayerCode}</strong>
          </div>
          <div className='thirdparty-code'>
              <span>Join a session:</span><br></br>
              <form onSubmit={this.handleMultiplayerSubmit}>
              <input type={'text'} placeholder={'Insert code'} onChange={this.handleMultiplaterInputChange}></input>
              </form>
              <this.CodeMatchBanner></this.CodeMatchBanner>
          </div>
        </div>
      )
    }

    CodeMatchBanner() {
      let text = 'No Match Found'
      let customClass = 'error'

      if(!this.state.matchRequested){
        return null
      }

      if(this.state.matched){
        text = 'Match Found!'
        customClass = 'ok'
      }

      if(this.state.errorMatch){
        text = this.state.errorMatch
      }
      return (
        <span className={'matchedBanner-'+customClass}>{text}</span>
      )
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
          <h3>Multiplayer Mode</h3>
          <this.ThirdPartyStuff></this.ThirdPartyStuff>
          <Board
            isDisabled={!this.state.matched || this.state.myTurn || this.state.events.user_disconnected || winner}
            squares={current.squares}
            onClick={this.handleClick}
          />
          <div className="game-info">
            <div className="status">{status}</div>
            <div className="game-controls">
              <GameButtons
                id="undo-button"
                isDisabled={this.state.stepNumber === 0  || this.state.myTurn || winner}
                placeholder={'←'}
                onClick={() => this.jumpTo(this.state.stepNumber - 1)}
              />
              <GameButtons
                id="redo-button"
                isDisabled={this.state.stepNumber === this.state.maxSteps  || this.state.myTurn || winner}
                placeholder={'→'}
                onClick={() => this.jumpTo(this.state.stepNumber + 1)}
              />
            </div>
          </div>
        </div>
      );
    }
  }

  function generateCode(length){
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   return result;
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

  export default Multiplayer;