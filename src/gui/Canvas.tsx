import React, { useState, useContext } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import BlockComposer from './BlockComposer';
import BlockTemplate from './BlockTemplate';
import EngineContext from './EngineContext';

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

const blocksTemplates: BlockTemplate[] = [
    { name: "Empty Block", type: "empty" },
]

interface Props {
    children: any
}

function Canvas(props: Props) {
    const classes = useStyles(props);
    const engine = useContext(EngineContext);
    const [composerState, setComposerState] = useState({ open: false, x: 0, y: 0 });

    return (
        <div
            className={classes.root}
            onContextMenu={(e) => {
                setComposerState({ open: true, x: e.pageX, y: e.pageY });
                e.preventDefault();
            }}
            onDrop={(e) => {
                e.preventDefault();
                const textData = e.dataTransfer.getData("Text");
                try {
                    const { blockId, shiftX, shiftY } = JSON.parse(textData);
                    if (blockId && shiftX && shiftY) {
                        engine.moveBlock(blockId, e.pageX - shiftX, e.pageY - shiftY);
                    }
                } catch (e) {
                    console.warn("dragging failed");
                    console.warn(e);
                }
            }}
            onDragOver={(e) => {
                e.preventDefault()
            }}
        >
            <BlockComposer
                blocksTemplates={blocksTemplates}
                onClick={(blockTemplate) => {
                    engine.createBlock(blockTemplate.type, composerState.x, composerState.y);
                    setComposerState({ ...composerState, open: false });
                }}
                onClose={() => {
                    setComposerState({ ...composerState, open: false });
                }}
                open={composerState.open}
                x={composerState.x}
                y={composerState.y}
            />
            {props.children}
        </div>
    );
}

export default Canvas;
