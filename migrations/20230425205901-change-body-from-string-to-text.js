'use strict';

module.exports = {
  async up (queryInterface, dataTypes) {
    await queryInterface.changeColumn(
      'Comments', 'body', {
        type: dataTypes.TEXT,
        name: 'change-body-from-string-to-text'
        }
    )
  },

  async down (queryInterface, dataTypes) {
    await queryInterface.changeColumn(
      'Comments',
      'change-body-from-string-to-text'
    )
  }
};
