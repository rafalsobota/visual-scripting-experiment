import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 100,
      height: 100,
      position: 'absolute',
      left: (props: Props) => props.x,
      top: (props: Props) => props.y,
    },
    title: {
        padding: 4,
        height: 20,
    }
  }),
);

interface Props {name: string, x: number, y: number}

export default function TextEmitterBlock(props: Props) {
  const classes = useStyles(props);

  useEffect(() => {
    // componentDidMount
  });

  return (
    <Paper className={classes.root} draggable>
        <div className={classes.title}>{props.name}</div>


    </Paper>
  );
}