import * as childProcess from 'child_process';
import { resolve } from 'path';

export interface SchematicsBuilderOptions {
  tsConfig: string;
}

class Builder {
  constructor(private root: string, private tsConfig: string) {}

  build(): Promise<void> {
    console.log('Build Schematics');
    console.log(`From: ${this.root}`);
    console.log(`To: ${resolve(this.root, this.tsConfig)}`);
    const child = childProcess.spawn('tsc', ['-p', resolve(this.root, this.tsConfig)]);
    child.stdout.on('data', data => {
      console.log('stdout:', data.toString());
    });
    child.stderr.on('data', data => {
      console.log('stderr:', data.toString());
    });
    return new Promise((res, reject) => {
      child.on('close', code => {
        console.info(`tsc exited with code ${code}`);
        if (code === 0) {
          res();
        } else {
          reject();
        }
      });
    });
  }
}

export async function initialize(
  options: SchematicsBuilderOptions,
  root: string
): Promise<Builder> {
  return new Builder(root, options.tsConfig);
}
