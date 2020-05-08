import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Popover } from '@material-ui/core';
import BlockPrefab from '../engine/BlockPrefab';

export default function BlockComposer(props: {
  blocksPrefabs: BlockPrefab[],
  onClick: (blockTemplate: BlockPrefab) => void,
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
        {props.blocksPrefabs.map((block) =>
          <ListItem button key={block.type} onClick={() => props.onClick(block)}>
            <ListItemText primary={block.name} />
          </ListItem>
        )}
      </List>
    </Popover>
  );
}
