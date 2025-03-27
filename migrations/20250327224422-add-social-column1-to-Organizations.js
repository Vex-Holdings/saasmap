'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
      await queryInterface.addColumn(
        'Organizations',
        'twitter',
        Sequelize.STRING
      );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn(
      'Organizations',
      'twitter'
    );
  }
};
