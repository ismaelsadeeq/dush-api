'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    
  };
  user.associate = function(models){
    user.hasMany(models.otpCode,{
      foreignKey:'userId'
    });
    user.hasOne(models.isLoggedout,{
      foreignKey:'userId'
    });
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    celoBalance:DataTypes.STRING,
    cusdbalance:DataTypes.STRING
    
  }, {
    sequelize,
    paranoid:true,
    modelName: 'user',
  });
  return user;
};