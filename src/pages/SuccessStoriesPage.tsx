import React, { useState } from 'react';
import { 
  Users, 
  CheckCircle2, 
  GraduationCap, 
  Award, 
  MapPin, 
  Quote, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { SUCCESS_STORIES, DESTINATIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface SuccessStoriesPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const SuccessStoriesPage: React.FC<SuccessStoriesPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [selectedCountry, setSelectedCountry] = useState('all');

  const filteredStories = selectedCountry === 'all'
    ? SUCCESS_STORIES
    : SUCCESS_STORIES.filter((s) => 
        s.countryCode.toLowerCase() === selectedCountry.toLowerCase() ||
        s.destination.toLowerCase().includes(selectedCountry.toLowerCase())
      );

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHelper
        title="Student Success Stories & Visa Testimonials | COS Education"
        description="Read inspiring real stories of Bangladeshi students who achieved university admission, scholarships, and visa approvals in the UK, Finland, USA, and Malaysia."
        canonicalPath="/success-stories"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Users className="w-3.5 h-3.5" />
            <span>Real Student Journeys</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Success Stories
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            From Sylhet to top university lecture halls around the globe. Discover how our dedicated mentors helped students make their international dreams a reality.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Success Stories' }]}
        onNavigate={onNavigate}
      />

      {/* Country Filter Buttons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <button
            onClick={() => setSelectedCountry('all')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              selectedCountry === 'all'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Stories ({SUCCESS_STORIES.length})
          </button>
          {DESTINATIONS.map((d) => (
            <button
              key={d.slug}
              onClick={() => setSelectedCountry(d.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedCountry === d.slug
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              <span>{d.flag}</span>
              <span>{d.name}</span>
            </button>
          ))}
        </div>

        {/* Stories List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                {/* Student header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={story.photo}
                      alt={story.studentName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-blue-600 shadow-sm"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 font-display">
                        {story.studentName}
                      </h3>
                      <p className="text-xs text-slate-500">{story.hometown}</p>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 mt-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {story.visaStatus}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">
                    {story.destination}
                  </span>
                </div>

                {/* Quote */}
                <div className="relative bg-blue-50/60 p-4 rounded-xl border border-blue-100 text-slate-800 text-xs italic leading-relaxed">
                  <Quote className="w-6 h-6 text-blue-300/60 absolute top-2 right-2 pointer-events-none" />
                  "{story.quote}"
                </div>

                {/* University & Degree */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">University:</span>
                    <span className="font-semibold text-slate-900">{story.university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Enrolled Course:</span>
                    <span className="font-semibold text-slate-900">{story.program}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Origin:</span>
                    <span className="text-slate-700">{story.hometown}</span>
                  </div>
                  {story.scholarshipAwarded && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Awarded Scholarship:</span>
                      <span>★ {story.scholarshipAwarded}</span>
                    </div>
                  )}
                </div>

                {/* Full Case Story */}
                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p>
                    <strong className="text-slate-800 block text-[11px] uppercase tracking-wider mb-0.5">The Journey:</strong>
                    {story.fullStory}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() => onOpenConsultationModal(story.destination)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-blue-600 text-slate-800 hover:text-white text-xs font-semibold transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Start Your Own {story.destination} Journey</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
