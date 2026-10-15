import React, { useEffect, useMemo, useState } from "react";
import { API_BASE } from '../config';
import { initiateRazorpayPayment } from '../utils/razorpay';
import PaymentSuccessModal from '../component/PaymentSuccessModal';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, Search, BookOpen, Clock, Tag, PlayCircle, 
  CheckCircle, PlusCircle, ShieldCheck, Star, Layers, Lock 
} from 'lucide-react';

/* =====================================================
   COMPANY: CREATE COURSE
===================================================== */
function CompanyCreateCourse({ onCourseCreated }) {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    duration: "",
    level: "Beginner",
    price: "Free",
    videos: [""],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) =>
    setCourse({ ...course, [e.target.name]: e.target.value });

  const handleVideoChange = (index, value) => {
    const v = [...(course.videos || [])];
    v[index] = value;
    setCourse({ ...course, videos: v });
  };

  const addVideo = () => setCourse({ ...course, videos: [...(course.videos || []), ""] });
  const removeVideo = (index) => {
    const v = [...(course.videos || [])];
    v.splice(index, 1);
    setCourse({ ...course, videos: v });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course.title.trim()) return alert("Course Title is required.");
    
    const token = localStorage.getItem('token');
    if (!token) return alert('Please log in with your Company account to publish courses.');

    setSubmitting(true);
    const payload = {
      name: course.title.trim(),
      description: course.description.trim(),
      duration: course.duration.trim() || 'Self-paced',
      category: course.level,
      price: course.price.trim() || 'Free',
      isPublished: true,
      videoUrls: JSON.stringify((course.videos || []).map(s => (s || "").trim()).filter(Boolean))
    };

    try {
      const res = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error(b.message || 'Failed to create course');
      }

      setCourse({ title: "", description: "", duration: "", level: "Beginner", price: "Free", videos: [""] });
      alert('🎉 Course published successfully to Placify Portal!');
      if (onCourseCreated) onCourseCreated();
    } catch (err) {
      console.error('Create course error:', err);
      alert(err.message || 'Failed to publish course');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-white/10 shadow-2xl backdrop-blur-xl text-white my-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
          <PlusCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Publish New Course</h2>
          <p className="text-xs text-slate-400">Distribute industry-standard training to verified students</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Course Title *</label>
          <input
            name="title"
            placeholder="e.g. Full-Stack Modern React & Cloud Architecture"
            value={course.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1">Description</label>
          <textarea
            name="description"
            rows="3"
            placeholder="Describe course outcomes, prerequisites, and syllabus..."
            value={course.description}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Duration</label>
            <input
              name="duration"
              placeholder="e.g. 4 Weeks / 20 hrs"
              value={course.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Level</label>
            <select
              name="level"
              value={course.level}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-purple-500"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1">Price (INR)</label>
            <input
              name="price"
              placeholder="e.g. Free or ₹499"
              value={course.price}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Video Lectures */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">Curriculum Video URLs (Direct MP4 / Stream)</label>
            <button
              onClick={addVideo}
              type="button"
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              + Add Video Lecture
            </button>
          </div>

          <div className="space-y-2">
            {(course.videos || []).map((v, i) => (
              <div key={i} className="flex gap-2">
                <input
                  placeholder={`Lecture #${i + 1} Direct MP4 URL`}
                  value={v}
                  onChange={(e) => handleVideoChange(i, e.target.value)}
                  className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
                {(course.videos || []).length > 1 && (
                  <button
                    onClick={() => removeVideo(i)}
                    className="px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-medium"
                    type="button"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-4 py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50"
        >
          {submitting ? "Publishing Course..." : "Publish Course to Catalog"}
        </button>
      </form>
    </div>
  );
}

/* =====================================================
   STUDENT: VIEW & ENROLL COURSES (WITH RAZORPAY)
===================================================== */
function StudentCourses({ courses, loading, onRefresh }) {
  const [openCourseId, setOpenCourseId] = useState(null);
  const [videoBlobs, setVideoBlobs] = useState({});
  const [processingCourseId, setProcessingCourseId] = useState(null);
  const [successPayment, setSuccessPayment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(() => {
    try {
      const raw = localStorage.getItem('enrolledCourses');
      return raw ? JSON.parse(raw) : [];
    } catch (e) { return []; }
  });

  const userId = localStorage.getItem('userId');

  // When a course is opened and student is enrolled, fetch video blobs
  useEffect(() => {
    if (!openCourseId) return;
    const course = courses.find(c => c._id === openCourseId);
    if (!course) return;
    const enrolled = (course.enrolledStudents || []).some(id => id.toString() === userId) || enrolledCourseIds.includes(openCourseId);
    if (!enrolled) return;

    let cancelled = false;
    const token = localStorage.getItem('token');
    const fetchVideos = async () => {
      const urls = [];
      for (let i = 0; i < (course.videos || []).length; i++) {
        try {
          const res = await fetch(`${API_BASE}/api/courses/${course._id}/video/${i}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) { urls.push(null); continue; }
          const blob = await res.blob();
          urls.push(URL.createObjectURL(blob));
        } catch (err) {
          urls.push(null);
        }
      }
      if (!cancelled) setVideoBlobs(prev => ({ ...prev, [course._id]: urls }));
    };

    fetchVideos();

    return () => {
      cancelled = true;
      const prev = videoBlobs[course._id] || [];
      prev.forEach(u => { if (u) URL.revokeObjectURL(u); });
    };
  }, [openCourseId]);

  const enrollFree = async (courseId) => {
    const token = localStorage.getItem('token');
    if (!token || !userId) return alert('Please log in as a student to enroll');

    try {
      setProcessingCourseId(courseId);
      const res = await fetch(`${API_BASE}/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const body = await res.json();
      if (!res.ok) return alert(body.message || 'Failed to enroll');

      setEnrolledCourseIds(prev => {
        const next = Array.from(new Set([...(prev || []), courseId]));
        try { localStorage.setItem('enrolledCourses', JSON.stringify(next)); } catch (e) {}
        return next;
      });
      setOpenCourseId(courseId);
      if (onRefresh) onRefresh();
      alert('🎉 Enrolled successfully in the course!');
    } catch (err) {
      console.error('Enroll error:', err);
      alert('Failed to enroll');
    } finally {
      setProcessingCourseId(null);
    }
  };

  const handleEnrollOrBuy = async (course) => {
    const token = localStorage.getItem('token');
    if (!token || !userId) {
      alert('Please log in to Placify to enroll in this course.');
      return;
    }

    const price = (course.price || '').trim();
    const isFree = !price || price.toLowerCase() === 'free' || price === '0';

    if (isFree) {
      await enrollFree(course._id);
    } else {
      setProcessingCourseId(course._id);
      await initiateRazorpayPayment({
        itemType: 'course',
        itemId: course._id,
        notes: {
          courseName: course.name
        },
        onSuccess: (verifyData) => {
          setProcessingCourseId(null);
          setSuccessPayment(verifyData);
          setEnrolledCourseIds(prev => {
            const next = Array.from(new Set([...(prev || []), course._id]));
            try { localStorage.setItem('enrolledCourses', JSON.stringify(next)); } catch (e) {}
            return next;
          });
          setOpenCourseId(course._id);
          if (onRefresh) onRefresh();
        },
        onError: (err) => {
          setProcessingCourseId(null);
          alert(err.message || 'Payment was not completed');
        },
        onClose: () => {
          setProcessingCourseId(null);
        }
      });
    }
  };

  // Filter courses by search and filter chips
  const filteredCourses = useMemo(() => {
    return (courses || []).filter(c => {
      const nameMatch = (c.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (c.description || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
                        (c.companyName || "").toLowerCase().includes(searchQuery.toLowerCase());
      if (!nameMatch) return false;

      const price = (c.price || "").toLowerCase();
      const isFree = !price || price === 'free' || price === '0';

      if (selectedFilter === 'free') return isFree;
      if (selectedFilter === 'paid') return !isFree;
      if (selectedFilter === 'beginner') return (c.category || "").toLowerCase() === 'beginner';
      if (selectedFilter === 'advanced') return (c.category || "").toLowerCase() === 'advanced' || (c.category || "").toLowerCase() === 'intermediate';
      return true;
    });
  }, [courses, searchQuery, selectedFilter]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses by title, keywords, or company..."
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: "all", label: "All Courses" },
            { id: "free", label: "Free" },
            { id: "paid", label: "Razorpay Pro" },
            { id: "beginner", label: "Beginner" },
            { id: "advanced", label: "Advanced" },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setSelectedFilter(pill.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedFilter === pill.id
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                  : "bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm">Loading verified curriculum courses...</p>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="py-16 text-center rounded-3xl bg-white/[0.02] border border-white/5 p-8">
          <BookOpen className="w-12 h-12 text-slate-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white">No courses match your criteria</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset filter pills to view available options.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const enrolledServer = (course.enrolledStudents || []).some(id => id.toString() === userId);
            const enrolledLocal = enrolledCourseIds.includes(course._id);
            const enrolled = enrolledServer || enrolledLocal;
            const opened = openCourseId === course._id;
            const price = (course.price || '').trim();
            const isFree = !price || price.toLowerCase() === 'free' || price === '0';
            const isProcessing = processingCourseId === course._id;

            return (
              <div
                key={course._id}
                className="group relative rounded-3xl bg-slate-900/60 border border-white/10 hover:border-purple-500/30 p-6 flex flex-col justify-between shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-[1.01]"
              >
                <div>
                  {/* Top Bar: Company & Price Tag */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300">
                      {course.companyName || 'Verified Corporate'}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      enrolled
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isFree
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20'
                        : 'bg-purple-600/25 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-600/20'
                    }`}>
                      {enrolled ? '✓ Enrolled' : (price || 'Free')}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-white mb-2 line-clamp-1 group-hover:text-purple-300 transition-colors">
                    {course.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-4 leading-relaxed">
                    {course.description || "In-depth course covering foundational concepts, real-world case studies, and corporate best practices."}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-4 pt-3 border-t border-white/5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-purple-400" />
                      {course.duration || 'Self-paced'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      {course.category || 'All Levels'}
                    </span>
                  </div>

                  {/* Videos for enrolled students */}
                  {enrolled && opened && course.videos && course.videos.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs font-bold text-slate-200 mb-2 flex items-center gap-1.5">
                        <PlayCircle className="w-4 h-4 text-emerald-400" />
                        Course Lectures ({course.videos.length}):
                      </p>
                      <div className="space-y-3">
                        {course.videos.map((url, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden bg-black/40 border border-white/10 p-2">
                            <p className="text-[11px] font-semibold text-slate-300 mb-1.5 px-1">
                              Lecture {idx + 1}
                            </p>
                            {videoBlobs[course._id] && videoBlobs[course._id][idx] ? (
                              <video controls className="w-full max-h-56 rounded-lg" src={videoBlobs[course._id][idx]}>
                                Your browser does not support the video tag.
                              </video>
                            ) : (
                              <div className="p-4 rounded-lg bg-white/5 text-slate-400 text-center text-xs flex items-center justify-center gap-2">
                                <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                                Loading video stream...
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Enroll / Razorpay Buy Button */}
                <div className="mt-5 pt-4 border-t border-white/5">
                  <button
                    disabled={isProcessing}
                    onClick={() => {
                      if (enrolled) return setOpenCourseId(opened ? null : course._id);
                      handleEnrollOrBuy(course);
                    }}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      enrolled
                        ? 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                        : isFree
                        ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
                        : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/40'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Initiating Razorpay...
                      </span>
                    ) : enrolled ? (
                      opened ? 'Hide Course Curriculum' : 'View Course Curriculum'
                    ) : isFree ? (
                      'Enroll for Free'
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        Buy with Razorpay ({price})
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Payment Success Confirmation Modal */}
      <PaymentSuccessModal
        isOpen={Boolean(successPayment)}
        onClose={() => setSuccessPayment(null)}
        paymentData={successPayment}
      />
    </div>
  );
}

/* =====================================================
   MAIN COURSES VIEW
===================================================== */
export default function Courses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("catalog"); // 'catalog' | 'create'

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/courses`);
      if (!res.ok) throw new Error('Failed to fetch courses');
      const data = await res.json();
      const filtered = (data.courses || []).filter(c => (c.companyId || c.companyName));
      setCourses(filtered);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const isCompany = user?.userType === 'company';

  return (
    <div className="min-h-screen bg-[#030014] text-white py-10 px-4 sm:px-6 relative overflow-hidden">
      {/* Background ambient glowing orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Verified Industry Curriculum
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
              Skill Acceleration Courses
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Upskill with hands-on video masterclasses created by industry experts, backed by instant Razorpay enrollments.
            </p>
          </div>

          {/* Navigation Pill switcher for companies */}
          {isCompany && (
            <div className="flex items-center p-1 bg-white/5 border border-white/10 rounded-2xl">
              <button
                onClick={() => setActiveTab("catalog")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  activeTab === "catalog"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Browse Catalog
              </button>
              <button
                onClick={() => setActiveTab("create")}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  activeTab === "create"
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Publish Course
              </button>
            </div>
          )}
        </div>

        {/* Tab Content */}
        {activeTab === "create" && isCompany ? (
          <CompanyCreateCourse
            onCourseCreated={() => {
              setActiveTab("catalog");
              fetchCourses();
            }}
          />
        ) : (
          <StudentCourses
            courses={courses}
            loading={loading}
            onRefresh={fetchCourses}
          />
        )}
      </div>
    </div>
  );
}
