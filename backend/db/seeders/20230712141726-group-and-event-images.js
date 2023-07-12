'use strict';

const { GroupImage, EventImage } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await GroupImage.bulkCreate([{
      groupId:
      url:
      preview:
    },{
      groupId:
      url:
      preview:
    }]);

    await EventImage.bulkCreate([{
      groupId:
      url:
      preview:
    },{
      groupId:
      url:
      preview:
    }]);
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;

    options.tableName = 'GroupImages';
    await queryInterface.bulkDelete(options, {
      preview: { [Op.in]: ['', ''] }
    }, {});

    options.tableName = 'EventImages';
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: ['', ''] }
    }, {});

    return
  }
};
