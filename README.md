# 📚 ShareNotes - Student Notes Sharing Platform

A modern, full-stack web application where students can upload, browse, preview, download, and rate study notes and PDF materials. Built with React, Node.js, Express, and MongoDB.

![ShareNotes](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🌟 Features

- **📤 Upload Notes**: Students can upload PDF notes with subject, year, section, and faculty details
- **🔍 Smart Search**: Search notes by subject, faculty name, or year
- **👁️ PDF Preview**: Preview PDFs before downloading (first 5-10 pages)
- **⭐ Rating System**: Rate and review notes to help other students
- **💰 Free & Paid Notes**: Support for both free and paid content
- **👤 User Profiles**: Track uploads, downloads, ratings, and subjects
- **🎨 Beautiful UI**: Modern design with violet theme and glass-morphism effects
- **🔐 Secure Authentication**: JWT-based authentication system
- **📱 Responsive Design**: Works perfectly on desktop, tablet, and mobile

## 🚀 Live Demo

- **Frontend**: [Your Netlify URL]
- **Backend API**: [Your Render URL]

## 🛠️ Tech Stack

### Frontend

- React 19.1.1
- Vite 7.1.7
- React Router v6
- Axios for API calls
- React-PDF for PDF viewing
- Tailwind CSS for styling
- Heroicons for icons

### Backend

- Node.js
- Express 4.18.2
- MongoDB Atlas (Database)
- Mongoose 7.0.0 (ODM)
- JWT for authentication
- Multer 2.0.2 for file uploads
- bcryptjs for password hashing

## 📁 Project Structure

```
studyShare/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Auth)
│   │   ├── services/       # API services
│   │   ├── utils/          # Utility functions
│   │   └── assets/         # Static assets
│   ├── public/             # Public files
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Node.js backend
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── uploads/            # Uploaded PDFs
│   ├── server.js           # Entry point
│   └── package.json
│
├── DEPLOYMENT_GUIDE.md      # Detailed deployment guide
├── QUICK_DEPLOY_GUIDE.md    # Quick start deployment
└── README.md                # This file
```

## 🏃‍♂️ Local Development Setup

### Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB)
- Git installed

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/sharenotes.git
cd sharenotes
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Start backend server:

```bash
npm start
```

Backend runs on: http://localhost:5000

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start frontend development server:

```bash
npm run dev
```

Frontend runs on: http://localhost:5173

## 🌐 Deployment

For detailed deployment instructions, see:

- **[QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)** - Step-by-step guide for beginners
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Comprehensive deployment documentation

### Quick Deploy Summary

1. **Push to GitHub**: `git push origin main`
2. **Deploy Backend**: Use Render.com (free tier)
3. **Deploy Frontend**: Use Netlify (free tier)
4. **Configure Environment Variables** in both platforms

## 📸 Screenshots

[Add screenshots of your application here after deployment]

## 🔑 Key Pages

- **Home**: Landing page with hero section and features
- **Browse Notes**: Search and filter study notes
- **Upload**: Upload new PDF notes
- **Profile**: User statistics and uploaded notes
- **Note Detail**: View full note details with preview
- **Login/Register**: Authentication pages

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Likhitha**

- GitHub: [@likhitha8977](https://github.com/likhitha8977)

## 🙏 Acknowledgments

- Heroicons for the beautiful icons
- Unsplash for background images
- MongoDB Atlas for database hosting
- Netlify & Render for free hosting

## 📞 Support

If you have any questions or need help, please open an issue on GitHub.

---

**Made with ❤️ for students, by students**
