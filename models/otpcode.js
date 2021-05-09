'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class otpCode extends Model {
  
  };
  otpCode.associate = function(models){
    otpCode.belongsTo(models.user,{
      foreignKey:'userId'
    });
  }
  otpCode.init({
    code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'otpCode',
  });
  return otpCode;
};