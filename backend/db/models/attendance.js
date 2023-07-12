'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Attendance.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
    eventId: {
      type: DataTypes.INTEGER,
      references: {model: 'Events'}
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {model: 'Users'}
    },
    status: {
      type: DataTypes.ENUM('attending', 'not attending'),
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
