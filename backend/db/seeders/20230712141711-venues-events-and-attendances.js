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
      groupId: 1,
      address: '123 Avenue Lane',
      city: 'L.A.',
      state: 'California',
      lat: 12.3454,
      lng: 23.3456
    },{
      groupId: 2,
      address: '456 Lane Avenue',
      city: 'Houston',
      state: 'Texas',
      lat: 56.2313,
      lng: 83.1213
    },{
      groupId: 3,
      address: '098 Address',
      city: 'City',
      state: 'State',
      lat: 12.2323,
      lng: 23.2323
    }])

    await Event.bulkCreate([{
      venueId: 2,
      groupId: 1,
      name: 'Event 1',
      description: 'This is the firste event in the database',
      type: 'In person',
      capacity: 2300,
      price: 199,
      startDate: new Date('2023-1-1'),
      endDate:  new Date('2023-1-7')
    },{
      venueId: 3,
      groupId: 2,
      name: 'The Second Event',
      description: 'Come Celebrate something with us!',
      type: 'Online',
      capacity: 1300,
      price: 2000,
      startDate: new Date('2023-05-17'),
      endDate: new Date('2023-06-17')
    },{
      venueId: 1,
      groupId: 3,
      name: 'The Third Event',
      description: 'The Final Event',
      type: 'Online',
      capacity: 100000,
      price: 9999,
      startDate: new Date('2023-6-5'),
      endDate:new Date('2023-6-18')
    }])

    await Attendance.bulkCreate([{
      eventId: 1,
      userId: 2,
      status: 'attending'
    },{
      eventId: 1,
      userId: 3,
      status: 'attending'
    }, {
      eventId: 2,
      userId: 1,
      status: 'attending'
    }, {
      eventId: 3,
      userId: 1,
      status: 'attending'
    },{
      eventId: 2,
      userId: 3,
      status: 'attending'
    },{
      eventId: 3,
      userId: 2,
      status: 'attending'
    }])

  },

  async down (queryInterface, Sequelize) {

    const Op = Sequelize.Op;
    options.tableName = 'Attendances';
    await queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['attending', 'not attending'] }
    }, {});

    options.tableName = 'Events';
    await queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['Event 1', 'The Second Event', 'The Third Event'] }
    }, {});

    options.tableName = 'Venues';
    await queryInterface.bulkDelete(options, {
      state: { [Op.in]: ['Texas', 'California','State'] }
    }, {});



    return
  }
};
