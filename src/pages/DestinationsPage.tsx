import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  GraduationCap, 
  Clock, 
  Briefcase, 
  DollarSign,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { DESTINATIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface DestinationsPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const DestinationsPage: React.FC<DestinationsPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');

  const filteredDestinations = DESTINATIONS.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.popularPrograms.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (selectedRegion === 'europe') {
      return ['uk', 'finland', 'greece', 'malta', 'cyprus'].includes(d.slug);
    }
    if (selectedRegion === 'asia') {
      return d.slug === 'malaysia';
    }
    if (selectedRegion === 'americas') {
      return d.slug === 'usa';
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHelper
        title="Study Destinations | UK, Finland, Malaysia, USA & Europe"
        description="Explore top global education destinations. Compare tuition fees, living expenses, post-study work permits, and entry requirements for Bangladeshi students."
        canonicalPath="/destinations"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Compass className="w-3.5 h-3.5" />
            <span>Global Education Directory</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Study Destinations
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover the ideal country for your higher education journey. We provide authorized university admission and visa guidance across top global destinations.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Study Destinations' }]}
        onNavigate={onNavigate}
      />

      {/* Filters Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search country or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          {/* Region Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            <button
              onClick={() => setSelectedRegion('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedRegion === 'all'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All (7 Countries)
            </button>
            <button
              onClick={() => setSelectedRegion('europe')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedRegion === 'europe'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Europe & UK (5)
            </button>
            <button
              onClick={() => setSelectedRegion('asia')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedRegion === 'asia'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              Asia (Malaysia)
            </button>
            <button
              onClick={() => setSelectedRegion('americas')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedRegion === 'americas'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              USA
            </button>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.slug}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Cover Image + Badges */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={dest.coverImage}
                  alt={`Study in ${dest.name}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent"></div>
                
                <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-xl text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1.5">
                  <span className="text-base">{dest.flag}</span>
                  <span>{dest.name}</span>
                </div>

                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[11px] font-semibold bg-emerald-600 px-2.5 py-0.5 rounded-md inline-block mb-1">
                    Post-Study Work: {dest.postStudyWork.split(' ')[0]} {dest.postStudyWork.split(' ')[1]}
                  </span>
                  <p className="text-xs text-slate-200 line-clamp-1">{dest.heroSubtitle}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    Study in {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {dest.overview}
                  </p>
                </div>

                {/* Key Facts List */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <DollarSign className="w-3.5 h-3.5 text-blue-600" />
                      Tuition Fees:
                    </span>
                    <span className="font-semibold text-slate-900">{dest.tuitionRange.split('(')[0]}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-indigo-600" />
                      Work While Studying:
                    </span>
                    <span className="font-semibold text-slate-900">{dest.workRights.split('during')[0]}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                      Scholarships:
                    </span>
                    <span className="font-semibold text-emerald-600">Available</span>
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => onNavigate('destinations', dest.slug)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold text-center transition-colors cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>Full Country Guide</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onOpenConsultationModal(dest.slug)}
                    className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
