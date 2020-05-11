import React, { useContext, useState, useEffect, useRef } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import GraphContext from '../GraphContext';
import { getBlock } from '../../engine/selectors';
import EngineContext from '../EngineContext';
import { Popover, List, ListItem, ListItemText } from '@material-ui/core';
import BlockPortsWrapper from './BlockPortsWrapper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute',
    },
    dangerousAction: {
      color: theme.palette.error.main,
    },
  }),
);

interface Props {
  id: string;
  children?: any;
}

export default function Block(props: Props) {
  const classes = useStyles(props);
  const graph = useContext(GraphContext);
  const engine = useContext(EngineContext);
  const [contextMenuState, setContextMenuState] = useState({ open: false, x: 0, y: 0 });

  const x = getBlock(graph, props.id)!.x;
  const y = getBlock(graph, props.id)!.y;

  const blockRef = useRef(null);

  useEffect(() => {
    const element = (blockRef.current! as unknown) as HTMLElement;
    const boundingBox = element.getBoundingClientRect();
    engine.setBlockSize(props.id, boundingBox.width, boundingBox.height);
  });

  return (
    <div
      ref={blockRef}
      className={classes.root}
      style={{ left: x, top: y }}
      draggable
      onDragStart={(e) => {
        const target: any = e.target;
        target.style.opacity = '0.5';
        const shiftX = e.clientX - target.getBoundingClientRect().left;
        const shiftY = e.clientY - target.getBoundingClientRect().top;
        const data = JSON.stringify({ blockId: props.id, shiftX, shiftY });
        e.dataTransfer.setData('Text', data);
      }}
      onDragEnd={(e) => {
        const target: any = e.target;
        target.style.opacity = '1';
      }}
      onContextMenu={(e) => {
        if (e.shiftKey) {
          return;
        }
        if (contextMenuState.open) {
          setContextMenuState({ open: false, x: e.pageX, y: e.pageY });
        } else {
          setContextMenuState({ open: true, x: e.pageX, y: e.pageY });
        }
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <BlockPortsWrapper id={props.id}>{props.children}</BlockPortsWrapper>
      <Popover
        anchorReference="anchorPosition"
        anchorPosition={{ top: contextMenuState.y, left: contextMenuState.x }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        open={contextMenuState.open}
        onClose={() => {
          setContextMenuState({ ...contextMenuState, open: false });
        }}
      >
        <List component="nav">
          <ListItem
            button
            onClick={() => {
              engine.createBlock(engine.getBlock(props.id)!.serialize().type, x + 10, y + 30);
              setContextMenuState({ ...contextMenuState, open: false });
            }}
          >
            <ListItemText primary="Dupliacte" />
          </ListItem>
          <ListItem
            button
            onClick={() => {
              engine.deleteBlock(props.id);
              setContextMenuState({ ...contextMenuState, open: false });
            }}
          >
            <ListItemText primary="Delete" className={classes.dangerousAction} />
          </ListItem>
        </List>
      </Popover>
    </div>
  );
}
