import { useState } from 'react'
import '../styles/Hero.css'
import ServiceCard from '../components/ui/ServiceCard'
import EventCard from '../components/ui/EventCard'

export default function Hero() {
  const [highlightedWord, setHighlightedWord] = useState('Together')

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

          <div className="events-grid">
            <EventCard
              image="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&fit=crop"
              date="2025-11-20"
              title="Dọon rác bãi biển"
              description="Cùng nhau làm sạch bãi biển Mỹ Khê."
              attendees="45"
              link="#"
            />
            <EventCard
              image="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&fit=crop"
              date="2025-11-15"
              title="Trồng cây xanh tại trường"
              description="Chương trình trồng 500 cây xanh."
              attendees="120"
              link="#"
            />
            <EventCard
              image="https://images.unsplash.com/photo-1469571486292-0ba52a96ae4a?w=400&fit=crop"
              date="2025-10-01"
              title="Phát quà cho trẻ em"
              description="Tặng quà trung thu cho trẻ em khó khăn."
              attendees="80"
              link="#"
            />
          </div>
        </div>
      </section>
    </div>
  )
}


