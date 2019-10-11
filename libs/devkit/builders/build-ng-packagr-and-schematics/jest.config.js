module.exports = {
  name: 'devkit-builders-build-ng-packagr-and-schematics',
  preset: '../../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../../coverage/libs/devkit/builders/build-ng-packagr-and-schematics'
};
