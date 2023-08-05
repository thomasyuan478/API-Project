const express = require("express");
const { Op } = require("sequelize");

const { Event } = require("../../db/models");
const { Venue } = require("../../db/models");
const { Group } = require("../../db/models");
const { Attendance } = require("../../db/models");
const { EventImage } = require("../../db/models");
const { Membership } = require("../../db/models");
const { User } = require("../../db/models");
const { GroupImage } = require("../../db/models");

const { requireAuth } = require("../../utils/auth");
const user = require("../../db/models/user");
const attendance = require("../../db/models/attendance");

const router = express.Router();

//VERIFIED
router.get("/", async (req, res) => {
  let { page, size, name, type, startDate } = req.query;

  if (!page) page = 1;
  if (!size) size = 20;

  page = parseInt(page);
  size = parseInt(size);

  const pagination = {};
  if (page >= 1 && size >= 1) {
    pagination.limit = size;
    pagination.offset = size * (page - 1);
  }

  let filter = {};
  if (name) filter.name = name;
  if (type) filter.type = type;
  if (startDate) filter.startDate = { [Op.gte]: startDate };

  console.log(filter);

  const events = await Event.findAll({
    where: filter,
    include: [
      { model: Group },
      { model: Venue },
      { model: Attendance },
      { model: EventImage },
    ],
    ...pagination,
  });

  let eventList = [];

  events.forEach((event) => eventList.push(event.toJSON()));

  eventList.forEach((event) => {
    event.startDate = event.startDate.toString().slice(4, 24);
    event.endDate = event.endDate.toString().slice(4, 24);

    event.numAttending = event.Attendances.length;
    event.EventImages.forEach((image) => {
      event.previewImage = image.url;
    });

    if (!event.previewImage) {
      event.previewImage = "No image found";
    }

    delete event.Attendances;
    delete event.EventImages;

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

    if (event.Venue !== null) {
      delete event.Venue.groupId;
      delete event.Venue.address;
      delete event.Venue.lat;
      delete event.Venue.lng;
      delete event.Venue.createdAt;
      delete event.Venue.updatedAt;
    }
  });

  res.json({ Events: eventList });
});

//VERIFIED
router.get("/:eventId/attendees", async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: { model: Group },
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 404;
    return next(err);
  }

  const validMembership = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: "co-host",
    },
  });

  if (validMembership || event.Group.organizerId === req.user.id) {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        where: {
          eventId: req.params.eventId,
        },
      },
    });

    let userList = [];

    users.forEach((user) => userList.push(user.toJSON()));

    userList.forEach((user) => {
      user.Attendances.forEach((attendance) => {
        user.Attendance = { status: attendance.status };
      });

      delete user.Attendances;
    });

    res.json(userList);
  } else {
    const users = await User.findAll({
      attributes: ["id", "firstName", "lastName"],
      include: {
        model: Attendance,
        where: {
          eventId: req.params.eventId,
          status: { [Op.in]: ["attending", "waitlist"] },
        },
      },
    });

    let userList = [];

    users.forEach((user) => userList.push(user.toJSON()));

    userList.forEach((user) => {
      user.Attendances.forEach((attendance) => {
        user.Attendance = { status: attendance.status };
      });

      delete user.Attendances;
    });

    res.json(userList);
  }
});

//VERIFIED
router.get("/:eventId", async (req, res) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: [
      {
        model: Group,
        attributes: ["id", "name", "private", "city", "state", "organizerId"],
        include: { model: GroupImage },
      },
      {
        model: Venue,
        attributes: ["id", "address", "city", "state", "lng", "lat"],
      },
      {
        model: EventImage,
        attributes: ["id", "url", "preview"],
      },
    ],
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 404;
    return next(err);
  }

  const resEvent = event.toJSON();
  const organizer = await User.findByPk(resEvent.Group.organizerId);
  const resOrganizer = await organizer.toJSON();
  resEvent.startDate = resEvent.startDate.toString().slice(4, 24);
  resEvent.endDate = resEvent.endDate.toString().slice(4, 24);
  delete resEvent.createdAt;
  delete resEvent.updatedAt;
  resEvent.numAttending = await Attendance.count({
    where: {
      eventId: req.params.eventId,
    },
  });

  resEvent.Group.firstName = resOrganizer.firstName;
  resEvent.Group.lastName = resOrganizer.lastName;

  res.json(resEvent);
});

//VERIFIED
router.post("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: {
      model: Group,
      include: {
        model: Membership,
        where: {
          userId: req.user.id,
          status:
            // 'member'
            {
              [Op.in]: ["member", "co-host", "organizer"],
            },
        },
      },
    },
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 404;
    return next(err);
  }

  if (event.Group === null) {
    const err = new Error(
      "Forbidden: Current User must be a member of the group to request attendance"
    );
    err.status = 403;
    return next(err);
  }

  const attendance = await Attendance.findOne({
    where: {
      eventId: req.params.eventId,
      userId: req.user.id,
    },
  });

  if (!attendance) {
    const requestAttend = await Attendance.create({
      eventId: req.params.eventId,
      userId: req.user.id,
      status: "pending",
    });

    const resAttend = {
      userId: req.user.id,
      status: requestAttend.status,
    };

    return res.json(resAttend);
  }

  if (attendance.status === "pending") {
    const err = new Error("Attendance has already been requested");
    err.status = 400;
    return next(err);
  }
  if (attendance.status === "attending") {
    const err = new Error("User is already an attendee of the event");
    err.status = 400;
    return next(err);
  }

  res.json(event);
});

//VERIFIED
router.post("/:eventId/images", requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: { model: Group },
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 404;
    return next(err);
  }

  const validMembership = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: "co-host",
    },
  });

  const validAttendee = await Attendance.findOne({
    where: {
      eventId: req.params.eventId,
      userId: req.user.id,
      status: "attending",
    },
  });

  if (
    validAttendee ||
    validMembership ||
    event.Group.organizerId === req.user.id
  ) {
    console.log(true);

    const { url, preview } = req.body;

    const newImage = await EventImage.create({
      userId: req.user.id,
      eventId: req.params.eventId,
      url,
      preview,
    });

    const resImage = {
      id: newImage.id,
      url: newImage.url,
      preview: newImage.preview,
    };

    res.json(resImage);
  } else {
    const err = new Error(
      "Forbidden: Current user is not an attendee, host or organizer"
    );
    err.status = 403;
    return next(err);
  }
});

//VERIFIED
router.put("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const { userId, status } = req.body;

  const event = await Event.findByPk(req.params.eventId, {
    include: {
      model: Group,
    },
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 400;
    return next(err);
  }

  const membership = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: "co-host",
    },
  });

  const update = await Attendance.findOne({
    where: {
      userId: userId,
      eventId: req.params.eventId,
    },
  });

  if (!update) {
    const err = new Error(
      "Attendance between the user and the event does not exist"
    );
    err.status = 400;
    return next(err);
  }

  if (status === "pending") {
    const err = new Error("Cannot change an attendance status to pending");
    err.status = 400;
    return next(err);
  }

  if (membership || event.Group.organizerId === req.user.id) {
    update.status = status;
    await update.save();

    const resUpdate = {
      id: update.id,
      eventId: update.eventId,
      userId: update.userId,
      status: update.status,
    };
    return res.status(200).json(resUpdate);
  }

  const err = new Error(
    "Forbidden: Current User must be the organizer or the co-host"
  );
  err.status = 403;
  return next(err);
});

//VERIFIED
router.put("/:eventId", requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: { model: Group },
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 404;
    next(err);
  }

  const validMembership = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: "co-host",
    },
  });

  if (validMembership || event.Group.organizerId === req.user.id) {
    const {
      venueId,
      name,
      type,
      capacity,
      price,
      description,
      startDate,
      endDate,
    } = req.body;

    const venue = await Venue.findByPk(venueId);

    const venueCheck = (venueId, venue) => {
      if (venueId !== null) {
        if (!venue) return true;
      } else return false;
    };

    console.log(
      "************",
      venueId,
      req.params.groupId,
      venueCheck(venueId, venue)
    );

    const nameCheck = (name) => {
      if (typeof name !== "string") return true;
      else if (name.length < 5) return true;
      else return false;
    };

    const typeCheck = (type) => {
      if (!(type === "Online" || type === "In person")) return true;
      else return false;
    };

    const integerCheck = (integer) => {
      if (typeof integer !== "number") return true;
      if (integer % 1 !== 0) return true;
      else return false;
    };

    const priceCheck = (integer) => {
      if (typeof integer !== "number") return true;
      else return false;
    };

    const startDateCheck = (date) => {
      if (new Date(date).toString() === "Invalid Date") return true;
      if (new Date(date) <= new Date()) return true;
      else return false;
    };

    const endDateCheck = (startDate, endDate) => {
      if (new Date(endDate).toString() === "Invalid Date") return true;
      if (new Date(endDate) <= new Date(startDate)) return true;
      else return false;
    };

    if (
      venueCheck(venueId, venue) ||
      nameCheck(name) ||
      typeCheck(type) ||
      integerCheck(capacity) ||
      priceCheck(price) ||
      !description ||
      startDateCheck(startDate) ||
      endDateCheck(startDate, endDate)
    ) {
      const err = new Error("Bad Request");
      err.status = 400;
      err.errors = {};
      if (venueCheck(venueId, venue))
        err.errors.venueId = "Venue does not exist";
      if (!name) err.errors.name = "Name is required";
      else if (name.length < 5)
        err.errors.name = "Name must be at least 5 characters";
      if (typeCheck(type)) err.errors.type = "Type must be Online or In person";
      if (integerCheck(capacity))
        err.errors.capacity = "Capacity must be an integer";
      if (priceCheck(price)) err.errors.price = "Price is invalid";
      if (!description) err.errors.description = "Description is required";
      if (new Date(startDate).toString() === "Invalid Date")
        err.errors.startDate = "Valid date required";
      else if (startDateCheck(startDate))
        err.errors.startDate = "Start date must be in the future";
      if (new Date(endDate).toString() === "Invalid Date")
        err.errors.endDate = "Valid date required";
      else if (endDateCheck(startDate, endDate))
        err.errors.endDate = "End date is before than start date";
      next(err);
    }

    event.venueId = venueId;
    event.name = name;
    event.type = type;
    event.capacity = capacity;
    event.price = price;
    event.description = description;
    event.startDate = startDate;
    event.endDate = endDate;

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
      startDate: event.startDate.toString().slice(4, 24),
      endDate: event.endDate.toString().slice(4, 24),
    };

    res.json(resEvent);
  } else {
    const err = new Error(
      "Forbidden: Current User must be the organizer or a co-host"
    );
    err.status = 403;
    next(err);
  }
});

//CURRENT
router.delete("/:eventId/attendance", requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: { model: Group },
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 404;
    return next(err);
  }

  const { userId } = req.body;

  const checkId = (userId) => {
    if (!userId) return true;
    else if (typeof userId !== "number") return true;
    return false;
  };

  if (checkId(userId)) {
    const err = new Error("Bad Request");
    err.status = 400;
    err.errors = {};
    if (!userId) err.errors.userId = "Invalid userId input";
    else if (typeof userId !== "number")
      err.errors.userId = "MemberId must be a number";
    return next(err);
  }

  const attendance = await Attendance.findOne({
    where: {
      userId: userId,
      eventId: req.params.eventId,
    },
  });

  if (!attendance) {
    const err = new Error("Attendance does not exist for this user");
    err.status = 404;
    return next(err);
  }

  if (req.user.id === userId || req.user.id === event.Group.organizerId) {
    try {
      await attendance.destroy();

      res.json({
        message: "Successfully deleted",
      });
    } catch {
      throw new Error("Something went wrong");
    }
  } else {
    const err = new Error(
      "Current User must be organizer or the same id as being deleted"
    );
    err.status = 403;
    return next(err);
  }
});

//CURRENT
router.delete("/:eventId", requireAuth, async (req, res, next) => {
  const event = await Event.findByPk(req.params.eventId, {
    include: { model: Group },
  });

  if (!event) {
    const err = new Error("Event could not be found");
    err.status = 404;
    return next(err);
  }

  const validMembership = await Membership.findOne({
    where: {
      groupId: event.groupId,
      userId: req.user.id,
      status: "co-host",
    },
  });

  if (validMembership || event.Group.organizerId === req.user.id) {
    try {
      await event.destroy();

      res.json({
        message: "Successfully deleted",
      });
    } catch (err) {
      throw new Error("event could not be deleted");
    }
  } else {
    const err = new Error(
      "Forbidden: Current User must be the owner or a co-host"
    );
    err.status = 403;
    return next(err);
  }
});

module.exports = router;
