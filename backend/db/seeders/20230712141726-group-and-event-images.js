"use strict";

const { GroupImage, EventImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "https://images.unsplash.com/photo-1558904541-efa843a96f01?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8eWFyZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        preview: true,
      },
      {
        groupId: 2,
        url: "https://images.unsplash.com/photo-1498931299472-f7a63a5a1cfa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmlyZXdvcmtzfGVufDB8fDB8fHww&auto=format&fit=crop&w=500&q=60",
        preview: false,
      },
      {
        groupId: 3,
        url: "https://images.unsplash.com/photo-1468183654773-77e2f0bb6bf9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fHRlbXBsZXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        preview: false,
      },
    ]);

    await EventImage.bulkCreate([
      {
        eventId: 1,
        url: "https://images.unsplash.com/photo-1628625251833-04eeafb7a2db?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8eWFyZHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        preview: true,
      },
      {
        eventId: 2,
        url: "https://images.unsplash.com/photo-1587899897387-091ebd01a6b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmluZSUyMGRpbmluZ3xlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        preview: false,
      },
      {
        eventId: 3,
        url: "https://images.unsplash.com/photo-1528715471579-d1bcf0ba5e83?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWVkaXRhdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
        preview: true,
      },
      {
        eventId: 4,
        url: "https://images.unsplash.com/photo-1596086221164-c8a4cac55e27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHlhcmR8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=500&q=60",
        preview: true,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    const Op = Sequelize.Op;

    options.tableName = "EventImages";
    await queryInterface.bulkDelete(
      options,
      {
        preview: { [Op.in]: [true, false] },
      },
      {}
    );

    options.tableName = "GroupImages";
    await queryInterface.bulkDelete(
      options,
      {
        preview: { [Op.in]: [true, false] },
      },
      {}
    );

    return;
  },
};
