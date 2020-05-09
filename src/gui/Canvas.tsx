import React, { useState, useContext } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import BlockComposer from './BlockComposer';
import EngineContext from './EngineContext';
import GraphContext from './GraphContext';
import { getWireLines } from '../engine/selectors';
import WireLine from '../engine/WireLine';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backgroundLayer: {
      width: '100%',
      height: '100%',
      backgroundSize: '20px 20px',
      backgroundImage: 'radial-gradient(circle, #ccc 1px, rgba(0, 0, 0, 0) 1px)',
      position: 'absolute',
    },
    layer: {
      width: '100%',
      height: '100%',
      position: 'absolute',
    },
    blocksLayer: {
      width: '100%',
      height: '100%',
    },
    wire: {
      stroke: theme.palette.primary.main,
      strokeWidth: 2,
      fill: 'none',
      cursor: 'pointer',
      '&:hover': {
        strokeWidth: 4,
      },
    },
    wiresSVG: {
      position: 'absolute',
      width: '100%',
      height: '100%',
    },
  }),
);

interface Props {
  children: any;
}

function wireLineToSVGPolylinePoints(w: WireLine): string {
  return `${w.x1},${w.y1} ${w.x1 + 20},${w.y1} ${w.x2 - 20},${w.y2} ${w.x2},${w.y2}`;
}

function Canvas(props: Props) {
  const classes = useStyles(props);
  const graph = useContext(GraphContext);
  const engine = useContext(EngineContext);
  const [contextMenuState, setContextMenuState] = useState({ open: false, x: 0, y: 0 });

  return (
    <div
      className={classes.backgroundLayer}
      onContextMenu={(e) => {
        if (e.shiftKey) {
          return;
        }
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        className={classes.layer}
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
        onDrop={(e) => {
          e.preventDefault();
          const textData = e.dataTransfer.getData('Text');
          try {
            const { blockId, shiftX, shiftY } = JSON.parse(textData);
            if (blockId && shiftX && shiftY) {
              engine.moveBlock(blockId, e.pageX - shiftX, e.pageY - shiftY);
            }
          } catch (e) {
            console.warn('dragging failed');
            console.warn(e);
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={classes.wiresSVG}>
          {getWireLines(graph).map((w) => (
            <polyline
              key={wireLineToSVGPolylinePoints(w)}
              points={wireLineToSVGPolylinePoints(w)}
              className={classes.wire}
              onClick={(e) => {
                console.log(e);
              }}
            />
          ))}
        </svg>
        <BlockComposer
          blocksPrefabs={engine.blocksPrefabs}
          onClick={(blockTemplate) => {
            engine.createBlock(blockTemplate.type, contextMenuState.x, contextMenuState.y);
            setContextMenuState({ ...contextMenuState, open: false });
          }}
          onClose={() => {
            setContextMenuState({ ...contextMenuState, open: false });
          }}
          open={contextMenuState.open}
          x={contextMenuState.x}
          y={contextMenuState.y}
        />
        {props.children}
      </div>
    </div>
  );
}

export default Canvas;
