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
    user.hasOne(models.isLoggedOut,{
      foreignKey:'userId'
    });
  }
  user.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    address: DataTypes.STRING,
    balance:DataTypes.STRING
    
  }, {
    sequelize,
    paranoid:true,
    modelName: 'user',
  });
  return user;
};