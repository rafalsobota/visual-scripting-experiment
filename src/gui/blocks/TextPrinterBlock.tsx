import React from 'react';
import Block from './Block';

export default function TextPrinterBlock(props: { id: string }) {
  return <Block id={props.id}>Printer custom stuff</Block>;
}
