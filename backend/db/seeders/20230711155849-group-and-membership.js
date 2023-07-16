'use strict';

const { Group } = require('../models');
const { Membership } = require('../models');

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    await Group.bulkCreate([
      {
        organizerId: 3,
        name: 'The Yard',
        about: 'This is a group for interest about lawncare. We do lawncare because we care.',
        type: 'In person',
        private: false,
        city: 'Houston',
        state: 'Texas'
      },{
        organizerId: 1,
        name: 'The Hatchery',
        about: 'Everything related to reptiles and platypuses. Also features anything else egg related.',
        type: 'Online',
        private: true,
        city: 'L.A.',
        state: 'California'
      },{
        organizerId: 2,
        name: 'The Place',
        about: 'Secret Interest Group for the Place. If you know, you know. The Place also knows if you dont know',
        type: 'Online',
        private: false,
        city: 'Novokribirsk',
        state: 'Ravka'
      }
    ], {validate: true});

    await Membership.bulkCreate([
      {
        userId: 3,
        groupId: 1,
        status: 'organizer'

      },
      {
        userId: 1,
        groupId: 2,
        status: 'organizer'

      },
      {
        userId: 2,
        groupId: 3,
        status: 'organizer'

      },
      {
        userId: 3,
        groupId: 2,
        status: 'member'

      },
      {
        userId: 3,
        groupId: 3,
        status: 'pending'

      },
      {
        userId: 1,
        groupId: 3,
        status: 'member'

      },
      {
        userId: 1,
        groupId: 1,
        status: 'pending'

      },
      {
        userId: 2,
        groupId: 1,
        status: 'pending'

      },
      {
        userId: 2,
        groupId: 2,
        status: 'member'

      },

    ], {validate: true})
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const Op = Sequelize.Op;
    options.tableName = 'Memberships';
    await queryInterface.bulkDelete(options, {
      status: { [Op.in]: ['pending', 'organizer','member','co-host'] }

    }, {});

    options.tableName = 'Groups'
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ['The Yard', 'The Place', 'The Hatchery'] }
    }, {});


  }
};
