'use strict';

const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Group, {
        foreignKey: 'organizerId',
        onDelete: 'cascade',
        hooks: true
      });

      User.hasMany(models.Attendance, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        hooks: true
      })

      User.hasMany(models.Membership, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        hooks: true
      })

      User.belongsToMany(models.Group, {
        through: models.Membership,
        foreignKey: 'userId',
        otherKey: 'groupId'
      })


      User.belongsToMany(models.Event, {
        through: models.Attendance,
        foreignKey: 'userId',
        otherKey: 'eventId'
      })

    }
  };

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
        },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
          notEmpty: true
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isAlpha: true,
          notEmpty: true
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    }, {
      sequelize,
      modelName: 'User',
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
