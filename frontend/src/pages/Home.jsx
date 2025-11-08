import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  StarIcon,
  ArrowUpTrayIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/notes");
    }
  };

  const topSubjects = [
    {
      name: "Mathematics",
      icon: "📐",
      count: "150+ notes",
      color: "bg-violet-500",
    },
    {
      name: "Physics",
      icon: "⚛️",
      count: "120+ notes",
      color: "bg-purple-500",
    },
    {
      name: "Computer Science",
      icon: "💻",
      count: "200+ notes",
      color: "bg-indigo-500",
    },
    {
      name: "Chemistry",
      icon: "🧪",
      count: "100+ notes",
      color: "bg-fuchsia-500",
    },
    {
      name: "Engineering",
      icon: "⚙️",
      count: "180+ notes",
      color: "bg-violet-600",
    },
    { name: "Biology", icon: "🧬", count: "90+ notes", color: "bg-pink-500" },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section / Banner */}
      <section className="bg-gradient-to-r from-violet-600 to-purple-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome to ShareNotes
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-violet-100">
              The Ultimate Platform for University Study Notes
            </p>
            <p className="text-lg mb-10 text-violet-50">
              Share knowledge, discover quality notes, and help fellow students
              succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <>
                  <Link
                    to="/upload"
                    className="bg-white text-violet-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-50 transition inline-flex items-center justify-center"
                  >
                    <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                    Upload Notes
                  </Link>
                  <Link
                    to="/notes"
                    className="bg-violet-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-800 transition inline-flex items-center justify-center"
                  >
                    <BookOpenIcon className="w-5 h-5 mr-2" />
                    Browse Notes
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-violet-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-50 transition"
                  >
                    Get Started Free
                  </Link>
                  <Link
                    to="/notes"
                    className="bg-violet-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-violet-800 transition"
                  >
                    Browse Notes
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Search Notes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Find Notes Instantly
            </h2>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden">
                <MagnifyingGlassIcon className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  placeholder="Search by subject, faculty name, or topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-4 py-4 text-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-8 py-4 font-semibold hover:bg-violet-700 transition"
                >
                  Search
                </button>
              </div>
            </form>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-sm text-gray-600">Popular:</span>
              {["Mathematics", "Physics", "Computer Science", "Chemistry"].map(
                (subject) => (
                  <button
                    key={subject}
                    onClick={() => {
                      setSearchQuery(subject);
                      navigate(`/notes?q=${encodeURIComponent(subject)}`);
                    }}
                    className="text-sm bg-white px-3 py-1 rounded-full border border-gray-300 hover:border-violet-500 hover:text-violet-600 transition"
                  >
                    {subject}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            How ShareNotes Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div className="text-center">
              <div className="bg-violet-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-violet-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Create Account</h3>
              <p className="text-gray-600">
                Register for free and join our student community
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Notes</h3>
              <p className="text-gray-600">
                Share your study materials with details
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse & Download</h3>
              <p className="text-gray-600">
                Search, preview, and download notes you need
              </p>
            </div>

            <div className="text-center">
              <div className="bg-yellow-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-yellow-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Rate & Review</h3>
              <p className="text-gray-600">
                Help others by rating quality content
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Top Subjects / Trending Notes */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
            Popular Subjects
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 max-w-6xl mx-auto">
            {topSubjects.map((subject) => (
              <Link
                key={subject.name}
                to={`/notes?subject=${encodeURIComponent(subject.name)}`}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition text-center group"
              >
                <div
                  className={`${subject.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition`}
                >
                  <span className="text-3xl">{subject.icon}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2 text-gray-900">
                  {subject.name}
                </h3>
                <p className="text-sm text-gray-600">{subject.count}</p>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/notes"
              className="inline-block bg-violet-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-violet-700 transition"
            >
              View All Subjects
            </Link>
          </div>
        </div>
      </section>

      {/* Upload Notes CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-green-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <ArrowUpTrayIcon className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">
              Have Quality Notes to Share?
            </h2>
            <p className="text-xl mb-8 text-green-50">
              Upload your study materials and help thousands of students. Set
              your notes as free or paid - it's completely up to you!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link
                  to="/upload"
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition inline-flex items-center justify-center"
                >
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                  Upload Your Notes Now
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition"
                  >
                    Sign Up to Upload
                  </Link>
                  <Link
                    to="/login"
                    className="bg-green-800 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-900 transition"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-5xl font-bold text-violet-600 mb-2">
                1000+
              </div>
              <div className="text-gray-600 text-lg">Study Notes</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 text-lg">Active Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 text-lg">Subjects Covered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ShareNotes</h3>
              <p className="text-gray-400">
                Empowering students with quality study materials from across the
                university.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to="/notes"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Browse Notes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/upload"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Upload Notes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Guidelines
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Copyright Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
            <p>
              &copy; 2025 ShareNotes. All rights reserved. Built for students,
              by students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
