'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class People extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  People.init({
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    location: DataTypes.STRING,
    linkedin: DataTypes.STRING,
    twitter: DataTypes.STRING,
    email: DataTypes.STRING,
    source: DataTypes.STRING,
    userid: DataTypes.INTEGER,
    cblink: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'People',
  });
  return People;
};