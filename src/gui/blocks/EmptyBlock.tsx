import React from 'react';
import Block from './Block';

export default function EmptyBlock(props: { id: string }) {
  return <Block id={props.id} />;
}
