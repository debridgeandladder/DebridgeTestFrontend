import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import NewLandingPage from '@/pages/NewLandingPage.jsx'
import AdminLogin from '@/pages/AdminLogin.jsx'
import AdminDashboard from '@/pages/AdminDashboard.jsx'
import ProtectedRoute from '@/components/ProtectedRoute.jsx'
import './App.css'
import SuccessPage from '@/pages/SuccessPage.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NewLandingPage />} />
        <Route path="/new" element={<NewLandingPage />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  )
}

export default App

