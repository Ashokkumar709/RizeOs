import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowRight, Briefcase, Users, Zap, Shield, Globe, TrendingUp } from 'lucide-react'

const Home = () => {
  const { user } = useAuth()

  const features = [
    {
      icon: <Briefcase className="w-8 h-8 text-primary-600" />,
      title: "Smart Job Matching",
      description: "AI-powered matching connects you with perfect opportunities based on your skills and preferences."
    },
    {
      icon: <Shield className="w-8 h-8 text-primary-600" />,
      title: "Web3 Payments",
      description: "Secure, transparent payments through blockchain technology. No intermediaries, no delays."
    },
    {
      icon: <Users className="w-8 h-8 text-primary-600" />,
      title: "Professional Network",
      description: "Build meaningful connections with professionals in your industry and beyond."
    },
    {
      icon: <Zap className="w-8 h-8 text-primary-600" />,
      title: "AI-Enhanced Profiles",
      description: "Automatically extract skills from resumes and get intelligent career recommendations."
    },
    {
      icon: <Globe className="w-8 h-8 text-primary-600" />,
      title: "Global Opportunities",
      description: "Access remote work opportunities from companies worldwide, paid in cryptocurrency."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-primary-600" />,
      title: "Career Growth",
      description: "Track your progress, get skill recommendations, and advance your career with data-driven insights."
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              The Future of Work is
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                Decentralized
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-3xl mx-auto animate-slide-up">
              Connect, collaborate, and get paid in the Web3 economy. AI-powered job matching meets blockchain payments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              {user ? (
                <Link
                  to="/dashboard"
                  className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/login"
                    className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose JobNet?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the next generation of professional networking with cutting-edge technology
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="card hover:shadow-lg transition-shadow duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-4xl font-bold text-primary-600 mb-2">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="text-4xl font-bold text-primary-600 mb-2">5K+</div>
              <div className="text-gray-600">Jobs Posted</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Match Accuracy</div>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <div className="text-4xl font-bold text-primary-600 mb-2">$2M+</div>
              <div className="text-gray-600">Paid Out</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl mb-8 text-primary-100">
            Join thousands of professionals who are already building their future in the Web3 economy
          </p>
          {!user && (
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center"
            >
              Start Your Journey
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home