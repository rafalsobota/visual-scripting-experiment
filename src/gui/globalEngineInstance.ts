import { GraphEngine } from "../engine/GraphEngine";
import EmptyBlockPrefab from "./blocks/EmptyBlockPrefab";
import TextEmitterBlockPrefab from "./blocks/TextEmitterBlockPrefab";

const globalEngineInstance = new GraphEngine();

globalEngineInstance.registerPrefab(EmptyBlockPrefab, TextEmitterBlockPrefab);

export default globalEngineInstance;