import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import { CssBaseline } from '@material-ui/core';
import EmptyBlock from './blocks/EmptyBlock';
import theme from './theme';
import { GraphSpec } from '../engine/GraphSpec';
import EngineContext from './EngineContext';
import globalEngineInstance from './globalEngineInstance';
import GraphContext from './GraphContext';
import Canvas from './Canvas';
import Block from './blocks/Block';

const engine = globalEngineInstance;

function GraphGUI() {
    const [graphState, setGraphState] = useState<GraphSpec>(engine.state);

    useEffect(() => {
        function listener(newState: GraphSpec) {
            setGraphState(newState);
        }
        engine.subscribe(listener);
        return () => engine.unsubscribe(listener);
    }, [setGraphState]);

    return (
        <EngineContext.Provider value={engine}>
        <GraphContext.Provider value={graphState}>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
            <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <Canvas>
                {graphState.blocks.map((block) =>
                    <div key={block.id}>
                        {engine.render(block)}
                    </div>
                )}
            </Canvas>
        </ThemeProvider>
        </GraphContext.Provider>
        </EngineContext.Provider>
    );
}

export default GraphGUI;
