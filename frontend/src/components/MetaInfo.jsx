import React, { Component } from 'react';
import './MetaInfo.css';

class MetaInfo extends Component {
  render() {
    return (
      <div className="meta_info">
        <div className="meta_info_row">
          <div className="meta_info_title">File name:</div>
          <div className="meta_info_element">{this.props.metadata.name}</div>
        </div>

        <div className="meta_info_row">
          <div className="meta_info_title">Amount of lines:</div>
          <div className="meta_info_element">{this.props.metadata.len}</div>
        </div>

        <div className="meta_info_row">
          <div className="meta_info_title">Columns:</div>
          <div className="meta_info_element">
            {this.props.metadata.columns.map((item) => {
              return <span>{item}<br/></span>
            })}
          </div>
        </div>

        <button className="button_decorated button_transparent" onClick={this.props.goToConfig}>
          Go to configirator
        </button>
      </div>
    );
  }
}

export default MetaInfo;
