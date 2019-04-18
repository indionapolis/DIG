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
      pageName = "0. Введите email";
      content = <Login {...this.props} />
    } else if (currentState === "0") {
      pageName = "1. Загрузите датасет";
      content = <UploadDataPage {...this.props} />
    } else if (currentState === "0.1") {
      pageName = "1. Проверьте себя";
      content = <MetaInfo {...this.props} />
    } else if (currentState === '1') {
      pageName = "2. Конфигуратор";
      content = <Configurator {...this.props} />
    } else if (currentState === '2') {
      pageName = "3. Результат разделения на команды";
      content = <Results {...this.props} />
    }

    return (
      <div className="App">
        <div className="header">
          {pageName}
        </div>
        <div className="main">
          {content}
        </div>
      </div>
    );
  }
}

export default AppRoutes;
