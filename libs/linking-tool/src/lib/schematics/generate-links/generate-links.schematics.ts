import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { GenerateLinksSchema } from './resources/interfaces/generate-links-schema.interface';
import { GenerateLinksService } from './services/generate-links.service';
import { ResultType } from './resources/enums/result-type.enum';

export class GenerateLinksSchematics {
  static run(_options: GenerateLinksSchema): Rule {
    return (tree: Tree, _context: SchematicContext) => {
      const resultPath = GenerateLinksSchematics.resolveResultPath(_options.resultPath);

      if (tree.exists(resultPath)) {
        console.log('Removing old links object located in', resultPath);
        tree.delete(resultPath);
      }

      tree.create(
        resultPath,
        new GenerateLinksService().generateLinks(
          GenerateLinksSchematics.resolveResultType(_options.resultType)
        )
      );
      return tree;
    };
  }

  private static resolveResultPath(resultPathFromSchema: string): string {
    let result = resultPathFromSchema.trim();

    if (!result) {
      return './links-object.json';
    }

    if (!result.startsWith('./')) {
      result = './'.concat(result);
    }

    return result.endsWith('.json') ? result : result.concat('.json');
  }

  private static resolveResultType(resultType: string): ResultType {
    if (resultType !== 'map' && resultType !== 'tree') {
      throw new Error('Given result type not recognised');
    }

    return resultType === 'map' ? ResultType.Map : ResultType.Tree;
  }
}
