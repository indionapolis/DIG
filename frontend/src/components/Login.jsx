import React, {Component} from 'react';
import './Login.css'

class Login extends Component {
    onLogin() {
        let login = document.getElementById("login_").value;
        if (login) {
            document.cookie = `email=${login}`;
            this.props.onLoginEnter();
        } else {
            alert("ENTER LOGIN!!!!!");
        }
    }

    render() {
        return (
            <div className="login">
                <input id="login_" type="text" placeholder="e.bobrov@innopolis.university"
                       onKeyPress={(e) => {if (e.key === "Enter") this.onLogin()}} />
                <button className="button_decorated"
                        style={{alignSelf: 'center', marginTop: '0'}}
                        onClick={this.onLogin.bind(this)}>Login</button>
            </div>
        )
    }
}

export default Login;