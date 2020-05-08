import React from "react";
import { GraphSpec } from "../engine/GraphSpec";

const GraphContext = React.createContext<GraphSpec>({blocks: []});
export default GraphContext;