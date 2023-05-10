'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'People',
      'cblink',
      Sequelize.STRING
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'People',
      'cblink'
    );
  }
};
