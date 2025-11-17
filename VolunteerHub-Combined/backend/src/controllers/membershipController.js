const Membership = require('../models/Membership');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// Create Membership
const createMembership = async (req, res) => {
  try {
    const { fullName, email, phone, address, city, state, zipCode, membershipType, interests, bio, acceptTerms } = req.body;

    // Check if email already registered
    const existingMember = await Membership.findOne({ email });
    if (existingMember && existingMember.status !== 'inactive') {
      return errorResponse(res, 400, 'Email already registered for membership');
    }

    const membership = new Membership({
      fullName,
      email,
      phone,
      address,
      city,
      state,
      zipCode,
      membershipType: membershipType || 'basic',
      interests: interests || [],
      bio,
      acceptTerms,
      status: 'pending',
      verificationStatus: false,
    });

    await membership.save();
    createdResponse(res, 'Membership application submitted successfully! Check your email for verification.', { membership });
  } catch (error) {
    console.error('Membership Creation Error:', error);
    errorResponse(res, 500, 'Failed to create membership: ' + error.message);
  }
};

// Get All Memberships (Admin only)
const getAllMemberships = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, membershipType } = req.query;

    let query = {};
    if (status) query.status = status;
    if (membershipType) query.membershipType = membershipType;

    const memberships = await Membership.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Membership.countDocuments(query);

    successResponse(res, 'Memberships retrieved successfully', {
      memberships,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve memberships: ' + error.message);
  }
};

// Approve Membership
const approveMembership = async (req, res) => {
  try {
    const { membershipId } = req.params;

    const membership = await Membership.findByIdAndUpdate(
      membershipId,
      {
        status: 'active',
        verificationStatus: true,
      },
      { new: true }
    );

    if (!membership) {
      return errorResponse(res, 404, 'Membership not found');
    }

    successResponse(res, 'Membership approved successfully', { membership });
  } catch (error) {
    errorResponse(res, 500, 'Failed to approve membership: ' + error.message);
  }
};

// Reject Membership
const rejectMembership = async (req, res) => {
  try {
    const { membershipId } = req.params;

    const membership = await Membership.findByIdAndUpdate(
      membershipId,
      { status: 'inactive' },
      { new: true }
    );

    if (!membership) {
      return errorResponse(res, 404, 'Membership not found');
    }

    successResponse(res, 'Membership rejected', { membership });
  } catch (error) {
    errorResponse(res, 500, 'Failed to reject membership: ' + error.message);
  }
};

// Get Membership Statistics
const getMembershipStats = async (req, res) => {
  try {
    const stats = await Membership.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          active: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] },
          },
          inactive: {
            $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] },
          },
        },
      },
    ]);

    const typeStats = await Membership.aggregate([
      {
        $group: {
          _id: '$membershipType',
          count: { $sum: 1 },
        },
      },
    ]);

    successResponse(res, 'Membership statistics retrieved successfully', {
      stats: stats[0] || {},
      typeStats,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve statistics: ' + error.message);
  }
};

module.exports = {
  createMembership,
  getAllMemberships,
  approveMembership,
  rejectMembership,
  getMembershipStats,
};
