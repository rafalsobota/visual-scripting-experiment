import React from "react";
import globalEngineInstance from "./globalEngineInstance";

const EngineContext = React.createContext(globalEngineInstance);
export default EngineContext;