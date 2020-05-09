import React from 'react';
import Block from './Block';

interface TextEmitterBlockProps {
  id: string;
}

export default function TextEmitterBlock({ id }: TextEmitterBlockProps) {
  return (
    <Block id={id}>
      <input />
    </Block>
  );
}
