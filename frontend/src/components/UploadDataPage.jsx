import React, { Component } from 'react';
import './UploadDataPage.css';

class UploadDataPage extends Component {
  constructor(props) {
    super(props);
    this.onFileUpload = this.onFileUpload.bind(this);
  }

  onFileUpload(e) {
    let file = document.getElementById("inputData").files[0];
    let formData = new FormData();
    formData.append("file", file);
    fetch(`${process.env.REACT_APP_BACKEND_URL}/upload`, {
      method: 'POST',
      body: formData
    })
      .then(d => {
        d.json().then((data) => {
          document.cookie = `uuid=${d.headers.get("uuid")}`;
          this.props.onUpload(data, d.headers.get("uuid"));
        })
      });
  }

  render() {
    return (
      <div className="data_upload">
        <input id="inputData" type="file" onChange={this.onFileUpload} />
      </div>
    );
  }
}

export default UploadDataPage;
