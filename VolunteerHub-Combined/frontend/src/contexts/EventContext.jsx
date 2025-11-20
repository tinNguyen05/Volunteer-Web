import { createContext, useContext, useState, useEffect } from 'react'

const EventContext = createContext()

export const useEvents = () => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvents must be used within EventProvider')
  }
  return context
}

export const EventProvider = ({ children }) => {
  // Approved events (visible to everyone)
  const [approvedEvents, setApprovedEvents] = useState(() => {
    const stored = localStorage.getItem('vh_approved_events')
    return stored ? JSON.parse(stored) : [
      {
        id: 1,
        image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&fit=crop",
        date: "2025-11-20",
        title: "Dọn rác bãi biển",
        description: "Cùng nhau làm sạch bãi biển Mỹ Khê.",
        attendees: "45",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        approved: true,
        approvedBy: "admin",
        approvedAt: new Date().toISOString()
      },
      {
        id: 2,
        image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&fit=crop",
        date: "2025-12-15",
        title: "Trồng cây xanh tại trường",
        description: "Chương trình trồng 500 cây xanh.",
        attendees: "120",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        approved: true,
        approvedBy: "admin",
        approvedAt: new Date().toISOString()
      },
      {
        id: 3,
        image: "https://images.unsplash.com/photo-1469571486292-0ba52a96ae4a?w=400&fit=crop",
        date: "2025-11-25",
        title: "Phát quà cho trẻ em",
        description: "Tặng quà trung thu cho trẻ em khó khăn.",
        attendees: "80",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        approved: true,
        approvedBy: "admin",
        approvedAt: new Date().toISOString()
      },
      {
        id: 4,
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&fit=crop",
        date: "2025-11-30",
        title: "Hiến máu nhân đạo",
        description: "Chiến dịch hiến máu cứu người.",
        attendees: "95",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        approved: true,
        approvedBy: "admin",
        approvedAt: new Date().toISOString()
      },
      {
        id: 5,
        image: "https://images.unsplash.com/photo-1509099863731-ef4bff19e808?w=400&fit=crop",
        date: "2025-12-05",
        title: "Xây nhà tình thương",
        description: "Xây dựng nhà cho người nghèo.",
        attendees: "60",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        approved: true,
        approvedBy: "admin",
        approvedAt: new Date().toISOString()
      },
      {
        id: 6,
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=400&fit=crop",
        date: "2025-12-10",
        title: "Dạy học miễn phí",
        description: "Dạy học cho trẻ em vùng cao.",
        attendees: "75",
        createdBy: "admin",
        createdAt: new Date().toISOString(),
        approved: true,
        approvedBy: "admin",
        approvedAt: new Date().toISOString()
      }
    ]
  })

  // Pending events (waiting for admin approval)
  const [pendingEvents, setPendingEvents] = useState(() => {
    const stored = localStorage.getItem('vh_pending_events')
    return stored ? JSON.parse(stored) : []
  })

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('vh_approved_events', JSON.stringify(approvedEvents))
  }, [approvedEvents])

  useEffect(() => {
    localStorage.setItem('vh_pending_events', JSON.stringify(pendingEvents))
  }, [pendingEvents])

  // Create event
  const createEvent = (eventData, creatorRole, creatorId) => {
    const newEvent = {
      id: Date.now(),
      ...eventData,
      createdBy: creatorId,
      createdAt: new Date().toISOString(),
      approved: creatorRole === 'admin', // Admin events are auto-approved
      approvedBy: creatorRole === 'admin' ? creatorId : null,
      approvedAt: creatorRole === 'admin' ? new Date().toISOString() : null
    }

    if (creatorRole === 'admin') {
      // Admin creates approved events directly
      setApprovedEvents(prev => [...prev, newEvent])
      return { success: true, message: 'Sự kiện đã được tạo thành công!' }
    } else if (creatorRole === 'manager') {
      // Manager creates pending events
      setPendingEvents(prev => [...prev, newEvent])
      return { success: true, message: 'Sự kiện đã được gửi. Vui lòng đợi admin phê duyệt.' }
    } else {
      return { success: false, message: 'Bạn không có quyền tạo sự kiện!' }
    }
  }

  // Approve event (admin only)
  const approveEvent = (eventId, adminId) => {
    const event = pendingEvents.find(e => e.id === eventId)
    if (!event) return { success: false, message: 'Không tìm thấy sự kiện!' }

    const approvedEvent = {
      ...event,
      approved: true,
      approvedBy: adminId,
      approvedAt: new Date().toISOString()
    }

    setApprovedEvents(prev => [...prev, approvedEvent])
    setPendingEvents(prev => prev.filter(e => e.id !== eventId))

    return { success: true, message: 'Đã phê duyệt sự kiện thành công!' }
  }

  // Reject event (admin only)
  const rejectEvent = (eventId, reason = '') => {
    setPendingEvents(prev => prev.filter(e => e.id !== eventId))
    return { success: true, message: 'Đã từ chối sự kiện!' }
  }

  // Delete event (admin only)
  const deleteEvent = (eventId) => {
    // Admin can delete any event (both approved and pending)
    setApprovedEvents(prev => prev.filter(e => e.id !== eventId))
    setPendingEvents(prev => prev.filter(e => e.id !== eventId))
    return { success: true, message: 'Đã xóa sự kiện!' }
  }

  // Update event (admin only)
  const updateEvent = (eventId, updatedData) => {
    // Admin can update approved events
    setApprovedEvents(prev => 
      prev.map(e => e.id === eventId ? { ...e, ...updatedData } : e)
    )
    // Also check pending events
    setPendingEvents(prev => 
      prev.map(e => e.id === eventId ? { ...e, ...updatedData } : e)
    )
    return { success: true, message: 'Đã cập nhật sự kiện!' }
  }

  const value = {
    approvedEvents,
    pendingEvents,
    createEvent,
    approveEvent,
    rejectEvent,
    deleteEvent,
    updateEvent
  }

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  )
}
