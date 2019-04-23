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

    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    render() {
        const loaders = ["loader", 'lol_loader', 'cube', 'spinner'];

        return (
            <div className="login">
                <img src={`/${this.randomChoice(loaders)}.gif`} height={350} width={350} />
            </div>
        )
    }
}

export default Login;
