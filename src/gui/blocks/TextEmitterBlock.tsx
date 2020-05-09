import React, { useEffect, useContext, useRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Block from './Block';
import GraphContext from '../GraphContext';
import { getBlock, getPort, getPortWires } from '../../engine/selectors';
import EngineContext from '../EngineContext';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 150,
      height: 150,
    },
    title: {
      padding: 4,
      height: 30,
    },
    portIcon: {
      margin: 5,
      width: 10,
      height: 10,
      borderRadius: 5,
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
      borderStyle: 'solid',
    },
    portIconActive: {
      backgroundColor: theme.palette.primary.main,
      margin: 5,
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    main: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    port: {
      '&:hover': {
        background: '#eee',
        cursor: 'pointer',
      },
      display: 'flex',
    },
    portName: {
      paddingLeft: 4,
      paddingRight: 4,
    },
  }),
);

interface Props {
  id: string;
}

export default function TextEmitterBlock(props: Props) {
  const classes = useStyles(props);
  const graph = useContext(GraphContext);
  const engine = useContext(EngineContext);
  const currentBlock = getBlock(graph, props.id)!;
  const name = currentBlock.name;
  const outputRef = useRef(null);
  const outputPortId = currentBlock.outputPorts[0].id!;
  const outputPortType = currentBlock.outputPorts[0].payloadType!;

  const portActive = getPortWires(graph, outputPortId).length > 0;

  useEffect(() => {
    // componentDidMount
    const portRef: any = outputRef.current;
    const positionRect = portRef.getBoundingClientRect();
    const x = Math.round(positionRect.x + positionRect.width / 2);
    const y = Math.round(positionRect.y + positionRect.height / 2);
    engine.setPortPosition(outputPortId, x, y);
  });

  return (
    <Block id={props.id}>
      <Paper className={classes.root} draggable>
        <div className={classes.title}>{name}</div>
        <div className={classes.main}>
          <div
            className={classes.port}
            draggable
            onDragStart={(e) => {
              const data = JSON.stringify({ outputPortId, payloadType: outputPortType });
              e.dataTransfer.setData('Text', data);
              e.stopPropagation();
            }}
          >
            <div className={classes.portName}>out</div>
            <div className={portActive ? classes.portIconActive : classes.portIcon} ref={outputRef}></div>
          </div>
        </div>
      </Paper>
    </Block>
  );
}
