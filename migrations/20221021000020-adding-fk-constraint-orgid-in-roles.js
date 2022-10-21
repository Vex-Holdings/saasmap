'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Roles',{
        fields: ['orgid'],
        type: 'FOREIGN KEY',
        name: 'orgidlink-fk-in-roles',
        references: {
          table: 'Organizations',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Roles',
      'orgidlink-fk-in-roles'
    )
  }
};
