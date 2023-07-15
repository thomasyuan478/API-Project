'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Venue.belongsTo(models.Group, {
        foreignKey: 'groupId'
      })

      Venue.belongsToMany(models.Group, {
        through: models.Event,
        foreignKey: 'venueId',
        otherKey: 'groupId'
      })
    }
  }
  Venue.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
    groupId: {
      type: DataTypes.INTEGER,
      references: {model: 'Groups'}

    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lat: {
      type: DataTypes.DECIMAL,
      allowNull: false
  },
    lng: {
      type: DataTypes.DECIMAL,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
