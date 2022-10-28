'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Instos',{
        fields: ['investeeid'],
        type: 'FOREIGN KEY',
        name: 'investeeidlink-fk-in-instos',
        references: {
          table: 'Organizations',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Instos',
      'investoreelink-fk-in-instos'
    )
  }
};
