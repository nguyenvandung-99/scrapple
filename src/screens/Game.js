import React from 'react';
import { catalog } from '../server/Catalog';
import Dictionary from '../server/Dictionary.json';
import ScoreRound from '../server/Score';
import ScoreBoard from '../components/ScoreBoard';
import Tray from '../components/Tray';
import Instruction from '../components/Instruction';

function copyUnique(array) {
  return JSON.parse(JSON.stringify(array));
}

let data = Dictionary.data;

export default class Game extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      new_tray: Array(7).fill({ letter: null, score: 0,}), // beginning state of new_tray
      current_new_tray: Array(7).fill({ letter: null, score: 0,}),
      board: [],
      previous_tray: [],
      current_previous_tray: [],
      score: 0,
      current_score: 0,
      bonus: 0,
      catalog,
      strike: 0,
      endgame: true,
      showinst: true,
      level: "easy",
      noti: "Welcome to Scrapple!",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({level: event.target.value});
  }

  toggleInst() {
    this.setState({
      showinst: !this.state.showinst,
    });
  }

  begin() { 
    this.setState({
      new_tray: Array(7).fill({ letter: null, score: 0,}), // beginning state of new_tray
      current_new_tray: Array(7).fill({ letter: null, score: 0,}),
      board: [],
      score: 0,
      current_score: 0,
      catalog,
      strike: 0,
      endgame: false,
    });
    this.newRound()
    this.clearNoti()
    this.setState({
      score: 0,
    })
  }

  assess() {
    let board = this.state.board;
    let word; let word_string; // word is array, word_string is string
    if (board.length === 0) {
      this.setState({
        noti: "The board is empty",
      });
      return;
    } 
    //else {
      //word = board.map(i => i.letter).join("").toLowerCase();
    //}
    else {
      word = board.map(i => i.letter);
    }
    let blank_pos = []; let i; let j; let k;
    for (i = 0; i < (word.length); i++) {
      if (word[i] === "_ ") {
        blank_pos.push(i);
      }
    }
    for (i = 0; i < Math.pow(26,(blank_pos.length)); i++) { // i is the combination in 26-th
      let blank_com = i; // pass it to blank_combination
      let blank_let = [];
      for (j = 0; j < blank_pos.length; j++) { // get the letter based on blank_com
        k = blank_com % 26; // j is the remainder
        blank_let.push(String.fromCharCode(65+k)) // 65 to 90 is A to Z
        blank_com = (blank_com - k) / 26;
      }
      blank_let.reverse()
      for (j = 0; j < blank_pos.length; j++) {
        word[blank_pos[j]] = blank_let[j];
      }
      word_string = word.join("").toLowerCase();
      if (data.includes(word_string)) {
        for (j = 0; j < blank_pos.length; j++) {
          board[blank_pos[j]].letter = blank_let[j];
        }
        this.setState({
          board: board,
        })
        break;
      }
    }

    if (data.includes(word_string)) { 
      this.newRound(); // how to print this to the screen tho
    } else {
      this.setState({
        noti: "The word does not exist",
      });
    }
    setTimeout(() => this.clearNoti(), 2000);
  }

  clearNoti() {
    this.setState({
      noti: null,
    });
  }

  newRound() {
    let bonus; let current_score; 
    [bonus, current_score] = ScoreRound(this.state.board,this.state.level);
    let score = this.state.score + current_score;
    let strike = this.state.strike;
    strike = current_score < 300 ? strike + 1 : 1;
    let catalog = this.state.catalog; // I can just leave catalog outside class but for management purpose let's not
    let previous_tray = this.state.board.map((square) => {
      if (square) {
        square.score = 0;
        return square;
      }
      return null;
    }); 
    let new_tray = this.state.current_new_tray.map((square) => { // fill in current_new_tray the letters from catalog and put it under new_tray
      if (square.letter == null && catalog.length > 0) {
        let random = Math.floor(Math.random() * catalog.length);
        square = catalog[random];
        catalog.splice(random, 1);
      }
      return square;
    });
    let noti = (
      <>
        <div>
          Bonus for each letter: {bonus}
        </div>
        <div>
          Score for this round: {current_score}
        </div>
      </>
    );
    this.setState ({
      new_tray: new_tray,
      current_new_tray: copyUnique(new_tray),
      previous_tray: previous_tray,
      current_previous_tray: copyUnique(previous_tray),
      board: [],
      catalog: catalog,
      bonus: bonus,
      current_score: current_score,
      score: score,
      strike: strike,
      noti: noti,
    });
    this.checkstrike(strike);
  }

  // need to look for a way to shorten these two functions into one mutual LATER
  clickPrevious(i) { // pass the data to Board first, then make the square disappear in Previous
    const board = this.state.board;
    const current_tray = this.state.current_previous_tray.slice();
    if (current_tray.length > Math.floor(this.state.previous_tray.length / 2)) { // maximum half letters from previous used
      board.push(copyUnique(current_tray)[i]);  
      current_tray.splice(i,1); 
      this.setState({
        current_previous_tray: current_tray,
        board: board,
    });
    } else {
      return null;
    }
  }

  clickNew(i) { // pass the data to Board first, then make the square disappear in New
    const board = this.state.board;
    const current_tray = this.state.current_new_tray;
    board.push(copyUnique(current_tray)[i]);
    current_tray[i].letter = null; // 
    this.setState({
      current_new_tray: current_tray,
      board: board,
    })
  }

  eraseAll() {
    this.setState({
      current_previous_tray: copyUnique(this.state.previous_tray),
      current_new_tray: copyUnique(this.state.new_tray),
      board: [],
    })
  }

  shuffle() {
    let strike;
    if (this.state.catalog.length > 0) {
      this.eraseAll();
      let new_tray = this.state.new_tray;
      let catalog = this.state.catalog.concat(copyUnique(new_tray));
      new_tray = new_tray.map((i) => {
        let random = Math.floor(Math.random() * catalog.length);
        let square = catalog[random];
        catalog.splice(random, 1);
        return square;
      });
      strike = this.state.strike + 1;
      this.setState({
        new_tray: new_tray,
        current_new_tray: copyUnique(new_tray),
        catalog: catalog,
        strike: strike,
      });
    }
    this.checkstrike(strike);
  }

  checkstrike(strike) {
    if (strike > 3) {
      this.setState({
        new_tray: Array(7).fill({ letter: null, score: 0,}), // beginning state of new_tray
        current_new_tray: Array(7).fill({ letter: null, score: 0,}),
        board: [],
        previous_tray: [],
        current_previous_tray: [],
        bonus: 0,
        catalog: catalog,
        strike: 0,
        endgame: true,
        showinst: true,
        noti: "Game over!"
      });
      setTimeout(() => this.clearNoti(), 2000);
    }
  }

  render() {
    let board_color;
    switch (this.state.strike) {
      case 1:
        board_color = "panel-success";
        break;
      case 2:
        board_color = "panel-warning";
        break;
      case 3:
        board_color = "panel-danger";
        break;
      default:
        board_color = "panel-default";
    }

    let bottombutton = this.state.endgame ? (
      <>
        <div id="bottombutton" onClick={() => this.begin()} className="btn btn-primary">
          Begin          
        </div>
        <br/>
        <div className="dropdown">Choose level:&nbsp;&nbsp;
          <select className="btn btn-danger dropdown-toggle" type="button" data-toggle="dropdown" value={this.state.level} onChange={this.handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </>) : (
      <div id="bottombutton" onClick={() => this.assess()} className="btn btn-primary">
        Submit
      </div>)
    
    return (
      <div id="game">
        <ScoreBoard
          score={this.state.score}
        />
        <div id="noti">
          {this.state.noti}
        </div>
        <div className = {"panel " + board_color}>
          <div id="game-board" className="panel-heading">
            <Tray
              class="square-board"
              string={this.state.board}
              onClick={i => null}
            />
          </div>
        </div>
        <div id="option" className="btn-group" role="group">
          <button id="eraseAll" className="btn btn-secondary option-left" onClick={() => this.eraseAll()}>
            Erase All
          </button>
          <button id="shuffle" className="btn btn-secondary option-right" onClick={() => this.shuffle()}>
            Shuffle
          </button>
        </div>
        <div id="previous-tray">
          Previous word
          <Tray
            class="square-previous"
            string={this.state.current_previous_tray}
            onClick={i => this.clickPrevious(i)}
          />
        </div>
        <div id="new-tray">
          New tiles
            <Tray
              class="square-new"
              string={this.state.current_new_tray}
              onClick={i => this.clickNew(i)}
            />
        </div>
        <div>
          {bottombutton} 
        </div>
        <div id="inst">
          <Instruction
            show={this.state.showinst}
            onClick={() => this.toggleInst()}
          />
        </div>
      </div>
    );
  }
}
