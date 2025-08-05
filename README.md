# JobNet - Web3 Job & Networking Portal

A full-stack Web3-powered job and networking platform that combines traditional job posting with blockchain payments and AI-enhanced features.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based secure login/registration
- **Profile Management**: Complete user profiles with skills, bio, and wallet integration
- **Job Posting & Browsing**: Post jobs with Web3 payment requirements
- **Social Feed**: Professional networking with posts, likes, and comments
- **Advanced Search**: Filter jobs by skills, location, budget, and more

### Web3 Integration
- **Phantom Wallet Connection**: Seamless Solana wallet integration
- **Blockchain Payments**: Pay platform fees in SOL before posting jobs
- **Transparent Transactions**: All payments recorded on Solana devnet
- **Wallet-based Authentication**: Connect Web3 identity to profile

### AI Features
- **Smart Job Matching**: AI-powered job recommendations based on user skills
- **Skill Extraction**: Automatically extract skills from resumes/text
- **Match Scoring**: Calculate compatibility between jobs and candidates
- **Intelligent Suggestions**: Personalized career recommendations

## 🛠 Tech Stack

### Frontend
- **React 18** with modern hooks and context
- **Tailwind CSS** for responsive, beautiful UI
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Axios** for API communication

### Backend
- **Node.js & Express** RESTful API
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **bcryptjs** password hashing
- **Natural & Compromise** for NLP processing

### Web3
- **Solana Web3.js** for blockchain interaction
- **Phantom Wallet** integration
- **Devnet** for testing (easily switchable to mainnet)

### AI/ML
- **Natural Language Processing** for skill extraction
- **Custom matching algorithms** for job recommendations
- **Text analysis** for profile enhancement

## 🏗 Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Phantom Wallet browser extension

### 1. Clone Repository
```bash
git clone <repository-url>
cd job-networking-portal
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/jobnet
JWT_SECRET=your-super-secret-jwt-key-here
PORT=5000
SOLANA_NETWORK=devnet
ADMIN_WALLET_ADDRESS=your-admin-wallet-address-here
```

### 4. Start Development Servers
```bash
# Start both frontend and backend
npm run dev:full

# Or start separately
npm run server  # Backend on :5000
npm run dev     # Frontend on :5173
```

## 🌐 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Render/Railway)
```bash
# Set environment variables
# Deploy with npm run server
```

### Database
- MongoDB Atlas for production
- Local MongoDB for development

## 💰 Web3 Payment Flow

1. **Connect Wallet**: User connects Phantom wallet
2. **Job Posting**: User creates job post
3. **Payment Required**: System prompts for 0.01 SOL platform fee
4. **Transaction**: Payment sent to admin wallet on Solana devnet
5. **Confirmation**: Job posted after successful payment
6. **Transparency**: All transactions visible on blockchain

## 🤖 AI Features

### Job Matching Algorithm
```javascript
const calculateJobMatch = (userSkills, jobSkills) => {
  // Fuzzy matching with skill synonyms
  // Returns percentage match score
}
```

### Skill Extraction
```javascript
const extractSkillsFromText = (text) => {
  // NLP processing to identify technical skills
  // Returns array of relevant skills
}
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Jobs
- `GET /api/jobs` - List jobs with filters
- `POST /api/jobs` - Create new job (requires payment)
- `GET /api/jobs/recommendations` - AI job recommendations

### Social
- `GET /api/posts` - Get feed posts
- `POST /api/posts` - Create new post
- `POST /api/posts/:id/like` - Like a post

### AI
- `POST /api/ai/extract-skills` - Extract skills from text

## 🎯 Go-to-Market Strategy

### Target Users
- **Freelancers & Contractors**: Seeking Web3-native payment solutions
- **Startups**: Looking for blockchain/AI talent
- **Remote Workers**: Wanting global opportunities with crypto payments

### 3-Month Roadmap (10K Users)
1. **Month 1**: Launch MVP, onboard 100 beta users
2. **Month 2**: Add advanced features, reach 1K users
3. **Month 3**: Marketing push, partnerships, 10K users

### Marketing (₹5,000 Budget)
- **Social Media**: Twitter/LinkedIn organic content
- **Community**: Engage in Web3/developer communities
- **Content**: Technical blogs and tutorials
- **Partnerships**: Collaborate with Web3 projects

### Revenue Streams
1. **Platform Fees**: ₹150/job posting
2. **Premium Subscriptions**: ₹500/month for advanced features
3. **Featured Listings**: ₹300/month for job highlighting
4. **Commission**: 2.5% on completed projects

## 🔒 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** with bcrypt
- **Input Validation** and sanitization
- **CORS Protection** for API security
- **Wallet Verification** for Web3 transactions

## 🧪 Testing

### Manual Testing
1. Register new account
2. Complete profile with skills
3. Connect Phantom wallet
4. Post a job (requires payment)
5. Browse and filter jobs
6. Create social posts
7. Test AI recommendations

### Wallet Testing
- Use Solana devnet for testing
- Get devnet SOL from faucet
- Test payment transactions
- Verify blockchain confirmations

## 🚀 Future Enhancements

### Phase 2 Features
- **Smart Contracts**: On-chain escrow for payments
- **NFT Certificates**: Skill verification badges
- **DAO Governance**: Community-driven platform decisions
- **Multi-chain**: Ethereum and Polygon support

### Advanced AI
- **Resume Parsing**: PDF skill extraction
- **Interview Matching**: AI-powered candidate screening
- **Salary Prediction**: Market-rate recommendations
- **Career Pathways**: Personalized growth suggestions

## 📊 Analytics & Metrics

### Key Performance Indicators
- **User Growth**: Monthly active users
- **Job Success Rate**: Completed vs posted jobs
- **Payment Volume**: Total SOL processed
- **Match Accuracy**: AI recommendation success

### Tracking Implementation
- User engagement analytics
- Conversion funnel analysis
- Payment success rates
- Feature usage statistics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Solana Foundation** for Web3 infrastructure
- **OpenAI** for AI inspiration
- **React Team** for amazing frontend framework
- **MongoDB** for flexible database solution

---

**Built with ❤️ for the RizeOS Core Team Internship Assessment**

*Demonstrating full-stack development, Web3 integration, AI features, and product thinking skills.*
