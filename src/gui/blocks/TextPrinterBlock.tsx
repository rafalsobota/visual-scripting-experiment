import React, { useContext, useEffect, useState } from 'react';
import Block from './Block';
import EngineContext from '../EngineContext';
import { createStyles, makeStyles } from '@material-ui/core';
import TextPrinterBlockLogic from './TextPrinterBlockLogic';

const useStyles = makeStyles(() =>
  createStyles({
    actions: {
      padding: 4,
    },
  }),
);

interface TextEmitterBlockProps {
  id: string;
}

export default function TextPrinterBlock({ id }: TextEmitterBlockProps) {
  const classes = useStyles();
  const engine = useContext(EngineContext);
  const instance: TextPrinterBlockLogic = engine.getBlock(id)! as TextPrinterBlockLogic;

  const [logState, setLogState] = useState('');

  useEffect(() => {
    function listener(newState: string) {
      setLogState(newState);
    }
    instance.subscribe(listener);
    return () => instance.unsubscribe(listener);
  }, [instance]);

  return (
    <Block id={id}>
      <div className={classes.actions}>{logState}</div>
    </Block>
  );
}
