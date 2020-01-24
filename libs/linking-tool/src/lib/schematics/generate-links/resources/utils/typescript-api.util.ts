import {
  ArrayLiteralExpression,
  ArrowFunction,
  CallExpression,
  Expression,
  Identifier,
  Node,
  ObjectLiteralExpression,
  PropertyAccessExpression,
  PropertyAssignment,
  SourceFile,
  StringLiteral,
  SyntaxKind,
  VariableDeclaration
} from 'ts-morph';
import { GenerateLinksProperty } from '../enums/generate-links-property.enum';
import { CommonUtil } from './common.util';

export class TypescriptApiUtil {
  static getArrayExpression(expression: Expression): Expression[] {
    return (expression as ArrayLiteralExpression).getElements();
  }

  static getArrayValue(propertyAssignment: PropertyAssignment): Expression[] {
    return TypescriptApiUtil.getArrayLiteralFromPropertyAssignment(
      propertyAssignment
    ).getElements();
  }

  static getThenValueFromImportArrowFunction(arrowFunction: ArrowFunction): string {
    const callExpression = TypescriptApiUtil.getCallExpressionFromArrowFunction(arrowFunction);
    const propertyAccessExpression = TypescriptApiUtil.getPropertyAccessExpressionFromArrowFunction(
      arrowFunction
    );
    const modulePath = TypescriptApiUtil.getCallExpressionArguments(
      propertyAccessExpression.getExpression() as CallExpression
    );
    const importThenArguments = TypescriptApiUtil.getCallExpressionArguments(callExpression);

    if (!importThenArguments || !importThenArguments.length) {
      throw new Error('Bad import-then block for ' + arrowFunction.getBodyText());
    }

    const importThenArrowFunction = importThenArguments.find(node =>
      TypescriptApiUtil.isArrowFunction(node as PropertyAssignment)
    );

    if (!importThenArrowFunction) {
      throw new Error('No arrow function found in ' + arrowFunction.getBodyText());
    }

    const thenBody = (importThenArrowFunction as ArrowFunction).getBody() as PropertyAccessExpression;
    return `${modulePath}/${thenBody.getNameNode().getText()}`;
  }

  static getObjectLiteralExpression(
    property: GenerateLinksProperty,
    object: ObjectLiteralExpression
  ): ObjectLiteralExpression {
    return TypescriptApiUtil.getPropertyAssignment(
      property,
      object
    ).getInitializer() as ObjectLiteralExpression;
  }

  static getPropertyAssignment(
    property: GenerateLinksProperty,
    object: ObjectLiteralExpression
  ): PropertyAssignment {
    return object.getProperty(property) as PropertyAssignment;
  }

  static getPropertyName(expression: Expression): string {
    return expression instanceof PropertyAccessExpression
      ? (expression as PropertyAccessExpression).getName()
      : '';
  }

  static getStringValue(propertyAssignment: PropertyAssignment): string {
    if (
      CommonUtil.isFunction((propertyAssignment.getInitializer() as StringLiteral).getLiteralValue)
    ) {
      return (propertyAssignment.getInitializer() as StringLiteral).getLiteralValue();
    }

    return (propertyAssignment.getInitializer() as PropertyAccessExpression).getName();
  }

  static isArrayValue(propertyAssignment: PropertyAssignment): boolean {
    return CommonUtil.isFunction(
      TypescriptApiUtil.getArrayLiteralFromPropertyAssignment(propertyAssignment).getElements
    );
  }

  static isArrayExpression(expression: Expression): boolean {
    return expression instanceof ArrayLiteralExpression;
  }

  static isArrowFunction(object: PropertyAssignment | ArrowFunction): boolean {
    return object.getKind() === SyntaxKind.ArrowFunction
      ? true
      : !!(object as PropertyAssignment).getInitializer() &&
          ((object as PropertyAssignment).getInitializer() as Expression).getKind() ===
            SyntaxKind.ArrowFunction;
  }

  static isObjectLiteralExpression(expression: Expression): boolean {
    return expression.getKind() === SyntaxKind.ObjectLiteralExpression;
  }

  static isPropertyExisting(
    property: GenerateLinksProperty,
    object: ObjectLiteralExpression
  ): boolean {
    return !!object.getProperty(property);
  }

  static isStringLiteral(propertyAssignment: PropertyAssignment): boolean {
    return (
      !!propertyAssignment.getInitializer() &&
      (propertyAssignment.getInitializer() as Expression).getKind() === SyntaxKind.StringLiteral
    );
  }

  static isVariableDeclarationExisting(
    property: GenerateLinksProperty,
    source: SourceFile
  ): boolean {
    return (
      !!source.getVariableDeclaration(property) &&
      !!(source.getVariableDeclaration(property) as VariableDeclaration).getInitializer()
    );
  }

  private static getArrayLiteralFromPropertyAssignment(
    propertyAssignment: PropertyAssignment
  ): ArrayLiteralExpression {
    return propertyAssignment.getInitializer() as ArrayLiteralExpression;
  }

  private static getCallExpressionArguments(callExpression: CallExpression): Node[] {
    return callExpression.getArguments();
  }

  private static getCallExpressionFromArrowFunction(arrowFunction: ArrowFunction): CallExpression {
    return arrowFunction.getBody() as CallExpression;
  }

  private static getCallExpressionFromPropertyAccessExpression(
    propertyAccessExpression: PropertyAccessExpression
  ): CallExpression {
    return propertyAccessExpression.getExpression() as CallExpression;
  }

  private static getPropertyAccessExpressionFromArrowFunction(
    arrowFunction: ArrowFunction
  ): PropertyAccessExpression {
    return arrowFunction.getBody() as PropertyAccessExpression;
  }

  private static getPropertyAccessExpressionFromCallExpression(
    callExpression: CallExpression
  ): PropertyAccessExpression {
    return callExpression.getExpression() as PropertyAccessExpression;
  }
}
