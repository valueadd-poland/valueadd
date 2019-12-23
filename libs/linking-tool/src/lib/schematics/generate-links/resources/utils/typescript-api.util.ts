import {
  ArrayLiteralExpression,
  ArrowFunction,
  CallExpression,
  Expression,
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

  static getImportValueFromArrowFunction(arrowFunction: ArrowFunction): string {
    const callExpression = TypescriptApiUtil.getCallExpressionFromArrowFunction(arrowFunction);
    const importThen = TypescriptApiUtil.getPropertyAccessExpressionFromCallExpression(
      callExpression
    );
    const importCall = TypescriptApiUtil.getCallExpressionFromPropertyAccessExpression(importThen);
    return TypescriptApiUtil.getCallExpressionArguments(importCall).length
      ? TypescriptApiUtil.getCallExpressionArguments(importCall)[0].getText()
      : '';
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

  static isArrowFunction(propertyAssignment: PropertyAssignment): boolean {
    return (
      !!propertyAssignment.getInitializer() &&
      (propertyAssignment.getInitializer() as Expression).getKind() === SyntaxKind.ArrowFunction
    );
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

  private static getPropertyAccessExpressionFromCallExpression(
    callExpression: CallExpression
  ): PropertyAccessExpression {
    return callExpression.getExpression() as PropertyAccessExpression;
  }
}