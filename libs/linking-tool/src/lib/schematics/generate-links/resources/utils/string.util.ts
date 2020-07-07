import { Node } from 'ts-morph';

export namespace StringUtil {
  export function getStringArgumentValue(node: Node): string {
    return node.getText().slice(1, -1);
  }
}
