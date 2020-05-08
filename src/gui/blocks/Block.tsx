import React, { useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import GraphContext from '../GraphContext';
import { getBlock } from '../../engine/selectors';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      position: 'absolute'
    }
  }),
);

interface Props {id: string, children: any}

export default function Block(props: Props) {
  const classes = useStyles(props);
  const graph = useContext(GraphContext);

  const x = getBlock(graph, props.id)!.x;
  const y = getBlock(graph, props.id)!.y;

  return (
      <div
        className={classes.root}
        style={{left: x, top: y}}
        draggable
        onDragStart={(e) => {
            const target: any = e.target;
            target.style.opacity = "0.5";
            const shiftX = e.clientX - target.getBoundingClientRect().left;
            const shiftY = e.clientY - target.getBoundingClientRect().top;
            const data = JSON.stringify({ blockId: props.id, shiftX, shiftY });
            e.dataTransfer.setData('Text', data);
        }}
        onDragEnd={(e) => {
            const target: any = e.target;
            target.style.opacity = "1";
        }}
        >
          {props.children}
      </div>
  );
}