import React, { Component } from "react";
import "./App.css";

import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();

const reducerFn = (state, action) => {
  if (action.type === "PLACE_ORDER_CMD") {
    return { ...state, order: action.payload }
  } else {
    return state;
  }
};

class Store {
  state = {
    order: null
  };

  constructor(reducerFn) {
    eventEmitter.on("UPDATE_STORE_CMD", action => {
      // call provided reducer function to update store state
      this.state = reducerFn(this.state, action);
      // emit UPDATED_STORE_EVT event to App so it can re-render
      eventEmitter.emit("UPDATED_STORE_EVT", this.state);
    });
  }
}

new Store(reducerFn);

class App extends Component {

  constructor() {
    super();
    this.state = {
      order: "unknown"
    };
    eventEmitter.on("UPDATED_STORE_EVT", state => {
      // setState triggers a call to this.render
      this.setState({order: state.order});
    });
  }

  onButtonClick = evt => {
    const name = evt.target.value;
    eventEmitter.emit("UPDATE_STORE_CMD", { type: "PLACE_ORDER_CMD", payload: name });
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          a store, a reducer, some React and an EventEmitter to bind them all
        </header>
        <p><em>Your order was:</em> {this.state.order}</p>

        <button onClick={this.onButtonClick} value="hamburger" className="waves-effect waves-light btn-large red">
          order hamburger
        </button>
        <button onClick={this.onButtonClick} value="fries" className="waves-effect waves-light btn-large blue">
          order fries
        </button>
      </div>
    );
  }
}

export default App;
