import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import { 
  MessageCircle, 
  Heart, 
  Share2, 
  MoreHorizontal,
  Plus,
  Image,
  Send
} from 'lucide-react'
import toast from 'react-hot-toast'

const Feed = () => {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPost, setNewPost] = useState('')
  const [showNewPost, setShowNewPost] = useState(false)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await axios.get('/api/posts')
      setPosts(response.data.posts || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
      // Mock data for demo
      setPosts([
        {
          _id: '1',
          content: 'Just completed an amazing Web3 project! The future of decentralized applications is here. Excited to share more details soon. #Web3 #Blockchain #DeFi',
          author: {
            name: 'Sarah Chen',
            title: 'Blockchain Developer'
          },
          createdAt: new Date().toISOString(),
          likes: 24,
          comments: 8,
          shares: 3
        },
        {
          _id: '2',
          content: 'Looking for talented React developers to join our remote team. We offer competitive salaries, equity, and the chance to work on cutting-edge projects. DM me if interested!',
          author: {
            name: 'Mike Johnson',
            title: 'CTO at TechStart'
          },
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          likes: 18,
          comments: 12,
          shares: 5
        },
        {
          _id: '3',
          content: 'Just attended an incredible AI conference. The advancements in machine learning are mind-blowing. Here are my top 3 takeaways: 1) AI will transform every industry 2) Ethics in AI is crucial 3) The talent gap is real - we need more ML engineers!',
          author: {
            name: 'Dr. Emily Rodriguez',
            title: 'AI Research Scientist'
          },
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          likes: 45,
          comments: 15,
          shares: 8
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim()) return

    try {
      const response = await axios.post('/api/posts', { content: newPost })
      setPosts([response.data.post, ...posts])
      setNewPost('')
      setShowNewPost(false)
      toast.success('Post created successfully!')
    } catch (error) {
      toast.error('Failed to create post')
    }
  }

  const handleLike = async (postId) => {
    try {
      await axios.post(`/api/posts/${postId}/like`)
      setPosts(posts.map(post => 
        post._id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ))
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const postDate = new Date(dateString)
    const diffInHours = Math.floor((now - postDate) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
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
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Professional Feed</h1>
          <p className="text-gray-600 mt-2">
            Stay connected with your professional network
          </p>
        </div>

        {/* Create Post */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="profile-avatar text-sm">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              {!showNewPost ? (
                <button
                  onClick={() => setShowNewPost(true)}
                  className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Share an update with your network...
                </button>
              ) : (
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="What's on your mind?"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={4}
                  autoFocus
                />
              )}
            </div>
          </div>
          
          {showNewPost && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                  <Image className="w-5 h-5" />
                  <span>Photo</span>
                </button>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setShowNewPost(false)
                    setNewPost('')
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Post</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Posts */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* Post Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="profile-avatar text-sm">
                    {post.author?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{post.author?.name}</h3>
                    <p className="text-sm text-gray-600">{post.author?.title}</p>
                    <p className="text-xs text-gray-500">{formatTimeAgo(post.createdAt)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{post.content}</p>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-6">
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>{post.likes}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span>{post.comments}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <button className="btn-secondary">
            Load More Posts
          </button>
        </div>
      </div>
    </div>
  )
}

export default Feed