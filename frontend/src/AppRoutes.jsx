import React, { Component } from 'react';
import UploadDataPage from "./components/UploadDataPage";
import "./App.css";

class AppRoutes extends Component {
  render() {
    let content = null;
    let pageName = null;
    let { currentState } = this.props;

    if (currentState === "0") {
      pageName = "0. zero state off-lane";
      content = <UploadDataPage {...this.props} />
    }
    return (
      <div>
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
