import React, { useEffect, useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { Typography } from '@material-ui/core';
import Block from './Block';
import GraphContext from '../GraphContext';
import { getBlock } from '../../engine/selectors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 150,
      height: 150,
    },
    title: {
        padding: 4,
        height: 20,
    }
  }),
);

interface Props {id: string}

export default function TextEmitterBlock(props: Props) {
  const classes = useStyles(props);
  const graph = useContext(GraphContext);
  const name = getBlock(graph, props.id)!.name

  useEffect(() => {
    // componentDidMount
  });

  return (
      <Block id={props.id}>
        <Paper className={classes.root} draggable>
            <div className={classes.title}>{name}</div>
        </Paper>
    </Block>
  );
}