# ShareNotes - University Notes Sharing Platform

A full-stack web application for university students to share, discover, and download study notes with ratings, search, and PDF preview functionality.

## 🚀 Features

- **User Authentication**: Secure login/register with JWT tokens
- **PDF Upload**: Upload study notes with metadata (subject, year, faculty, section)
- **Smart Search**: Search notes by subject, faculty name, or year
- **PDF Preview**: Preview first 5-10 pages of any PDF before downloading
- **Rating System**: Rate and review notes to help fellow students
- **Free & Paid Notes**: Support both free and paid content
- **Download Tracking**: Track how many times notes are downloaded
- **Responsive Design**: Beautiful violet-themed UI that works on all devices

## 🛠️ Tech Stack

### Frontend

- React 19 + Vite
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- React-PDF for PDF preview
- Heroicons for icons

### Backend

- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Multer for file uploads
- bcryptjs for password hashing

## 📦 Installation

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- npm or yarn

### Backend Setup

1. Navigate to backend directory:

```bash
cd backend
npm install
```

2. Create `.env` file with:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

3. Start the backend server:

```bash
npm start
```

### Frontend Setup

1. Navigate to frontend directory:

```bash
cd frontend
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open http://localhost:5173 (or the port shown in terminal)

## 📝 Usage

### For Students Looking for Notes

1. **Browse Notes**: Click "Browse Notes" to see all available study materials
2. **Search**: Use search filters (subject, faculty, year) to find specific notes
3. **Preview**: Click "Preview" button to view first 5-10 pages of any PDF
4. **Download**:
   - Free notes: Click "Download" directly
   - Paid notes: Complete payment first (feature coming soon)
5. **Rate**: After downloading, rate and review the notes to help others

### For Students Sharing Notes

1. **Register/Login**: Create an account or login
2. **Upload Notes**: Click "Upload Notes" in navbar
3. **Fill Details**:
   - Upload PDF file
   - Enter subject, year, section, faculty name
   - Choose if it's free or paid (set price if paid)
4. **Submit**: Your notes will be available for others to search and download

## 🎨 UI Features

- **Violet Theme**: Modern gradient design with violet/purple colors
- **Attractive Login**: Background image with glass-morphism effect
- **PDF Preview Modal**: Full-screen modal with scrollable preview
- **Responsive Cards**: Beautiful note cards with ratings and metadata
- **Smooth Animations**: Hover effects and transitions throughout

## 🔧 PDF Preview Implementation

The PDF preview uses `react-pdf` library:

- Displays first 5-10 pages (configurable)
- Shows page numbers
- Scrollable preview area
- Indicates total pages vs preview pages
- Automatic PDF worker configuration

### Preview Limits

- **Free Notes**: Preview up to 10 pages
- **Paid Notes**: Preview limited to 5 pages

## 📱 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Notes

- `GET /api/notes` - Get all notes (with search/filter)
- `GET /api/notes/:id` - Get specific note details
- `POST /api/notes/upload` - Upload new note (requires auth)
- `GET /api/notes/:id/download` - Download PDF file
- `POST /api/notes/:id/rate` - Rate a note (requires auth)

## 🎯 Upcoming Features

- [ ] Payment integration (Razorpay)
- [ ] Admin panel for content moderation
- [ ] Email verification
- [ ] Password reset functionality
- [ ] User dashboard with upload history
- [ ] Advanced search filters
- [ ] Bookmark/save notes
- [ ] Share notes via link

## 🤝 Contributing

This is a university project. Feel free to fork and customize for your needs!

## 📄 License

MIT License - Feel free to use this project for educational purposes.

---

**Made with ❤️ for students, by students**
