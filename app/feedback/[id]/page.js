/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function FeedbackFormPage() {
  const { id } = useParams();
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const BASE_URL = 'https://feedback-backend-3-0hi9.onrender.com';
  const categories = [
    { value: 'general', label: 'General Feedback' },
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'improvement', label: 'Improvement Suggestion' },
    { value: 'other', label: 'Other' }
  ];
  const handleCancel = () => {
    router.push('/'); 
  }

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  if (!feedback.trim()) {
    setError('Please enter your feedback before submitting.');
    return;
  }

  if (feedback.trim().length < 10) {
    setError('Feedback must be at least 10 characters long.');
    return;
  }

  setIsSubmitting(true);

  try {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        pageId: id,           
        content: feedback,    
        category,            
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || 'Failed to submit feedback.');
    }

    setSubmitted(true);
    setFeedback('');

    
    setTimeout(() => {
      router.push('/');
    }, 3000);

  } catch (err) {
    setError(err.message || 'An error occurred. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  const characterCount = feedback.length;
  const maxLength = 1000;
  const isNearLimit = characterCount > maxLength * 0.8;

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thank You!</h1>
          <p className="text-gray-600 mb-6">
            Your feedback has been submitted anonymously and will help us improve.
          </p>
          <div className="text-sm text-gray-500 mb-4">
            Redirecting to home page in 3 seconds...
          </div>
          <button
            onClick={handleCancel}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Return Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md shadow-gray-400">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Anonymous Feedback</h1>
          <p className="text-sm text-gray-500">
            You're providing feedback for: <span className="font-medium text-blue-600">{id}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Your feedback is completely anonymous and helps us improve our service.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Category Selection */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className=" text-black w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Feedback Textarea */}
          <div>
            <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-2">
              Your Feedback *
            </label>
            <textarea
              id="feedback"
              rows="6"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Please share your thoughts, suggestions, or report any issues you've encountered..."
              maxLength={maxLength}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-black"
              disabled={isSubmitting}
              aria-describedby="feedback-help"
            />
            <div id="feedback-help" className="flex justify-between mt-2 text-xs">
              <span className="text-gray-500">Minimum 10 characters required</span>
              <span className={`${isNearLimit ? 'text-orange-600' : 'text-gray-400'}`}>
                {characterCount}/{maxLength}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !feedback.trim()}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-medium"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Feedback'
              )}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Privacy Notice */}
        <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 leading-relaxed">
            <strong>Privacy Notice:</strong> This feedback is submitted anonymously. 
            We do not collect or store any personal information that could identify you.
          </p>
        </div>
      </div>
    </div>
  );
}
