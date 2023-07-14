const express = require('express');
const { Op } = require('sequelize');

const { Group } = require('../../db/models');
const { Membership } = require('../../db/models');
const { GroupImage } = require('../../db/models');
const { Venue } = require('../../db/models');
const { User } = require('../../db/models');
const { Event } = require('../../db/models');
const { EventImage } = require('../../db/models');
const { Attendance } = require('../../db/models');

const { requireAuth } = require('../../utils/auth');
const group = require('../../db/models/group');
const user = require('../../db/models/user');


const router = express.Router();


router.get('/', async (req, res) => {
  const groups = await Group.findAll({
    include: [
      {model: Membership},
      {model: GroupImage}
  ]
  });

  let groupsList = [];
  groups.forEach(group => {groupsList.push(group.toJSON())});

  groupsList.forEach(group => {

    group.numMembers = group.Memberships.length;

    group.GroupImages.forEach(image => {
      group.previewImage = image.url;
    });

    if(!group.previewImage){
      group.previewImage = 'No image found';
    }

    delete group.Memberships
    delete group.GroupImages
  })

  res.json({Groups: groupsList});
});


router.get('/current', async(req,res) => {
  const groups = await Group.findAll({
    where: {
      organizerId: req.user.id
    },
    include: [
      {model: Membership},
      {model: GroupImage}
  ]
  });

  const membergroups = await Group.findAll({
    include: [
      {model: Membership,
      where: {
        userId: req.user.id
      }},
      {model: GroupImage}
    ]
  })

  let groupsList = [];
  groups.forEach(group => {groupsList.push(group.toJSON())});
  membergroups.forEach(group => {groupsList.push(group.toJSON())});

  groupsList.forEach(group => {

    group.numMembers = group.Memberships.length;

    group.GroupImages.forEach(image => {
      group.previewImage = image.url;
    });

    if(!group.previewImage){
      group.previewImage = 'No image found'
    }
    delete group.Memberships
    delete group.GroupImages
  })

  res.json({
    Groups:groupsList
  });
});

router.get('/:groupId/venues', requireAuth, async (req, res) => {

const groups = await Group.findByPk(req.params.groupId, {
  include: [
    {model: Venue,
    where: {
    groupId: req.params.groupId
  }
  }]})

  const valid = await Membership.findAll({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(!groups){
    throw new Error("Group couldn't be found")
  }

  if(valid[0] || groups.organizerId === req.user.id){
    const jsonGroup = groups.toJSON();
    const venue = jsonGroup.Venues;

    venue.forEach(venue => {
      delete venue.createdAt
      delete venue.updatedAt
    })

    res.json({Venues: venue});

  }


  throw new Error("Must be group owner or co-host to search for venues.")

});


router.get('/:groupId/events', async (req, res) => {

  const events = await Event.findAll({
    where: {
      groupId: req.params.groupId
    },
    attributes: ['id', 'groupId', 'venueId', 'name', 'type', 'startDate', 'endDate'],
    include: [{
      model: Group,
      attributes: ['id', 'name', 'city', 'state']
    },{
      model: Venue,
      attributes: ['id', 'city', 'state']
    },{
      model: EventImage
    },{
      model: Attendance
    }]
  })

  let eventList = [];
  events.forEach(event => {
    eventList.push(event.toJSON());
  })

  eventList.forEach( event => {

    event.numAttending = event.Attendances.length;
    delete event.Attendances;

    event.EventImages.forEach(image => {
      event.previewImage = image.url;
    });

    if(!event.previewImage){
      event.previewImage = 'No image found';
    }
    delete event.EventImages

  })

  res.json(eventList);
});

router.get('/:groupId/members', async (req,res) => {

const members = await User.findAll({
  attributes: ['id','firstName','lastName'],
  include: {model: Membership,
    // attributes: ['status'],
    // include: {model: Group},
    where: {
      groupId: req.params.groupId
    },
  }
});

let membersList = [];
members.forEach(member => membersList.push(member.toJSON()));

membersList.forEach(member => {
  member.Memberships.forEach( group => {
    if(group.groupId == req.params.groupId){
      member.Membership = {status: group.status};
    }
  })

  delete member.Memberships;
})

res.json({
  Members: membersList});
});

router.get('/:id', async (req,res) => {

  const group = await Group.findByPk(req.params.id, {
    include: [
      {model: GroupImage},
      {model: User},
      {model: Venue}
    ]
  })

  const resGroup = group.toJSON();

  resGroup.GroupImages.forEach(image => {
    delete image.groupId
    delete image.createdAt
    delete image.updatedAt
  })

  resGroup.Organizer = {
    id: resGroup.User.id,
    firstName: resGroup.User.firstName,
    lastName: resGroup.User.lastName
  }

  delete resGroup.User

  resGroup.Venues.forEach(venue => {
    delete venue.createdAt
    delete venue.updatedAt
  })


  res.json(resGroup);
});


router.post('/', requireAuth, async (req, res) => {


  const { name, about, type, private, city, state } = req.body;

  console.log(req.user);

  const newGroup = await Group.create({
    organizerId: req.user.id,
    name,
    about,
    type,
    private,
    city,
    state
  });

  const createdGroup = {
    name: newGroup.name,
    about: newGroup.about,
    type: newGroup.type,
    private: newGroup.private,
    city: newGroup.city,
    state: newGroup.state
  }

  res.json(createdGroup);
});


router.post('/:groupId/venues', requireAuth, async(req,res) => {

  const group = await Group.findByPk(req.params.groupId);

  const valid = await Membership.findAll({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  const { address, city, state, lat, lng } = req.body;

  if(!group){
    throw new Error("Group couldn't be found")
  }

  if(valid[0] || group.organizerId === req.user.id){

    const newVenue = await Venue.create({
      groupId: group.id,
      address,
      city,
      state,
      lat,
      lng
    });

    const resVenue = {
      id: newVenue.id,
      groupId: newVenue.groupId,
      address: newVenue.address,
      city:newVenue.city,
      state:newVenue.state,
      lat:newVenue.lat,
      lng:newVenue.lng
    }

    res.json(resVenue);
    return;
  }

  throw new Error("Must be group owner or co-host to create new venues.")
});


router.post('/:groupId/images', requireAuth, async (req,res) => {

  const { url, preview } = req.body;

  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  })

  if(!group){
    throw new Error("Group couldn't be found")
  }

  if(group.organizerIdid !== req.user.id){
    throw new Error("Must be group owner to add image.")
    return;
  }

  const newImage = await GroupImage.create({
    groupId: req.params.groupId,
    url,
    preview
  })

  const resImage = newImage.toJSON();

  delete resImage.createdAt
  delete resImage.updatedAt

  res.json(resImage);
});

router.post('/:groupId/events', requireAuth, async (req,res) => {

  const group = await Group.findByPk(req.params.groupId);

  if(!group){
    throw new Error("Group cannot be found");
  }

  const valid = await Membership.findAll({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  const { venueId, name, type, capacity, price, description, startDate, endDate} = req.body;

  if(valid[0] || group.organizerId === req.user.id){

    const newEvent = await Event.create({
      venueId,
      groupId: req.params.groupId,
      name,
      description,
      type,
      capacity,
      price,
      startDate,
      endDate
    });

    const resEvent = {
      id: newEvent.id,
      groupId: newEvent.groupId,
      venueId: newEvent.venueId,
      name: newEvent.name,
      type: newEvent.type,
      capacity: newEvent.capacity,
      price: newEvent.price,
      description: newEvent.description,
      startDate: newEvent.startDate,
      endDate: newEvent.endDate
    }

    res.json(resEvent);
    return;
  }

  throw new Error("Must be group owner or co-host to create new venues.")
});

router.post('/:groupId/membership', requireAuth, async (req,res) => {

const group = await Group.findByPk(req.params.groupId);

if(!group){
  res.status(404);
  res.json({
    message: "Group couldn't be found"
  })
}

//create an index for userId/groupId

});

router.put('/:groupId', requireAuth, async (req,res) => {

  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  })

  if(!group){
    throw new Error("Group couldn't be found")
  }

  if(group.organizerId !== req.user.id){
    throw new Error("Must be group owner to edit group.")
  }

  const { name, about, type, private, city, state } = req.body;

  group.name = name ?? group.name;
  group.about = about ?? group.about;
  group.type = type ?? group.type;
  group.private = private ?? group.private;
  group.city = city ?? group.city;
  group.state = state ?? group.state;


  await group.save();

  res.json(group);

});


// router.delete('/:groupId/membership', requireAuth, async (req,res) => {

// //body will be memberId

// const group = await Group.findByPk(req.params.groupId,
//   {
//     include: {model: Membership}
//   });

// if(!group){
//   res.status(404);
//   res.json({
//     message: "Group couldn't be found"
//   });
// }

//   const { memberId } = req.body;

//   if( memberId === req.user. id || group.organizerId === req.user.id){

//   };
//   res.json(group);



// });


router.delete('/:groupId', async (req,res) => {
  const group = await Group.findByPk(req.params.groupId);

  if(!group){
    throw new Error("Group couldn't be found")
  }

  if(group.organizerId !== req.user.id){
    throw new Error("Must be group owner to edit group.")
  }

  try{

    await group.destroy();

    return res.json({
      message: "Successfully deleted"
    });
  } catch {
    throw new Error("Something went wrong");
  }

});



module.exports = router;
