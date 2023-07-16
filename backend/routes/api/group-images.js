const express = require('express');
const { Op } = require('sequelize');

const { GroupImage } = require('../../db/models');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { JsonWebTokenError } = require('jsonwebtoken');

const router = express.Router();

//CURRRENT
router.delete('/:imageId', requireAuth, async (req,res,next) => {

  const image = await GroupImage.findByPk(req.params.imageId);

  if(!image){
    const err = new Error("Group Image cannot be found");
    err.status= 404;
    return next(err);
  }

  const group = await Group.findByPk(image.groupId);

  const validMembership = await Membership.findOne({
    where: {
      groupId: image.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(validMembership || group.organizerId === req.user.id){

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
