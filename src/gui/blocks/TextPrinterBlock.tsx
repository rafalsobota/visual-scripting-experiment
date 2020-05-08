import React, { useEffect, useContext, useRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Block from './Block';
import GraphContext from '../GraphContext';
import { getBlock, getPort } from '../../engine/selectors';
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
    input: {
        width: 20,
        height: 20,
    },
    inputIcon: {
        margin: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
        borderColor: theme.palette.primary.main,
        borderWidth: 2,
        borderStyle: 'solid',
    },
    inputIconActive: {
        backgroundColor: theme.palette.primary.main,
        margin: 5,
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    main: {
        display: 'flex',
        justifyContent: 'flex-start'
    },
    port: {
        '&:hover': {
            background: '#eee',
            cursor: 'pointer'
        },
        display: 'flex',
    },
    portName: {
        paddingLeft: 4,
        paddingRight: 4,
    }
  }),
);

interface Props {id: string}

export default function TextPrinterBlock(props: Props) {
  const classes = useStyles(props);
  const graph = useContext(GraphContext);
  const engine = useContext(EngineContext);
  const currentBlock = getBlock(graph, props.id)!;
  const name = currentBlock.name;
  const inputRef = useRef(null);
  const inputPort = currentBlock.inputPorts[0]!;

  useEffect(() => {
    // componentDidMount
    const portRef: any = inputRef.current;
    const positionRect = portRef.getBoundingClientRect();
    const x = Math.round(positionRect.x + positionRect.width / 2);
    const y = Math.round(positionRect.y + positionRect.height / 2);
    const portId = currentBlock.inputPorts[0].id;
    engine.setPortPosition(portId!, x, y);
  });

  return (
      <Block id={props.id}>
        <Paper className={classes.root} draggable>
            <div className={classes.title}>{name}</div>
            <div className={classes.main}>
                <div
                    className={classes.port}
                    onDrop={(e) => {
                        e.preventDefault();
                        const textData = e.dataTransfer.getData("Text");
                        try {
                            const { outputPortId, payloadType } = JSON.parse(textData);
                            if (outputPortId && payloadType && payloadType === inputPort.payloadType) {
                                engine.connectPorts(outputPortId, inputPort.id!);
                            }
                        } catch (e) {
                            console.warn("dragging to port failed");
                            console.warn(e);
                        }
                    }}
                    // onDragOver={(e) => {
                    //     const textData = e.dataTransfer.getData("Text");
                    //     try {
                    //         const { inputPortId, payloadType } = JSON.parse(textData);
                    //         if (inputPortId && payloadType && payloadType === inputPort.payloadType) {
                    //             e.currentTarget.style.backgroundColor = 'green';
                    //         }
                    //     } catch (e) {
                    //         console.log('onDragOver error', e);
                    //     }


                    //     console.log('dragOver', e.currentTarget);
                    // }}
                >
                    <div className={classes.input} ref={inputRef}>
                        <div className={classes.inputIcon}></div>
                    </div>
                    <div className={classes.portName}>in</div>
                </div>
            </div>
            
        </Paper>
    </Block>
  );
}