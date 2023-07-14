const express = require('express');
const { Op } = require('sequelize');

const { Venue } = require('../../db/models');
const { Membership } = require('../../db/models');
const { Group } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.put('/:venueId', requireAuth, async (req,res) => {

  const venue = await Venue.findByPk(req.params.venueId,
    {include: [
      {model: Group}]
    });

 if(!venue){
    throw new Error("Venue couldn't be found")
  }

  const valid = await Membership.findAll({
    where: {
      groupId: venue.Group.id,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  const { address, city, state, lat, lng } = req.body;


  if(valid[0] || venue.Group.organizerId === req.user.id){
    venue.address = address ?? venue.address;
    venue.city = city ?? venue.city;
    venue.state = state ?? venue.state;
    venue.lat = lat ?? venue.lat;
    venue.lng = lng ?? venue.lng;

    await venue.save();

    const resVenue = {
      id: venue.id,
      groupid: venue.groupId,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng
    }

    res.json(resVenue);
    return;
  };

  throw new Error("Must be group owner or co-host to edit venues.")


})

module.exports = router;
