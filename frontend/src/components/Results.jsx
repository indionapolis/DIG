import React, { Component } from 'react';
import './Configurator.css';
import './Results.css'

class Results extends Component {
  componentDidMount() {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/divide_into_groups`, {
      method: "POST",
      body: JSON.stringify(this.props.config)
    })
      .then(d => d.json())
      .then(data => {
        this.props.fetchDivisionResult(data);
        console.log(JSON.stringify(data, 0, 4));
      })
  }

  onFileDownload() {
    window.open(`${process.env.REACT_APP_BACKEND_URL}/download`, "blank");
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
                    Команда:
                    <div style={{fontWeight: '300', marginLeft: '25px'}}>
                      {this.props.resultConfig[projectIndex].teams[teamIndex].name}
                    </div>
                  </div>
                  <div style={{padding: "7px 10px"}}>
                    Участники:
                    <div style={{fontWeight: '300', marginLeft: '25px'}}>
                      {this.props.resultConfig[projectIndex].teams[teamIndex].members
                        .map(d => (<div>{d["Full Name"].toString()}</div>))}
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
          Назад
        </button>
        <button className="button_decorated button_no_margin" onClick={this.onFileDownload}>
          Скачать датасет
        </button>
      </div>
    );
  }
}

export default Results;
