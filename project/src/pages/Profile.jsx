import React, { useState, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { 
  User, 
  Mail, 
  MapPin, 
  Link as LinkIcon, 
  Edit3, 
  Save, 
  X,
  Upload,
  Zap,
  Wallet
} from 'lucide-react'
import toast from 'react-hot-toast'

const Profile = () => {
  const { user, updateProfile } = useAuth()
  const { wallet, connected, connectWallet } = useWallet()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [extractingSkills, setExtractingSkills] = useState(false)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    linkedinUrl: user?.linkedinUrl || '',
    skills: user?.skills || [],
    walletAddress: user?.walletAddress || ''
  })

  const [newSkill, setNewSkill] = useState('')

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

  const handleFileUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    setExtractingSkills(true)
    
    try {
      const formDataUpload = new FormData()
      formDataUpload.append('resume', file)
      
      // Mock AI skill extraction for demo
      setTimeout(() => {
        const mockSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Machine Learning']
        const newSkills = mockSkills.filter(skill => !formData.skills.includes(skill))
        
        if (newSkills.length > 0) {
          setFormData({
            ...formData,
            skills: [...formData.skills, ...newSkills]
          })
          toast.success(`Extracted ${newSkills.length} new skills from your resume!`)
        } else {
          toast.info('No new skills found in your resume')
        }
        setExtractingSkills(false)
      }, 2000)
      
    } catch (error) {
      toast.error('Failed to extract skills from resume')
      setExtractingSkills(false)
    }
  }

  const handleSave = async () => {
    setLoading(true)
    
    const profileData = {
      ...formData,
      walletAddress: connected ? wallet?.toString() : ''
    }
    
    const result = await updateProfile(profileData)
    
    if (result.success) {
      setEditing(false)
    }
    
    setLoading(false)
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      linkedinUrl: user?.linkedinUrl || '',
      skills: user?.skills || [],
      walletAddress: user?.walletAddress || ''
    })
    setEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center space-x-2 btn-secondary"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-2 btn-primary disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{loading ? 'Saving...' : 'Save'}</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-2 btn-secondary"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Profile Picture & Basic Info */}
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {formData.name.charAt(0).toUpperCase() || 'U'}
              </div>
              
              <div className="flex-1">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    {editing ? (
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                      />
                    ) : (
                      <p className="text-gray-900 font-medium">{formData.name || 'Not provided'}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {formData.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="input-field"
                  placeholder="Tell us about yourself, your experience, and what you're looking for..."
                />
              ) : (
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                  {formData.bio || 'No bio provided yet. Add a bio to help others understand your background and interests.'}
                </p>
              )}
            </div>

            {/* Location & LinkedIn */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                {editing ? (
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="e.g., San Francisco, CA"
                  />
                ) : (
                  <p className="text-gray-700 flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {formData.location || 'Not specified'}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LinkedIn URL
                </label>
                {editing ? (
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                ) : (
                  <div className="flex items-center">
                    <LinkIcon className="w-4 h-4 mr-2 text-gray-400" />
                    {formData.linkedinUrl ? (
                      <a
                        href={formData.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        View LinkedIn Profile
                      </a>
                    ) : (
                      <span className="text-gray-500">Not provided</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Wallet Connection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Web3 Wallet
              </label>
              <div className="flex items-center space-x-4">
                {connected ? (
                  <div className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg">
                    <Wallet className="w-4 h-4" />
                    <span className="font-medium">Connected</span>
                    <span className="text-sm">
                      {wallet?.toString().slice(0, 8)}...{wallet?.toString().slice(-8)}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={connectWallet}
                    className="flex items-center space-x-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Connect Phantom Wallet</span>
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Connect your wallet to receive payments and post jobs
              </p>
            </div>

            {/* Skills Section */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Skills
                </label>
                {editing && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept=".pdf"
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={extractingSkills}
                      className="flex items-center space-x-1 text-sm bg-yellow-100 text-yellow-700 px-3 py-1 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50"
                    >
                      {extractingSkills ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                          <span>Extracting...</span>
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4" />
                          <span>AI Extract from Resume</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
              
              {editing && (
                <div className="flex items-center space-x-2 mb-4">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                    className="input-field flex-1"
                    placeholder="Add a skill..."
                  />
                  <button
                    onClick={handleAddSkill}
                    className="btn-primary"
                  >
                    Add
                  </button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {formData.skills.length > 0 ? (
                  formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className={`skill-tag ${editing ? 'pr-1' : ''}`}
                    >
                      {skill}
                      {editing && (
                        <button
                          onClick={() => handleRemoveSkill(skill)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          ×
                        </button>
                      )}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500 italic">
                    No skills added yet. {editing ? 'Add some skills to showcase your expertise!' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Profile Completion */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3">Profile Completion</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-primary-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <div className="text-xs text-gray-500 mt-3 space-y-1">
                  <p className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Basic information completed
                  </p>
                  <p className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    Skills added ({formData.skills.length} skills)
                  </p>
                  <p className="flex items-center">
                    <span className={`mr-2 ${formData.bio ? 'text-green-500' : 'text-gray-400'}`}>
                      {formData.bio ? '✓' : '○'}
                    </span>
                    Professional bio {formData.bio ? 'completed' : 'missing'}
                  </p>
                  <p className="flex items-center">
                    <span className={`mr-2 ${connected ? 'text-green-500' : 'text-gray-400'}`}>
                      {connected ? '✓' : '○'}
                    </span>
                    Wallet {connected ? 'connected' : 'not connected'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile