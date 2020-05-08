import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Popover } from '@material-ui/core';
import { GraphEngine } from '../engine/GraphEngine';
import BlockTemplate from './BlockTemplate';

export default function BlockComposer(props: {
  blocksTemplates: BlockTemplate[],
  onClick: (blockTemplate: BlockTemplate) => void,
  open: boolean,
  onClose: () => void,
  x: number,
  y: number
}) {
  return (
    <Popover
      anchorReference="anchorPosition"
      anchorPosition={{ top: props.y, left: props.x }}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      open={props.open}
      onClose={props.onClose}
    >
      <List component="nav">
        {props.blocksTemplates.map((block) =>
          <ListItem button key={block.type}>
            <ListItemText primary={block.name} onClick={() => props.onClick(block)} />
          </ListItem>
        )}
      </List>
    </Popover>
  );
}
