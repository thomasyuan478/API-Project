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

      // Group.belongsToMany(models.User, {
      //   through: models.Membership,
      //   foreignKey: 'groupId',
      //   otherKey: 'userId'
      // })

      Group.belongsTo(models.User, {
        foreignKey: 'organizerId'
      })

      Group.hasMany(models.Membership, {
        foreignKey: 'groupId'
      })


      Group.hasMany(models.Venue, {
        foreignKey: 'groupId'
      })

      // Group.belongsToMany(models.Venue, {
      //   through: models.Event,
      //   foreignKey: 'groupId',
      //   otherKey: 'venueId'
      // })
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
      type: DataTypes.STRING(60),
      allowNull: false,
      validate: {
        len: [2,60]
      }
    },
    about: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [50,100]
      }
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['online','in person']
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
  },
    city: {
      type: DataTypes.STRING,
    allowNull: false},
    state: {
      type: DataTypes.STRING,
    allowNull: false}
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
