'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Comments',{
        fields: ['orgid'],
        type: 'FOREIGN KEY',
        name: 'orgidlink-fk-in-comments',
        references: {
          table: 'Organizations',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Comments',
      'orgidlink-fk-in-comments'
    )
  }
};
