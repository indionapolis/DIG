import React, { Component } from 'react';
import "./Configurator.css";

class Configurator extends Component {
  constructor(props) {
    super(props);
    this.onProjectAdd = this.onProjectAdd.bind(this);
    this.onSkillAdd = this.onSkillAdd.bind(this);
    this.onTeamAdd = this.onTeamAdd.bind(this);
    this.onProjectNameChange = this.onProjectNameChange.bind(this);
  }

  onProjectAdd() {
    this.props.onConfigAction("addProject");
  }

  onTeamAdd(i) {
    this.props.onConfigAction("addTeam", i);
  }

  onSkillAdd(projectIndex, teamIndex, name) {
    this.props.onConfigAction("addSkill", {projectIndex, teamIndex, name});
  }

  onProjectNameChange(projectIndex, name) {
    if (name.length > 0) {
      this.props.onConfigAction("changeProjectName", {projectIndex, name});
    }
  }

  onTeamNameChange(projectIndex, teamIndex, name) {
    if (name.length > 0) {
      this.props.onConfigAction("changeTeamName", {projectIndex, teamIndex, name});
    }
  }

  onTeamSizeChange(projectIndex, teamIndex, size) {
    if (size.length > 0 && !isNaN(size)) {
      size = Number.parseInt(size);
      this.props.onConfigAction("changeTeamSize", {projectIndex, teamIndex, size});
    }
  }

  render() {
    return (
      <div className="configurator">
        <div id="configurator_box">
          {this.props.config.map((data, projectIndex) => (
            <div key={"project" + projectIndex} className="project card">
              <div style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
                <input className="project_name"
                       type="text"
                       placeholder="Введите название проекта"
                       onKeyPress={(e) => {if (e.key === "Enter") this.onTeamAdd(projectIndex)}}
                       onBlur={(e) => this.onProjectNameChange(projectIndex, e.currentTarget.value)}
                       value={this.props.config[projectIndex].name} />
                <button onClick={() => this.onTeamAdd(projectIndex)} className="button_decorated button_no_margin">
                  Добавить команду
                </button>
              </div>
              <div className="teams_module">
                {this.props.config[projectIndex].teams.map((teamData, teamIndex) => (
                  <div key={projectIndex + "team" + teamIndex} className="team_element">
                    <div style={{padding: "7px 10px"}}>
                      Название:
                      <input type="text"
                             placeholder={"Команда #" + teamIndex}
                             onBlur={(e) => this.onTeamNameChange(projectIndex, teamIndex, e.currentTarget.value)}
                             value={this.props.config[projectIndex].teams[teamIndex].name} />
                    </div>
                    <div style={{padding: "7px 10px"}}>
                      Размер:
                      <input type="text" placeholder="0"
                             onBlur={(e) => this.onTeamSizeChange(projectIndex, teamIndex, e.currentTarget.value)}
                             className="users_count"
                             value={this.props.config[projectIndex].teams[teamIndex].size}/>
                    </div>
                    <div style={{padding: "7px 10px"}}>
                      Скиллы:
                      {this.props.config[projectIndex].teams[teamIndex].skills.map((skillData, skillIndex) => (
                        <div key={projectIndex + "team" + teamIndex + "skill" + skillIndex} className="card skill">
                          {skillData}
                        </div>
                      ))}
                      <input type="text"
                             className="new_skill"
                             placeholder={"Новый скилл"}
                             onBlur={(e) => {
                               if (e.currentTarget.value.length > 0) {
                                 this.onSkillAdd(projectIndex, teamIndex, e.currentTarget.value);
                                 e.currentTarget.value = null;
                               }
                             }}
                             onKeyPress={(e) => {
                               if (e.key === "Enter" && e.currentTarget.value.length > 0) {
                                 this.onSkillAdd(projectIndex, teamIndex, e.currentTarget.value);
                                 e.currentTarget.value = null;
                               }
                             }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="button_decorated" onClick={this.props.goToPrevState}>
          Назад
        </button>
        <button onClick={this.onProjectAdd} className="button_decorated button_no_margin">
          Добавить проект
        </button>
        <button onClick={this.props.goToRetrieveResults} className="button_decorated button_no_margin">
          Разделить людей на команды
        </button>
      </div>
    );
  }
}

export default Configurator;
