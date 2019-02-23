import React, { Component } from 'react';

class UploadDataPage extends Component {
  render() {
    return (
      <div className="data_upload">
        {this.props.sample}
      </div>
    );
  }
}

export default UploadDataPage;
