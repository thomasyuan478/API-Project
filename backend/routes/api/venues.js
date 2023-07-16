const express = require('express');
const { Op } = require('sequelize');

const { Venue } = require('../../db/models');
const { Membership } = require('../../db/models');
const { Group } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//VERIFIED
router.put('/:venueId', requireAuth, async (req,res,next) => {

  const venue = await Venue.findByPk(req.params.venueId,
    {include: [
      {model: Group}]
    });

 if(!venue){
    const err = new Error("Venue couldn't be found");
    err.status = 404;
    return next(err);
  }

  const valid = await Membership.findOne({
    where: {
      groupId: venue.Group.id,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  const { address, city, state, lat, lng } = req.body;

  if(!address || !city || !state || !lat || !lng || typeof lat !== "number" || typeof lng !== "number"){
    const err = new Error("Bad request");
    err.status = 400;
    err.errors = {};
    if(!address) err.errors.address = "Street Address is required";
    if(!city) err.errors.city = "City is required";
    if(!state) err.errors.state = "State is required";
    if(!lat) err.errors.lat = "Latitude is required";
    else if(typeof lat !== "number") err.errors.lat = "Latitude is not valid";
    if(!lng) err.errors.lng = "Longitdue is required";
    else if (typeof lng !== "number") err.errors.lng = "Longitude is not valid";
    return next (err);
  }


  if(valid || venue.Group.organizerId === req.user.id){
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

  const err = new Error("Forbidden: Must be group owner or co-host to edit venues.");
  err.status = 403;
  next(err);

})

module.exports = router;
