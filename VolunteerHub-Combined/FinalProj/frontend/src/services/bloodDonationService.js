/**
 * Blood Donation Service - REST API Integration
 * ONLINE MODE: Using real backend API
 */
import axiosClient from '../api/client';

// ===========================
// MOCK DATA - Khớp với Database Schema
// ===========================
const MOCK_DATA = [
  { id: 1, fullName: 'Nguyen Van An', email: 'nguyenvanan90@gmail.com', phoneNumber: '0901234567', bloodType: 'O+', healthNote: null, registrationDate: '2025-01-20', createdAt: '2025-12-14T16:17:31.329288', status: 'pending' },
  { id: 2, fullName: 'Tran Thi Bich', email: 'bichtran@outlook.com', phoneNumber: '0918765432', bloodType: 'A-', healthNote: 'Huyết áp thấp nhẹ', registrationDate: '2025-01-22', createdAt: '2025-12-14T16:17:31.329288', status: 'pending' },
  { id: 3, fullName: 'Le Hoang Nam', email: 'nam.lh@company.vn', phoneNumber: '0933555777', bloodType: 'B+', healthNote: null, registrationDate: '2025-02-05', createdAt: '2025-12-14T16:17:31.329288', status: 'confirmed' },
  { id: 4, fullName: 'Pham Minh Tuan', email: 'tuanphamdev@gmail.com', phoneNumber: '0977888999', bloodType: 'AB+', healthNote: 'Đã tiêm vaccine cúm cách đây 1 tuần', registrationDate: '2025-02-10', createdAt: '2025-12-14T16:17:31.329288', status: 'confirmed' },
  { id: 5, fullName: 'Hoang Thi Mai', email: 'maihoang1995@yahoo.com', phoneNumber: '0909000111', bloodType: 'O-', healthNote: null, registrationDate: '2025-02-14', createdAt: '2025-12-14T16:17:31.329288', status: 'confirmed' },
  { id: 6, fullName: 'Vo Van Kiet', email: 'kietvv@edu.vn', phoneNumber: '0388999666', bloodType: 'A+', healthNote: 'Dị ứng phấn hoa', registrationDate: '2025-03-01', createdAt: '2025-12-14T16:17:31.329288', status: 'completed' },
  { id: 7, fullName: 'Dang Thuy Linh', email: 'linh.dang@gmail.com', phoneNumber: '0944555666', bloodType: 'B-', healthNote: null, registrationDate: '2025-03-05', createdAt: '2025-12-14T16:17:31.329288', status: 'completed' },
  { id: 8, fullName: 'Bui Tien Dung', email: 'dungbt_sport@gmail.com', phoneNumber: '0966777888', bloodType: 'AB-', healthNote: null, registrationDate: '2025-03-12', createdAt: '2025-12-14T16:17:31.329288', status: 'completed' },
  { id: 9, fullName: 'Doan Van Hau', email: 'hau.doan@football.vn', phoneNumber: '0988111222', bloodType: 'O+', healthNote: 'Từng phẫu thuật dây chằng năm 2023', registrationDate: '2025-03-20', createdAt: '2025-12-14T16:17:31.329288', status: 'pending' },
  { id: 10, fullName: 'Nguyen Thi Lan', email: 'lan.nguyen@bank.com', phoneNumber: '0911222333', bloodType: 'A+', healthNote: null, registrationDate: '2025-04-01', createdAt: '2025-12-14T16:17:31.329288', status: 'confirmed' },
  { id: 11, fullName: 'Tran Quoc Toan', email: 'toantran@tech.io', phoneNumber: '0922333444', bloodType: 'B+', healthNote: 'Đang dùng thuốc bổ sung sắt', registrationDate: '2025-04-10', createdAt: '2025-12-14T16:17:31.329288', status: 'confirmed' },
  { id: 12, fullName: 'Le Thi Hong', email: 'hongle_spa@gmail.com', phoneNumber: '0933444555', bloodType: 'O+', healthNote: null, registrationDate: '2025-04-15', createdAt: '2025-12-14T16:17:31.329288', status: 'completed' },
  { id: 13, fullName: 'Phan Van Duc', email: 'ducphan@realestate.vn', phoneNumber: '0944555777', bloodType: 'AB+', healthNote: null, registrationDate: '2025-05-01', createdAt: '2025-12-14T16:17:31.329288', status: 'pending' },
  { id: 14, fullName: 'Vu Thi Thu', email: 'thuvu.teacher@school.edu', phoneNumber: '0955666777', bloodType: 'A-', healthNote: 'Thiếu máu nhẹ trong quá khứ', registrationDate: '2025-05-05', createdAt: '2025-12-14T16:17:31.329288', status: 'pending' },
  { id: 15, fullName: 'Ngo Bao Chau', email: 'chaungo.math@inst.org', phoneNumber: '0966777888', bloodType: 'B-', healthNote: null, registrationDate: '2025-05-20', createdAt: '2025-12-14T16:17:31.329288', status: 'confirmed' }
];

const MOCK_STATS = {
  totalDonations: 15,
  byBloodType: {
    'O+': 4,
    'A+': 3,
    'B+': 3,
    'AB+': 2,
    'O-': 1,
    'A-': 2,
    'B-': 2,
    'AB-': 1
  },
  recentDonations: 8,
  upcomingDonations: 7
};

// ===========================
// SERVICE FUNCTIONS - OFFLINE MOCK MODE
// ===========================

/**
 * Get all blood donations (admin/manager only)
 * MOCK MODE: Returns data directly without API call
 */
export const getAllBloodDonations = async () => {
  try {
    const response = await axiosClient.get('/blood-donation/all');
    return response.data || response;
  } catch (error) {
    console.error('Get all blood donations error:', error);
    throw error;
  }
};

/**
 * Get blood donation statistics (public)
 * MOCK MODE: Returns stats directly without API call
 */
export const getBloodStatistics = async () => {
  try {
    const response = await axiosClient.get('/blood-donation/statistics');
    return response.data || response;
  } catch (error) {
    console.error('Get blood statistics error:', error);
    throw error;
  }
};

/**
 * Update blood donation status (admin/manager only)
 * MOCK MODE: Simulates successful update without API call
 */
export const updateBloodDonationStatus = async (donationId, status) => {
  try {
    console.log(`📡 API Call: PUT /blood-donation/${donationId}?status=${status}`);
    
    const response = await axiosClient.put(`/blood-donation/${donationId}?status=${status}`, null);
    
    console.log("📦 Response từ server:", response);
    
    return response.data;
  } catch (error) {
    console.error('❌ Update blood donation status error:', error);
    console.error('❌ Error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

/**
 * Register blood donation (public)
 * MOCK MODE: Simulates registration without API call
 */
export const registerBloodDonation = async (donationData) => {
  try {
    const response = await axiosClient.post('/blood-donation/register', donationData);
    return response.data;
  } catch (error) {
    console.error('Register blood donation error:', error);
    throw error;
  }
};

export const deleteBloodDonation = async (donationId) => {
  try {
    const response = await axiosClient.delete(`/blood-donation/${donationId}`);
    return response.data;
  } catch (error) {
    console.error('Delete blood donation error:', error);
    throw error;
  }
};
