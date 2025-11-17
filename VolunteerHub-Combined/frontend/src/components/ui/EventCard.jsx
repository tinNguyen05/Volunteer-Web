import './EventCard.css'

export default function EventCard({ image, date, title, description, attendees, link }) {
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="event-card">
      <div className="event-image-wrapper">
        <img src={image} alt={title} className="event-image" />
        <div className="event-date-badge">
          <span className="date-value">{formatDate(date)}</span>
        </div>
      </div>
      
      <div className="event-content">
        <h3 className="event-title">{title}</h3>
        <p className="event-description">{description}</p>
        
        <div className="event-footer">
          <div className="event-attendees">
            <span className="attendees-icon">👥</span>
            <span className="attendees-count">{attendees || '0'} người</span>
          </div>
          <a href={link || '#'} className="event-link">
            Xem Chi Tiết →
          </a>
        </div>
      </div>
    </div>
  )
}
