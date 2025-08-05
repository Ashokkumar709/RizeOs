import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import axios from 'axios'
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Star,
  MapPin,
  Clock,
  ArrowRight,
  Zap
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const { connected, balance } = useWallet()
  const [stats, setStats] = useState({
    totalJobs: 0,
    appliedJobs: 0,
    profileViews: 0,
    matchScore: 0
  })
  const [recentJobs, setRecentJobs] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [jobsRes, recommendationsRes] = await Promise.all([
        axios.get('/api/jobs?limit=5'),
        axios.get('/api/jobs/recommendations')
      ])
      
      setRecentJobs(jobsRes.data.jobs || [])
      setRecommendations(recommendationsRes.data.recommendations || [])
      
      // Mock stats for demo
      setStats({
        totalJobs: jobsRes.data.total || 0,
        appliedJobs: Math.floor(Math.random() * 10),
        profileViews: Math.floor(Math.random() * 100) + 50,
        matchScore: Math.floor(Math.random() * 30) + 70
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening in your professional network
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-100 rounded-lg">
                <Briefcase className="w-6 h-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Available Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalJobs}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Profile Views</p>
                <p className="text-2xl font-bold text-gray-900">{stats.profileViews}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Match Score</p>
                <p className="text-2xl font-bold text-gray-900">{stats.matchScore}%</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Wallet Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {connected ? `${balance.toFixed(3)} SOL` : 'Not Connected'}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Jobs */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Job Postings</h2>
                <Link
                  to="/jobs"
                  className="text-primary-600 hover:text-primary-700 font-medium flex items-center"
                >
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="space-y-4">
                {recentJobs.length > 0 ? (
                  recentJobs.map((job) => (
                    <div key={job._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">{job.title}</h3>
                          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{job.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <DollarSign className="w-4 h-4 mr-1" />
                              ${job.budget || job.salary}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location || 'Remote'}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                          </span>
                        </div>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {job.skills?.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag text-xs">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No jobs available yet</p>
                    <Link to="/post-job" className="text-primary-600 hover:text-primary-700 font-medium">
                      Post the first job
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Recommendations */}
            <div className="card">
              <div className="flex items-center mb-4">
                <Zap className="w-5 h-5 text-yellow-500 mr-2" />
                <h3 className="font-bold text-gray-900">AI Recommendations</h3>
              </div>
              
              {recommendations.length > 0 ? (
                <div className="space-y-3">
                  {recommendations.slice(0, 3).map((rec, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{rec.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{rec.reason}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${rec.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">{rec.matchScore}% match</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">Complete your profile to get AI recommendations</p>
                  <Link to="/profile" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Update Profile
                  </Link>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/post-job"
                  className="block w-full btn-primary text-center"
                >
                  Post a Job
                </Link>
                <Link
                  to="/profile"
                  className="block w-full btn-secondary text-center"
                >
                  Update Profile
                </Link>
                <Link
                  to="/feed"
                  className="block w-full btn-secondary text-center"
                >
                  View Network Feed
                </Link>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">Profile Strength</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Overall</span>
                  <span className="text-sm font-medium text-gray-900">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>✅ Basic info completed</p>
                  <p>✅ Skills added</p>
                  <p>❌ Portfolio/LinkedIn missing</p>
                  <p>❌ Wallet not connected</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard