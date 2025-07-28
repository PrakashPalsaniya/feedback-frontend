"use client";
import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  BrainCircuit,
} from "lucide-react";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [admin, setAdmin] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const [analysis, setAnalysis] = useState({});
  const [analyzingId, setAnalyzingId] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("https://feedback-backend.railway.internal/api/admin/dashboard", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();
        if (!res.ok)
          throw new Error(data.message || "Failed to load dashboard");

        setAdmin(data.admin);
        setFeedbacks(data.feedbacks);
        setFilteredFeedbacks(data.feedbacks);
      } catch (err) {
        setError("Please Register/Login To Proceed");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  useEffect(() => {
    let filtered = feedbacks;
    if (selectedCategory !== "all") {
      filtered = filtered.filter((fb) => fb.category === selectedCategory);
    }
    setFilteredFeedbacks(filtered);
  }, [feedbacks, selectedCategory]);

  const categories = [...new Set(feedbacks.map((fb) => fb.category))];

  const handleDeleteFeedback = async (id) => {
    try {
      const res = await fetch(
        `https://feedback-backend.railway.internal/api/admin/feedback/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      if (res.ok) {
        setFeedbacks(feedbacks.filter((fb) => fb.pageId !== id));
        toast.success("Feedback deleted successfully");
      }
    } catch (err) {
      console.error("Error deleting feedback:", err);
      toast.error("Failed to delete feedback");
    }
  };

  const handleAnalyze = async (id, content) => {
    setAnalyzingId(id);
    try {
      const res = await fetch("https://feedback-backend-hkqy.onrender.com/api/analyze-sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: content }),
      });

      const data = await res.json();
      setAnalysis((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      alert("Error analyzing feedback");
    } finally {
      setAnalyzingId(null);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      bug: "bg-red-100 text-red-800",
      feature: "bg-blue-100 text-blue-800",
      improvement: "bg-green-100 text-green-800",
      general: "bg-gray-100 text-gray-800",
      complaint: "bg-yellow-100 text-yellow-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getSentimentColor = (score) => {
    if (score > 0) return "text-green-600";
    if (score < 0) return "text-red-600";
    return "text-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {error}
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-1" />
              <span>{admin.name}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Feedback ({filteredFeedbacks.length})
            </h2>
          </div>

          {filteredFeedbacks.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No feedback found</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredFeedbacks.map((fb) => (
                <div key={fb._id} className="p-6 hover:bg-gray-50 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                            fb.category
                          )}`}
                        >
                          {fb.category}
                        </span>
                        <span className="text-sm text-gray-500">
                          Page ID: {fb.pageId}
                        </span>
                      </div>

                      <p className="text-gray-800 mb-3 leading-relaxed">
                        {fb.content}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(fb.createdAt).toLocaleDateString()}
                        </span>
                        <span>
                          {new Date(fb.createdAt).toLocaleTimeString()}
                        </span>
                      </div>

                     {analysis[fb._id] && (
  <div className="mt-4 p-3 bg-gray-50 border rounded-lg shadow-sm w-fit">
    <div className="text-sm font-semibold flex items-center gap-2">
      <span
        className={`${
          analysis[fb._id].score > 0
            ? "text-green-600"
            : analysis[fb._id].score < 0
            ? "text-red-600"
            : "text-gray-600"
        } flex items-center gap-1`}
      >
        {analysis[fb._id].score > 0 && "😊 Positive"}
        {analysis[fb._id].score < 0 && "😞 Negative"}
        {analysis[fb._id].score === 0 && "😐 Neutral"}
      </span>
    </div>
    <div className="text-xs mt-1 text-gray-600">
      Score:{" "}
      <span
        className={`font-mono ${
          analysis[fb._id].score > 0
            ? "text-green-600"
            : analysis[fb._id].score < 0
            ? "text-red-600"
            : "text-gray-500"
        }`}
      >
        {analysis[fb._id].score.toFixed(2)}
      </span>
    </div>
  </div>
)}

                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                     <button
  onClick={() => handleAnalyze(fb._id, fb.content)}
  disabled={analyzingId === fb._id}
  className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition"
>
  {analyzingId === fb._id ? (
    <svg
      className="animate-spin h-4 w-4 text-white"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4zm2 5.3A7.96 7.96 0 014 12H0c0 3 1.1 5.8 3 7.9l3-2.6z"
      />
    </svg>
  ) : (
    <>
      <BrainCircuit className="h-4 w-4" />
      Analyze Sentiment
    </>
  )}
</button>

                      <button
                        onClick={() => handleDeleteFeedback(fb.pageId)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
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
