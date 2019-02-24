import React, { Component } from 'react';
import './App.css';
import AppRoutes from "./AppRoutes";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentState: "0",
      sample: "kek",
      metadata: null,
      config: []
    };
    this.onUpload = this.onUpload.bind(this);
    this.goToConfig = this.goToConfig.bind(this);
    this.onConfigAction = this.onConfigAction.bind(this);
    this.goToRetrieveResults = this.goToRetrieveResults.bind(this);
  }

  // stage 1
  onUpload(data) {
    this.setState({
      metadata: data,
      currentState: '0.1'
    })
  }

  // stage 2
  goToConfig() {
    this.setState({
      currentState: '1'
    })
  }

  // stage 3
  goToRetrieveResults() {
    this.setState({
      currentState: '2'
    })
  }

  /**
   * Actions handler (for configurator)
   * @param action
   * @param data
   */
  onConfigAction(action, data) {
    let { config } = this.state;

    if (action === "addProject") {
      this.setState({
        config: [...config, {
          name: null,
          teams: []
        }]
      })
    } else if (action === "addTeam") {
      config[data].teams = [...config[data].teams, {
        name: null,
        size: null,
        skills: []
      }];
      this.setState({
        config
      })
    } else if (action === "addSkill") {
      let { projectIndex, teamIndex, name } = data;
      config[projectIndex].teams[teamIndex].skills = [...config[projectIndex].teams[teamIndex].skills, name];
      this.setState({
        config
      });
    } else if (action === "changeProjectName") {
      let { projectIndex, name } = data;
      config[projectIndex].name = name;
      this.setState({
        config
      })
    } else if (action === "changeTeamName") {
      let { projectIndex, teamIndex, name } = data;

      config[projectIndex].teams[teamIndex].name = name;
    } else if (action === "changeTeamSize") {
      let { projectIndex, teamIndex, size } = data;

      config[projectIndex].teams[teamIndex].size = size;
    }

    console.log(this.state.config);
  }

  render() {
    return (
      <div style={{position: "absolute", height: '100%', width: '100%'}}>
        <AppRoutes {...this.state}
                   onUpload={this.onUpload}
                   goToConfig={this.goToConfig}
                   onConfigAction={this.onConfigAction}
                   goToRetrieveResults={this.goToRetrieveResults}/>
      </div>
    );
  }
}

export default App;
