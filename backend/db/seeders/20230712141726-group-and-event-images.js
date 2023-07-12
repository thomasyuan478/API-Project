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
      groupId: 1,
      url:"https://cdn2.thecatapi.com/images/chi.jpg",
      preview: true
    },{
      groupId: 2,
      url:"https://cdn2.thecatapi.com/images/MTYwNzk5MA.jpg",
      preview: false
    },{
      groupId: 3,
      url:"https://cdn2.thecatapi.com/images/MjAzODI4OQ.jpg",
      preview: false
    },]);

    await EventImage.bulkCreate([{
      groupId:1,
      url:"https://cdn2.thecatapi.com/images/3ih.jpg",
      preview: true
    },{
      groupId:2,
      url: "https://cdn2.thecatapi.com/images/199.gif",
      preview: false
    },
    {
      groupId:3,
      url:"https://cdn2.thecatapi.com/images/MTgzMjc5Mw.jpg",
      preview: true
    }]);
  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;

    options.tableName = 'GroupImages';
    await queryInterface.bulkDelete(options, {
      preview: { [Op.in]: ['true', 'false'] }
    }, {});

    options.tableName = 'EventImages';
    await queryInterface.bulkDelete(options, {
      preview: { [Op.in]: ['true', 'false'] }
    }, {});

    return
  }
};
