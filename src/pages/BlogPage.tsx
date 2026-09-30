import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Calendar, 
  Clock, 
  User, 
  ArrowRight, 
  Share2, 
  CheckCircle2, 
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { BLOG_POSTS, COMPANY_INFO } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface BlogPageProps {
  slug?: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  slug,
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const activePost = slug ? BLOG_POSTS.find((p) => p.slug === slug) : null;

  const categories = ['all', 'Visa Guide', 'Scholarships', 'Country Comparison', 'Test Prep'];

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesSearch = 
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      post.category.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedCategory !== 'all' && post.category !== selectedCategory) {
      return false;
    }

    return true;
  });

  // DETAIL VIEW
  if (activePost) {
    return (
      <div className="min-h-screen bg-slate-50 pb-24">
        <SEOHelper
          title={`${activePost.title} | COS Education Blog`}
          description={activePost.excerpt}
          canonicalPath={`/blog/${activePost.slug}`}
          ogType="article"
        />

        <div className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto space-y-4">
            <button
              onClick={() => onNavigate('blog')}
              className="inline-flex items-center gap-1.5 text-xs text-blue-300 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Articles</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
                {activePost.category}
              </span>
              <span className="text-xs text-slate-400">• {activePost.readTime}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display leading-tight">
              {activePost.title}
            </h1>

            <div className="flex items-center gap-3 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-2">
                <img
                  src={activePost.author.avatar}
                  alt={activePost.author.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>By {activePost.author.name} ({activePost.author.role})</span>
              </div>
              <span>•</span>
              <span>Published on {activePost.date}</span>
            </div>
          </div>
        </div>

        <Breadcrumbs
          items={[
            { label: 'Resources & Blog', route: 'blog' },
            { label: activePost.title }
          ]}
          onNavigate={onNavigate}
        />

        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <img
              src={activePost.coverImage}
              alt={activePost.title}
              className="w-full h-72 sm:h-96 object-cover"
            />

            <div className="p-6 sm:p-10 space-y-8">
              {/* Excerpt Lead */}
              <p className="text-base sm:text-lg text-slate-700 font-medium leading-relaxed border-l-4 border-blue-600 pl-4 italic">
                "{activePost.excerpt}"
              </p>

              {/* Main Body */}
              <div className="text-slate-800 text-sm sm:text-base leading-relaxed space-y-4">
                {Array.isArray(activePost.content) ? (
                  activePost.content.map((para: string, idx: number) => (
                    <p key={idx}>{para}</p>
                  ))
                ) : (
                  <p>{activePost.content}</p>
                )}
              </div>

              {/* CTA Inside Article */}
              <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Need personalized guidance on this topic?</h4>
                  <p className="text-xs text-slate-600 mt-0.5">Speak with our senior counselor in Sylhet for free.</p>
                </div>
                <button
                  onClick={() => onOpenConsultationModal()}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0 cursor-pointer shadow-xs"
                >
                  Book Free Consultation
                </button>
              </div>

              {/* Tags */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Related Tags:</span>
                {activePost.tags.map((t, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  // LIST VIEW
  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHelper
        title="Study Abroad Guides, Visa Updates & IELTS Resources | COS Education"
        description="Comprehensive guides on UK graduate route visa, Finland Schengen permits, statement of purpose drafting, IELTS test prep, and budget planning."
        canonicalPath="/blog"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Student Knowledge Base</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Resources & Guides
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Stay up to date with verified international student policy changes, visa rules, scholarship opportunities, and preparation strategies.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Resources & Blog' }]}
        onNavigate={onNavigate}
      />

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search guides, visas, or topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer capitalize ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {cat === 'all' ? 'All Guides' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onNavigate('blog', post.slug)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between cursor-pointer group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs rounded-lg text-[11px] font-bold text-blue-600 shadow-xs">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
