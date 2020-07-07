import { ArrowFunction, PropertyAccessExpression, SyntaxKind } from 'ts-morph';
import { TypescriptApiUtil } from './typescript-api.util';

export namespace AngularUtil {
  export function getLazyLoadedModuleName(loader: ArrowFunction) {
    const loaderReturns = TypescriptApiUtil.getCallExpressionFromArrowFunction(loader);
    const moduleExtractionExpression = loaderReturns
      .getChildrenOfKind(SyntaxKind.ArrowFunction)[0]
      .getBody() as PropertyAccessExpression;

    return moduleExtractionExpression.getName();
  }
}
