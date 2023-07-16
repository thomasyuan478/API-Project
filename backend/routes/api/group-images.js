const express = require('express');
const { Op } = require('sequelize');

const { GroupImage } = require('../../db/models');
const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const { JsonWebTokenError } = require('jsonwebtoken');

const router = express.Router();

router.delete('/:imageId', requireAuth, async (req,res) => {

  const image = await GroupImage.findByPk(req.params.imageId);

  if(!image){
    return res.status(404).json({
      message: "Group Image cannot be found"
    });
  }

  const group = await Group.findByPk(image.groupId);

  const validMembership = await Membership.findAll({
    where: {
      groupId: image.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(validMembership[0] || group.organizerId === req.user.id){

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
