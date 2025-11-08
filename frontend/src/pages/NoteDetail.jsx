import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  StarIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { StarIcon as StarSolidIcon } from "@heroicons/react/24/solid";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import PDFViewer from "../components/PDFViewer";

export default function NoteDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const response = await api.get(`/notes/${id}`);
      setNote(response.data);
    } catch (error) {
      console.error("Failed to fetch note:", error);
      navigate("/notes");
    } finally {
      setLoading(false);
    }
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to rate notes");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    setSubmittingRating(true);
    try {
      await api.post(`/notes/${id}/rate`, { rating, review });
      alert("Rating submitted successfully!");
      fetchNote(); // Refresh note data
      setRating(0);
      setReview("");
    } catch (error) {
      alert("Failed to submit rating. Please try again.");
    } finally {
      setSubmittingRating(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/notes/${id}/download`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${note.subject}-notes.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert("Download failed. Please try again.");
    }
  };

  const renderStars = (
    currentRating,
    interactive = false,
    onStarClick = null
  ) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      const filled = i <= currentRating;
      stars.push(
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => onStarClick(i) : undefined}
          className={
            interactive
              ? "cursor-pointer transition-transform hover:scale-125 focus:outline-none"
              : ""
          }
          disabled={!interactive}
        >
          {filled ? (
            <StarSolidIcon
              className={`${
                interactive ? "w-7 h-7" : "w-5 h-5"
              } text-yellow-400`}
            />
          ) : (
            <StarIcon
              className={`${interactive ? "w-7 h-7" : "w-5 h-5"} ${
                interactive
                  ? "text-gray-300 hover:text-yellow-200"
                  : "text-gray-300"
              }`}
            />
          )}
        </button>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading note details...</p>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Note not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <button
          onClick={() => navigate("/notes")}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
          Back to Notes
        </button>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {note.subject}
            </h1>
            <p className="text-gray-600">
              {note.faculty && `Faculty: ${note.faculty}`}
              {note.year && ` • Year: ${note.year}`}
              {note.section && ` • Section: ${note.section}`}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Uploaded on {new Date(note.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                note.isPaid
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {note.isPaid ? `₹${note.price}` : "Free"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex items-center mr-3">
              {renderStars(note.avgRating || 0)}
            </div>
            <span className="text-gray-600">
              {(note.avgRating || 0).toFixed(1)} ({note.ratings?.length || 0}{" "}
              reviews)
            </span>
          </div>

          <button
            onClick={handleDownload}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 flex items-center"
          >
            <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
            {note.isPaid ? `Buy & Download (₹${note.price})` : "Download Free"}
          </button>
        </div>
      </div>

      {/* PDF Preview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">📄 Document Preview</h2>
        <div className="bg-gray-50 rounded-lg p-4">
          <PDFViewer
            pdfUrl={`http://localhost:5000${note.pdfPath}`}
            maxPages={note.isPaid ? 5 : 10}
          />
          {note.isPaid && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-center">
              <p className="text-yellow-800 font-semibold">
                💰 This is a paid document
              </p>
              <p className="text-yellow-600 text-sm mt-1">
                Preview shows first 5 pages. Purchase for ₹{note.price} to
                access the complete document.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Rating and Reviews */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Ratings & Reviews</h2>

        {/* Submit Rating Form */}
        {user ? (
          <form
            onSubmit={handleRatingSubmit}
            className="mb-6 p-5 bg-gradient-to-br from-violet-50 to-purple-50 rounded-lg border-2 border-violet-200"
          >
            <h3 className="font-semibold text-lg mb-4 text-violet-900">
              ✨ Share Your Experience
            </h3>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating:
              </label>
              <div className="flex items-center gap-2">
                {renderStars(rating, true, setRating)}
                {rating > 0 && (
                  <span className="ml-2 text-sm font-semibold text-violet-600">
                    {rating} star{rating !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Review (optional):
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-violet-500 transition"
                placeholder="Share your thoughts about these notes..."
              />
            </div>

            <button
              type="submit"
              disabled={submittingRating || rating === 0}
              className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-2.5 rounded-lg hover:from-violet-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition shadow-md hover:shadow-lg"
            >
              {submittingRating ? "Submitting..." : "Submit Rating"}
            </button>
          </form>
        ) : (
          <div className="mb-6 p-5 bg-gray-50 rounded-lg border-2 border-gray-200 text-center">
            <p className="text-gray-600 mb-3">
              Please log in to rate this note
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-violet-600 text-white px-6 py-2 rounded-lg hover:bg-violet-700 transition font-medium"
            >
              Login to Rate
            </button>
          </div>
        )}

        {/* Existing Reviews */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg mb-3">
            All Reviews ({note.ratings?.length || 0})
          </h3>
          {note.ratings && note.ratings.length > 0 ? (
            note.ratings.map((ratingItem, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {renderStars(ratingItem.rating)}
                    <span className="font-semibold text-gray-700">
                      {ratingItem.rating}.0
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {ratingItem.createdAt
                      ? new Date(ratingItem.createdAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
                {ratingItem.review && (
                  <p className="text-gray-700 mt-2 italic">
                    "{ratingItem.review}"
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <StarIcon className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">
                No reviews yet. Be the first to rate this note!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
