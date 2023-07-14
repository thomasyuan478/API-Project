const express = require('express');
const { Op } = require('sequelize');

const { EventImage } = require('../../db/models');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');
const { Event } = require('../../db/models');
const { User } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {

  const image = await EventImage.findByPk(req.params.imageId, {
    include: {
      model: Event,
      include: {
        model: Group
      }
    }
  });

  if(!image){
    res.status(404);
    res.json({
      message: "Group Image cannot be found"
    })
  }

  const validMembership = await Membership.findAll({
    where: {
      groupId: image.Event.Group.id,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(validMembership[0] || image.Event.Group.organizerId === req.user.id){

    try{

      await image.destroy();

      res.status(200);
      res.json({message: "Successfully deleted"})

    }
    catch{
      throw new Error("Something went wrong")
    }

  } else {
    res.status(403);
    res.json({
      message: "Current User must be organizer or co-host"
    })
  }


});


module.exports = router;
