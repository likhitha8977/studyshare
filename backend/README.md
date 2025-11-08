# ShareNotes Backend

Minimal Node/Express backend for the ShareNotes app. Features:

- User register/login (JWT)
- PDF upload (stored in /uploads)
- Notes listing, rating, and delete

Setup:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies and run server:

```powershell
cd backend
npm install
npm run dev
```

Endpoints (summary):

- POST /api/auth/register { name, email, password }
- POST /api/auth/login { email, password }
- POST /api/notes/upload (auth, form-data: pdf file + subject, year, section, faculty, isPaid, price)
- GET /api/notes?q=math&page=1&limit=12
- GET /api/notes/:id
- POST /api/notes/:id/rate (auth) { rating, review }
