import React from 'react';
import NormalMode from './normal-mode/NormalMode.js'
import Multiplayer from './multiplayer/Multiplayer.js'
import './App.css'


class Game extends React.Component {
  constructor(props){
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {value: 'normal'};
  }

  handleMultiplayer(e){
    e.preventDefault();
    alert("Hola")
  }

  handleChange(event){
    this.setState({value: event.target.value});
  }

  render(){
    let game;
    switch(this.state.value){
      case 'normal':
        game = <NormalMode />
        break;
      case 'multiplayer':
        game = <Multiplayer/>
        break;
      case '3d':
        game = <h1>Nothing to see here, yet.</h1>
        break;
      default:
        game = <h1>Nothing to see here, yet.</h1>
      }

    return (
      <section className="main">
        <div>
          {game}
        </div>
        <form className="general-settings">
          <input type="radio" onChange={this.handleChange} defaultChecked name="selector-game" value="normal"></input>
          <label htmlFor="normal">Normal TicTacToe</label>
          <input type="radio" onChange={this.handleChange} name="selector-game" value="multiplayer"></input>
          <label htmlFor="multiplayer">Multiplayer Mode</label>
          <input disabled="true" type="radio" onChange={this.handleChange} name="selector-game" value="3d"></input>
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