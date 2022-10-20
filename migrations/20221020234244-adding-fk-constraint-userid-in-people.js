'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'People',{
        fields: ['userid'],
        type: 'FOREIGN KEY',
        name: 'useridlink-fk-in-people',
        references: {
          table: 'Users',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'People',
      'useridlink-fk-in-people'
    )
  }
};
