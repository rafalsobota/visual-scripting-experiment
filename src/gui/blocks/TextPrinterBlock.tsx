import React, { useEffect, useContext, useRef, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Block from './Block';
import GraphContext from '../GraphContext';
import { getBlock, getPortWires } from '../../engine/selectors';
import EngineContext from '../EngineContext';
import TextPrinterBlockLogic from './TextPrinterBlockLogic';

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
      justifyContent: 'flex-start',
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
    actions: {
      padding: 4,
    },
  }),
);

interface Props {
  id: string;
}

export default function TextPrinterBlock(props: Props) {
  const classes = useStyles(props);
  const graph = useContext(GraphContext);
  const engine = useContext(EngineContext);
  const currentBlock = getBlock(graph, props.id)!;
  const name = currentBlock.name;
  const inputRef = useRef(null);
  const inputPort = currentBlock.inputPorts[0]!;
  const portActive = getPortWires(graph, inputPort.id!).length > 0;

  const blockLogic = engine.getBlock(props.id) as TextPrinterBlockLogic;

  useEffect(() => {
    // componentDidMount
    const portRef: any = inputRef.current;
    const positionRect = portRef.getBoundingClientRect();
    const x = Math.round(positionRect.x + positionRect.width / 2);
    const y = Math.round(positionRect.y + positionRect.height / 2);
    const portId = currentBlock.inputPorts[0].id;
    engine.setPortPosition(portId!, x, y);
  });

  const [logState, setLogState] = useState('');

  useEffect(() => {
    function listener(newState: string) {
      setLogState(newState);
    }
    blockLogic.subscribe(listener);
    return () => blockLogic.unsubscribe(listener);
  }, [blockLogic]);

  return (
    <Block id={props.id}>
      <Paper
        className={classes.root}
        draggable
        onDrop={(e) => {
          e.preventDefault();
          const textData = e.dataTransfer.getData('Text');
          try {
            const { outputPortId, payloadType } = JSON.parse(textData);
            if (outputPortId && payloadType && payloadType === inputPort.payloadType) {
              engine.connectPorts(outputPortId, inputPort.id!);
            }
          } catch (e) {
            console.warn('dragging to port failed');
            console.warn(e);
          }
        }}
      >
        <div className={classes.title}>{name}</div>
        <div className={classes.main}>
          <div
            className={classes.port}
            onDrop={(e) => {
              e.preventDefault();
              const textData = e.dataTransfer.getData('Text');
              try {
                const { outputPortId, payloadType } = JSON.parse(textData);
                if (outputPortId && payloadType && payloadType === inputPort.payloadType) {
                  engine.connectPorts(outputPortId, inputPort.id!);
                }
              } catch (e) {
                console.warn('dragging to port failed');
                console.warn(e);
              }
            }}
          >
            <div className={portActive ? classes.portIconActive : classes.portIcon} ref={inputRef}></div>
            <div className={classes.portName}>in</div>
          </div>
        </div>
        <div className={classes.actions}>{logState}</div>
      </Paper>
    </Block>
  );
}
