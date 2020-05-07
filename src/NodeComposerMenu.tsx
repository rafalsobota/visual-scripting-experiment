import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem, { ListItemProps } from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
    },
  }),
);

export default function NodeComposerMenu(props: {nodes: {type: string, name: string}[], onClick: (nodeType: string) => void}) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <List component="nav">
        {props.nodes.map((node) =>
          <ListItem button key={node.type}>
            <ListItemText primary={node.name} onClick={() => props.onClick(node.type)}/>
          </ListItem>
        )}
      </List>
    </div>
  );
}