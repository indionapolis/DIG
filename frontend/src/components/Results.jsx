import React, { Component } from 'react';
import './Results.css';

class Results extends Component {
  componentDidMount() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/divide_into_groups`, {
      method: "POST",
      body: JSON.stringify(this.props.config)
    })
      .then(d => d.json())
      .then(data => {
        console.log(data);
      })
  }

  onFileDownload() {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/download`, "blank");
  }

  render() {
    return (
      <div className='division_result'>
        <button className="button_decorated button_no_margin" onClick={this.onFileDownload}>
          Скачать датасет
        </button>
      </div>
    );
  }
}

export default Results;
