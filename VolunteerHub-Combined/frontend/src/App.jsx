import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import './styles/ColorScheme.css'
import './styles/ProfessionalLayout.css'
import './styles/animations.css'
import './styles/Auth.css'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { NotificationProvider } from './contexts/NotificationContext'

// Import public pages (landing page)
import Header from './components/Header'
import AuthModal from './components/AuthModal'
import Hero from './pages/Hero'
import MembershipForm from './pages/MembershipForm'
import BloodDonation from './pages/BloodDonation'
import About from './pages/About'
import TestimonialSlider from './components/ui/TestimonialSlider'
import Footer from './components/Footer'

// Import auth pages
import OAuthCallback from './pages/auth/OAuthCallback'

// Import dashboard & volunteer pages
import Dashboard from './components/dashboard/Dashboard'
import EventPosts from './components/post/EventPosts'
import EventsVolunteer from './pages/volunteer/EventsVolunteer'
import History from './pages/volunteer/History'
import Notification from './pages/volunteer/Notification'

// Import manager pages
import EventManagement from './pages/manager/EventManagement'
import VolunteerApproval from './pages/manager/VolunteerApproval'
import VolunteerList from './pages/manager/VolunteerList'
import VolunteerCompleted from './pages/manager/VolunteerCompleted'

// Import admin pages
import EventApproval from './pages/admin/EventApproval'
import UserManagement from './pages/admin/UserManagement'

// Import NotFound
import NotFound from './pages/notfound/NotFound'

// Landing page component (public)
function LandingPage() {
  const [currentSection, setCurrentSection] = useState('home')

  const scrollToSection = (sectionId) => {
    setCurrentSection(sectionId)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'sukien', 'member', 'blood', 'aboutus', 'contact']
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setCurrentSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white">
      {/* Auth Modal */}
      <AuthModal />

      {/* Header */}
      <Header currentSection={currentSection} setCurrentPage={scrollToSection} currentPage={currentSection} />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section id="home">
          <Hero />
        </section>

        {/* Membership Section */}
        <section id="member">
          <MembershipForm />
        </section>

        {/* Blood Donation Section */}
        <section id="blood">
          <BloodDonation />
        </section>

        {/* About Section */}
        <About />

        {/* Testimonials Section */}
        <TestimonialSlider />

        {/* Contact/Footer Section */}
        <section id="contact">
          <Footer />
        </section>
      </main>
    </div>
  )
}

// Protected route component
function ProtectedRoute({ children }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

// Role-based route component
function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

// App Router
function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected Routes - Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/eventPosts" 
        element={
          <ProtectedRoute>
            <EventPosts />
          </ProtectedRoute>
        } 
      />

      {/* Volunteer Routes */}
      <Route 
        path="/events" 
        element={
          <ProtectedRoute>
            <EventsVolunteer />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/history" 
        element={
          <ProtectedRoute>
            <History />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/notification" 
        element={
          <ProtectedRoute>
            <Notification />
          </ProtectedRoute>
        } 
      />

      {/* Manager Routes */}
      <Route 
        path="/manager/events" 
        element={
          <RoleRoute allowedRoles={['manager']}>
            <EventManagement />
          </RoleRoute>
        } 
      />
      <Route 
        path="/manager/approve" 
        element={
          <RoleRoute allowedRoles={['manager']}>
            <VolunteerApproval />
          </RoleRoute>
        } 
      />
      <Route 
        path="/manager/volunteerList" 
        element={
          <RoleRoute allowedRoles={['manager']}>
            <VolunteerList />
          </RoleRoute>
        } 
      />
      <Route 
        path="/manager/volunteerCompleted" 
        element={
          <RoleRoute allowedRoles={['manager']}>
            <VolunteerCompleted />
          </RoleRoute>
        } 
      />

      {/* Admin Routes */}
      <Route 
        path="/admin/users" 
        element={
          <RoleRoute allowedRoles={['admin']}>
            <UserManagement />
          </RoleRoute>
        } 
      />
      <Route 
        path="/admin/events" 
        element={
          <RoleRoute allowedRoles={['admin']}>
            <EventApproval />
          </RoleRoute>
        } 
      />

      {/* Not Found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRouter />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
