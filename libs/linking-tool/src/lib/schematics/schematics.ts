import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../resources/interfaces/schema.interface';
import { GenerateLinksService } from '../services/generate-links.service';

export class Schematics {
  static generateLinks(_options: Schema): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      const resultPath = Schematics.resolveResultPath(_options.resultPath);

      if (tree.exists(resultPath)) {
        console.log('Removing old links map located in', resultPath);
        tree.delete(resultPath);
      }

      tree.create(resultPath, new GenerateLinksService().generateLinksMap());
      return tree;
    };
  }

  private static resolveResultPath(resultPathFromSchema: string): string {
    let result = resultPathFromSchema.trim();

    if (!result) {
      return './links-map.json';
    }

    if (!result.startsWith('./')) {
      result = './'.concat(result);
    }

    return result.endsWith('.json') ? result : result.concat('.json');
  }
}
