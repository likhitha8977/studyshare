import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  StarIcon,
  EyeIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PDFViewer from "../components/PDFViewer";
import "./NotesList.css";

export default function NotesList() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    subject: "",
    faculty: "",
    year: "",
  });
  const [selectedNote, setSelectedNote] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingNote, setRatingNote] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    fetchNotes();
  }, [searchQuery, filters]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (filters.subject) params.append("subject", filters.subject);
      if (filters.faculty) params.append("faculty", filters.faculty);
      if (filters.year) params.append("year", filters.year);

      const response = await api.get(`/notes?${params.toString()}`);
      setNotes(response.data.notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNotes();
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handlePreview = (note) => {
    setSelectedNote(note);
    setShowPreview(true);
  };

  const handleDownload = async (noteId) => {
    try {
      const response = await api.get(`/notes/${noteId}/download`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `note-${noteId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed. Please try again.");
    }
  };

  const handleOpenRatingModal = (note) => {
    if (!user) {
      alert("Please login to rate notes");
      return;
    }
    setRatingNote(note);
    setUserRating(0);
    setUserReview("");
    setShowRatingModal(true);
  };

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    if (userRating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmittingRating(true);
    try {
      await api.post(`/notes/${ratingNote._id}/rate`, {
        rating: userRating,
        review: userReview,
      });
      alert("Rating submitted successfully!");
      setShowRatingModal(false);
      fetchNotes(); // Refresh notes to show updated rating
      setUserRating(0);
      setUserReview("");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to submit rating. Please try again."
      );
    } finally {
      setSubmittingRating(false);
    }
  };

  const renderInteractiveStars = (currentRating, onStarClick) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= currentRating;
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => onStarClick(i)}
          className="cursor-pointer transition-transform hover:scale-110"
        >
          {filled ? (
            <StarSolidIcon className="w-6 h-6 text-yellow-400" />
          ) : (
            <StarIcon className="w-6 h-6 text-gray-300 hover:text-yellow-200" />
          )}
        </button>
      );
    }
    return stars;
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <StarSolidIcon key={i} className="w-4 h-4 text-yellow-400" />
        );
      } else {
        stars.push(<StarIcon key={i} className="w-4 h-4 text-gray-300" />);
      }
    }
    return stars;
  };

  return (
    <div className="notes-list-container">
      <div className="notes-list-content">
        {/* Search and Filters */}
        <div className="notes-search-section">
          <h2 className="notes-search-title">Browse Study Notes</h2>

          <form onSubmit={handleSearch} className="notes-search-form">
            <div>
              <input
                type="text"
                placeholder="Search by subject or faculty name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="notes-search-input"
              />
            </div>

            <div className="notes-filters-grid">
              <select
                name="subject"
                value={filters.subject}
                onChange={handleFilterChange}
                className="notes-filter-select"
              >
                <option value="">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
              </select>

              <input
                type="text"
                name="faculty"
                placeholder="Faculty name..."
                value={filters.faculty}
                onChange={handleFilterChange}
                className="notes-filter-input"
              />

              <select
                name="year"
                value={filters.year}
                onChange={handleFilterChange}
                className="notes-filter-select"
              >
                <option value="">All Years</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <button type="submit" className="notes-search-button">
              Search Notes
            </button>
          </form>
        </div>

        {/* Notes Grid */}
        {loading ? (
          <div className="notes-loading">
            <div className="notes-spinner"></div>
            <p className="notes-loading-text">Loading notes...</p>
          </div>
        ) : (
          <div className="notes-grid">
            {notes.length === 0 ? (
              <div className="notes-empty">
                <p className="notes-empty-text">
                  No notes found. Try adjusting your search criteria.
                </p>
                <Link to="/upload" className="notes-empty-link">
                  Be the first to upload notes! →
                </Link>
              </div>
            ) : (
              notes.map((note) => (
                <div key={note._id} className="note-card">
                  <div className="note-card-header">
                    <h3 className="note-card-title">{note.subject}</h3>
                    <div className="note-card-meta">
                      {note.faculty && (
                        <span className="note-card-meta-item">
                          By {note.faculty}
                        </span>
                      )}
                      {note.year && (
                        <span className="note-card-meta-item">
                          • {note.year}
                        </span>
                      )}
                      {note.section && (
                        <span className="note-card-meta-item">
                          • Section {note.section}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="note-rating-section">
                    <div className="note-stars">
                      {renderStars(note.avgRating || 0)}
                    </div>
                    <span className="note-rating-count">
                      ({note.ratings?.length || 0} reviews)
                    </span>
                  </div>

                  <div className="note-card-footer">
                    <span
                      className={`note-price-badge ${
                        note.isPaid ? "note-price-paid" : "note-price-free"
                      }`}
                    >
                      {note.isPaid ? `₹${note.price}` : "Free"}
                    </span>
                    <span className="note-date">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="note-actions">
                    <button
                      onClick={() => handlePreview(note)}
                      className="note-btn note-btn-preview"
                    >
                      <EyeIcon className="w-4 h-4" />
                      Preview
                    </button>

                    {!note.isPaid || (user && note.isPaid) ? (
                      <button
                        onClick={() => handleDownload(note._id)}
                        className="note-btn note-btn-download"
                      >
                        <ArrowDownTrayIcon className="w-4 h-4" />
                        {note.isPaid ? "Buy" : "Download"}
                      </button>
                    ) : (
                      <Link to="/login" className="note-btn note-btn-login">
                        Login to Buy
                      </Link>
                    )}
                  </div>

                  {/* Add Rate Button */}
                  <button
                    onClick={() => handleOpenRatingModal(note)}
                    className="note-btn note-btn-rate mt-2 w-full"
                  >
                    <StarIcon className="w-4 h-4" />
                    Rate this Note
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* Preview Modal */}
        {showPreview && selectedNote && (
          <div className="preview-modal-overlay">
            <div className="preview-modal-content">
              <div className="preview-modal-header">
                <div className="preview-modal-title-section">
                  <h3>{selectedNote.subject} - Preview</h3>
                  <p>
                    {selectedNote.faculty && `By ${selectedNote.faculty}`}
                    {selectedNote.year && ` • ${selectedNote.year}`}
                    {selectedNote.section &&
                      ` • Section ${selectedNote.section}`}
                  </p>
                </div>
                <button
                  onClick={() => setShowPreview(false)}
                  className="preview-modal-close"
                >
                  ✕
                </button>
              </div>

              <div className="preview-modal-body">
                <PDFViewer
                  pdfUrl={`http://localhost:5000${selectedNote.pdfPath}`}
                  maxPages={10}
                />
              </div>

              <div className="preview-modal-footer">
                <button
                  onClick={() => setShowPreview(false)}
                  className="preview-btn preview-btn-close"
                >
                  Close
                </button>

                {!selectedNote.isPaid ? (
                  <button
                    onClick={() => {
                      handleDownload(selectedNote._id);
                      setShowPreview(false);
                    }}
                    className="preview-btn preview-btn-download"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    Download Free
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      alert(
                        `Purchase ${selectedNote.subject} for ₹${selectedNote.price}`
                      );
                    }}
                    className="preview-btn preview-btn-purchase"
                  >
                    Purchase for ₹{selectedNote.price}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rating Modal */}
        {showRatingModal && ratingNote && (
          <div className="preview-modal-overlay">
            <div
              className="preview-modal-content"
              style={{ maxWidth: "600px" }}
            >
              <div className="preview-modal-header">
                <div className="preview-modal-title-section">
                  <h3>Rate: {ratingNote.subject}</h3>
                  <p>Share your experience with this note</p>
                </div>
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="preview-modal-close"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmitRating}>
                <div className="preview-modal-body">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-3 text-center">
                      Your Rating:
                    </label>
                    <div className="flex items-center justify-center gap-2">
                      {renderInteractiveStars(userRating, setUserRating)}
                      {userRating > 0 && (
                        <span className="ml-3 text-lg font-semibold text-violet-600">
                          {userRating} star{userRating !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Review (optional):
                    </label>
                    <textarea
                      value={userReview}
                      onChange={(e) => setUserReview(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 transition"
                      placeholder="Share your thoughts about these notes..."
                    />
                  </div>
                </div>

                <div className="preview-modal-footer">
                  <button
                    type="button"
                    onClick={() => setShowRatingModal(false)}
                    className="preview-btn preview-btn-close"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingRating || userRating === 0}
                    className="preview-btn preview-btn-purchase disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingRating ? "Submitting..." : "Submit Rating"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
