import React, { Component } from 'react';
import "./App.css";

import UploadDataPage from "./components/UploadDataPage";
import MetaInfo from "./components/MetaInfo";
import Configurator from "./components/Configurator";
import Results from "./components/Results";
import Login from "./components/Login";

class AppRoutes extends Component {
  render() {
    let content = null;
    let pageName = null;
    let { currentState } = this.props;

    if (currentState === '4') {
      pageName = " ";
      content = <Login {...this.props} />
    } else if (currentState === "0") {
      pageName = "0. The DIG";
      content = <UploadDataPage {...this.props} />
    } else if (currentState === "0.1") {
      pageName = "1. Check yourself";
      content = <MetaInfo {...this.props} />
    } else if (currentState === '1') {
      pageName = "2. Configurator";
      content = <Configurator {...this.props} />
    } else if (currentState === '2') {
      pageName = "3. Result of division";
      content = <Results {...this.props} />
    }

    return (
      <div className="App">
        <header>
          <div className="container">
            <div className="title">{pageName}</div>
          </div>
        </header>

        <section>
          <div className="container">
            {content}
          </div>
        </section>

        <footer>
          <div className="container">
            <a href="https://github.com/indionapolis/DIG" target="_blank">GitHub</a>
            <br />
            Group Breakdown © 2019
          </div>
        </footer>
      </div>
    );
  }
}

export default AppRoutes;
