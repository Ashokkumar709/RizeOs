import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useWallet } from '../contexts/WalletContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  FileText, 
  Tag,
  Wallet,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

const PostJob = () => {
  const navigate = useNavigate()
  const { connected, sendPayment, connectWallet } = useWallet()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
    location: '',
    skills: [],
    jobType: 'full-time',
    experienceLevel: 'intermediate'
  })
  
  const [newSkill, setNewSkill] = useState('')
  const [loading, setLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleAddSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      })
      setNewSkill('')
    }
  }

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    })
  }

  const handlePayment = async () => {
    if (!connected) {
      toast.error('Please connect your wallet first')
      return
    }

    setLoading(true)
    
    try {
      const result = await sendPayment(0.01) // 0.01 SOL platform fee
      
      if (result.success) {
        setPaymentComplete(true)
        toast.success('Payment successful! You can now post your job.')
      } else {
        toast.error('Payment failed. Please try again.')
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!paymentComplete) {
      setPaymentStep(true)
      return
    }

    setLoading(true)
    
    try {
      await axios.post('/api/jobs', formData)
      toast.success('Job posted successfully!')
      navigate('/jobs')
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to post job'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Briefcase className="w-6 h-6 mr-2 text-primary-600" />
              Post a New Job
            </h1>
            <p className="text-gray-600 mt-1">
              Find the perfect candidate for your project
            </p>
          </div>

          {/* Payment Step */}
          {paymentStep && !paymentComplete && (
            <div className="px-6 py-4 bg-yellow-50 border-b border-yellow-200">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-medium text-yellow-800">Payment Required</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    To post a job, you need to pay a platform fee of 0.01 SOL (~$2) to prevent spam and ensure quality listings.
                  </p>
                  <div className="mt-3 flex items-center space-x-3">
                    {!connected ? (
                      <button
                        onClick={connectWallet}
                        className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Connect Wallet</span>
                      </button>
                    ) : (
                      <button
                        onClick={handlePayment}
                        disabled={loading}
                        className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                      >
                        <DollarSign className="w-4 h-4" />
                        <span>{loading ? 'Processing...' : 'Pay 0.01 SOL'}</span>
                      </button>
                    )}
                    <button
                      onClick={() => setPaymentStep(false)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Complete */}
          {paymentComplete && (
            <div className="px-6 py-4 bg-green-50 border-b border-green-200">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <h3 className="font-medium text-green-800">Payment Successful!</h3>
                  <p className="text-green-700 text-sm">
                    You can now complete and submit your job posting.
                  </p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Senior React Developer"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="input-field"
                placeholder="Describe the role, responsibilities, requirements, and what makes this opportunity exciting..."
              />
            </div>

            {/* Budget and Location */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget (USD) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    required
                    className="input-field pl-10"
                    placeholder="5000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field pl-10"
                    placeholder="Remote, San Francisco, etc."
                  />
                </div>
              </div>
            </div>

            {/* Job Type and Experience Level */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Type
                </label>
                <select
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="contract">Contract</option>
                  <option value="freelance">Freelance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience Level
                </label>
                <select
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="entry">Entry Level</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="senior">Senior</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Required Skills
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                    className="input-field pl-10"
                    placeholder="Add a skill..."
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="skill-tag pr-1"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 text-primary-600 hover:text-primary-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/jobs')}
                className="btn-secondary"
              >
                Cancel
              </button>
              
              {!paymentStep ? (
  <button
    type="submit"
    disabled={loading}
    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Processing...' : 'Continue to Payment'}
  </button>
) : !paymentComplete ? (
  <button
    type="button"
    onClick={handlePayment}
    disabled={loading}
    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Processing Payment...' : 'Pay 0.01 SOL'}
  </button>
) : (
  <button
    type="submit"
    disabled={loading}
    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {loading ? 'Posting...' : 'Post Job'}
  </button>
)}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PostJob