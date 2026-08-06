import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute.jsx'
import DashboardPage from '../../pages/dashboard/DashboardPage.jsx'
import HomePage from '../../pages/home/HomePage.jsx'
import LoginPage from '../../pages/auth/LoginPage.jsx'
import RegisterPage from '../../pages/auth/RegisterPage.jsx'
import NotFoundPage from '../../pages/NotFoundPage.jsx'

export default function AppRouter() {
  return <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
}
