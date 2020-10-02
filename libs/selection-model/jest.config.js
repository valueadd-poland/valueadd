module.exports = {
  name: 'selection-model',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/selection-model',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
