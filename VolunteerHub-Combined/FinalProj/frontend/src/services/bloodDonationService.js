import client from '../api/client';

// Register blood donation
export const registerBloodDonation = async (donationData) => {
  try {
    const response = await client.post('/blood-donation/register', donationData);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to register blood donation',
    };
  }
};

// Get blood donation statistics (public)
export const getBloodStatistics = async () => {
  try {
    const response = await client.get('/blood-donation/statistics');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get blood statistics',
    };
  }
};

// Get all blood donations (admin/manager only)
export const getAllBloodDonations = async () => {
  try {
    const response = await client.get('/blood-donation/all');
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to get blood donations',
    };
  }
};

// Update blood donation status (admin/manager only)
export const updateBloodDonationStatus = async (donationId, status) => {
  try {
    const response = await client.put(`/blood-donation/${donationId}/status`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Failed to update donation status',
    };
  }
};
