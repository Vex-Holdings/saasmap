'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Roles',{
        fields: ['peopleid'],
        type: 'FOREIGN KEY',
        name: 'peopleidlink-fk-in-roles',
        references: {
          table: 'People',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Roles',
      'peopleidlink-fk-in-roles'
    )
  }
};
