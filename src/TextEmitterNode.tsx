import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import ShareIcon from '@material-ui/icons/Share';
import PowerIcon from '@material-ui/icons/Power';
import PowerOffIcon from '@material-ui/icons/PowerOff';
import DirectionsIcon from '@material-ui/icons/Directions';
import TextFieldsIcon from '@material-ui/icons/TextFields';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: '2px 4px',
      display: 'flex',
      alignItems: 'center',
      width: 400,
    },
    input: {
      marginLeft: theme.spacing(1),
      flex: 1,
    },
    iconButton: {
      padding: 10,
    },
    divider: {
      height: 28,
      margin: 4,
    },
  }),
);

export default function TextEmitterNode() {
  const classes = useStyles();

  return (
    <Paper component="form" className={classes.root}>
      {/* <IconButton className={classes.iconButton} aria-label="menu">
        <TextFieldsIcon />
      </IconButton> */}
      
      <InputBase
        className={classes.input}
        placeholder="Text Value"
      />
      <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SendIcon />
      </IconButton>
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton className={classes.iconButton}>
        {/* <ShareIcon /> */}
        <PowerIcon />
        {/* <PowerOffIcon /> */}
      </IconButton>
    </Paper>
  );
}