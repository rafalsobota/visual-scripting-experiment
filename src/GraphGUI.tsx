import React, { useState, useEffect, DOMElement } from 'react';
import './App.css';
import demo from './graph/demo';
import Button from '@material-ui/core/Button';
import { Theme, createStyles, makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import cyan from '@material-ui/core/colors/cyan';
import blueGrey from '@material-ui/core/colors/blueGrey';
import lime from '@material-ui/core/colors/lime';
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import { AppBar, Toolbar, IconButton, Typography, Container, Paper, CssBaseline, Card, CardContent, CardActions, FormControl, InputLabel, Select, MenuItem, TextField, Divider, List, ListItem, ListItemIcon, ListItemText, CardHeader, CardActionArea, Avatar, OutlinedInput, InputAdornment, Menu, Popover } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import SendIcon from '@material-ui/icons/Send';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextEmitterNode from './TextEmitterNode';
import TextPrinterNode from './TextPrinterNode';
import EmptyNode from './EmptyNode';
import theme from './theme';
import { GraphEngine } from './GraphEngine';
import NodeComposerMenu from './NodeComposerMenu';
import { GraphSpec } from './GraphSpec';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      height: '100%',
      backgroundSize: '20px 20px',
      backgroundImage: 'radial-gradient(circle, #ccc 1px, rgba(0, 0, 0, 0) 1px)',
    }
  }),
);


const engine = new GraphEngine();

const nodes = [
    {name: "Empty Node", type: "empty"},
]

function GraphGUI() {
  const classes = useStyles(theme);
  const [state, setState] = useState({opened: false, x: 0, y: 0});
  const [engineState, setEngineState] = useState<GraphSpec>(engine.state);

  useEffect(() => {
    function listener(newState: GraphSpec) {
      console.log("listener", newState);
      setEngineState(newState);
    }
    engine.subscribe(listener);
    return () => engine.unsubscribe(listener);
  }, [setEngineState]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <div className={classes.root} onContextMenu={(e) => {
          console.log(e);
          setState({opened: true, x: e.pageX, y: e.pageY});
          e.preventDefault();
      }}
      onDrop={(e) => {
          e.preventDefault();
        const textData = e.dataTransfer.getData("Text");
        try {
            const {id, shiftX, shiftY} = JSON.parse(textData);
            if (id) {
                // console.log({nodeId});
                // engine.moveNode(nodeId, e.clientLeft, e.clientTop);
                engine.moveNode(id, e.pageX - shiftX, e.pageY - shiftY);
            } else {
                console.log("nodeId not transfered!")
            }
            console.log("Drop end target", e.pageX, e.pageY, e)
        } catch (e) {
            console.warn("dragging unsupported elements");
            console.warn(e);
        }
      }
    
    }
    //   onDragEnd={(e) => {
    //     const nodeId = e.dataTransfer.getData("Text");
    //     if (nodeId) {
    //         console.log({nodeId});
    //         engine.moveNode(nodeId, e.pageX, e.pageY);
    //     } else {
    //         console.log("nodeId not transfered!")
    //     }
    //     console.log("DragEnd end target", e.pageX, e.pageY, e)
    //   }
    // }
      onDragOver={(e) => {
        console.log("drag over on target")  
        e.preventDefault()
        }}
      >
       <Popover 
        anchorReference="anchorPosition"
        anchorPosition={{ top: state.y, left: state.x }}
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
        }}
        open={state.opened}
        onClose={() => {setState({...state, opened: false})}}
        >
        <NodeComposerMenu nodes={nodes} onClick={(nodeType) => {
            engine.createNode(nodeType, state.x, state.y);
            setState({...state, opened: false});
        }} />
        </Popover>
       {engineState.nodes.map((n) =>
           <div style={{left: n.x, top: n.y, position: 'absolute'}} draggable onDragStart={(e) => {
               const target: any = e.target;
               target.style.opacity = "0.5";
               const shiftX = e.clientX - target.getBoundingClientRect().left; 
               const shiftY = e.clientY - target.getBoundingClientRect().top;
               const data = JSON.stringify({id: n.id, shiftX, shiftY});
               e.dataTransfer.setData('Text',data);
               console.log({shiftX, shiftY});
                // e.target.style.left = e.pageX + "px";
                // e.target.style.top = e.pageY + "px";
               console.log("Drag Start", e.pageX, e.pageY, e);
               }}
            //    onDragEnd={(e) => console.log("Drag end", e.pageX, e.pageY, e)}
               onDragEnd={(e) => {
                const target: any = e.target;
                target.style.opacity = "1";
            }}
               >
            <EmptyNode name={n.name}/>
           </div>
       )}

       
      </div>  
    </ThemeProvider>
  );
}


export default GraphGUI;
