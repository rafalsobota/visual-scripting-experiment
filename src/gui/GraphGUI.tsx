import React, { useState, useEffect } from 'react';
import { Theme, createStyles, makeStyles, ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import EmptyBlock from './blocks/EmptyBlock';
import theme from './theme';
import { GraphEngine } from '../engine/GraphEngine';
import BlockComposer from './BlockComposer';
import { GraphSpec } from '../engine/GraphSpec';
import BlockTemplate from './BlockTemplate';

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

const blocksTemplates: BlockTemplate[] = [
    { name: "Empty Block", type: "empty" },
]

function GraphGUI() {
    const classes = useStyles(theme);
    const [composerState, setComposerState] = useState({ open: false, x: 0, y: 0 });
    const [engineState, setEngineState] = useState<GraphSpec>(engine.state);

    useEffect(() => {
        function listener(newState: GraphSpec) {
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
                setComposerState({ open: true, x: e.pageX, y: e.pageY });
                e.preventDefault();
            }}
                onDrop={(e) => {
                    e.preventDefault();
                    const textData = e.dataTransfer.getData("Text");
                    try {
                        const { id, shiftX, shiftY } = JSON.parse(textData);
                        if (id && shiftX && shiftY) {
                            engine.moveBlock(id, e.pageX - shiftX, e.pageY - shiftY);
                        }
                    } catch (e) {
                        console.warn("dragging failed");
                        console.warn(e);
                    }
                }
                }
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
                    engine={engine}
                />
                {engineState.blocks.map((n) =>
                    <div
                        style={{ left: n.x, top: n.y, position: 'absolute' }}
                        draggable
                        onDragStart={(e) => {
                            const target: any = e.target;
                            target.style.opacity = "0.5";
                            const shiftX = e.clientX - target.getBoundingClientRect().left;
                            const shiftY = e.clientY - target.getBoundingClientRect().top;
                            const data = JSON.stringify({ id: n.id, shiftX, shiftY });
                            e.dataTransfer.setData('Text', data);
                        }}
                        onDragEnd={(e) => {
                            const target: any = e.target;
                            target.style.opacity = "1";
                        }}
                    >
                        <EmptyBlock name={n.name} />
                    </div>
                )}
            </div>
        </ThemeProvider>
    );
}

export default GraphGUI;
