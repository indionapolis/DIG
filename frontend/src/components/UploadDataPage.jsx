import React, { Component } from 'react';
import './UploadDataPage.css';

class UploadDataPage extends Component {
  constructor(props) {
    super(props);
    this.onFileUpload = this.onFileUpload.bind(this);

    this.state = {
      projects: []
    }
  }

  componentDidMount() {
    let {email} = this.props;
    fetch(`${process.env.REACT_APP_BACKEND_URL}/projects?email=${email}`)
        .then(d => d.json())
        .then(data => {
          let {projects} = data;
          this.setState({
            projects
          })
        })
  }

  onFileUpload() {
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

  onProjectSelect(data) {

    fetch(`${process.env.REACT_APP_BACKEND_URL}/upload_from_outsource`, {
      method: 'POST',
      body: JSON.stringify(data)
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
        <div className="select_data">
          {this.state.projects.map((d) => <div className="project_item" onClick={() => this.onProjectSelect(d)}>{d.title}</div>)}
        </div>
        <input id="inputData" type="file" onChange={this.onFileUpload} />
      </div>
    );
  }
}

export default UploadDataPage;
