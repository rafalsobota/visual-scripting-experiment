import React from 'react';
import Block from '../Block';
import { TextField, createStyles, makeStyles } from '@material-ui/core';
import { useBehavior } from '../hooks';
import TextLengthValidatorBehavior from './TextLengthValidatorBehavior';

const useStyles = makeStyles(() =>
  createStyles({
    actions: {
      padding: 4,
    },
  }),
);

interface Props {
  id: string;
}

export default function TextLengthValidatorBlock({ id }: Props) {
  const classes = useStyles();
  const behavior = useBehavior<TextLengthValidatorBehavior>(id);

  return (
    <Block id={id}>
      <div className={classes.actions}>
        <TextField
          id="value"
          variant="outlined"
          label="Min Length"
          onChange={(e) => {
            if (e.target.value === '') {
              behavior.setMin(undefined);
              return;
            }
            const value = Number.parseInt(e.target.value);
            if (isNaN(value)) {
              return;
            }
            behavior.setMin(value);
          }}
        />
        <TextField
          id="value"
          variant="outlined"
          label="Max Length"
          onChange={(e) => {
            if (e.target.value === '') {
              behavior.setMax(undefined);
              return;
            }
            const value = Number.parseInt(e.target.value);
            if (isNaN(value)) {
              return;
            }
            behavior.setMax(value);
          }}
        />
      </div>
    </Block>
  );
}
