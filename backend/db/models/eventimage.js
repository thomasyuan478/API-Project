'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      EventImage.belongsTo(models.Event, {
        foreignKey: 'eventId'
      })
    }
  }
  EventImage.init({
    eventId: {
      type: DataTypes.INTEGER,
    references: {
      model: 'Events'
    }
    },
    url: DataTypes.STRING,
    preview: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
  }
  }, {
    sequelize,
    modelName: 'EventImage',
  });
  return EventImage;
};
