'use strict';

const { Venue, Event, Attendance } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await Venue.bulkCreate([{
      groupId:
      address:
      city:
      state:
      lat:
      lng:
    },{
      groupId:
      address:
      city:
      state:
      lat:
      lng:
    },{
      groupId:
      address:
      city:
      state:
      lat:
      lng:
    }])

    await Event.bulkCreate([{
      venueId:
      groupId:
      name:
      description:
      type:
      capacity:
      price:
      startDate:
      endDate:
    },{
      venueId:
      groupId:
      name:
      description:
      type:
      capacity:
      price:
      startDate:
      endDate:
    },{
      venueId:
      groupId:
      name:
      description:
      type:
      capacity:
      price:
      startDate:
      endDate:
    }])

    await Attendance.bulkCreate([{
      eventId:
      userId:
      status:
    },{
      eventId:
      userId:
      status:
    }, {
      eventId:
      userId:
      status:
    }, {
      eventId:
      userId:
      status:
    },{
      eventId:
      userId:
      status:
    },{
      eventId:
      userId:
      status:
    }])

  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    options.tableName = 'Venues';
    await queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['', ''] }
    }, {});

    options.tableName = 'Events';
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['', ''] }
    }, {});

    options.tableName = 'Attendances';
    await queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['attending', 'not attending'] }
    }, {});

    return
  }
};
