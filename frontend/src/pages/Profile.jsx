import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  UserCircleIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ArrowDownTrayIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import api from "../services/api";
import "./Profile.css";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userNotes, setUserNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUploads: 0,
    subjects: [],
    totalDownloads: 0,
    avgRating: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchUserNotes();
  }, [user, navigate]);

  const fetchUserNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get("/notes");

      // Filter notes uploaded by current user
      const myNotes = response.data.notes.filter(
        (note) => note.uploader === user.id || note.uploader?._id === user.id
      );

      setUserNotes(myNotes);

      // Calculate statistics
      const subjects = [...new Set(myNotes.map((note) => note.subject))];
      const totalDownloads = myNotes.reduce(
        (sum, note) => sum + (note.downloads || 0),
        0
      );
      const avgRating =
        myNotes.length > 0
          ? myNotes.reduce((sum, note) => sum + (note.avgRating || 0), 0) /
            myNotes.length
          : 0;

      setStats({
        totalUploads: myNotes.length,
        subjects,
        totalDownloads,
        avgRating,
      });
    } catch (error) {
      console.error("Failed to fetch user notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }

    try {
      await api.delete(`/notes/${noteId}`);
      alert("Note deleted successfully!");
      fetchUserNotes(); // Refresh the list
    } catch (error) {
      alert("Failed to delete note. Please try again.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-content">
          <div className="profile-loading">
            <div className="profile-spinner"></div>
            <p className="profile-loading-text">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-content">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            <UserCircleIcon className="profile-avatar-icon" />
          </div>
          <div className="profile-user-info">
            <h1 className="profile-username">{user?.name || "User"}</h1>
            <p className="profile-email">{user?.email}</p>
          </div>
          <button onClick={handleLogout} className="profile-logout-btn">
            Logout
          </button>
        </div>

        {/* Statistics Cards */}
        <div className="profile-stats-grid">
          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper profile-stat-violet">
              <DocumentTextIcon className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <p className="profile-stat-label">Total Uploads</p>
              <p className="profile-stat-value">{stats.totalUploads}</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper profile-stat-blue">
              <AcademicCapIcon className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <p className="profile-stat-label">Subjects</p>
              <p className="profile-stat-value">{stats.subjects.length}</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper profile-stat-green">
              <ArrowDownTrayIcon className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <p className="profile-stat-label">Total Downloads</p>
              <p className="profile-stat-value">{stats.totalDownloads}</p>
            </div>
          </div>

          <div className="profile-stat-card">
            <div className="profile-stat-icon-wrapper profile-stat-yellow">
              <StarIcon className="profile-stat-icon" />
            </div>
            <div className="profile-stat-content">
              <p className="profile-stat-label">Avg Rating</p>
              <p className="profile-stat-value">{stats.avgRating.toFixed(1)}</p>
            </div>
          </div>
        </div>

        {/* Subjects List */}
        {stats.subjects.length > 0 && (
          <div className="profile-section">
            <h2 className="profile-section-title">
              📚 Subjects You've Uploaded
            </h2>
            <div className="profile-subjects-grid">
              {stats.subjects.map((subject, index) => {
                const subjectCount = userNotes.filter(
                  (note) => note.subject === subject
                ).length;
                return (
                  <div key={index} className="profile-subject-badge">
                    <span className="profile-subject-name">{subject}</span>
                    <span className="profile-subject-count">
                      {subjectCount}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Uploaded Notes List */}
        <div className="profile-section">
          <h2 className="profile-section-title">📄 Your Uploaded Notes</h2>

          {userNotes.length === 0 ? (
            <div className="profile-empty-state">
              <DocumentTextIcon className="profile-empty-icon" />
              <p className="profile-empty-text">
                You haven't uploaded any notes yet.
              </p>
              <button
                onClick={() => navigate("/upload")}
                className="profile-upload-btn"
              >
                Upload Your First Note
              </button>
            </div>
          ) : (
            <div className="profile-notes-list">
              {userNotes.map((note) => (
                <div key={note._id} className="profile-note-card">
                  <div className="profile-note-header">
                    <div>
                      <h3 className="profile-note-title">{note.subject}</h3>
                      <p className="profile-note-meta">
                        {note.faculty && `By ${note.faculty}`}
                        {note.year && ` • ${note.year}`}
                        {note.section && ` • Section ${note.section}`}
                      </p>
                    </div>
                    <span
                      className={`profile-note-price ${
                        note.isPaid
                          ? "profile-note-price-paid"
                          : "profile-note-price-free"
                      }`}
                    >
                      {note.isPaid ? `₹${note.price}` : "Free"}
                    </span>
                  </div>

                  <div className="profile-note-stats">
                    <div className="profile-note-stat">
                      <ArrowDownTrayIcon className="w-4 h-4" />
                      <span>{note.downloads || 0} downloads</span>
                    </div>
                    <div className="profile-note-stat">
                      <StarIcon className="w-4 h-4" />
                      <span>
                        {(note.avgRating || 0).toFixed(1)} (
                        {note.ratings?.length || 0} reviews)
                      </span>
                    </div>
                    <div className="profile-note-stat">
                      <span className="text-xs text-gray-500">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="profile-note-actions">
                    <button
                      onClick={() => navigate(`/notes/${note._id}`)}
                      className="profile-note-btn profile-note-btn-view"
                    >
                      View Details
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note._id)}
                      className="profile-note-btn profile-note-btn-delete"
                    >
                      <TrashIcon className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
