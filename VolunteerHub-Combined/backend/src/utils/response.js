// API Response utility with toast types
const sendResponse = (res, statusCode, message, data = null, toastType = 'info') => {
  const statusMap = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: 'info',
  };

  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    toastType: statusMap[toastType] || 'info',
    data,
  });
};

const successResponse = (res, message, data = null) => {
  sendResponse(res, 200, message, data, 'success');
};

const createdResponse = (res, message, data = null) => {
  sendResponse(res, 201, message, data, 'success');
};

const errorResponse = (res, statusCode, message, data = null) => {
  sendResponse(res, statusCode, message, data, 'error');
};

const validationErrorResponse = (res, message, errors = null) => {
  res.status(400).json({
    success: false,
    message,
    toastType: 'error',
    errors,
  });
};

module.exports = {
  sendResponse,
  successResponse,
  createdResponse,
  errorResponse,
  validationErrorResponse,
};
