const { version } = require('../../package.json');
const { projects } = require('../../angular');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const cwd = process.cwd();
const otp = process.argv.slice(2)[0];

function updateVersion(filePath) {
  const libPackageJson = require(filePath);
  libPackageJson['version'] = version;
  fs.writeFileSync(filePath, JSON.stringify(libPackageJson));
}

Object.keys(projects).forEach(key => {
  const project = projects[key];
  if (project.architect && project.architect.build) {
    const projectDist = path.normalize(`${cwd}/dist/${project.root}`);
    updateVersion(path.normalize(`${projectDist}/package.json`));

    exec(
      `npm publish  --access public --tag latest ${projectDist}${otp ? ' --otp ' + otp : ''}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`exec error: ${error}`);
          return;
        }
        console.log(`stdout: ${stdout}`);
        console.log(`stderr: ${stderr}`);
      }
    );
  }
});
