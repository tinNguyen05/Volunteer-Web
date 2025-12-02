const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Post = require('../models/Post');
const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/response');
const { Parser } = require('json2csv');

// Get Dashboard Stats
const getDashboardStats = async (req, res) => {
  try {
    const userRole = req.user.role;
    let stats = {};

    if (userRole === 'admin') {
      // Admin dashboard
      const totalUsers = await User.countDocuments({ isActive: true });
      const totalEvents = await Event.countDocuments();
      const approvedEvents = await Event.countDocuments({ isApproved: true });
      const pendingEvents = await Event.countDocuments({ status: 'pending' });
      const totalRegistrations = await Registration.countDocuments();

      stats = {
        totalUsers,
        totalEvents,
        approvedEvents,
        pendingEvents,
        totalRegistrations,
        usersByRole: await User.aggregate([
          { $match: { isActive: true } },
          { $group: { _id: '$role', count: { $sum: 1 } } },
        ]),
      };
    } else if (userRole === 'manager') {
      // Manager dashboard
      const myEvents = await Event.countDocuments({ createdBy: req.user._id });
      const approvedEvents = await Event.countDocuments({
        createdBy: req.user._id,
        isApproved: true,
      });
      const pendingEvents = await Event.countDocuments({
        createdBy: req.user._id,
        status: 'pending',
      });

      const myEventsIds = await Event.find({ createdBy: req.user._id }).select('_id');
      const eventIds = myEventsIds.map((e) => e._id);

      const totalRegistrations = await Registration.countDocuments({
        event: { $in: eventIds },
      });
      const totalPosts = await Post.countDocuments({ event: { $in: eventIds } });

      stats = {
        myEvents,
        approvedEvents,
        pendingEvents,
        totalRegistrations,
        totalPosts,
      };
    } else {
      // Volunteer dashboard
      const registeredEvents = await Registration.countDocuments({
        volunteer: req.user._id,
      });
      const completedEvents = await Registration.countDocuments({
        volunteer: req.user._id,
        status: 'completed',
      });
      const upcomingEvents = await Registration.countDocuments({
        volunteer: req.user._id,
        status: { $in: ['registered', 'approved'] },
      });

      stats = {
        registeredEvents,
        completedEvents,
        upcomingEvents,
        hoursContributed: req.user.hoursContributed || 0,
      };
    }

    successResponse(res, 'Dashboard stats retrieved successfully', stats);
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    errorResponse(res, 500, 'Failed to retrieve dashboard stats: ' + error.message);
  }
};

// Get Trending Events (for all roles)
const getTrendingEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;

    // Get events with most registrations and posts
    const trendingEvents = await Event.aggregate([
      { $match: { isApproved: true, status: { $ne: 'cancelled' } } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'event',
          as: 'posts',
        },
      },
      {
        $addFields: {
          registrationCount: { $size: '$registeredVolunteers' },
          postCount: { $size: '$posts' },
          trendScore: {
            $add: [
              { $multiply: [{ $size: '$registeredVolunteers' }, 2] },
              { $size: '$posts' },
            ],
          },
        },
      },
      { $sort: { trendScore: -1, createdAt: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
        },
      },
      { $unwind: '$createdBy' },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          date: 1,
          location: 1,
          image: 1,
          registrationCount: 1,
          postCount: 1,
          'createdBy.name': 1,
          'createdBy.avatar': 1,
        },
      },
    ]);

    successResponse(res, 'Trending events retrieved successfully', {
      events: trendingEvents,
    });
  } catch (error) {
    console.error('Trending Events Error:', error);
    errorResponse(res, 500, 'Failed to retrieve trending events: ' + error.message);
  }
};

// Get Recent Posts (for dashboard)
const getRecentPosts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find({ isActive: true })
      .populate('author', 'name avatar role')
      .populate('event', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);

    successResponse(res, 'Recent posts retrieved successfully', { posts });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve recent posts: ' + error.message);
  }
};

// Export Data (Admin only)
const exportData = async (req, res) => {
  try {
    const { type, format } = req.query; // type: events, users, registrations

    let data = [];
    let fields = [];

    switch (type) {
      case 'events':
        data = await Event.find()
          .populate('createdBy', 'name email')
          .populate('approvedBy', 'name')
          .lean();
        fields = [
          'title',
          'category',
          'date',
          'location',
          'capacity',
          'status',
          'isApproved',
          'createdBy.name',
          'createdBy.email',
          'createdAt',
        ];
        break;

      case 'users':
        data = await User.find().lean();
        fields = [
          'name',
          'email',
          'role',
          'phone',
          'isActive',
          'eventsCompleted',
          'hoursContributed',
          'createdAt',
        ];
        break;

      case 'registrations':
        data = await Registration.find()
          .populate('volunteer', 'name email')
          .populate('event', 'title date')
          .lean();
        fields = [
          'volunteer.name',
          'volunteer.email',
          'event.title',
          'event.date',
          'status',
          'hoursWorked',
          'rating',
          'createdAt',
        ];
        break;

      default:
        return errorResponse(res, 400, 'Invalid export type');
    }

    if (format === 'csv') {
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${type}_export.csv`);
      return res.send(csv);
    } else {
      // JSON format
      res.setHeader('Content-Type', 'application/json');
      res.setHeader(
        'Content-Disposition',
        `attachment; filename=${type}_export.json`
      );
      return res.json(data);
    }
  } catch (error) {
    console.error('Export Data Error:', error);
    errorResponse(res, 500, 'Failed to export data: ' + error.message);
  }
};

module.exports = {
  getDashboardStats,
  getTrendingEvents,
  getRecentPosts,
  exportData,
};
