import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Clock, 
  Briefcase,
  Star,
  Zap
} from 'lucide-react'

const Jobs = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    location: '',
    minBudget: '',
    skills: ''
  })
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchJobs()
  }, [])

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/jobs')
      setJobs(response.data.jobs || [])
    } catch (error) {
      console.error('Error fetching jobs:', error)
      // Mock data for demo
      setJobs([
        {
          _id: '1',
          title: 'Senior React Developer',
          description: 'We are looking for an experienced React developer to join our team and help build the next generation of web applications.',
          budget: 5000,
          location: 'Remote',
          skills: ['React', 'JavaScript', 'Node.js', 'TypeScript'],
          postedBy: { name: 'TechCorp Inc.' },
          createdAt: new Date().toISOString(),
          matchScore: 95
        },
        {
          _id: '2',
          title: 'Full Stack Web3 Developer',
          description: 'Join our blockchain startup to build decentralized applications using modern web technologies and smart contracts.',
          budget: 8000,
          location: 'San Francisco, CA',
          skills: ['Solidity', 'React', 'Web3.js', 'Smart Contracts'],
          postedBy: { name: 'BlockChain Innovations' },
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          matchScore: 88
        },
        {
          _id: '3',
          title: 'AI/ML Engineer',
          description: 'Work on cutting-edge machine learning projects and help build intelligent systems that make a difference.',
          budget: 7500,
          location: 'Remote',
          skills: ['Python', 'TensorFlow', 'Machine Learning', 'Data Science'],
          postedBy: { name: 'AI Solutions Ltd.' },
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          matchScore: 82
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesLocation = !filters.location || 
                           job.location.toLowerCase().includes(filters.location.toLowerCase())
    
    const matchesBudget = !filters.minBudget || 
                         job.budget >= parseInt(filters.minBudget)
    
    const matchesSkills = !filters.skills ||
                         job.skills.some(skill => 
                           skill.toLowerCase().includes(filters.skills.toLowerCase())
                         )
    
    return matchesSearch && matchesLocation && matchesBudget && matchesSkills
  })

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
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Job Opportunities</h1>
            <p className="text-gray-600 mt-2">
              Discover your next career opportunity in the Web3 economy
            </p>
          </div>
          <Link
            to="/post-job"
            className="btn-primary"
          >
            Post a Job
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs, skills, or companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="e.g., Remote, San Francisco"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Budget ($)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 1000"
                  value={filters.minBudget}
                  onChange={(e) => setFilters({...filters, minBudget: e.target.value})}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills
                </label>
                <input
                  type="text"
                  placeholder="e.g., React, Python"
                  value={filters.skills}
                  onChange={(e) => setFilters({...filters, skills: e.target.value})}
                  className="input-field"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
          </p>
          <select className="input-field w-auto">
            <option>Sort by: Most Recent</option>
            <option>Sort by: Highest Budget</option>
            <option>Sort by: Best Match</option>
          </select>
        </div>

        {/* Job Listings */}
        <div className="space-y-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      {job.matchScore && (
                        <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                          <Zap className="w-3 h-3" />
                          <span>{job.matchScore}% match</span>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                      <span className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        ${job.budget?.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {job.location}
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="w-4 h-4 mr-1" />
                        {job.postedBy?.name}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {job.skills?.map((skill, index) => (
                        <span key={index} className="skill-tag text-xs">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="ml-6 flex flex-col space-y-2">
                    <button className="btn-primary">
                      Apply Now
                    </button>
                    <button className="btn-secondary">
                      Save Job
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Link to="/post-job" className="btn-primary">
                Post the first job
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jobs