/**
 * Toast Notification Service
 * Handles all API responses and converts them to toast notifications
 */

export const handleApiResponse = async (response) => {
  const data = await response.json();

  // Nếu response có toastType, trả về thông tin để hiển thị toast
  if (data.toastType) {
    return {
      type: data.toastType,
      message: data.message,
      success: data.success,
      data: data.data || null,
    };
  }

  return {
    type: response.ok ? 'success' : 'error',
    message: data.message || 'Operation completed',
    success: response.ok,
    data: data.data || null,
  };
};

/**
 * Toast Types:
 * - success: Xanh lá cây (Green)
 * - error: Đỏ (Red)
 * - warning: Vàng (Yellow)
 * - info: Xanh dương (Blue)
 */

export const toastMessages = {
  // Auth Messages
  registerSuccess: 'Đăng ký thành công! Vui lòng đăng nhập.',
  registerError: 'Đăng ký thất bại. Vui lòng thử lại.',
  loginSuccess: 'Đăng nhập thành công!',
  loginError: 'Email hoặc mật khẩu không chính xác.',
  logoutSuccess: 'Đăng xuất thành công!',
  profileUpdateSuccess: 'Cập nhật hồ sơ thành công!',
  profileUpdateError: 'Cập nhật hồ sơ thất bại.',

  // Event Messages
  eventCreated: 'Sự kiện được tạo thành công!',
  eventCreatedPending: 'Sự kiện được tạo thành công! Đang chờ phê duyệt.',
  eventUpdateSuccess: 'Sự kiện được cập nhật thành công!',
  eventUpdateError: 'Cập nhật sự kiện thất bại.',
  eventRegisteredSuccess: 'Đăng ký sự kiện thành công!',
  eventRegisteredError: 'Đăng ký sự kiện thất bại.',
  eventFull: 'Sự kiện đã đầy. Không thể đăng ký.',
  alreadyRegistered: 'Bạn đã đăng ký sự kiện này.',
  eventApproved: 'Sự kiện được phê duyệt thành công!',
  eventRejected: 'Sự kiện được từ chối.',

  // Blood Donation Messages
  bloodDonationSuccess: 'Đăng ký hiến máu thành công! Chúng tôi sẽ liên hệ sớm.',
  bloodDonationError: 'Đăng ký hiến máu thất bại.',
  bloodDonationDuplicate: 'Email này đã được đăng ký trước đó.',
  bloodStatusUpdated: 'Cập nhật trạng thái hiến máu thành công!',

  // Membership Messages
  membershipSuccess: 'Đơn tham gia được gửi thành công! Vui lòng kiểm tra email xác nhận.',
  membershipError: 'Tạo thành viên thất bại.',
  membershipDuplicate: 'Email này đã được đăng ký trước đó.',
  membershipApproved: 'Thành viên được chấp thuận thành công!',
  membershipRejected: 'Thành viên bị từ chối.',

  // General Messages
  loadingError: 'Tải dữ liệu thất bại.',
  networkError: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối.',
  serverError: 'Lỗi máy chủ. Vui lòng thử lại sau.',
  unauthorized: 'Bạn không có quyền truy cập.',
  forbidden: 'Truy cập bị từ chối.',
  notFound: 'Không tìm thấy dữ liệu.',
};

export default toastMessages;
