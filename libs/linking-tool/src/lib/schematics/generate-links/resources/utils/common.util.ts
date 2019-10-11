import { SourceFile, SyntaxKind } from 'ts-morph';

export class CommonUtil {
  static isFunction(element: any): boolean {
    return typeof element === 'function';
  }

  static isValidRoutingModule(source: SourceFile): boolean {
    return (
      !!source.getStatementByKind(SyntaxKind.ClassDeclaration) &&
      !!source.getStatementByKind(SyntaxKind.VariableStatement)
    );
  }
}
