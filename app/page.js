/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [feedbackLink, setFeedbackLink] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const BASE_URL ='https://feedback-backend-3-0hi9.onrender.com';
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/me`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const generateFeedbackLink = async () => {
    if (!user) {
      alert('Please log in to generate feedback links.');
      return (window.location.href = '/login');
    }

    setIsGenerating(true);
    setTimeout(() => {
      const uniqueId = Math.random().toString(36).substr(2, 9);
      const link = `${window.location.origin}/feedback/${uniqueId}`;
      setFeedbackLink(link);
      setIsGenerating(false);
    }, 1000);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(feedbackLink);
    alert('Link copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                FeedbackHub
              </h1>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">Home</a>
              <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">Admin</a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 relative group">About</a>
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700 font-medium">Hi, {user.firstName}</span>
                  <button
                    onClick={async () => {
                      await fetch(`${BASE_URL}/api/logout`, {
                        method: 'POST',
                        credentials: 'include',
                      });
                      window.location.reload();
                    }}
                    className="text-red-600 hover:underline"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <a
                  href="/login"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </a>
              )}
            </nav>

            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              {isMenuOpen ? (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {isMenuOpen && (
            <div className="md:hidden pb-4 border-t border-gray-200 mt-4">
              <nav className="flex flex-col space-y-3 pt-4">
                <a href="#" className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200">Home</a>
                <a href="/admin" className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200">Admin</a>
                <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200">About</a>
                {user ? (
                  <button
                    onClick={async () => {
                      await fetch(`${BASE_URL}/api/logout`, {
                        method: 'POST',
                        credentials: 'include',
                      });
                      window.location.reload();
                    }}
                    className="text-red-600 py-2 px-4"
                  >
                    Logout
                  </button>
                ) : (
                  <a href="/login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transition-all duration-200 mt-2">
                    Get Started
                  </a>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Share Your Thoughts <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Safely</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Our anonymous feedback system allows you to share honest opinions without fear. Whether you're a student or employee, your voice is protected.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 lg:p-12 text-center border border-gray-100">
          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Start Collecting Feedback?</h3>
          <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
            Generate a unique feedback link that you can share.
          </p>

          {!feedbackLink ? (
            <button
              onClick={generateFeedbackLink}
              disabled={isGenerating}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-blue-400 disabled:to-purple-400 text-white font-semibold py-3 px-6 sm:py-4 sm:px-8 rounded-full transition-all duration-200 flex items-center justify-center mx-auto hover:shadow-lg hover:scale-105 transform"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Feedback Link'
              )}
            </button>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                <p className="text-sm text-gray-600 mb-3 sm:mb-4">Your unique feedback link:</p>
                <div className="flex flex-col sm:flex-row items-center justify-between bg-white rounded-lg border p-3 sm:p-4 gap-3 sm:gap-0">
                  <span className="text-blue-600 font-mono text-sm break-all sm:truncate flex-1">{feedbackLink}</span>
                  <button onClick={copyToClipboard} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button onClick={() => { setFeedbackLink(''); }} className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium">Generate New Link</button>
                <button onClick={() => window.open(feedbackLink, '_blank')} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Preview Link
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Anonymous Feedback</h4>
              <p className="text-gray-400">Empowering honest communication in educational and workplace environments.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Home</a></li>
                <li><a href="/admin" className="hover:text-white">Admin Dashboard</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/support" className="hover:text-white">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400">Need help? Our support team is here to assist you.</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Anonymous Feedback System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
