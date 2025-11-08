import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to ShareNotes</h1>
          <p className="hero-subtitle">
            Share and discover quality study notes from your university. Help fellow
            students succeed while earning from your own contributions.
          </p>
          <div className="hero-buttons">
            {user ? (
              <Link to="/upload" className="btn btn-primary">
                Upload Notes
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            )}
            <Link to="/notes" className="btn btn-secondary">
              Browse Notes
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose ShareNotes?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📚</div>
            <h3 className="feature-title">Upload Notes</h3>
            <p className="feature-description">
              Share your study materials with students who need them most. 
              Help others while building your reputation.
            </p>
            {user ? (
              <Link to="/upload" className="btn btn-primary">
                Upload Now
              </Link>
            ) : (
              <Link to="/register" className="btn btn-primary">
                Get Started
              </Link>
            )}
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3 className="feature-title">Find Notes</h3>
            <p className="feature-description">
              Search by subject, faculty, or year to find exactly what you need.
              Access high-quality study materials instantly.
            </p>
            <Link to="/notes" className="btn btn-primary" style={{ backgroundColor: '#10b981' }}>
              Browse Notes
            </Link>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⭐</div>
            <h3 className="feature-title">Rate & Review</h3>
            <p className="feature-description">
              Help others by rating notes and leaving helpful reviews.
              Build a community of quality content.
            </p>
            <Link to="/notes" className="btn btn-primary" style={{ backgroundColor: '#8b5cf6' }}>
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="section-title">How it Works</h2>
          <div className="steps-list">
            <div className="step-item">
              <span className="step-number">1</span>
              <p className="step-text">Register and create your account</p>
            </div>
            <div className="step-item">
              <span className="step-number">2</span>
              <p className="step-text">Upload your study notes with subject and faculty details</p>
            </div>
            <div className="step-item">
              <span className="step-number">3</span>
              <p className="step-text">Set notes as free or paid based on your preference</p>
            </div>
            <div className="step-item">
              <span className="step-number">4</span>
              <p className="step-text">Students discover and rate your notes</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">Ready to Start Sharing?</h2>
          <p className="cta-text">
            Join thousands of students who are already sharing and discovering great study notes.
          </p>
          {!user && (
            <Link to="/register" className="btn btn-primary btn-large">
              Join ShareNotes Today
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
