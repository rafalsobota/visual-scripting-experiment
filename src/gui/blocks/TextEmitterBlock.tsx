import React from 'react';
import Block from './Block';
import { Button, TextField, createStyles, makeStyles } from '@material-ui/core';
import TextEmitterBlockLogic from './TextEmitterBlockLogic';
import { useBehavior } from './hooks';

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
  const behavior = useBehavior<TextEmitterBlockLogic>(id);

  return (
    <Block id={id}>
      <div className={classes.actions}>
        <TextField
          id="value"
          variant="outlined"
          label="Value"
          onChange={(e) => {
            behavior.setValue(e.target.value);
          }}
        />
        <Button
          fullWidth
          color="primary"
          onClick={() => {
            behavior.emit();
          }}
        >
          Emit
        </Button>
      </div>
    </Block>
  );
}
