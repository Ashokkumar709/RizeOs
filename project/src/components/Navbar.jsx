import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { Briefcase, User, LogOut, Wallet, Home, Users, PlusCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const Navbar = () => {
  const { user, logout } = useAuth()
  const { wallet, connected, connectWallet, disconnectWallet, balance } = useWallet()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">JobNet</span>
          </Link>

          {/* Navigation Links */}
          {user && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/dashboard')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              
              <Link
                to="/jobs"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/jobs')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
              </Link>
              
              <Link
                to="/feed"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/feed')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Feed</span>
              </Link>
              
              <Link
                to="/post-job"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive('/post-job')
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Post Job</span>
              </Link>
            </div>
          )}

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Wallet Connection */}
                <div className="flex items-center space-x-2">
                  {connected ? (
                    <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1 rounded-lg">
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {balance.toFixed(3)} SOL
                      </span>
                      <button
                        onClick={disconnectWallet}
                        className="text-green-600 hover:text-green-800 ml-2"
                        title="Disconnect Wallet"
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={connectWallet}
                      className="flex items-center space-x-1 bg-purple-100 text-purple-700 px-3 py-1 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Wallet className="w-4 h-4" />
                      <span className="text-sm font-medium">Connect Wallet</span>
                    </button>
                  )}
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                  >
                    <div className="profile-avatar text-sm">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:block font-medium">{user.name}</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar