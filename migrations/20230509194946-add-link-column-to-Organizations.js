'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'Organizations',
      'link',
      Sequelize.TEXT
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Organizations',
      'link'
    );
  }
};
