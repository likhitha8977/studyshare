import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "./Upload.css";

export default function Upload() {
  const [formData, setFormData] = useState({
    subject: "",
    year: "",
    section: "",
    faculty: "",
    isPaid: false,
    price: 0,
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess(false);

    const uploadData = new FormData();
    uploadData.append("pdf", file);
    uploadData.append("subject", formData.subject);
    uploadData.append("year", formData.year);
    uploadData.append("section", formData.section);
    uploadData.append("faculty", formData.faculty);
    uploadData.append("isPaid", formData.isPaid);
    uploadData.append("price", formData.price);

    try {
      await api.post("/notes/upload", uploadData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/notes");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== "application/pdf") {
      setError("Please select a PDF file only");
      return;
    }
    setFile(selectedFile);
    setError("");
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        <div className="upload-header">
          <div className="upload-icon">📤</div>
          <h2>Upload Study Notes</h2>
          <p>Share your knowledge with fellow students</p>
        </div>

        {error && (
          <div className="upload-error-message">
            <strong>⚠️ Error:</strong> {error}
          </div>
        )}

        {success && (
          <div className="upload-success-message">
            <strong>✓ Success!</strong> Your notes have been uploaded
            successfully. Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="upload-form-row">
            <div className="upload-form-group">
              <label className="upload-form-label">Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g., Mathematics, Physics"
                className="upload-form-input"
                required
              />
            </div>

            <div className="upload-form-group">
              <label className="upload-form-label">Faculty Name</label>
              <input
                type="text"
                name="faculty"
                value={formData.faculty}
                onChange={handleChange}
                placeholder="e.g., Dr. Smith"
                className="upload-form-input"
              />
            </div>
          </div>

          <div className="upload-form-row">
            <div className="upload-form-group">
              <label className="upload-form-label">Year</label>
              <select
                name="year"
                value={formData.year}
                onChange={handleChange}
                className="upload-form-select"
              >
                <option value="">Select Year</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>

            <div className="upload-form-group">
              <label className="upload-form-label">Section</label>
              <input
                type="text"
                name="section"
                value={formData.section}
                onChange={handleChange}
                placeholder="e.g., A, B, CSE-A"
                className="upload-form-input"
              />
            </div>
          </div>

          <div className="upload-form-group">
            <label className="upload-form-label">Upload PDF File *</label>
            <div className="upload-file-input">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                id="pdf-upload"
                style={{ display: "none" }}
                required
              />
              <label htmlFor="pdf-upload" className="upload-file-label">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span>{file ? "Change File" : "Click to upload PDF"}</span>
                {file && (
                  <span className="file-name">
                    📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </label>
            </div>
          </div>

          <div className="upload-checkbox-group">
            <input
              type="checkbox"
              id="isPaid"
              name="isPaid"
              checked={formData.isPaid}
              onChange={handleChange}
            />
            <label htmlFor="isPaid">💰 Make this a paid note</label>
          </div>

          {formData.isPaid && (
            <div className="upload-price-input">
              <div className="upload-form-group">
                <label className="upload-form-label">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="1"
                  max="1000"
                  className="upload-form-input"
                  placeholder="Enter price in rupees"
                  required={formData.isPaid}
                />
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "#6b7280",
                    marginTop: "0.4rem",
                  }}
                >
                  Students will see a preview before purchasing
                </p>
              </div>
            </div>
          )}

          <button type="submit" disabled={uploading} className="upload-button">
            {uploading ? (
              <span>
                <svg
                  className="inline animate-spin h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </span>
            ) : (
              "📤 Upload Notes"
            )}
          </button>
        </form>

        <div className="upload-guidelines">
          <h4>📋 Upload Guidelines</h4>
          <ul>
            <li>Only PDF files are accepted</li>
            <li>Maximum file size: 50MB</li>
            <li>Ensure content is clear and readable</li>
            <li>Provide accurate subject and faculty information</li>
            <li>Inappropriate content will be removed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
