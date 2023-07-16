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

//VERIFIED

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

//VERIFIED
router.get('/current', requireAuth, async(req,res) => {
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

  if(groups.length === 0 && membergroups.length === 0) return res.json({message: "User is not part of any groups."})


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

//VERIFIED
router.get('/:groupId/venues', requireAuth, async (req, res, next) => {

const groups = await Group.findByPk(req.params.groupId, {
  include: [
    {model: Venue,
    where: {
    groupId: req.params.groupId
  }
  }]})


  const valid = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
      userId: req.user.id,
      status: 'co-host'
    }
  })

  if(!groups){
    const err = new Error("Group couldn't be found");
    err.status = 404;
    return next(err);
  }

  if(valid || groups.organizerId === req.user.id){
    const jsonGroup = groups.toJSON();
    const venue = jsonGroup.Venues;

    venue.forEach(venue => {
      delete venue.createdAt
      delete venue.updatedAt
    })

    res.json({Venues: venue});


  } else {
    const err = new Error("Forbidden: Must be group owner or co-host to search for venues.")
    err.status = 403;
    return next(err);
  }
  });


router.get('/:groupId/events', async (req, res) => {

  const group = await Group.findByPk(req.params.groupId);
  if(!group) return res.status(404).json({message: "Group could not be found"})


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

//VERIFIED
router.get('/:id', async (req,res,next) => {

  const group = await Group.findByPk(req.params.id, {
    include: [
      {model: GroupImage},
      {model: User},
      {model: Venue}
    ]
  })


  if(!group){
    const err = new Error("Group cannot be found");
    err.status= 404;
    return next(err);

    res.json({
      message: err.message,
      code: err.status
    })
  }

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


//VERIFIED
router.post('/', requireAuth, async (req, res, next) => {

  const { name, about, type, private, city, state } = req.body;

  if(!name || name.length > 60 || about.length < 50 || !(type === "Online" || type === "In person") ||
   !(private == true || private == false) || !city || !state){
    const err = new Error('Bad Request');
    err.status = 400;
    err.errors = {};
    if(!name) err.errors.name = "Name is required"
    else if(name.length > 60) err.errors.name = "Name must be 60 characters or less";
    if(about.length < 50) err.errors.about = "About must be 50 characters or more"
    if(!(type === "Online" || type === "In person")) err.errors.type = "Type must be 'Online' or 'In person'";
    if(!(private == true || private == false)) err.errors.private = "Private must be a boolean";
    if(!city) err.errors.city = "City is required";
    if(!state) err.errors.state = "State is required";
    return next(err);
  }

  const newGroup = await Group.create({
    organizerId: req.user.id,
    name,
    about,
    type,
    private,
    city,
    state
  });

  return res.status(201).json(newGroup);
});

//VERIFIED
router.post('/:groupId/venues', requireAuth, async(req, res, next) => {

  const group = await Group.findByPk(req.params.groupId);

  if(!group){
    const err = new Error("Group cannot be found");
    err.status = 404;
    return next(err);
  }

  const valid = await Membership.findOne({
    where: {
      groupId: req.params.groupId,
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

  if(valid || group.organizerId === req.user.id){


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

else {
  const err = new Error("Forbidden: Must be group owner or co-host to create new venues.");
  err.status = 403;
  return next(err);
}
});

//VERIFIED
router.post('/:groupId/images', requireAuth, async (req,res,next) => {

  const { url, preview } = req.body;

  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  })

  if(!group){
    const err = new Error("Group cannot be found");
    err.status= 404;
    return next(err);
  }

  if(group.organizerId !== req.user.id){
    const err = new Error("Forbidden: Must be group owner to add image.");
    err.status = 403;
    return next(err);
  }

  const newImage = await GroupImage.create({
    groupId: req.params.groupId,
    url,
    preview
  })

  const resImage = newImage.toJSON();

  delete resImage.groupId
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

const { memberId, status } = req.body;

const group = await Group.findByPk(req.params.groupId);

if(!group){
  res.status(404);
  res.json({
    message: "Group couldn't be found"
  })
}

const pendingMembership = await Membership.findOne({
  attributes: ['status'],
  where: {
    userId: memberId,
    groupId: req.params.groupId
  }
})

if(!pendingMembership){
  const newMembership = await Membership.create({
  userId: memberId,
  groupId: req.params.groupId,
  status
});

const resMembership = {
  memberId: memberId,
  status: newMembership.status
}

res.json(resMembership);
}
if(pendingMembership.status === 'pending') res.status(400).json({message: "membership has already been requested."})
if(pendingMembership.status === 'member' || pendingMembership.status === 'co-host' || pendingMembership.status === 'organizer') res.status(400).json({message: "User is already a member of the group"})
});

router.put('/:groupId/membership', requireAuth, async (req,res) => {

const { memberId, status } = req.body;

const group = await Group.findByPk(req.params.groupId);
if(!group) return res.status(404).json({message: "Group could not be found"});

const currentUser = await Membership.findOne({
  where: {
    userId: req.user.id
  }
})

const update = await Membership.findOne({
  where: {
   userId: memberId,
   groupId: req.params.groupId
  }
})
if(!update) return res.status(404).json({message: "Membership between the user and the group does not exist"});

if(status === 'member' && (req.user.id === group.ogranizerId || currentUser.status === 'co-host')){
  update.status = status;
  await update.save();

  const resUpdate = {
    id: update.id,
    groupId: update.groupId,
    memberId: update.memberId,
    status: update.status
  }

  res.json(resUpdate);
} else


if(status === 'co-host' && req.user.id == group.organizerId){

  update.status = status;
  await update.save();

  const resUpdate = {
    id: update.id,
    groupId: update.groupId,
    memberId: update.memberId,
    status: update.status
  }

  res.json(resUpdate);
}

res.status(403).json({message:"Forbidden"});
});

//VERIFIED
router.put('/:groupId', requireAuth, async (req,res,next) => {

  const group = await Group.findOne({
    where: {
      id: req.params.groupId
    }
  })

  if(!group){
    const err = new Error("Group cannot be found");
    err.status= 404;
    return next(err);
  }

  if(group.organizerId !== req.user.id){
    const err = new Error("Forbidden: Must be group owner to edit group.");
    err.status= 403;
    return next(err);
  }

const { name, about, type, private, city, state } = req.body;

if(!name || name.length > 60 || about.length < 50 || !(type === "Online" || type === "In person") ||
 !(private == true || private == false) || !city || !state){
  const err = new Error('Bad Request');
  err.status = 400;
  err.errors = {};
  if(!name) err.errors.name = "Name is required"
  else if(name.length > 60) err.errors.name = "Name must be 60 characters or less";
  if(about.length < 50) err.errors.about = "About must be 50 characters or more"
  if(!(type === "Online" || type === "In person")) err.errors.type = "Type must be 'Online' or 'In person'";
  if(!(private == true || private == false)) err.errors.private = "Private must be a boolean";
  if(!city) err.errors.city = "City is required";
  if(!state) err.errors.state = "State is required";
  return next(err);
}

  group.name = name ?? group.name;
  group.about = about ?? group.about;
  group.type = type ?? group.type;
  group.private = private ?? group.private;
  group.city = city ?? group.city;
  group.state = state ?? group.state;


  await group.save();

  res.json(group);
});

router.delete('/:groupId/membership', requireAuth, async (req,res) => {

const { memberId } = req.body;

const group = await Group.findByPk(req.params.groupId,
  {
    include: {model: Membership}
  });

if(!group){
  return res.status(404).json({
    message: "Group couldn't be found"
  });
}

const membership = await Membership.findOne({
  where: {
    userId: memberId,
    groupId: group.id
  }
})

if(!membership) res.status(404).json({message: "Membership does not exist for this user."})


if( memberId === req.user.id || group.organizerId === req.user.id){

  try{

  } catch{
    throw new Error("Something went wrong.")
  }
  };
  res.status(403).json({message: "Forbidden"});
});

router.delete('/:groupId', requireAuth, async (req,res) => {

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
