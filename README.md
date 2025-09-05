# Tesk Trak - Employee Productivity Tracking & Rewards System

A comprehensive web application for tracking employee productivity, generating monthly rankings, and managing a credit-based voucher rewards system.

## 🌟 Features

### Core Functionality
- **Employee Management**: Complete CRUD operations for employee profiles
- **Productivity Tracking**: Track various metrics including tasks, hours, quality scores, and attendance
- **Monthly Rankings**: Automated ranking system based on productivity scores
- **Credit System**: Award credits to top performers (1st: 1000, 2nd: 750, 3rd: 500)
- **Voucher Store**: Brand vouchers that employees can redeem using earned credits
- **Role-Based Access**: Different access levels for employees, managers, and admins

### User Roles
- **Employee**: View personal dashboard, productivity history, redeem vouchers
- **Manager**: All employee features + manage team productivity, view department rankings
- **Admin**: Full system access including employee management and voucher creation

## 🏗️ Technical Architecture

### Backend (Node.js + Express)
- **Framework**: Express.js with MongoDB
- **Authentication**: JWT-based authentication system
- **Database**: MongoDB with Mongoose ODM
- **API**: RESTful API design with comprehensive error handling
- **Security**: Helmet, CORS, input validation, password hashing

### Frontend (React + Vite)
- **Framework**: React 18 with functional components and hooks
- **Routing**: React Router v6 for navigation
- **State Management**: React Query for server state + Context API
- **Styling**: Tailwind CSS with responsive design
- **Forms**: React Hook Form with validation
- **Notifications**: React Hot Toast for user feedback

### Database Schema
- **Employee**: User profiles, credentials, credits
- **Productivity**: Monthly performance metrics
- **Ranking**: Monthly employee rankings
- **Voucher**: Brand rewards catalog
- **VoucherRedemption**: Redemption tracking

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone and navigate to project**
   ```bash
   cd tesk-trak
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   MONGODB_URI=mongodb://localhost:27017/tesk-trak
   JWT_SECRET=your-super-secret-key
   PORT=5000
   CLIENT_URL=http://localhost:3000
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend development server on `http://localhost:3000`

## 📁 Project Structure

```
tesk-trak/
├── server/                 # Backend application
│   ├── controllers/        # Request handlers
│   ├── middleware/         # Custom middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API endpoints
│   ├── utils/             # Helper functions
│   └── server.js          # Main server file
├── client/                # Frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   ├── hooks/         # Custom React hooks
│   │   └── utils/         # Helper functions
│   ├── public/            # Static assets
│   └── index.html         # HTML template
├── config/                # Configuration files
├── docs/                  # Documentation
└── tests/                 # Test files
```

## 🔧 Available Scripts

### Root Level
- `npm run dev` - Start both frontend and backend in development mode
- `npm run server` - Start only the backend server
- `npm run client` - Start only the frontend development server
- `npm run install-all` - Install dependencies for both frontend and backend
- `npm run build` - Build the frontend for production

### Backend (server/)
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Frontend (client/)
- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new employee
- `POST /api/auth/login` - Employee login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh-token` - Refresh JWT token

### Employees
- `GET /api/employees` - List all employees (Admin/Manager)
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee
- `POST /api/employees/:id/credits` - Award credits

### Productivity
- `POST /api/productivity` - Create/update productivity record
- `GET /api/productivity` - Get productivity records
- `GET /api/productivity/:id` - Get specific record
- `GET /api/productivity/employee/:id/summary` - Get employee summary
- `DELETE /api/productivity/:id` - Delete record

### Rankings
- `POST /api/rankings/generate` - Generate monthly rankings
- `POST /api/rankings/:id/publish` - Publish rankings and award credits
- `GET /api/rankings` - Get published rankings
- `GET /api/rankings/:id` - Get specific ranking
- `GET /api/rankings/employee/:id/history` - Get employee ranking history

### Vouchers
- `POST /api/vouchers` - Create voucher (Admin/Manager)
- `GET /api/vouchers` - List available vouchers
- `GET /api/vouchers/:id` - Get voucher details
- `POST /api/vouchers/:id/redeem` - Redeem voucher
- `GET /api/vouchers/redemptions/my` - Get user redemptions
- `GET /api/vouchers/redemptions` - Get all redemptions (Admin)
- `GET /api/vouchers/stats/overview` - Get voucher statistics

## 🔐 Authentication & Authorization

The system uses JWT tokens for authentication with role-based access control:

- **Public**: Login, health check
- **Employee**: Personal dashboard, profile, voucher redemption
- **Manager**: Employee role + team management, department analytics
- **Admin**: Full system access

Token expires in 7 days by default and includes employee ID, role, and email.

## 📈 Productivity Scoring

The system calculates overall productivity scores using weighted metrics:

- **Task Completion Rate** (30%): Tasks completed ÷ Tasks assigned × 100
- **Quality Score** (25%): Direct input (0-100)
- **Attendance** (20%): Attendance percentage
- **Deadline Performance** (25%): Deadlines met ÷ Total deadlines × 100

## 🏆 Ranking & Credits System

### Monthly Rankings
1. Collect productivity data for all active employees
2. Calculate overall scores using weighted formula
3. Sort employees by score (highest first)
4. Generate rankings with positions

### Credit Awards
- **1st Place**: 1000 credits
- **2nd Place**: 750 credits  
- **3rd Place**: 500 credits

### Voucher System
- Employees spend credits to redeem brand vouchers
- Vouchers have expiration dates and usage limits
- Track redemption history and status

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting on sensitive endpoints
- CORS configuration
- Helmet.js security headers
- Role-based access control
- Environment variable protection

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
NODE_ENV=production
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
CLIENT_URL=https://your-domain.com
```

## 🧪 Testing

```bash
# Run backend tests
cd server && npm test

# Run frontend tests  
cd client && npm test
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile application
- [ ] Integration with HR systems
- [ ] Automated report generation
- [ ] Goal setting and tracking
- [ ] Team collaboration features
- [ ] Multi-language support

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Tesk Trak** - Empowering employee productivity through effective tracking and rewards! 🚀
