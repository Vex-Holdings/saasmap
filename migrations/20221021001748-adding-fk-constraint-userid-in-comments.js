'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addConstraint(
      'Comments',{
        fields: ['userid'],
        type: 'FOREIGN KEY',
        name: 'useridlink-fk-in-comments',
        references: {
          table: 'Users',
          field: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint(
      'Comments',
      'useridlink-fk-in-comments'
    )
  }
};
