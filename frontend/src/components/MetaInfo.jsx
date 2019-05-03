import React, { Component } from 'react';
import './MetaInfo.css';

class MetaInfo extends Component {
  render() {
    return (
      <div className="meta_info">
        <div style={{marginBottom: '15px'}}>
          Check yourself:
        </div>
        <div className="meta_info_element">
          <b>File name:</b> {this.props.metadata.name}
        </div>
        <div className="meta_info_element">
          <b>Number of lines:</b> {this.props.metadata.len}
        </div>
        <div className="meta_info_element">
          <b>Columns:</b> {this.props.metadata.columns.join(", ")}
        </div>
        <div>
          <button className="button_decorated" onClick={this.props.goToPrevState}>
            Go back
          </button>
          <button className="button_decorated button_transparent" onClick={this.props.goToConfig}>
            Go to configirator
          </button>
        </div>
      </div>
    );
  }
}

export default MetaInfo;
