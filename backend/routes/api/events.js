const express = require('express');
const { Op } = require('sequelize');

const { Event } = require('../../db/models');
const { Venue } = require('../../db/models');
const { Group } = require('../../db/models');
const { Attendance } = require('../../db/models');
const { EventImage } = require('../../db/models');
const { Membership } = require('../../db/models');
const { User } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const user = require('../../db/models/user');
const attendance = require('../../db/models/attendance');

const router = express.Router();

router.get('/', async (req,res) => {
  const events = await Event.findAll({
    include: [
      {model: Group},
      {model: Venue},
      {model: Attendance},
      {model: EventImage} ]
  });

  let eventList = [];

  events.forEach(event => eventList.push(event.toJSON()));

  eventList.forEach(event=> {

    event.numAttending = event.Attendances.length;
    event.EventImages.forEach(image => {
      event.previewImage = image.url;
    });

    if(!event.previewImage){
      event.previewImage = 'No image found';
    }

    delete event.Attendances;
    delete event.EventImages

    delete event.description;
    delete event.capacity;
    delete event.price;
    delete event.createdAt;
    delete event.updatedAt;

    delete event.Group.organizerId;
    delete event.Group.about;
    delete event.Group.type;
    delete event.Group.private;
    delete event.Group.createdAt;
    delete event.Group.updatedAt;

    delete event.Venue.groupId;
    delete event.Venue.address;
    delete event.Venue.lat;
    delete event.Venue.lng;
    delete event.Venue.createdAt;
    delete event.Venue.updatedAt;
  })

  res.json(eventList);

});

router.get('/:eventId/attendees', async (req,res) => {

  const event = await Event.findByPk(req.params.eventId,
    {include: {model: Group}});

  if(!event){
    res.status(404)
    res.json({
      message: "Event could not be found"
    })
  }

  const validMembership = await Membership.findAll({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })



if(validMembership[0] || event.Group.organizerId === req.user.id){

  const users = await User.findAll({
      attributes: ['id','firstName','lastName'],
      include: {model: Attendance,
      where: {
        eventId: req.params.eventId
      }}
    })

  let userList = [];

  users.forEach(user => userList.push(user.toJSON()));

  userList.forEach(user => {

    user.Attendances.forEach(attendance => {
      user.Attendance = {status: attendance.status};
    })

  delete user.Attendances;
  })


  res.json(userList);
} else {

  const users = await User.findAll({
    attributes: ['id','firstName','lastName'],
    include: {model: Attendance,
    where: {
      eventId: req.params.eventId,
      status: {[Op.in]: ['attending','waitlist']}
    }}
  })

  let userList = [];

  users.forEach(user => userList.push(user.toJSON()));

  userList.forEach(user => {

    user.Attendances.forEach(attendance => {
      user.Attendance = {status: attendance.status};
    })


  delete user.Attendances;
  })


  res.json(userList);
}


});

router.get('/:eventId', async (req,res) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [{
      model: Group,
      attributes: ['id','name','private','city','state']
    }, {
      model: Venue,
      attributes: ['id','address','city','state','lng','lat']
    }, {
      model: EventImage,
      attributes: ['id','url','preview']
    }]
  })


  const resEvent = event.toJSON();
  delete resEvent.createdAt;
  delete resEvent.updatedAt;
  resEvent.numAttending = await Attendance.count({
    where: {
      eventId: req.params.eventId
    }
  })

  res.json(resEvent);
});

//INCOMPLETE
router.post('/:eventId/attendance', requireAuth, async (req,res) => {

  const event = await Event.findByPk(req.params.eventId, {
    include: {
      model: Group,
      include: {
        model: Membership,
        where: {
          userId: req.user.id,
          status: 'member'
        }
      }}
  });

  if(!event){
    res.status(404);
    res.json({
      message: "Event could not be found"})
  }

  if(event.Group === null){
    res.status(403);
    res.json({
      message: "Current User must be a member of the group to request attendance"
    })
  }




  res.json(event);

});

router.post('/:eventId/images', requireAuth, async (req,res) => {

  const event = await Event.findByPk(req.params.eventId,
    {include: {model: Group}});

  if(!event){
    throw new Error("Event could not be found")
  }

  const validMembership = await Membership.findAll({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  const validAttendee = await Attendance.findAll({
    where: {
      eventId: req.params.eventId,
      userId: req.user.id,
      status: 'attending'
    }
  })

  if(validAttendee[0] || validMembership[0] || event.Group.organizerId === req.user.id){
  console.log(true);


  const { url, preview } = req.body

  const newImage = await EventImage.create({
      userId: req.user.id,
      eventId: req.params.eventId,
      url,
      preview
    });

    const resImage = {
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
      }

      res.json(resImage);


    }else{
    throw new Error("Current user is not an attendee, host or organizer");
  }
});

router.put('/:eventId', requireAuth, async (req,res) => {

  const event = await Event.findByPk(req.params.eventId,
    {include: {model: Group}});

  if(!event){
    throw new Error("Event could not be found")
  }

  const validMembership = await Membership.findAll({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(validMembership[0] || event.Group.organizerId === req.user.id){
  console.log(true);

  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

  event.venueId = venueId ?? event.venueId;
  event.name = name ?? event.name;
  event.type = type ?? event.type;
  event.capacity = capacity ?? event.capacity;
  event.price = price ?? event.price;
  event.description = description ?? event.description;
  event.startDate = startDate ?? event.startDate;
  event.endDate = endDate ?? event.endDate;

  await event.save();

  const resEvent = {
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate
  }

  res.json(
    resEvent
  );
  } else {
    throw new Error("Current User must be the organizer or a co-host");
  }
});

router.delete('/:eventId', requireAuth, async (req,res) => {
  const event = await Event.findByPk(req.params.eventId,
    {include: {model: Group}});

  if(!event){
    res.status(404)
    res.json({
      message: "Event could not be found"
    })
  }

  const validMembership = await Membership.findAll({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(validMembership[0] || event.Group.organizerId === req.user.id){

    try{
      await event.destroy();

      res.json({
        message: "Successfully deleted"
      })

    }
    catch (err) {
      throw new Error("event could not be deleted")
    }
  }
  else {
    res.status(403);
    res.json({
      message: "Current user must be owner or co-host"
    })
  }
})

module.exports = router;
