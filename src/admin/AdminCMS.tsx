import React, { useState, useEffect } from 'react';
import {
  FileText,
  Calendar,
  HelpCircle,
  Trophy,
  Plus,
  Edit3,
  Trash2,
  Search,
  CheckCircle2,
  X,
  ExternalLink,
  Tag,
  Clock,
  MapPin,
  Eye,
  Share2,
  Send,
  Sparkles,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export const AdminCMS: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'blog' | 'events' | 'faqs' | 'stories'>('blog');

  const [blogs, setBlogs] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Social Automation from Blog
  const [socialModalBlog, setSocialModalBlog] = useState<any | null>(null);
  const [generatingSocial, setGeneratingSocial] = useState(false);
  const [generatedSocialPackage, setGeneratedSocialPackage] = useState<any | null>(null);
  const [socialToast, setSocialToast] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Blog Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('Visa Guidance');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogTags, setBlogTags] = useState('UK Visa, Graduate Route, Student Tips');
  const [blogPublished, setBlogPublished] = useState(true);

  // Event Form State
  const [eventTitle, setEventTitle] = useState('');
  const [eventType, setEventType] = useState('University Open Day');
  const [eventDate, setEventDate] = useState('2026-10-15');
  const [eventTime, setEventTime] = useState('03:00 PM – 06:00 PM');
  const [eventLocation, setEventLocation] = useState('COS Education Sylhet Office');
  const [eventSpeaker, setEventSpeaker] = useState('International Admissions Director');
  const [eventLink, setEventLink] = useState('');

  // FAQ Form State
  const [faqCategory, setFaqCategory] = useState('Admissions');
  const [faqQuestion, setFaqQuestion] = useState('');
  const [faqAnswer, setFaqAnswer] = useState('');

  // Story Form State
  const [storyStudent, setStoryStudent] = useState('');
  const [storyUni, setStoryUni] = useState('');
  const [storyProg, setStoryProg] = useState('');
  const [storyVisaDate, setStoryVisaDate] = useState('2026-08-10');
  const [storyQuote, setStoryQuote] = useState('');

  const fetchCMSData = async () => {
    setLoading(true);
    try {
      const [bRes, eRes, fRes, sRes] = await Promise.all([
        fetch('/api/admin/blogs', { headers: getAuthHeaders() }),
        fetch('/api/admin/events', { headers: getAuthHeaders() }),
        fetch('/api/admin/faqs', { headers: getAuthHeaders() }),
        fetch('/api/admin/stories', { headers: getAuthHeaders() }),
      ]);
      if (bRes.ok) setBlogs(await bRes.json());
      if (eRes.ok) setEvents(await eRes.json());
      if (fRes.ok) setFaqs(await fRes.json());
      if (sRes.ok) setStories(await sRes.json());
    } catch (err) {
      console.error('Error fetching CMS content:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCMSData();
  }, [user]);

  // Open modal handlers
  const handleOpenAdd = () => {
    setEditingItem(null);
    if (activeTab === 'blog') {
      setBlogTitle('');
      setBlogCategory('Visa Guidance');
      setBlogExcerpt('');
      setBlogContent('');
      setBlogTags('Study Abroad, Student Visa');
      setBlogPublished(true);
    } else if (activeTab === 'events') {
      setEventTitle('');
      setEventType('Education Expo');
      setEventDate('2026-11-01');
      setEventTime('11:00 AM');
      setEventLocation('COS Education Center, Sylhet');
      setEventSpeaker('');
      setEventLink('');
    } else if (activeTab === 'faqs') {
      setFaqCategory('Visa');
      setFaqQuestion('');
      setFaqAnswer('');
    } else if (activeTab === 'stories') {
      setStoryStudent('');
      setStoryUni('University of Hertfordshire');
      setStoryProg('MSc International Business');
      setStoryVisaDate('2026-08-15');
      setStoryQuote('');
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    if (activeTab === 'blog') {
      setBlogTitle(item.title);
      setBlogCategory(item.category);
      setBlogExcerpt(item.excerpt || '');
      setBlogContent(item.content);
      setBlogTags((item.tags || []).join(', '));
      setBlogPublished(item.published);
    } else if (activeTab === 'events') {
      setEventTitle(item.title);
      setEventType(item.type);
      setEventDate(item.date);
      setEventTime(item.time);
      setEventLocation(item.location);
      setEventSpeaker(item.speaker || '');
      setEventLink(item.registrationLink || '');
    } else if (activeTab === 'faqs') {
      setFaqCategory(item.category);
      setFaqQuestion(item.question);
      setFaqAnswer(item.answer);
    } else if (activeTab === 'stories') {
      setStoryStudent(item.studentName);
      setStoryUni(item.university);
      setStoryProg(item.program);
      setStoryVisaDate(item.visaGrantDate || '');
      setStoryQuote(item.quote);
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this record?')) return;
    const endpoint = `/api/admin/${activeTab === 'stories' ? 'stories' : activeTab === 'blog' ? 'blogs' : activeTab}/${id}`;
    try {
      const res = await fetch(endpoint, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        if (activeTab === 'blog') setBlogs((p) => p.filter((x) => x.id !== id));
        if (activeTab === 'events') setEvents((p) => p.filter((x) => x.id !== id));
        if (activeTab === 'faqs') setFaqs((p) => p.filter((x) => x.id !== id));
        if (activeTab === 'stories') setStories((p) => p.filter((x) => x.id !== id));
      }
    } catch (e) {
      console.error('Error deleting record:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let payload: any = {};
    let endpoint = `/api/admin/${activeTab === 'stories' ? 'stories' : activeTab === 'blog' ? 'blogs' : activeTab}`;

    if (activeTab === 'blog') {
      payload = {
        title: blogTitle,
        slug: blogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        category: blogCategory,
        excerpt: blogExcerpt,
        content: blogContent,
        tags: blogTags.split(',').map((s) => s.trim()).filter(Boolean),
        published: blogPublished,
      };
    } else if (activeTab === 'events') {
      payload = {
        title: eventTitle,
        slug: eventTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        type: eventType,
        date: eventDate,
        time: eventTime,
        location: eventLocation,
        speaker: eventSpeaker,
        registrationLink: eventLink,
      };
    } else if (activeTab === 'faqs') {
      payload = {
        category: faqCategory,
        question: faqQuestion,
        answer: faqAnswer,
        order: 1,
      };
    } else if (activeTab === 'stories') {
      payload = {
        studentName: storyStudent,
        university: storyUni,
        program: storyProg,
        visaGrantDate: storyVisaDate,
        quote: storyQuote,
        country: 'United Kingdom',
      };
    }

    try {
      if (editingItem) {
        const res = await fetch(`${endpoint}/${editingItem.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          if (activeTab === 'blog') setBlogs((p) => p.map((x) => (x.id === updated.id ? updated : x)));
          if (activeTab === 'events') setEvents((p) => p.map((x) => (x.id === updated.id ? updated : x)));
          if (activeTab === 'faqs') setFaqs((p) => p.map((x) => (x.id === updated.id ? updated : x)));
          if (activeTab === 'stories') setStories((p) => p.map((x) => (x.id === updated.id ? updated : x)));
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          if (activeTab === 'blog') setBlogs((p) => [created, ...p]);
          if (activeTab === 'events') setEvents((p) => [created, ...p]);
          if (activeTab === 'faqs') setFaqs((p) => [created, ...p]);
          if (activeTab === 'stories') setStories((p) => [created, ...p]);
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Error saving CMS record:', err);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Website Content Management (CMS)</h1>
          <p className="text-xs text-slate-400 mt-1">
            Author blog insights, post admission fairs, update student visa success stories, and manage live FAQs.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add New {activeTab === 'blog' ? 'Article' : activeTab === 'events' ? 'Event' : activeTab === 'faqs' ? 'FAQ' : 'Visa Story'}</span>
          </button>
        )}
      </div>

      {/* Sub-Tabs */}
      <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1">
        <button
          onClick={() => setActiveTab('blog')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'blog' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Articles & Insights ({blogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'events' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Fairs & Events ({events.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('faqs')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'faqs' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>FAQs ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('stories')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'stories' ? 'bg-emerald-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Visa Success Stories ({stories.length})</span>
        </button>
      </div>

      {/* Tab 1: Blog Articles */}
      {activeTab === 'blog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {blogs.map((b) => (
            <div
              key={b.id}
              className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-md space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{b.title}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      b.published ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {b.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Category: <span className="text-slate-200 font-medium">{b.category}</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(b)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(b.id)} className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <p className="text-xs text-slate-400 line-clamp-2">{b.excerpt || b.content}</p>

              <div className="flex flex-wrap gap-1 pt-1">
                {(b.tags || []).map((t: string) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={async () => {
                    setSocialModalBlog(b);
                    setGeneratingSocial(true);
                    setGeneratedSocialPackage(null);
                    try {
                      const res = await fetch('/api/admin/communications/generate-from-blog', {
                        method: 'POST',
                        headers: { ...getAuthHeaders(), 'Content-Type': 'application/json' },
                        body: JSON.stringify({ blogId: b.id }),
                      });
                      if (res.ok) {
                        const data = await res.json();
                        setGeneratedSocialPackage(data.campaign);
                      }
                    } catch (e) {
                      console.error(e);
                    } finally {
                      setGeneratingSocial(false);
                    }
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs font-semibold transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Create Social Posts</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-md space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{ev.title}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {ev.type}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{ev.date} ({ev.time})</span>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(ev)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(ev.id)} className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1">
                <div>Venue: <span className="text-white font-medium">{ev.location}</span></div>
                {ev.speaker && <div>Speaker: <span className="text-slate-200">{ev.speaker}</span></div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: FAQs */}
      {activeTab === 'faqs' && (
        <div className="space-y-3">
          {faqs.map((f) => (
            <div
              key={f.id}
              className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all shadow-sm space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {f.category}
                  </span>
                  <div className="text-sm font-semibold text-white mt-1">{f.question}</div>
                </div>

                {user.role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(f)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(f.id)} className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400">{f.answer}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Stories */}
      {activeTab === 'stories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {stories.map((st) => (
            <div
              key={st.id}
              className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-md space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-bold text-white text-base">{st.studentName}</span>
                  <div className="text-xs text-slate-300 mt-0.5">
                    {st.university} — <span className="text-slate-400">{st.program}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 font-semibold mt-0.5">
                    Visa Granted: {st.visaGrantDate}
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => handleOpenEdit(st)} className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(st.id)} className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <blockquote className="text-xs italic text-slate-300 border-l-2 border-emerald-500 pl-3 py-1">
                "{st.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      )}

      {/* GLOBAL CMS MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingItem ? 'Edit' : 'Create'}{' '}
                {activeTab === 'blog' ? 'Article' : activeTab === 'events' ? 'Event' : activeTab === 'faqs' ? 'FAQ' : 'Visa Story'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs">
              {/* Blog Form */}
              {activeTab === 'blog' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={blogTitle}
                      onChange={(e) => setBlogTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Category</label>
                      <select
                        value={blogCategory}
                        onChange={(e) => setBlogCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      >
                        <option value="Visa Guidance">Visa Guidance</option>
                        <option value="Destinations">Destinations</option>
                        <option value="Scholarships">Scholarships</option>
                        <option value="Student Life">Student Life</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Tags (comma separated)</label>
                      <input
                        type="text"
                        value={blogTags}
                        onChange={(e) => setBlogTags(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Excerpt Summary</label>
                    <input
                      type="text"
                      value={blogExcerpt}
                      onChange={(e) => setBlogExcerpt(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Full Article Content</label>
                    <textarea
                      rows={4}
                      required
                      value={blogContent}
                      onChange={(e) => setBlogContent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>
                </>
              )}

              {/* Event Form */}
              {activeTab === 'events' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Event Title *</label>
                    <input
                      type="text"
                      required
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Date</label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Time</label>
                      <input
                        type="text"
                        value={eventTime}
                        onChange={(e) => setEventTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Location / Venue</label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Key Speaker / University Guest</label>
                    <input
                      type="text"
                      value={eventSpeaker}
                      onChange={(e) => setEventSpeaker(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </>
              )}

              {/* FAQ Form */}
              {activeTab === 'faqs' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Category</label>
                    <select
                      value={faqCategory}
                      onChange={(e) => setFaqCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="Admissions">Admissions</option>
                      <option value="Visas">Visas & Regulations</option>
                      <option value="Finances">Finances & Scholarships</option>
                      <option value="Post-Study">Post-Study Work</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Question *</label>
                    <input
                      type="text"
                      required
                      value={faqQuestion}
                      onChange={(e) => setFaqQuestion(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Answer *</label>
                    <textarea
                      rows={3}
                      required
                      value={faqAnswer}
                      onChange={(e) => setFaqAnswer(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>
                </>
              )}

              {/* Story Form */}
              {activeTab === 'stories' && (
                <>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Student Full Name *</label>
                    <input
                      type="text"
                      required
                      value={storyStudent}
                      onChange={(e) => setStoryStudent(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">University</label>
                      <input
                        type="text"
                        value={storyUni}
                        onChange={(e) => setStoryUni(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 font-medium mb-1">Program</label>
                      <input
                        type="text"
                        value={storyProg}
                        onChange={(e) => setStoryProg(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Visa Grant Date</label>
                    <input
                      type="date"
                      value={storyVisaDate}
                      onChange={(e) => setStoryVisaDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Student Testimonial Quote *</label>
                    <textarea
                      rows={3}
                      required
                      value={storyQuote}
                      onChange={(e) => setStoryQuote(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* SOCIAL MEDIA AUTOMATION MODAL FROM BLOG */}
      {socialModalBlog && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Social Media Promotional Package</h3>
                  <p className="text-xs text-slate-400">Generated from article: "{socialModalBlog.title}"</p>
                </div>
              </div>
              <button
                onClick={() => setSocialModalBlog(null)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {generatingSocial ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto mb-2 animate-bounce" />
                <p>Generating platform-tailored promotional copies with hashtags & CTAs...</p>
              </div>
            ) : generatedSocialPackage ? (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-blue-950/40 border border-blue-800/50 rounded-xl text-blue-300 font-semibold">
                  {generatedSocialPackage.campaignHeadline}
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-blue-400 font-bold uppercase text-[10px]">Facebook Post</div>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">{generatedSocialPackage.facebook}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-pink-400 font-bold uppercase text-[10px]">Instagram Caption</div>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">{generatedSocialPackage.instagram}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-sky-400 font-bold uppercase text-[10px]">LinkedIn Advisory Post</div>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">{generatedSocialPackage.linkedin}</p>
                  </div>

                  <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                    <div className="text-emerald-400 font-bold uppercase text-[10px]">YouTube Shorts / TikTok Script</div>
                    <p className="text-slate-300 whitespace-pre-line leading-relaxed">{generatedSocialPackage.youtubeShorts}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    onClick={() => setSocialModalBlog(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `Facebook:\n${generatedSocialPackage.facebook}\n\nInstagram:\n${generatedSocialPackage.instagram}\n\nLinkedIn:\n${generatedSocialPackage.linkedin}`
                      );
                      alert('Social package copied to clipboard! You can also manage schedules in Admin → Communications & Social Media.');
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold"
                  >
                    Copy All Captions
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
