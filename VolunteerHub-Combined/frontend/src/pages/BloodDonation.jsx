import { useState, useEffect } from 'react'
import { registerBloodDonation, getBloodStatistics } from '../services/bloodDonationService'
import { showNotification } from '../services/toastService'
import '../styles/BloodDonation.css'

export default function BloodDonation() {
  const [donorFormData, setDonorFormData] = useState({
    donorName: '',
    donorEmail: '',
    donorPhone: '',
    bloodType: '',
    preferredEventDate: '',
    medicalHistory: ''
  })

  const [showDonorConfirmation, setShowDonorConfirmation] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [statistics, setStatistics] = useState(null)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    const response = await getBloodStatistics()
    if (response.success) {
      setStatistics(response.data.statistics)
    }
  }

  const upcomingEvents = [
    {
      id: 1,
      date: '25 tháng 11, 2025',
      time: '08:00 - 16:00',
      location: 'Trung tâm chính Arise Hearts - Phòng Y tế',
      collected: 45,
      target: 100,
      status: 'Sắp diễn ra'
    },
    {
      id: 2,
      date: '10 tháng 12, 2025',
      time: '09:00 - 15:00',
      location: 'Trung tâm Hợp tác Y tế Arise Hearts',
      collected: 0,
      target: 80,
      status: 'Đang mở đăng ký'
    },
    {
      id: 3,
      date: '28 tháng 12, 2025',
      time: '08:00 - 17:00',
      location: 'Trung tâm Cộng đồng Arise Hearts',
      collected: 0,
      target: 120,
      status: 'Sắp công bố'
    }
  ]

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-']

  const handleDonorChange = (e) => {
    const { name, value } = e.target
    setDonorFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleDonorSubmit = async (e) => {
    e.preventDefault()
    
    if (!donorFormData.donorName || !donorFormData.donorEmail || !donorFormData.donorPhone || 
        !donorFormData.bloodType || !donorFormData.preferredEventDate) {
      showNotification('Vui lòng điền đầy đủ thông tin', 'error')
      return
    }

    setSubmitting(true)
    try {
      const response = await registerBloodDonation(donorFormData)
      
      if (response.success) {
        setShowDonorConfirmation(true)
        showNotification('Đăng ký hiến máu thành công! Chúng tôi sẽ liên hệ sớm.', 'success')
        
        setTimeout(() => {
          setShowDonorConfirmation(false)
          setDonorFormData({
            donorName: '',
            donorEmail: '',
            donorPhone: '',
            bloodType: '',
            preferredEventDate: '',
            medicalHistory: ''
          })
        }, 3000)
        
        fetchStatistics()
      } else {
        showNotification(response.error, 'error')
      }
    } catch (error) {
      showNotification('Đăng ký hiến máu thất bại', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: 'easeOut',
      },
    }),
    hover: {
      y: -5,
      boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
      transition: { duration: 0.3 },
    },
  }

  const eventCardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: i * 0.1,
        ease: 'easeOut',
      },
    }),
    hover: {
      y: -10,
      boxShadow: '0 20px 40px rgba(220, 38, 38, 0.2)',
      transition: { duration: 0.3 },
    },
  }

  return (
    <div className="blood-donation-page">
      {/* Header */}
      <div className="blood-header" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&h=400&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="blood-header-overlay"></div>
        <div className="blood-header-content">
          <h1>Chiến Dịch Hiến Máu</h1>
          <p>Cứu sống sinh mạng thông qua việc hiến máu nhân đạo</p>
        </div>
      </div>

      {/* Importance Section */}
      <section className="importance-section">
        <div className="container">
          <h2 className="section-title">
            Tại Sao Hiến Máu Lại Quan Trọng
          </h2>
          
          <div className="importance-grid">
            {[
              { icon: '🩸', title: 'Cứu Sống Sinh Mạng', desc: 'Một lần hiến máu có thể cứu tới ba người.' },
              { icon: '❤️', title: 'Trao Niềm Hy Vọng', desc: 'Sự hiến máu của bạn mang đến cơ hội sống thứ hai cho bệnh nhân.' },
              { icon: '🏥', title: 'Dự trữ Thiết yếu', desc: 'Bệnh viện phụ thuộc vào nguồn cung cấp máu ổn định.' },
              { icon: '🌍', title: 'Sức Khỏe Cộng Đồng', desc: 'Tăng cường cơ sở hạ tầng y tế của cộng đồng.' },
            ].map((item, i) => (
              <div 
                key={i} 
                className="importance-card"
              >
                <div className="importance-icon">{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor Registration Section */}
      <section className="donor-section">
        <div className="container">
          <div className="donor-main-grid">
            {/* Left Sidebar - Info Cards */}
            <div className="donor-sidebar">
              <div className="donor-info-cards">
                {[
                  {
                    title: '📋 Yêu Cầu Điều Kiện',
                    items: [
                      'Tuổi: Từ 18-65 tuổi',
                      'Cân nặng: Tối thiểu 45 kg',
                      'Sức khỏe tốt',
                      'Chưa hiến máu trong 3 tháng qua',
                      'Cần giấy tờ tùy thân hợp lệ'
                    ]
                  },
                  {
                    title: '⏱️ Quy Trình Diễn Ra',
                    items: [
                      'Khám sàng lọc sức khỏe (5-10 phút)',
                      'Quy trình hiến máu (5-15 phút)',
                      'Nghỉ ngơi và bổ sung (10-15 phút)',
                      'Bữa ăn trưa miễn phí & giấy chứng nhận'
                    ]
                  }
                ].map((card, i) => (
                  <div 
                    key={i}
                    className="info-card"
                  >
                    <h3>{card.title}</h3>
                    <ul>
                      {card.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Form */}
            <div className="donor-content">
              {/* Form */}
              <div 
                className="donor-form-wrapper"
              >
                <h2>Đăng Ký Làm Người Hiến Máu</h2>
                
                <form onSubmit={handleDonorSubmit} className="form">
                <div className="form-group">
                  <label className="form-label">Họ và tên *</label>
                  <input
                    type="text"
                    name="donorName"
                    value={donorFormData.donorName}
                    onChange={handleDonorChange}
                    placeholder="Tên của bạn"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    name="donorEmail"
                    value={donorFormData.donorEmail}
                    onChange={handleDonorChange}
                    placeholder="email@example.com"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Số điện thoại *</label>
                  <input
                    type="tel"
                    name="donorPhone"
                    value={donorFormData.donorPhone}
                    onChange={handleDonorChange}
                    placeholder="+84 123 456 789"
                    required
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Nhóm máu *</label>
                  <select
                    name="bloodType"
                    value={donorFormData.bloodType}
                    onChange={handleDonorChange}
                    required
                    className="form-select"
                  >
                    <option value="">Chọn nhóm máu của bạn</option>
                    {bloodTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tiền sử bệnh lý (nếu có)</label>
                  <textarea
                    name="medicalHistory"
                    value={donorFormData.medicalHistory}
                    onChange={handleDonorChange}
                    placeholder="Ghi chú về tình trạng sức khỏe..."
                    className="form-input"
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ngày mong muốn hiến máu *</label>
                  <input
                    type="date"
                    name="preferredEventDate"
                    value={donorFormData.preferredEventDate}
                    onChange={handleDonorChange}
                    required
                    className="form-input"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-secondary"
                  >
                    Đăng ký hiến máu
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Confirmation Popup */}
      {showDonorConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <div className="confirmation-icon">
              ✓
            </div>
            <h2>Cảm ơn bạn!</h2>
            <p>Chúng tôi biết ơn sự sẵn lòng cứu sống sinh mạng của bạn.</p>
            <p>Email xác nhận đã được gửi đến <strong>{donorFormData.email}</strong></p>
            <p className="confirmation-message">Hẹn gặp bạn tại chiến dịch hiến máu!</p>
          </div>
        </div>
      )}
    </div>
  )
}

