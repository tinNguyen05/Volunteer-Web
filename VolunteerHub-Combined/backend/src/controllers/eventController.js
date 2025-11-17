const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// Create Event
const createEvent = async (req, res) => {
  try {
    const { title, description, category, date, startTime, endTime, location, capacity, image, skills, requirements, impact } = req.body;

    const event = new Event({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      location,
      capacity,
      image,
      skills: skills || [],
      requirements: requirements || [],
      impact,
      createdBy: req.user._id,
      status: req.user.role === 'admin' ? 'approved' : 'pending',
      isApproved: req.user.role === 'admin',
    });

    await event.save();
    createdResponse(res, 'Event created successfully', { event });
  } catch (error) {
    console.error('Create Event Error:', error);
    errorResponse(res, 500, 'Failed to create event: ' + error.message);
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { category, status, search } = req.query;

    let query = { isApproved: true };

    if (category) query.category = category;
    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query)
      .populate('createdBy', 'name email')
      .skip(skip)
      .limit(limit)
      .sort({ date: 1 });

    const total = await Event.countDocuments(query);

    successResponse(res, 'Events retrieved successfully', {
      events,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve events: ' + error.message);
  }
};

// Get Event By ID
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('registeredVolunteers', 'name email');

    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    successResponse(res, 'Event retrieved successfully', { event });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve event: ' + error.message);
  }
};

// Update Event
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    // Check authorization
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You cannot update this event');
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    successResponse(res, 'Event updated successfully', { event: updated });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update event: ' + error.message);
  }
};

// Register for Event
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    // Check if already registered
    const existingRegistration = await Registration.findOne({
      volunteer: req.user._id,
      event: eventId,
    });

    if (existingRegistration) {
      return errorResponse(res, 400, 'Already registered for this event');
    }

    // Check capacity
    if (event.registeredVolunteers.length >= event.capacity) {
      return errorResponse(res, 400, 'Event is at full capacity');
    }

    const registration = new Registration({
      volunteer: req.user._id,
      event: eventId,
      status: 'registered',
    });

    await registration.save();

    // Add volunteer to event
    event.registeredVolunteers.push(req.user._id);
    await event.save();

    createdResponse(res, 'Registered for event successfully', { registration });
  } catch (error) {
    console.error('Register Event Error:', error);
    errorResponse(res, 500, 'Failed to register for event: ' + error.message);
  }
};

// Approve Event (Admin/Manager)
const approveEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { approvalStatus } = req.body;

    const event = await Event.findByIdAndUpdate(
      eventId,
      {
        isApproved: approvalStatus === 'approved',
        status: approvalStatus,
        approvedBy: req.user._id,
        approvalDate: new Date(),
      },
      { new: true }
    );

    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    successResponse(res, `Event ${approvalStatus} successfully`, { event });
  } catch (error) {
    errorResponse(res, 500, 'Failed to approve event: ' + error.message);
  }
};

// Get User's Registered Events
const getUserRegisteredEvents = async (req, res) => {
  try {
    const registrations = await Registration.find({ volunteer: req.user._id })
      .populate('event')
      .sort({ createdAt: -1 });

    const events = registrations.map(reg => reg.event);

    successResponse(res, 'User events retrieved successfully', { events });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve user events: ' + error.message);
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  registerForEvent,
  approveEvent,
  getUserRegisteredEvents,
};
