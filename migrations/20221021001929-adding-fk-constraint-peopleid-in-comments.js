'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Comments',{
        fields: ['orgid'],
        type: 'FOREIGN KEY',
        name: 'peopleidlink-fk-in-comments',
        references: {
          table: 'People',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Comments',
      'peopleidlink-fk-in-comments'
    )
  }
};
