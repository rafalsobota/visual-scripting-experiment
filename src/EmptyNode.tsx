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
import PowerOutlinedIcon from '@material-ui/icons/PowerOutlined';
import KeyboardTabIcon from '@material-ui/icons/KeyboardTab';
import GpsNotFixedIcon from '@material-ui/icons/GpsNotFixed';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 100,
      height: 100,
    },
    title: {
        padding: 4
    }
  }),
);

export default function EmptyNode(props: {name: string}) {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Typography className={classes.title}>{props.name}</Typography>
    </Paper>
  );
}