'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Comments',{
        fields: ['peopleid'],
        type: 'FOREIGN KEY',
        name: 'peopleidlink2-fk-in-comments',
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
      'peopleidlink2-fk-in-comments'
    )
  }
};
