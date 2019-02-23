import React, { Component } from 'react';
import './App.css';
import AppRoutes from "./AppRoutes";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentState: "0",
      sample: "kek"
    };
  }

  render() {
    return (
      <div className="App">
        <AppRoutes {...this.state} />
      </div>
    );
  }
}

export default App;
