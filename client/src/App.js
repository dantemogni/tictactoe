import React from 'react';
import NormalMode from './normal-mode/NormalMode.js'
import './App.css'
const { io } = require("socket.io-client");

const socket = io();
socket.on("connect", () => {
  console.log(socket.connected); // true
});

class Game extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: 'normal'};
  }

  handleChange(event){
    this.setState({value: event.target.value});
  }

  render(){
    let game;
    this.state.value === 'normal' 
      ? game = <NormalMode />
      : game = <h1>Nothing to see here.</h1>

    return (
      <section className="main">
        <div>
          {game}
        </div>
        <form className="general-settings">
          <input type="radio" onChange={this.handleChange} defaultChecked name="selector-game" value="normal"></input>
          <label htmlFor="normal">Normal TicTacToe</label>
          <input type="radio" onChange={this.handleChange} name="selector-game" value="3d"></input>
          <label htmlFor="3d">3D TicTacToe</label>
        </form>
      </section>
    );  
  }
}

function App(){
  return(
      <Game />
  );
}



export default App;