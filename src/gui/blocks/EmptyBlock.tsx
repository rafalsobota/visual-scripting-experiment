import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 100,
      height: 100,
    },
    title: {
        padding: 4
    }
  }),
);

export default function EmptyBlock(props: {name: string}) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography className={classes.title}>{props.name}</Typography>
    </Paper>
  );
}