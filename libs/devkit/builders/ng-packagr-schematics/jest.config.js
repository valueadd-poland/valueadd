module.exports = {
  name: 'devkit-builders-ng-packagr-schematics',
  preset: '../../../../jest.config.js',
  transform: {
    '^.+\\.[tj]sx?$': 'ts-jest'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'html'],
  coverageDirectory: '../../../../coverage/libs/devkit/builders/ng-packagr-schematics'
};
