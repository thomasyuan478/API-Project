const express = require('express');
const { Op } = require('sequelize');

const { EventImage } = require('../../db/models');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');
const { Event } = require('../../db/models');
const { User } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

//VERIFIED
router.delete('/:imageId', requireAuth, async (req, res, next) => {

  const image = await EventImage.findByPk(req.params.imageId, {
    include: {
      model: Event,
      include: {
        model: Group
      }
    }
  });

  if(!image){
    const err = new Error("Group Image cannot be found");
    err.status= 404;
    return next(err);
  }

  const validMembership = await Membership.findOne({
    where: {
      groupId: image.Event.Group.id,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(validMembership || image.Event.Group.organizerId === req.user.id){

    try{

      await image.destroy();

      res.status(200);
      res.json({message: "Successfully deleted"})

    }
    catch{
      throw new Error("Something went wrong")
    }

  } else {
    const err = new Error("Current User must be organizer or co-host");
    err.status = 403;
    return next(err);
  }


});


module.exports = router;
