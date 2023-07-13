'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Event.hasMany(models.EventImage, {
        foreignKey: 'eventId'
      })

      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: 'eventId',
        otherKey: 'userId'
      }
        )
    }
  }
  Event.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
    venueId: {
      type: DataTypes.INTEGER,
      references: {model: 'Venues'}
    },
    groupId: {
      type: DataTypes.INTEGER,
      references: {model: 'Groups'}
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    type: {

      type: DataTypes.ENUM('in person','online'),

      allowNull: false
    },
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
  }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
