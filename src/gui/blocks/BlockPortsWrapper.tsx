import React, { useEffect, useContext, useRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import EngineContext from '../EngineContext';
import { useBlock, useBlockUtils } from './hooks';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 150,
      minHeight: 100,
    },
    title: {
      paddingLeft: 4,
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
    childrenWrapper: {
      display: 'block',
    },
    portName: {
      paddingLeft: 4,
      paddingRight: 4,
    },
  }),
);

interface BlockPortsWrapperProps {
  id: string;
  children: any;
}

export default function BlockPortsWrapper({ id, children }: BlockPortsWrapperProps) {
  const engine = useContext(EngineContext);
  const currentBlock = useBlock(id)!;
  const classes = useStyles();
  const { isOutputPortWired, isInputPortWired } = useBlockUtils(id);

  const allPorts = [...currentBlock.inputPorts, ...currentBlock.outputPorts];

  const portsRef = useRef(Object.fromEntries(allPorts.map(({ id }) => [id, { current: null }])));

  useEffect(() => {
    const portsIds = Object.keys(portsRef.current) as string[];
    portsIds.forEach((id: string) => {
      const portElement = portsRef.current[id]!.current as HTMLElement;
      if (portElement) {
        const positionRect = portElement.getBoundingClientRect();
        const x = Math.round(positionRect.x + positionRect.width / 2);
        const y = Math.round(positionRect.y + positionRect.height / 2);
        engine.setPortPosition(id, x, y);
      }
    });
  });

  return (
    <Paper className={classes.root} draggable>
      <Grid container spacing={0}>
        <Grid item xs={12} className={classes.title}>
          {currentBlock.name}
        </Grid>
        <Grid item container xs={12} spacing={0} justify="space-between" alignItems="flex-start">
          <Grid item xs>
            {currentBlock.inputPorts.map((inputPort) => (
              <div
                key={inputPort.id}
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
                <div
                  className={isInputPortWired(inputPort.name) ? classes.portIconActive : classes.portIcon}
                  ref={portsRef.current[inputPort.id!]}
                ></div>
                <div className={classes.portName}>{inputPort.name}</div>
              </div>
            ))}
          </Grid>
          <Grid item xs>
            {currentBlock.outputPorts.map((outputPort) => (
              <div
                key={outputPort.id}
                className={classes.port}
                style={{ placeContent: 'flex-end' }}
                draggable
                onDragStart={(e) => {
                  const data = JSON.stringify({
                    outputPortId: outputPort.id!,
                    payloadType: outputPort.payloadType!,
                  });
                  e.dataTransfer.setData('Text', data);
                  e.stopPropagation();
                }}
              >
                <div className={classes.portName}>{outputPort.name}</div>
                <div
                  className={isOutputPortWired(outputPort.name) ? classes.portIconActive : classes.portIcon}
                  ref={portsRef.current[outputPort.id!]}
                ></div>
              </div>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </Paper>
  );
}
