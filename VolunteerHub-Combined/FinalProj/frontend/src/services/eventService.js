/**
 * Event Service - GraphQL Integration
 * Tích hợp với backend GraphQL API
 */
import graphqlClient from '../api/graphqlClient';

// --- OFFLINE MOCK MODE: REAL DATA FROM DATABASE ---
const MOCK_DB_EVENTS = [
  {
    eventId: "777627648166723584",
    eventName: "Áo Ấm Cho Em - Hà Giang 2025",
    eventDescription: "Chương trình quyên góp và trao tặng 500 áo ấm, chăn bông cho trẻ em tại điểm trường Xín Mần.",
    eventLocation: "Xín Mần, Hà Giang",
    eventState: "UPCOMING", // Map từ ACCEPTED
    createdAt: "2025-11-01T08:00:00",
    updatedAt: "2025-11-01T08:00:00",
    memberCount: 350,
    postCount: 12,
    likeCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000&auto=format&fit=crop",
    ticketPrice: 0,
    soldTickets: 350,
    capacity: 500,
    creatorInfo: { userId: "1", username: "BTC Ha Giang", avatarId: "default" }
  },
  {
    eventId: "777627701996421120",
    eventName: "Xuân Yêu Thương 2025 - TP. Thủ Đức",
    eventDescription: "Phát quà Tết (gạo, mì, dầu ăn) cho 200 hộ gia đình khó khăn và người già neo đơn.",
    eventLocation: "Nhà văn hóa phường Linh Chiểu, TP. Thủ Đức",
    eventState: "UPCOMING", // Map từ ACCEPTED
    createdAt: "2025-11-02T09:30:00",
    updatedAt: "2025-11-02T09:30:00",
    memberCount: 150,
    postCount: 8,
    likeCount: 45,
    imageUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?q=80&w=1000&auto=format&fit=crop",
    ticketPrice: 100000, // Vé ủng hộ
    soldTickets: 150,
    capacity: 200,
    creatorInfo: { userId: "2", username: "Youth Union", avatarId: "default" }
  },
  {
    eventId: "783729111222333444",
    eventName: "Green Life: Đổi Giấy Cũ Lấy Cây Xanh",
    eventDescription: "Chương trình khuyến khích tái chế. Đổi 5kg giấy vụn lấy 1 chậu sen đá.",
    eventLocation: "Kho tập kết số 3, Quận 1",
    eventState: "PENDING",
    createdAt: "2025-12-05T08:00:00",
    updatedAt: "2025-12-05T08:00:00",
    memberCount: 20,
    postCount: 3,
    likeCount: 15,
    imageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb7d5763?q=80&w=1000&auto=format&fit=crop",
    ticketPrice: 0,
    soldTickets: 20,
    capacity: 1000,
    creatorInfo: { userId: "3", username: "GreenClub", avatarId: "default" }
  },
  {
    eventId: "783729555666777888",
    eventName: "Khoảnh Khắc Vàng - Chụp Ảnh Miễn Phí",
    eventDescription: "Dự án chụp ảnh chân dung tặng các cụ già neo đơn. Cần tuyển thợ chụp ảnh.",
    eventLocation: "Trung tâm dưỡng lão Thị Nghè",
    eventState: "PENDING",
    createdAt: "2025-12-06T09:30:00",
    updatedAt: "2025-12-06T09:30:00",
    memberCount: 5,
    postCount: 1,
    likeCount: 8,
    imageUrl: "https://images.unsplash.com/photo-1516307365426-bea591f05011?q=80&w=1000&auto=format&fit=crop",
    ticketPrice: 0,
    soldTickets: 5,
    capacity: 20,
    creatorInfo: { userId: "4", username: "PhotoGroup", avatarId: "default" }
  },
  {
    eventId: "783729999000111222",
    eventName: "Code For Future - Dạy Lập Trình Miễn Phí",
    eventDescription: "Mở lớp dạy lập trình cơ bản cho trẻ em đường phố.",
    eventLocation: "Trung tâm GDTX Quận 5",
    eventState: "PENDING",
    createdAt: "2025-12-07T14:00:00",
    updatedAt: "2025-12-07T14:00:00",
    memberCount: 12,
    postCount: 2,
    likeCount: 10,
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=1000&auto=format&fit=crop",
    ticketPrice: 0,
    soldTickets: 12,
    capacity: 30,
    creatorInfo: { userId: "5", username: "DevCommunity", avatarId: "default" }
  }
];

// Get all events với pagination - ONLINE MODE
export const getAllEvents = async (page = 0, size = 10, filters = {}) => {
  try {
    const query = `
      query FindEvents($page: Int, $size: Int) {
        findEvents(page: $page, size: $size) {
          content {
            eventId
            eventName
            eventDescription
            eventLocation
            eventState
            createdAt
            updatedAt
            memberCount
            postCount
            likeCount
            creatorInfo {
              userId
              username
              avatarId
            }
          }
          pageInfo {
            page
            size
            totalElements
            totalPages
            hasNext
            hasPrevious
          }
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { page, size });
    return { success: true, data: data.findEvents.content, pageInfo: data.findEvents.pageInfo };
  } catch (error) {
    console.error('Get all events error:', error);
    return { success: false, error: error.message || 'Không thể tải danh sách sự kiện' };
  }
};

// Get event by ID với nested data (Posts + Comments)
export const getEventById = async (eventId) => {
  // ONLINE MODE - Real GraphQL query with nested data
  try {
    const query = `
      query GetEvent($eventId: ID!) {
        getEvent(eventId: $eventId) {
          eventId
          eventName
          eventDescription
          eventLocation
          eventState
          createdAt
          updatedAt
          memberCount
          postCount
          likeCount
          creatorInfo {
            userId
            username
            avatarId
          }
          listPosts(page: 0, size: 20) {
            pageInfo {
              page
              size
              totalElements
              totalPages
              hasNext
              hasPrevious
            }
            content {
              postId
              eventId
              title
              content
              imageUrl
              createdAt
              updatedAt
              commentCount
              likeCount
              isLiked
              creatorInfo {
                userId
                username
                avatarId
              }
              listComment(page: 0, size: 10) {
                pageInfo {
                  page
                  size
                  totalElements
                  totalPages
                }
                content {
                  commentId
                  postId
                  content
                  createdAt
                  updatedAt
                  likeCount
                }
              }
            }
          }
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { eventId });
    return { success: true, data: data.getEvent };
  } catch (error) {
    console.error('Get event by ID error:', error);
    return { success: false, error: error.message || 'Không thể tải thông tin sự kiện' };
  }
};

// Register for event
export const registerForEvent = async (eventId) => {
  try {
    const mutation = `
      mutation RegisterEvent($eventId: ID!) {
        registerEvent(eventId: $eventId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { eventId });
    return { success: data.registerEvent.ok, message: data.registerEvent.message };
  } catch (error) {
    console.error('Register for event error:', error);
    return { success: false, error: error.message || 'Không thể đăng ký sự kiện' };
  }
};

// Unregister from event
export const unregisterFromEvent = async (eventId) => {
  try {
    const mutation = `
      mutation UnregisterEvent($eventId: ID!) {
        unregisterEvent(eventId: $eventId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { eventId });
    return { success: data.unregisterEvent.ok, message: data.unregisterEvent.message };
  } catch (error) {
    console.error('Unregister from event error:', error);
    return { success: false, error: error.message || 'Không thể hủy đăng ký' };
  }
};

// Get user's registered events (fallback to getAllEvents)
export const getUserRegisteredEvents = async () => {
  try {
    // Backend không có query riêng cho registered events
    // Có thể filter trên client hoặc dùng findEvents với filter
    return await getAllEvents(0, 50);
  } catch (error) {
    console.error('Get registered events error:', error);
    return { success: false, error: error.message || 'Không thể tải danh sách đăng ký' };
  }
};

// Get my registered event IDs from database
export const getMyRegisteredEventIds = async () => {
  try {
    const token = localStorage.getItem('vh_access_token');
    if (!token) {
      return { success: false, data: [] };
    }

    const response = await fetch('http://localhost:8080/api/event-registrations/my-registered-event-ids', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch registered event IDs');
    }

    const eventIds = await response.json();
    return { success: true, data: eventIds };
  } catch (error) {
    console.error('Get registered event IDs error:', error);
    return { success: false, data: [] };
  }
};

// Get participation history (fallback)
export const getParticipationHistory = async () => {
  try {
    return await getAllEvents(0, 50);
  } catch (error) {
    console.error('Get participation history error:', error);
    return { success: false, error: error.message || 'Không thể tải lịch sử tham gia' };
  }
};

// Create event (Manager/Admin)
export const createEvent = async (eventData) => {
  try {
    const mutation = `
      mutation CreateEvent($input: CreateEventInput!) {
        createEvent(input: $input) {
          ok
          id
          message
          createdAt
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { input: eventData });
    return { success: data.createEvent.ok, data: data.createEvent };
  } catch (error) {
    console.error('Create event error:', error);
    return { success: false, error: error.message || 'Không thể tạo sự kiện' };
  }
};

// Update event
export const updateEvent = async (eventId, eventData) => {
  try {
    const mutation = `
      mutation EditEvent($input: EditEventInput!) {
        editEvent(input: $input) {
          ok
          message
          updatedAt
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { 
      input: { eventId, ...eventData } 
    });
    return { success: data.editEvent.ok, message: data.editEvent.message };
  } catch (error) {
    console.error('Update event error:', error);
    return { success: false, error: error.message || 'Không thể cập nhật sự kiện' };
  }
};

// Delete event (for EVENT_MANAGER role)
export const deleteEvent = async (eventId) => {
  try {
    const mutation = `
      mutation DeleteEvent($eventId: ID!) {
        deleteEvent(eventId: $eventId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { eventId });
    return { success: data.deleteEvent.ok, message: data.deleteEvent.message };
  } catch (error) {
    console.error('Delete event error:', error);
    return { success: false, error: error.message || 'Không thể xóa sự kiện' };
  }
};

// Get dashboard events (recent events with full details)
export const getDashboardEvents = async (limit = 5) => {
  try {
    const query = `
      query DashboardEvents($page: Int!, $size: Int!) {
        findEvents(page: $page, size: $size) {
          content {
            eventId
            eventName
            eventDescription
            eventLocation
            createdAt
            updatedAt
            memberCount
            postCount
            likeCount
            creatorInfo {
              userId
              username
              avatarId
            }
          }
          pageInfo {
            page
            size
            totalElements
            totalPages
            hasNext
            hasPrevious
          }
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { page: 0, size: limit });
    return { success: true, data: data.findEvents.content };
  } catch (error) {
    console.error('Get dashboard events error:', error);
    return { success: false, error: error.message || 'Không thể tải sự kiện dashboard' };
  }
};

// Approve event (Admin) - Update event_state to ACCEPTED
export const approveEvent = async (eventId) => {
  try {
    const mutation = `
      mutation ApproveEvent($eventId: ID!) {
        approveEvent(eventId: $eventId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { eventId: String(eventId) });
    return { success: data.approveEvent.ok, message: data.approveEvent.message || 'Đã duyệt sự kiện thành công' };
  } catch (error) {
    console.error('Approve event error:', error);
    return { success: false, error: error.message || 'Không thể duyệt sự kiện' };
  }
};

// Reject event (Admin) - Update event_state to REJECTED
export const rejectEvent = async (eventId) => {
  try {
    const mutation = `
      mutation RejectEvent($eventId: ID!) {
        rejectEvent(eventId: $eventId) {
          ok
          message
        }
      }
    `;
    
    const data = await graphqlClient.mutation(mutation, { eventId: String(eventId) });
    return { success: data.rejectEvent.ok, message: data.rejectEvent.message || 'Đã từ chối sự kiện thành công' };
  } catch (error) {
    console.error('Reject event error:', error);
    return { success: false, error: error.message || 'Không thể từ chối sự kiện' };
  }
};

// Update registration status (Manager/Admin) - Placeholder
export const updateRegistrationStatus = async (registrationId, status) => {
  console.warn('updateRegistrationStatus not implemented in GraphQL backend');
  return { success: false, error: 'Chức năng chưa được hỗ trợ' };
};

// Mark event as complete (Manager/Admin) - Placeholder
export const completeEvent = async (eventId) => {
  console.warn('completeEvent not implemented in GraphQL backend');
  return { success: false, error: 'Chức năng chưa được hỗ trợ' };
};

// Get registrations for an event (Manager/Admin) - Placeholder
export const getRegistrationsByEvent = async (eventId) => {
  console.warn('getRegistrationsByEvent not implemented in GraphQL backend');
  return { success: false, error: 'Chức năng chưa được hỗ trợ' };
};
