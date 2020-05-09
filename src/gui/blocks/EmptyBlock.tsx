import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Block from './Block';
import GraphContext from '../GraphContext';
import { getBlock } from '../../engine/selectors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 100,
      height: 100,
    },
    title: {
      padding: 4,
    },
  }),
);

function EmptyBlock(props: { id: string }) {
  const classes = useStyles();
  const graph = useContext(GraphContext);
  const name = getBlock(graph, props.id)?.name;

  return (
    <Block id={props.id}>
      <Paper className={classes.root}>
        <div className={classes.title}>{name}</div>
      </Paper>
    </Block>
  );
}

export default EmptyBlock;
