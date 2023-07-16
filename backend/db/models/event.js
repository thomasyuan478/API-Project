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
        foreignKey: 'eventId',
        onDelete: 'cascade',
        hooks: true
      })

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })

      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId'
      })

      Event.hasMany(models.Attendance, {
        foreignKey: 'eventId',
        onDelete: 'cascade',
        hooks: true
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
      references: {model: 'Venues'},
      onDelete: 'cascade'
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {model: 'Groups'},
      onDelete: 'cascade'

    },

    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM('In person','Online'),
      allowNull: false
    },
    capacity: {
      type: DataTypes.INTEGER,
    allowNull: false},
    price: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false},
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
  }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
