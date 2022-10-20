'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Organization extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Organization.init({
    orgname: DataTypes.STRING,
    description: DataTypes.STRING,
    location: DataTypes.STRING,
    website: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Organization',
  });
  return Organization;
};