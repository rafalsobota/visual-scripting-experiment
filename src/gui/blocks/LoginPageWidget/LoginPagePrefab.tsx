import React from 'react';
import BlockPrefab from '../../../engine/BlockPrefab';
import { BlockSpec } from '../../../engine/GraphSpec';
import Behavior, { Send } from '../../../engine/Behavior';
import Block from '../Block';
import LoginPageBehavior from './LoginPageBehavior';

const LoginPagePrefab: BlockPrefab = {
  type: 'login-page',
  name: 'Login Page',
  newSpec(id: string, type: string, name: string, x: number, y: number): BlockSpec {
    return {
      id,
      x,
      y,
      name,
      type,
      inputPorts: [
        { name: 'loginValid', payloadType: 'boolean' },
        { name: 'passwordValid', payloadType: 'boolean' },
        { name: 'loginButtonActive', payloadType: 'boolean' },
      ],
      outputPorts: [
        { name: 'login', payloadType: 'string' },
        { name: 'password', payloadType: 'string' },
        { name: 'loginButtonClick', payloadType: 'boolean' },
        { name: 'widget', payloadType: 'widget' },
      ],
    };
  },
  render(spec: BlockSpec) {
    return <Block id={spec.id} />;
  },
  materialize(spec: BlockSpec, send: Send): Behavior {
    return new LoginPageBehavior(spec, send);
  },
};

export default LoginPagePrefab;
