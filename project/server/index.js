import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import natural from 'natural'
import compromise from 'compromise'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/jobnet'

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: String,
  location: String,
  linkedinUrl: String,
  skills: [String],
  walletAddress: String,
  profileViews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)

// Job Schema
const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  location: String,
  skills: [String],
  jobType: { type: String, enum: ['full-time', 'part-time', 'contract', 'freelance'], default: 'full-time' },
  experienceLevel: { type: String, enum: ['entry', 'intermediate', 'senior', 'expert'], default: 'intermediate' },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
  paymentTxHash: String,
  createdAt: { type: Date, default: Date.now }
})

const Job = mongoose.model('Job', jobSchema)

// Post Schema
const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
  comments: [{ 
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    content: String,
    createdAt: { type: Date, default: Date.now }
  }],
  shares: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

const Post = mongoose.model('Post', postSchema)

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access token required' })
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// AI/NLP Helper Functions
const extractSkillsFromText = (text) => {
  const skillKeywords = [
    'javascript', 'python', 'java', 'react', 'node.js', 'angular', 'vue.js',
    'html', 'css', 'typescript', 'php', 'ruby', 'go', 'rust', 'swift',
    'kotlin', 'c++', 'c#', 'sql', 'mongodb', 'postgresql', 'mysql',
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git', 'linux',
    'machine learning', 'ai', 'data science', 'blockchain', 'web3',
    'solidity', 'smart contracts', 'defi', 'nft', 'ethereum', 'solana'
  ]

  const doc = compromise(text.toLowerCase())
  const extractedSkills = []

  skillKeywords.forEach(skill => {
    if (text.toLowerCase().includes(skill)) {
      extractedSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1))
    }
  })

  return [...new Set(extractedSkills)]
}

const calculateJobMatch = (userSkills, jobSkills) => {
  if (!userSkills.length || !jobSkills.length) return 0
  
  const userSkillsLower = userSkills.map(s => s.toLowerCase())
  const jobSkillsLower = jobSkills.map(s => s.toLowerCase())
  
  const matches = userSkillsLower.filter(skill => 
    jobSkillsLower.some(jobSkill => 
      jobSkill.includes(skill) || skill.includes(jobSkill)
    )
  )
  
  return Math.round((matches.length / jobSkillsLower.length) * 100)
}

// Routes

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword
    })

    await user.save()

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        skills: user.skills,
        walletAddress: user.walletAddress
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        skills: user.skills,
        walletAddress: user.walletAddress
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        skills: user.skills,
        walletAddress: user.walletAddress
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, bio, location, linkedinUrl, skills, walletAddress } = req.body

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { name, bio, location, linkedinUrl, skills, walletAddress },
      { new: true }
    ).select('-password')

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        linkedinUrl: user.linkedinUrl,
        skills: user.skills,
        walletAddress: user.walletAddress
      }
    })
  } catch (error) {
    console.error('Profile update error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Job Routes
app.get('/api/jobs', async (req, res) => {
  try {
    const { limit = 10, page = 1, search, location, minBudget, skills } = req.query
    
    let query = { status: 'active' }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $in: [new RegExp(search, 'i')] } }
      ]
    }
    
    if (location) {
      query.location = { $regex: location, $options: 'i' }
    }
    
    if (minBudget) {
      query.budget = { $gte: parseInt(minBudget) }
    }
    
    if (skills) {
      query.skills = { $in: [new RegExp(skills, 'i')] }
    }

    const jobs = await Job.find(query)
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await Job.countDocuments(query)

    res.json({
      jobs,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    })
  } catch (error) {
    console.error('Get jobs error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, description, budget, location, skills, jobType, experienceLevel } = req.body

    const job = new Job({
      title,
      description,
      budget,
      location,
      skills,
      jobType,
      experienceLevel,
      postedBy: req.user.userId
    })

    await job.save()
    await job.populate('postedBy', 'name')

    res.status(201).json({
      message: 'Job posted successfully',
      job
    })
  } catch (error) {
    console.error('Post job error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.get('/api/jobs/recommendations', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
    if (!user || !user.skills.length) {
      return res.json({ recommendations: [] })
    }

    const jobs = await Job.find({ status: 'active' })
      .populate('postedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(20)

    const recommendations = jobs.map(job => {
      const matchScore = calculateJobMatch(user.skills, job.skills)
      return {
        ...job.toObject(),
        matchScore,
        reason: `Matches ${matchScore}% of your skills`
      }
    }).filter(job => job.matchScore > 30)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5)

    res.json({ recommendations })
  } catch (error) {
    console.error('Get recommendations error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Post Routes
app.get('/api/posts', async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query

    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    res.json({ posts })
  } catch (error) {
    console.error('Get posts error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/posts', authenticateToken, async (req, res) => {
  try {
    const { content } = req.body

    const post = new Post({
      content,
      author: req.user.userId
    })

    await post.save()
    await post.populate('author', 'name')

    res.status(201).json({
      message: 'Post created successfully',
      post
    })
  } catch (error) {
    console.error('Create post error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

app.post('/api/posts/:id/like', authenticateToken, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    )

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.json({ message: 'Post liked', post })
  } catch (error) {
    console.error('Like post error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// AI Routes
app.post('/api/ai/extract-skills', authenticateToken, async (req, res) => {
  try {
    const { text } = req.body
    
    if (!text) {
      return res.status(400).json({ message: 'Text is required' })
    }

    const extractedSkills = extractSkillsFromText(text)
    
    res.json({
      skills: extractedSkills,
      message: `Extracted ${extractedSkills.length} skills`
    })
  } catch (error) {
    console.error('Skill extraction error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})