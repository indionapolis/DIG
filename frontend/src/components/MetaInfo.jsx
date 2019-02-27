import React, { Component } from 'react';
import './MetaInfo.css';

class MetaInfo extends Component {
  render() {
    return (
      <div className="meta_info">
        <div style={{marginBottom: '15px'}}>
          Проверьте себя:
        </div>
        <div className="meta_info_element">
          <b>Название файла:</b> {this.props.metadata.name}
        </div>
        <div className="meta_info_element">
          <b>Количество строк:</b> {this.props.metadata.len}
        </div>
        <div className="meta_info_element">
          <b>Названия колонок:</b> {this.props.metadata.columns.join(", ")}
        </div>
        <div>
          <button className="button_decorated" onClick={this.props.goToPrevState}>
            Назад
          </button>
          <button className="button_decorated button_transparent" onClick={this.props.goToConfig}>
            Перейти к настройке
          </button>
        </div>
      </div>
    );
  }
}

export default MetaInfo;
