import React from 'react';
import './App.css';
import demo from './experiments/demo';
import Button from '@material-ui/core/Button';
import { Theme, createStyles, makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lime from '@material-ui/core/colors/lime';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import { AppBar, Toolbar, IconButton, Typography, Container, Paper, CssBaseline, Card, CardContent, CardActions, FormControl, InputLabel, Select, MenuItem, TextField, Divider, List, ListItem, ListItemIcon, ListItemText, CardHeader, CardActionArea, Avatar, OutlinedInput, InputAdornment } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextEmitterNode from './TextEmitterNode';
import TextPrinterNode from './TextPrinterNode';
import EmptyNode from './EmptyNode';

const theme = createMuiTheme({

  // Dark Mode
  palette: {
    primary: blue,
    secondary: green,
    // type: 'dark',
  },

  // Dense - https://material-ui.com/customization/density/
  
  props: {
    MuiButton: {
      size: 'small',
    },
    MuiFilledInput: {
      margin: 'dense',
    },
    MuiFormControl: {
      margin: 'dense',
    },
    MuiFormHelperText: {
      margin: 'dense',
    },
    MuiIconButton: {
      size: 'small',
    },
    MuiInputBase: {
      margin: 'dense',
    },
    MuiInputLabel: {
      margin: 'dense',
    },
    MuiListItem: {
      dense: true,
    },
    MuiOutlinedInput: {
      margin: 'dense',
    },
    MuiFab: {
      size: 'small',
    },
    MuiTable: {
      size: 'small',
    },
    MuiTextField: {
      margin: 'dense',
    },
    MuiToolbar: {
      variant: 'dense',
    },
  },
  overrides: {
    MuiIconButton: {
      sizeSmall: {
        // Adjust spacing to reach minimal touch target hitbox
        marginLeft: 4,
        marginRight: 4,
        padding: 12,
      },
    },
  },
});

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      // display: 'flex',
      // flexWrap: 'wrap',
      // '& > *': {
      //   margin: theme.spacing(1),
      //   minWidth: theme.spacing(16),
      //   minHeight: theme.spacing(16)
      // },
      width: '100%',
      height: '100%',
      // backgroundColor: '#ddd',
      backgroundSize: '20px 20px',
      backgroundImage: 'radial-gradient(circle, #ccc 1px, rgba(0, 0, 0, 0) 1px)',
    },
    bullet: {
      display: 'inline-block',
      margin: '0 2px',
      transform: 'scale(0.8)',
    },
    title: {
      fontSize: 14,
    },
    pos: {
      marginBottom: 12,
    },
    nodeHeader: {
      padding: 8
    },
    formControl: {
      minWidth: theme.spacing(24),
    },
    autocomplete: {
      width: theme.spacing(24),
    },
    card: {
      // position: 'absolute',
      zIndex: 10,
      left: 10,
      top: 20,
      margin: theme.spacing(2),
      // margin: theme.spacing(1),
      width: theme.spacing(28),
      // minHeight: theme.spacing(16)
      // transform: 'scale(0.7)',
    }
  }),
);

function App() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <div className={classes.root}>
        <Card elevation={4} draggable onDragEnd={(e) => console.log(e)} className={classes.card}>
          <CardHeader
            title="Text Emitter 1"
          />
          <CardContent>
          <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Value</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type='text'
            value='Hello'
            // onChange={(e) => console.log(e)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
            {/* <form noValidate autoComplete="off">
              <TextField id="filled-basic" label="Value" variant="outlined" value="Hello" />
            </form>
            <Button size="medium" color="primary" variant="contained" fullWidth={true}>
                Emit
              </Button>  */}
          </CardContent>
          <Divider/>
          <CardContent>
          <Autocomplete
                freeSolo
                className={classes.autocomplete}
                multiple
                disableClearable
                fullWidth={true}
                id="size-small-outlined-multi"
                size="small"
                options={top100Films}
                getOptionLabel={(option) => option.title}
                defaultValue={[top100Films[0]]}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Output" />
                )}
              />
          </CardContent>
        </Card>
        <Card elevation={4} draggable onDragEnd={(e) => console.log(e)} className={classes.card}>
          <CardHeader
            title="Text Printer 1"
          />
          <CardContent>
            Hello
          </CardContent>
        </Card>
        <Card elevation={4} draggable onDragEnd={(e) => console.log(e)} className={classes.card}>
          {/* <CardHeader
            title="Text Emitter 1"
          /> */}
          <CardContent>
          <FormControl variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">Value</InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type='text'
            value='Hello'
            // onChange={(e) => console.log(e)}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  aria-label="toggle password visibility"
                  edge="end"
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            }
            labelWidth={70}
          />
        </FormControl>
          </CardContent>
        </Card>
        <div className={classes.card} draggable>
          <TextEmitterNode />
        </div>
        <div className={classes.card} draggable>
          <TextPrinterNode />
        </div>

        <div className={classes.card} draggable>
          <EmptyNode name="Node 1" />
        </div>
        <svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">

  <path d="M 10 10 C 20 20, 40 20, 50 10" stroke="black" fill="transparent"/>
  <path d="M 70 10 C 70 20, 120 20, 120 10" stroke="black" fill="transparent"/>
  <path d="M 130 10 C 120 20, 180 20, 170 10" stroke="black" fill="transparent"/>
  <path d="M 10 60 C 20 80, 40 80, 50 60" stroke="black" fill="transparent"/>
  <path d="M 70 60 C 70 80, 110 80, 110 60" stroke="black" fill="transparent"/>
  <path d="M 130 60 C 120 80, 180 80, 170 60" stroke="black" fill="transparent"/>
  <path d="M 10 110 C 20 140, 40 140, 50 110" stroke="black" fill="transparent"/>
  <path d="M 70 110 C 70 140, 110 140, 110 110" stroke="black" fill="transparent"/>
  <path d="M 130 110 C 120 140, 180 140, 170 110" stroke="black" fill="transparent" onClick={(e) => console.log(e)}/>

</svg>
      </div>  
    </ThemeProvider>
  );
}


export default App;

const top100Films = [
  { title: 'Text Printer 1' }
];