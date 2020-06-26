import { resolve } from 'path';
import * as childProcess from 'child_process';
import { error, info, success } from '../utils/log';

export class TscBuilder {
  constructor(private root: string, private tsConfig: string) {}

  build(options?: string[]): Promise<void> {
    info(`Build Schematics\nFrom: ${this.root}\nTo: ${resolve(this.root, this.tsConfig)}`);

    const child = childProcess.spawn('tsc', [
      '-p',
      resolve(this.root, this.tsConfig),
      ...(options || [])
    ]);
    child.stdout.on('data', data => {
      info(`stdout: ${data.toString()}`);
    });
    child.stderr.on('data', data => {
      info(`stderr: ${data.toString()}`);
    });
    return new Promise((res, reject) => {
      child.on('close', code => {
        if (code === 0) {
          success(`tsc exited with code ${code}`);
          res();
        } else {
          error(`tsc exited with code ${code}`);
          reject();
        }
      });
    });
  }

  watch(): Promise<void> {
    return this.build(['-w']);
  }
}
