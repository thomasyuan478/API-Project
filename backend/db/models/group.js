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
        foreignKey: 'groupId',
        onDelete: 'cascade',
        hooks: true
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
        foreignKey: 'groupId',
        onDelete: 'cascade',
        hooks: true
      })

      Group.hasMany(models.Event, {
        foreignKey: 'groupId',
        onDelete: 'cascade',
        hooks: true
      })

      Group.hasMany(models.Venue, {
        foreignKey: 'groupId',
        onDelete: 'cascade',
        hooks: true
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
     allowNull: false,
     references: {model: 'Users'},
     onDelete: 'cascade'
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
        len: [50,140]
      }
    },
    type: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['Online','In person']
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
