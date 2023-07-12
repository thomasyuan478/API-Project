'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.hasMany(models.GroupImage, {
        foreignKey: 'groupId'
      });

      Group.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: 'groupId',
        otherKey: 'userId'
      })


      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      })

      Group.belongsToMany(models.Venue, {
        through: models.Event,
        foreignKey: 'groupId',
        otherKey: 'venueId'
      })
    }
  }
  Group.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
      },
    organizerId:{
     type: DataTypes.INTEGER,
     references: {model: 'Users'}

    } ,
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    about: {
      type: DataTypes.TEXT,
    allowNull: false
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['active','inactive']
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
  },
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
