'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Insto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Insto.init({
    investorid: DataTypes.INTEGER,
    investeeid: DataTypes.INTEGER,
    roundtype: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Insto',
  });
  return Insto;
};