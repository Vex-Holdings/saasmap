'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Instos',{
        fields: ['investorid'],
        type: 'FOREIGN KEY',
        name: 'investoridlink-fk-in-instos',
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
      'investoridlink-fk-in-instos'
    )
  }
};
