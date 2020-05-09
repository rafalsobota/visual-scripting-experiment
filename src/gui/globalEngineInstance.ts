import GraphEngine from '../engine/GraphEngine';
import EmptyBlockPrefab from './blocks/EmptyBlockPrefab';
import TextEmitterBlockPrefab from './blocks/TextEmitterBlockPrefab';
import TextPrinterBlockPrefab from './blocks/TextPrinterBlockPrefab';

const globalEngineInstance = new GraphEngine();

globalEngineInstance.registerPrefab(EmptyBlockPrefab, TextEmitterBlockPrefab, TextPrinterBlockPrefab);

export default globalEngineInstance;
