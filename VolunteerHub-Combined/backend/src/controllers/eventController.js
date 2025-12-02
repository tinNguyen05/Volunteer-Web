const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');
const { createNotification } = require('../services/notificationService');

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

    // Notify admins about new event (if created by manager)
    if (req.user.role === 'manager') {
      const admins = await User.find({ role: 'admin', isActive: true });
      
      for (const admin of admins) {
        await createNotification({
          recipient: admin._id,
          sender: req.user._id,
          type: 'event_created',
          title: 'Sự kiện mới cần duyệt',
          message: `${req.user.name} đã tạo sự kiện "${title}" cần được duyệt`,
          relatedEvent: event._id,
        });
      }
    }

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

    const event = await Event.findById(eventId).populate('createdBy', 'name');
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

    // Notify event manager
    await createNotification({
      recipient: event.createdBy._id,
      sender: req.user._id,
      type: 'registration_new',
      title: 'Đăng ký mới',
      message: `${req.user.name} đã đăng ký tham gia sự kiện "${event.title}"`,
      relatedEvent: event._id,
      relatedRegistration: registration._id,
    });

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
    ).populate('createdBy', 'name');

    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    // Notify event creator
    await createNotification({
      recipient: event.createdBy._id,
      sender: req.user._id,
      type: approvalStatus === 'approved' ? 'event_approved' : 'event_rejected',
      title: approvalStatus === 'approved' ? 'Sự kiện đã được duyệt' : 'Sự kiện bị từ chối',
      message: `Sự kiện "${event.title}" đã được ${approvalStatus === 'approved' ? 'phê duyệt' : 'từ chối'} bởi ${req.user.name}`,
      relatedEvent: event._id,
    });

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

// Approve/Reject Registration (Manager/Admin)
const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params;
    const { status } = req.body; // 'approved' or 'rejected'

    const registration = await Registration.findById(registrationId)
      .populate('volunteer', 'name')
      .populate('event', 'title createdBy');

    if (!registration) {
      return errorResponse(res, 404, 'Registration not found');
    }

    // Check authorization (only event creator or admin can approve)
    if (
      registration.event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return errorResponse(res, 403, 'Forbidden: You cannot update this registration');
    }

    registration.status = status;
    registration.approvedBy = req.user._id;
    registration.approvalDate = new Date();
    await registration.save();

    // Notify volunteer
    await createNotification({
      recipient: registration.volunteer._id,
      sender: req.user._id,
      type: status === 'approved' ? 'registration_approved' : 'registration_rejected',
      title: status === 'approved' ? 'Đăng ký đã được chấp nhận' : 'Đăng ký bị từ chối',
      message: `Đăng ký của bạn cho sự kiện "${registration.event.title}" đã được ${status === 'approved' ? 'chấp nhận' : 'từ chối'}`,
      relatedEvent: registration.event._id,
      relatedRegistration: registration._id,
    });

    successResponse(res, `Registration ${status} successfully`, { registration });
  } catch (error) {
    console.error('Update Registration Status Error:', error);
    errorResponse(res, 500, 'Failed to update registration status: ' + error.message);
  }
};

// Mark Event as Completed (Manager/Admin)
const completeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return errorResponse(res, 404, 'Event not found');
    }

    // Check authorization
    if (event.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return errorResponse(res, 403, 'Forbidden: You cannot complete this event');
    }

    event.status = 'completed';
    await event.save();

    // Update all approved registrations to completed
    const registrations = await Registration.find({
      event: eventId,
      status: 'approved',
    }).populate('volunteer', 'name');

    for (const reg of registrations) {
      reg.status = 'completed';
      reg.completionDate = new Date();
      await reg.save();

      // Update volunteer stats
      await User.findByIdAndUpdate(reg.volunteer._id, {
        $inc: { eventsCompleted: 1 },
      });

      // Notify volunteer
      await createNotification({
        recipient: reg.volunteer._id,
        sender: req.user._id,
        type: 'event_completed',
        title: 'Sự kiện đã hoàn thành',
        message: `Sự kiện "${event.title}" đã được đánh dấu hoàn thành. Cảm ơn sự tham gia của bạn!`,
        relatedEvent: event._id,
      });
    }

    successResponse(res, 'Event marked as completed successfully', { event });
  } catch (error) {
    console.error('Complete Event Error:', error);
    errorResponse(res, 500, 'Failed to complete event: ' + error.message);
  }
};

// Get Participation History (Volunteer)
const getParticipationHistory = async (req, res) => {
  try {
    const registrations = await Registration.find({
      volunteer: req.user._id,
      status: 'completed',
    })
      .populate('event', 'title date location category image')
      .sort({ completionDate: -1 });

    const totalHours = registrations.reduce((sum, reg) => sum + (reg.hoursWorked || 0), 0);

    successResponse(res, 'Participation history retrieved successfully', {
      registrations,
      totalEvents: registrations.length,
      totalHours,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve participation history: ' + error.message);
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
  updateRegistrationStatus,
  completeEvent,
  getParticipationHistory,
};
