import Behavior from '../../../engine/Behavior';
import LoginPage from '../../../app/LoginPage';
import React from 'react';

export default class LoginPageBehavior extends Behavior {
  private loginValid = false;
  private passwordValid = false;
  private loginButtonActive = false;

  private onLoginChange = (value: string) => {
    this.send('login', value);
  };

  private onPasswordChange = (value: string) => {
    this.send('password', value);
  };

  private onLogin = () => {
    this.send('loginButtonClick', true);
  };

  start() {
    setInterval(() => {
      this.sendWidget();
    }, 1000);
  }

  private sendWidget = () => {
    this.send('widget', this.render());
  };

  private render() {
    return (
      <LoginPage
        onLoginChange={this.onLoginChange}
        onPasswordChange={this.onPasswordChange}
        loginValid={this.loginValid}
        passwordValid={this.passwordValid}
        loginButtonActive={this.loginButtonActive}
        onLogin={this.onLogin}
      />
    );
  }

  receive(portName: string, value: any) {
    if (portName === 'loginValid') {
      this.loginValid = value;
    } else if (portName === 'passwordValid') {
      this.passwordValid = value;
    } else if (portName === 'loginButtonActive') {
      this.loginButtonActive = value;
    }
    this.sendWidget();
  }
}
