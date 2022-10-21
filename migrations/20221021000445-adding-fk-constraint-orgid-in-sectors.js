'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Sectors',{
        fields: ['orgid'],
        type: 'FOREIGN KEY',
        name: 'orgidlink-fk-in-sectors',
        references: {
          table: 'Organizations',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Sectors',
      'orgidlink-fk-in-sectors'
    )
  }
};