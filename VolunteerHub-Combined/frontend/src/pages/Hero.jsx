import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import '../styles/Hero.css'
import ServiceCard from '../components/ui/ServiceCard'
import EventCard from '../components/ui/EventCard'
import { useEvents } from '../contexts/EventContext'

export default function Hero() {
  const { approvedEvents } = useEvents()
  const [highlightedWord, setHighlightedWord] = useState('Together')
  const [currentEventIndex, setCurrentEventIndex] = useState(0)
  const [eventsPerPage, setEventsPerPage] = useState(3)

  const handleJoinNow = () => {
    const element = document.getElementById('member')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleLearnMore = () => {
    const element = document.querySelector('.about-section')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleDonateBlood = () => {
    const element = document.getElementById('blood')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Filter out expired events (events before today) from approved events
  const activeEvents = approvedEvents.filter(event => {
    const eventDate = new Date(event.date)
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time to start of day
    return eventDate >= today
  })

  // Calculate responsive events per page
  useEffect(() => {
    const updateEventsPerPage = () => {
      if (window.innerWidth < 768) {
        setEventsPerPage(1)
      } else if (window.innerWidth < 1024) {
        setEventsPerPage(2)
      } else {
        setEventsPerPage(3)
      }
    }

    updateEventsPerPage()
    window.addEventListener('resize', updateEventsPerPage)
    return () => window.removeEventListener('resize', updateEventsPerPage)
  }, [])

  // Navigation handlers - Move one event at a time
  const handlePrevious = () => {
    setCurrentEventIndex(prev => {
      if (prev === 0) {
        // If at the beginning, go to the last possible position
        return Math.max(0, activeEvents.length - eventsPerPage)
      }
      return prev - 1
    })
  }

  const handleNext = () => {
    setCurrentEventIndex(prev => {
      const maxIndex = Math.max(0, activeEvents.length - eventsPerPage)
      if (prev >= maxIndex) {
        // If at the end, go back to the beginning
        return 0
      }
      return prev + 1
    })
  }

  // Get visible events
  const visibleEvents = activeEvents.slice(currentEventIndex, currentEventIndex + eventsPerPage)

  // Show navigation arrows only if there are more events than can be displayed
  const showNavigation = activeEvents.length > eventsPerPage



  return (
    <div className="hero-wrapper">
      {/* Hero Banner */}
      <div className="hero-banner">
        {/* Blue Overlay */}
        <div className="hero-overlay"></div>

        {/* Content */}
        <div className="hero-content">
          {/* Main Title - Improved with highlighted word */}
          <h1 className="hero-title">
            Cùng Nhau Tạo Nên <span className="highlight-accent">Sự Khác Biệt</span>
          </h1>

          {/* Motivational Quote */}
          <p className="hero-quote">
            "Cách tốt nhất để tìm thấy chính mình là mất mình trong việc phục vụ người khác."
          </p>
          <p className="hero-quote-author">
            — Mahatma Gandhi
          </p>

          {/* Call-to-Action Buttons - Enhanced */}
          <div className="hero-buttons">
            <button 
              className="btn btn-primary btn-lg" 
              onClick={handleJoinNow}
            >
              <span>Tham Gia Ngay</span>
              <span className="btn-icon">→</span>
            </button>
            <button 
              className="btn btn-outline btn-lg" 
              onClick={handleLearnMore}
            >
              <span>Tìm Hiểu Thêm</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="hero-stats">
            {[
              { icon: '👥', number: '500+', label: 'Tình Nguyện Viên Hoạt Động', iconClass: 'users-icon' },
              { icon: '❤', number: '50+', label: 'Dự Án Hoàn Thành', iconClass: 'project-icon' },
              { icon: '⭐', number: '10K+', label: 'Người Được Giúp Đỡ', iconClass: 'impact-icon' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="stat-item"
              >
                <span className={`stat-icon ${stat.iconClass}`}>{stat.icon}</span>
                <div>
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="services-section">
        <div className="services-container">
          <h2 className="section-title">Các Hoạt Động Của Chúng Tôi</h2>
          <p className="section-description">
            Chúng tôi tổ chức các hoạt động tình nguyện đa dạng để giúp đỡ cộng đồng
          </p>

          <div className="services-grid">
            <ServiceCard
              icon="🌱"
              title="Bảo Vệ Môi Trường"
              description="Tham gia các hoạt động trồng cây, dọn dẹp môi trường và bảo vệ tự nhiên"
            />
            <ServiceCard
              icon="📚"
              title="Giáo Dục Cộng Đồng"
              description="Hỗ trợ giáo dục trẻ em, tổ chức các khóa học kỹ năng cho cộng đồng"
            />
            <ServiceCard
              icon="❤️"
              title="Chăm Sóc Sức Khỏe"
              description="Hiến máu, kiểm tra sức khỏe miễn phí và hỗ trợ các bệnh viện địa phương"
            />
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events-section" id="sukien">
        <div className="events-container">
          <h2 className="section-title">Sự Kiện Sắp Tới</h2>
          <p className="section-description">
            Hãy xem những sự kiện tình nguyện sắp tới
          </p>

          <div className="events-carousel-wrapper">
            {showNavigation && (
              <button 
                className="carousel-arrow carousel-arrow-left" 
                onClick={handlePrevious}
                aria-label="Sự kiện trước"
              >
                <ChevronLeft size={32} />
              </button>
            )}
            
            <div className="events-grid">
              {visibleEvents.map((event, index) => (
                <EventCard
                  key={index}
                  image={event.image}
                  date={event.date}
                  title={event.title}
                  description={event.description}
                  attendees={event.attendees}
                  link={event.link}
                />
              ))}
            </div>

            {showNavigation && (
              <button 
                className="carousel-arrow carousel-arrow-right" 
                onClick={handleNext}
                aria-label="Sự kiện tiếp theo"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>

          {/* Dots Indicator */}
          {activeEvents.length > 0 && showNavigation && (
            <div className="carousel-dots">
              {Array.from({ length: Math.max(0, activeEvents.length - eventsPerPage + 1) }).map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${currentEventIndex === index ? 'active' : ''}`}
                  onClick={() => setCurrentEventIndex(index)}
                  aria-label={`Đi tới sự kiện ${index + 1}`}
                />
              ))}
            </div>
          )}

          {activeEvents.length === 0 && (
            <p className="no-events-message">Hiện tại không có sự kiện nào sắp diễn ra.</p>
          )}
        </div>
      </section>
    </div>
  )
}


