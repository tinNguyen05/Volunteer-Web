const BloodDonation = require('../models/BloodDonation');
const { successResponse, createdResponse, errorResponse } = require('../utils/response');

// Register Blood Donation
const registerDonation = async (req, res) => {
  try {
    const { donorName, donorEmail, donorPhone, bloodType, lastDonationDate, preferredEventDate } = req.body;

    // Check if email already registered
    const existingDonor = await BloodDonation.findOne({ donorEmail });
    if (existingDonor && existingDonor.status !== 'cancelled') {
      return errorResponse(res, 400, 'Email already registered for blood donation');
    }

    const donation = new BloodDonation({
      donorName,
      donorEmail,
      donorPhone,
      bloodType,
      lastDonationDate: lastDonationDate || null,
      preferredEventDate,
      status: 'pending',
      user: req.user ? req.user._id : null,
    });

    await donation.save();
    createdResponse(res, 'Blood donation registration successful. We will contact you soon!', { donation });
  } catch (error) {
    console.error('Blood Donation Registration Error:', error);
    errorResponse(res, 500, 'Failed to register blood donation: ' + error.message);
  }
};

// Get All Donations (Admin/Manager only)
const getAllDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const { status, bloodType } = req.query;

    let query = {};
    if (status) query.status = status;
    if (bloodType) query.bloodType = bloodType;

    const donations = await BloodDonation.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await BloodDonation.countDocuments(query);

    successResponse(res, 'Blood donations retrieved successfully', {
      donations,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve donations: ' + error.message);
  }
};

// Update Donation Status
const updateDonationStatus = async (req, res) => {
  try {
    const { donationId } = req.params;
    const { status, notes } = req.body;

    const donation = await BloodDonation.findByIdAndUpdate(
      donationId,
      {
        status,
        notes: notes || donation.notes,
      },
      { new: true, runValidators: true }
    );

    if (!donation) {
      return errorResponse(res, 404, 'Donation record not found');
    }

    successResponse(res, 'Donation status updated successfully', { donation });
  } catch (error) {
    errorResponse(res, 500, 'Failed to update donation status: ' + error.message);
  }
};

// Get Blood Statistics
const getBloodStatistics = async (req, res) => {
  try {
    const stats = await BloodDonation.aggregate([
      {
        $group: {
          _id: '$bloodType',
          count: { $sum: 1 },
          status: { $push: '$status' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ]);

    const totalDonors = await BloodDonation.countDocuments();
    const completedDonations = await BloodDonation.countDocuments({ status: 'completed' });

    successResponse(res, 'Blood statistics retrieved successfully', {
      statistics: stats,
      totalDonors,
      completedDonations,
    });
  } catch (error) {
    errorResponse(res, 500, 'Failed to retrieve statistics: ' + error.message);
  }
};

module.exports = {
  registerDonation,
  getAllDonations,
  updateDonationStatus,
  getBloodStatistics,
};
