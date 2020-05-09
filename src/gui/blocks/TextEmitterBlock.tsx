import React, { useContext } from 'react';
import Block from './Block';
import EngineContext from '../EngineContext';
import { Button, TextField, createStyles, makeStyles } from '@material-ui/core';
import TextEmitterBlockLogic from './TextEmitterBlockLogic';

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

export default function TextEmitterBlock({ id }: TextEmitterBlockProps) {
  const classes = useStyles();
  const engine = useContext(EngineContext);
  const instance: TextEmitterBlockLogic = engine.getBlock(id)! as TextEmitterBlockLogic;

  return (
    <Block id={id}>
      <div className={classes.actions}>
        <TextField
          id="value"
          variant="outlined"
          label="Value"
          onChange={(e) => {
            instance.setValue(e.target.value);
          }}
        />
        <Button
          onClick={() => {
            instance.emit();
          }}
        >
          Emit
        </Button>
      </div>
    </Block>
  );
}
