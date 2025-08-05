import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import { WalletProvider } from './contexts/WalletContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Jobs from './pages/Jobs'
import PostJob from './pages/PostJob'
import Feed from './pages/Feed'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/jobs" element={
                  <ProtectedRoute>
                    <Jobs />
                  </ProtectedRoute>
                } />
                <Route path="/post-job" element={
                  <ProtectedRoute>
                    <PostJob />
                  </ProtectedRoute>
                } />
                <Route path="/feed" element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
            <Toaster position="top-right" />
          </div>
        </WalletProvider>
      </AuthProvider>
    </Router>
  )
}

export default App