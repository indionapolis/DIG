import React, { Component } from 'react';
import './App.css';
import AppRoutes from "./AppRoutes";
import queryString from 'query-string';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentState: "4",
      sample: "kek",
      metadata: null,
      config: [],
      resultConfig: [],
      templates: [],
      uuid: "",
      email: this.getCookie("email") || ""
    };
    this.onUpload = this.onUpload.bind(this);
    this.goToConfig = this.goToConfig.bind(this);
    this.onConfigAction = this.onConfigAction.bind(this);
    this.goToRetrieveResults = this.goToRetrieveResults.bind(this);
    this.fetchDivisionResult = this.fetchDivisionResult.bind(this);
    this.goToPrevState = this.goToPrevState.bind(this);
    this.onLoginEnter = this.onLoginEnter.bind(this);
  }

  getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined
  }

  componentDidMount() {
    let query = queryString.parse(window.location.search);
    console.log(query);
    if (query && query.form_id) {
      this.setState({
        currentState: '4'
      });

      fetch(`${process.env.REACT_APP_BACKEND_URL}/upload_from_outsource`, {
        method: 'POST',
        body: JSON.stringify(query)
      })
        .then(d => {
          d.json().then((data) => {
            document.cookie = `uuid=${d.headers.get("uuid")}`;
            this.onUpload(data, d.headers.get("uuid"));
          })
        });
    } else if (this.getCookie("email")) {
      this.setState({currentState: "0"})
    }
  }

  // stage 1
  onUpload(data, uuid) {
    this.setState({
      metadata: data,
      currentState: '0.1',
      uuid: uuid
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

  // load data result
  fetchDivisionResult(data) {
    this.setState({
      resultConfig: data
    })
  }

  goToPrevState() {
    let { currentState: state } = this.state;
    if (state === "2") {
      this.setState({
        currentState: "1"
      })
    } else if (state === "1") {
      this.setState({
        currentState: "0.1"
      })
    } else if (state === "0.1") {
      this.setState({
        currentState: "0"
      })
    }
  }

  /**
   * Actions handler (for configurator)
   * @param action
   * @param data
   */
  onConfigAction(action, data) {
    let { config } = this.state;

    if (action === "addProject") {
      let { name } = data;
      this.setState({
        config: [...config, {
          name: name ? name : `Project#${config.length}`,
          teams: []
        }]
      })
    } else if (action === "addTeam") {
      let { name } = data;
      config[data].teams = [...config[data].teams, {
        name: name ? name : `Team#${config[data].teams.length}`,
        size: "",
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
    } else if (action === "removeTeam") {
      let { projectIndex, teamIndex } = data;

      config[projectIndex].teams = [...config[projectIndex].teams.slice(0, teamIndex), ...config[projectIndex].teams.slice(teamIndex + 1)];
      this.setState({
        config
      })
    } else if (action === "removeProject") {
      let { projectIndex } = data;

      config = [...config.slice(0, projectIndex), ...config.slice(projectIndex + 1)];
      this.setState({
        config
      });
    } else if (action === "cloneTeam") {
      let { projectIndex, teamIndex } = data;

      config[projectIndex].teams = [...config[projectIndex].teams, JSON.parse(JSON.stringify(config[projectIndex].teams[teamIndex]))];
      this.setState({
        config
      })
    }
    // console.log(config)
  }

  onLoginEnter() {
    this.setState({
      currentState: '0'
    })
  }

  onLogout() {

  }

  render() {
    return (
      <div style={{position: "absolute", height: '100%', width: '100%'}}>
        <AppRoutes {...this.state}
                   onUpload={this.onUpload}
                   goToConfig={this.goToConfig}
                   onConfigAction={this.onConfigAction}
                   goToRetrieveResults={this.goToRetrieveResults}
                   fetchDivisionResult={this.fetchDivisionResult}
                   goToPrevState={this.goToPrevState}
                   onLoginEnter={this.onLoginEnter} />
      </div>
    );
  }
}

export default App;
