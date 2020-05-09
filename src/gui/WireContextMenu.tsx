import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import EngineContext from './EngineContext';
import { Popover, List, ListItem, ListItemText } from '@material-ui/core';

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
  x: number;
  y: number;
  open: boolean;
  onClose: () => void;
}

export default function WireContextMenu(props: Props) {
  const classes = useStyles(props);
  const engine = useContext(EngineContext);

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
        <ListItem
          button
          onClick={() => {
            engine.deleteWire(props.id);
            props.onClose();
          }}
        >
          <ListItemText primary="Delete" className={classes.dangerousAction} />
        </ListItem>
      </List>
    </Popover>
  );
}
