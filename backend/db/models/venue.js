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
    address: {type: DataTypes.STRING},
    city: {type: DataTypes.STRING},
    state: {type: DataTypes.STRING},
    lat: {type: DataTypes.DECIMAL},
    lng: {type: DataTypes.DECIMAL}
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
