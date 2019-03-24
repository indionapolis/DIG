import React, { Component } from 'react';
import "./Configurator.css";

class Configurator extends Component {
  constructor(props) {
    super(props);
    this.onProjectAdd = this.onProjectAdd.bind(this);
    this.onSkillAdd = this.onSkillAdd.bind(this);
    this.onTeamAdd = this.onTeamAdd.bind(this);
    this.onProjectNameChange = this.onProjectNameChange.bind(this);
    this.onTeamRemove = this.onTeamRemove.bind(this);
    this.onProjectRemove = this.onProjectRemove.bind(this);
    this.onTeamClone = this.onTeamClone.bind(this);
    this.onSuggestion = this.onSuggestion.bind(this);
  }

  onProjectAdd() {
    this.props.onConfigAction("addProject", {});
  }

  onProjectRemove(projectIndex) {
    this.props.onConfigAction("removeProject", {projectIndex});
  }

  onTeamAdd(i, name) {
    this.props.onConfigAction("addTeam", i, name);
  }

  onTeamRemove(projectIndex, teamIndex) {
    this.props.onConfigAction("removeTeam", {projectIndex, teamIndex});
  }

  onTeamClone(projectIndex, teamIndex) {
    this.props.onConfigAction("cloneTeam", {projectIndex, teamIndex});
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

  onSuggestion(projectIndex, teamIndex) {
    if (document.getElementById(`P${projectIndex}T${teamIndex}skill_input`).value.length > 0) {
      fetch(`${process.env.REACT_APP_BACKEND_URL}/skill_suggestion?input=` + document.getElementById(`P${projectIndex}T${teamIndex}skill_input`).value)
        .then(d => d.json())
        .then(data => {
          console.log(data);
          let suggester = document.getElementById(`P${projectIndex}T${teamIndex}skill_suggester`);
          if (data.length > 0) {
            suggester.style.display = 'block';
            suggester.innerHTML = data.map((elem, elem_index) => `<div id="suggest_item_${elem_index}" class="suggestion_skill_elem">${elem.toString()}</div>`).join("");
            for (let i = 0; i < data.length; ++i) {
              document.getElementById(`suggest_item_${i}`).onclick = (e) => {
                console.log(1, e);
              }
            }
          } else {
            suggester.style.display = 'none';
          }
        })
    } else {
      document.getElementById(`P${projectIndex}T${teamIndex}skill_suggester`).style.display = 'none';
    }
  }

  render() {
    return (
      <div className="configurator">
        <div id="configurator_box">
          {this.props.config.map((data, projectIndex) => (
            <div key={data.name + "~" + projectIndex} className="project card">
              <div style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
                <input className="project_name"
                       type="text"
                       placeholder="Введите название проекта"
                       onKeyPress={(e) => {if (e.key === "Enter") this.onTeamAdd(projectIndex)}}
                       onBlur={(e) => this.onProjectNameChange(projectIndex, e.currentTarget.value)}
                       defaultValue={this.props.config[projectIndex].name} />
                <button onClick={() => this.onTeamAdd(projectIndex)}
                        className="button_decorated button_no_margin">
                  Добавить команду
                </button>
                <button className="button_decorated button_no_margin remove_project"
                        onClick={() => this.onProjectRemove(projectIndex)}>
                  <img className="remove_image"
                        src="./remove.png"
                        alt="remove"
                        style={{position: 'relative'}} />
                </button>
              </div>
              <div className="teams_module">
                {this.props.config[projectIndex].teams.map((teamData, teamIndex) => (
                  <div key={teamData.name + teamIndex.toString()} className="team_element">
                    <div style={{position: 'relative'}}>
                      <img  className="clone_image"
                            src="./clone.png"
                            alt="clone"
                            onClick={() => this.onTeamClone(projectIndex, teamIndex)}
                      />
                      <img  className="remove_image remove_image_target"
                            src="./remove.png"
                            alt="remove"
                            onClick={() => this.onTeamRemove(projectIndex, teamIndex)}/>
                    </div>
                    <div style={{padding: "7px 10px"}}>
                      Название:
                      <input type="text"
                             placeholder={"Команда #" + teamIndex}
                             onBlur={(e) => this.onTeamNameChange(projectIndex, teamIndex, e.currentTarget.value)}
                             defaultValue={this.props.config[projectIndex].teams[teamIndex].name} />
                    </div>
                    <div style={{padding: "7px 10px"}}>
                      Размер:
                      <input type="text" placeholder="0"
                             onBlur={(e) => this.onTeamSizeChange(projectIndex, teamIndex, e.currentTarget.value)}
                             className="users_count"
                             defaultValue={this.props.config[projectIndex].teams[teamIndex].size}/>
                    </div>
                    <div style={{padding: "7px 10px"}}>
                      Скиллы:
                      {this.props.config[projectIndex].teams[teamIndex].skills.map((skillData, skillIndex) => (
                        <div key={projectIndex + "team" + teamIndex + "skill" + skillIndex} className="card skill">
                          {skillData}
                        </div>
                      ))}
                      <div className="input_skill_wrapper">
                        <input type="text"
                               className="new_skill"
                               placeholder="Новый скилл"
                               id={`P${projectIndex}T${teamIndex}skill_input`}
                               onBlur={(e) => {
                                 document.getElementById(`P${projectIndex}T${teamIndex}skill_suggester`).style.display = 'none';
                                 // if (e.currentTarget.value.length > 0) {
                                 //   this.onSkillAdd(projectIndex, teamIndex, e.currentTarget.value);
                                 //   e.currentTarget.value = "";
                                 // }
                               }}
                               autoComplete="off"
                               spellCheck="false"
                               onChange={() => this.onSuggestion(projectIndex, teamIndex)}
                               onKeyPress={(e) => {
                                 if (e.key === "Enter" && e.currentTarget.value.length > 0) {
                                   this.onSkillAdd(projectIndex, teamIndex, e.currentTarget.value);
                                   e.currentTarget.value = "";
                                 }
                               }}
                        />
                        <div className="skill_suggestions" id={`P${projectIndex}T${teamIndex}skill_suggester`}>
                          cXc<br/>kek<br/>jej<br/>lol
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="button_box">
          <button className="button_decorated button_no_margin"
                  onClick={this.props.goToPrevState}
                  style={{width: '80px'}}>
            Назад
          </button>
          <button onClick={this.onProjectAdd}
                  className="button_decorated button_no_margin"
                  style={{width: '150px'}}>
            Добавить проект
          </button>
          <button onClick={this.props.goToRetrieveResults} className="button_decorated button_no_margin button_transparent divide">
            Разделить людей на команды
          </button>
        </div>
      </div>
    );
  }
}

export default Configurator;
