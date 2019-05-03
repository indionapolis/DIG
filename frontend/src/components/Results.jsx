import React, { Component } from 'react';
import './Configurator.css';
import './Results.css'

class Results extends Component {
  constructor(props) {
    super(props);
    this.onFileDownload = this.onFileDownload.bind(this);
  }

  componentDidMount() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/divide_into_groups`, {
      method: "POST",
      headers: {
        uuid: this.props.uuid
      },
      body: JSON.stringify(this.props.config)
    })
      .then(d => d.json())
      .then(data => {
        this.props.fetchDivisionResult(data);
        console.log(JSON.stringify(data, 0, 4));
      })
  }

  showFile(blob) {
    // It is necessary to create a new blob object with mime-type explicitly set
    // otherwise only Chrome works like it should
    var newBlob = new Blob([blob], {type: "application/pdf"})

    // IE doesn't allow using a blob object directly as link href
    // instead it is necessary to use msSaveOrOpenBlob
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(newBlob);
      return;
    }

    // For other browsers:
    // Create a link pointing to the ObjectURL containing the blob.
    const data = window.URL.createObjectURL(newBlob);
    var link = document.createElement('a');
    link.href = data;
    link.download="file.csv";
    link.click();
    setTimeout(function() {
      // For Firefox it is necessary to delay revoking the ObjectURL
      window.URL.revokeObjectURL(data);
    }, 100)
  }

  onFileDownload() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/download`, {
      headers: {
        uuid: this.props.uuid
      },
    })
      .then(d => d.blob().then(data => this.showFile(data)))

    // window.open(`${process.env.REACT_APP_BACKEND_URL}/download`, "blank");
  }

  render() {
    let res = this.props.resultConfig.length === 0
      ? null
      : <div id="configurator_box">
        {this.props.resultConfig.map((data, projectIndex) => (
          <div key={"project" + projectIndex} className="project card">
            <div style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
              <div className="project_name text">
                {this.props.resultConfig[projectIndex].name}
              </div>
            </div>
            <div className="teams_module">
              {this.props.resultConfig[projectIndex].teams.map((teamData, teamIndex) => (
                <div key={projectIndex + "team" + teamIndex} className="team_element">
                  <div style={{padding: "7px 10px"}}>
                    Team:
                    <div style={{fontWeight: '300', marginLeft: '25px'}}>
                      {this.props.resultConfig[projectIndex].teams[teamIndex].name}
                    </div>
                  </div>
                  <div style={{padding: "7px 10px"}}>
                    Skills:
                    <div>
                      {this.props.resultConfig[projectIndex].teams[teamIndex].skills.map((skillData, skillIndex) => (
                        <div key={projectIndex + "team" + teamIndex + "skill" + skillIndex} className="card skill">
                          {skillData}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{padding: "7px 10px"}}>
                    Team members:
                    <div style={{fontWeight: '300', marginLeft: '25px'}}>
                      {this.props.resultConfig[projectIndex].teams[teamIndex].members
                        .map((d, xyz) => (<div key={`lol+kek${d}+-${xyz}`}>{d["What's your name?"].toString()}</div>))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>;
    return (
      <div className='division_result'>
        {res}
        <button className="button_decorated" onClick={this.props.goToPrevState}>
          Go back
        </button>
        <button className="button_decorated button_no_margin button_transparent" onClick={this.onFileDownload}>
          Download dataset
        </button>
      </div>
    );
  }
}

export default Results;
