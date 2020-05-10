import GraphEngine from '../engine/GraphEngine';
import EmptyBlockPrefab from './blocks/EmptyBlockPrefab';
import TextEmitterBlockPrefab from './blocks/TextEmitterBlockPrefab';
import TextPrinterBlockPrefab from './blocks/TextPrinterBlockPrefab';
import LoginPagePrefab from './blocks/LoginPageWidget/LoginPagePrefab';
import WidgetRendererPrefab from './blocks/WidgetRenderer/WidgetRendererPrefab';
import TextLengthValidatorPrefab from './blocks/TextLengthValidator/TextLengthValidatorPrefab';
import AndPrefab from './blocks/And/AndPrefab';

const globalEngineInstance = new GraphEngine();

globalEngineInstance.registerPrefab(
  EmptyBlockPrefab,
  TextEmitterBlockPrefab,
  TextPrinterBlockPrefab,
  LoginPagePrefab,
  WidgetRendererPrefab,
  TextLengthValidatorPrefab,
  AndPrefab,
);

export default globalEngineInstance;
