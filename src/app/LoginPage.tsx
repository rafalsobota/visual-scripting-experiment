import React, { useState } from 'react';
import { FormControl, InputLabel, FilledInput, InputAdornment, IconButton, Button } from '@material-ui/core';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

interface Props {
  onLoginChange: (value: string) => void;
  loginValid: boolean;
  onPasswordChange: (value: string) => void;
  passwordValid: boolean;
  loginButtonActive: boolean;
  onLogin: (login: string, password: string) => void;
}

export default function LoginPage(props: Props) {
  const [state, setState] = useState({ showPassword: false });
  return (
    <div>
      <FormControl variant="filled">
        <InputLabel htmlFor="filled-adornment-login">Login</InputLabel>
        <FilledInput
          error={!props.loginValid}
          id="filled-adornment-login"
          // type={state.showPassword ? 'text' : 'password'}
          onChange={(e) => props.onLoginChange(e.target.value)}
        />
      </FormControl>
      <FormControl variant="filled">
        <InputLabel htmlFor="filled-adornment-password">Password</InputLabel>
        <FilledInput
          error={!props.passwordValid}
          id="filled-adornment-password"
          type={state.showPassword ? 'text' : 'password'}
          onChange={(e) => props.onPasswordChange(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => {
                  setState({ showPassword: !state.showPassword });
                }}
                onMouseDown={(e) => e.preventDefault()}
                edge="end"
              >
                {state.showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>
      <Button fullWidth variant="contained" color="primary" disabled={!props.loginButtonActive}>
        Log In
      </Button>
    </div>
  );
}
