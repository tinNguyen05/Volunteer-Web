/**
 * Event Service - GraphQL Integration
 * Tích hợp với backend GraphQL API
 */
import graphqlClient from '../api/graphqlClient';

// Get all events với pagination
export const getAllEvents = async (page = 0, size = 10, filters = {}) => {
  try {
    const query = `
      query FindEvents($page: Int!, $size: Int!) {
        findEvents(page: $page, size: $size) {
          content {
            eventId
            title
            description
            location
            startAt
            endAt
            eventStatus
            memberCount
            memberLimit
            creatorInfo {
              userId
              username
              avatarId
            }
          }
          totalElements
          totalPages
        }
      }
    `;
    
    const data = await graphqlClient.query(query, { page, size });
    return { success: true, data: data.findEvents.content, totalPages: data.findEvents.totalPages };
  } catch (error) {
    console.error('Get all events error:', error);
    return { success: false, error: error.message || 'Không thể tải danh sách sự kiện' };
  }
};

// Get event by ID với nested data (Posts + Comments)
export const getEventById = async (eventId) => {
  try {
    const query = `
      query GetEvent($eventId: ID!) {
        getEvent(eventId: $eventId) {
          eventId
          title
          description
          location
          startAt
          endAt
          eventStatus
          memberCount
          memberLimit
          postCount
          likeCount
          creatorInfo {
            userId
            username
            avatarId
          }
          listPosts(page: 0, size: 10) {
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
              content
              createdAt
              updatedAt
              commentCount
              likeCount
              creatorInfo {
                userId
                username
                avatarId
              }
              listComment(page: 0, size: 5) {
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
                  creatorInfo {
                    userId
                    username
                    avatarId
                  }
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
            title
            description
            location
            startAt
            endAt
            eventStatus
            memberCount
            memberLimit
            postCount
            likeCount
            creatorInfo {
              userId
              username
              avatarId
            }
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

// Approve event (Admin) - Not in GraphQL schema, placeholder
export const approveEvent = async (eventId, approvalStatus) => {
  console.warn('approveEvent not implemented in GraphQL backend');
  return { success: false, error: 'Chức năng chưa được hỗ trợ' };
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
