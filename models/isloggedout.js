'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class isLoggedout extends Model {
   
  };
  isLoggedOut.associate = function(models){
    isLoggedOut.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  isLoggedout.init({
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'isLoggedout',
  });
  return isLoggedout;
};