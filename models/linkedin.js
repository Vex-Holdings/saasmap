'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Linkedin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Linkedin.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    linkedin: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Linkedin',
  });
  return Linkedin;
};