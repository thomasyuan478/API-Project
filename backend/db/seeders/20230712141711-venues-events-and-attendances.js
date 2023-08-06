"use strict";

const { Venue, Event, Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Venue.bulkCreate([
      {
        groupId: 1,
        address: "123 Avenue Lane",
        city: "L.A.",
        state: "California",
        lat: 12.3454,
        lng: 23.3456,
      },
      {
        groupId: 2,
        address: "456 Lane Avenue",
        city: "Houston",
        state: "Texas",
        lat: 56.2313,
        lng: 83.1213,
      },
      {
        groupId: 3,
        address: "098 Address",
        city: "City",
        state: "State",
        lat: 12.2323,
        lng: 23.2323,
      },
    ]);

    await Event.bulkCreate([
      {
        venueId: 2,
        groupId: 1,
        name: "Welcome to Lawn Care Basics",
        description:
          "This if the first session for care of different lawns. Bring your questions and we will get you answers!",
        type: "In person",
        capacity: 2300,
        price: 199,
        startDate: new Date("2023-01-23 10:00:00"),
        endDate: new Date("2023-01-24 10:00:00"),
      },
      {
        venueId: 2,
        groupId: 1,
        name: "Welcome to Advanced Lawn Care",
        description:
          "Advanced Lawn Care for those who are trying to bring their lawn to the next level. Will include refreshments!",
        type: "In person",
        capacity: 2300,
        price: 199,
        startDate: new Date("2023-09-23 10:00:00"),
        endDate: new Date("2023-09-24 11:00:00"),
      },
      {
        venueId: 3,
        groupId: 2,
        name: "The Best Event Ever!",
        description: "Come join us in the celebration of excellence!",
        type: "Online",
        capacity: 1300,
        price: 2000,
        startDate: new Date("2023-05-17 10:00:00"),
        endDate: new Date("2023-06-17 11:00:00"),
      },
      {
        venueId: 1,
        groupId: 3,
        name: "The Place's Secret Meeting for Secret Things.",
        description:
          "This is a super secret meeting where we will discuss the guiding principles for the Place and it's members.",
        type: "Online",
        capacity: 100000,
        price: 9999,
        startDate: new Date("2023-10-14 10:00:00"),
        endDate: new Date("2023-10-14 12:00:00"),
      },
    ]);

    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 2,
        status: "attending",
      },
      {
        eventId: 1,
        userId: 3,
        status: "pending",
      },
      {
        eventId: 2,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 2,
        userId: 3,
        status: "pending",
      },
      {
        eventId: 3,
        userId: 1,
        status: "pending",
      },
      {
        eventId: 3,
        userId: 2,
        status: "pending",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    options.tableName = "Attendances";
    await queryInterface.bulkDelete(
      options,
      {
        status: { [Op.in]: ["attending", "not attending"] },
      },
      {}
    );

    options.tableName = "Events";
    await queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Event 1", "The Second Event", "The Third Event"] },
      },
      {}
    );

    options.tableName = "Venues";
    await queryInterface.bulkDelete(
      options,
      {
        state: { [Op.in]: ["Texas", "California", "State"] },
      },
      {}
    );

    return;
  },
};
