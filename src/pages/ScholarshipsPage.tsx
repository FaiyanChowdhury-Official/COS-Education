import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Search, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  CheckCircle2, 
  ArrowRight,
  Info,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { SCHOLARSHIPS, DESTINATIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface ScholarshipsPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const ScholarshipsPage: React.FC<ScholarshipsPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [degreeFilter, setDegreeFilter] = useState('all');
  const [coverageFilter, setCoverageFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'title-asc' | 'title-desc'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleFilterChange = (setter: (v: any) => void, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCountryFilter('all');
    setDegreeFilter('all');
    setCoverageFilter('all');
    setSortBy('featured');
    setCurrentPage(1);
  };

  const filteredAndSortedScholarships = useMemo(() => {
    const result = SCHOLARSHIPS.filter((sch) => {
      const matchesSearch = 
        sch.title.toLowerCase().includes(search.toLowerCase()) ||
        sch.country.toLowerCase().includes(search.toLowerCase()) ||
        sch.description.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (countryFilter !== 'all' && !sch.country.toLowerCase().includes(countryFilter.toLowerCase())) {
        return false;
      }

      if (degreeFilter !== 'all' && !sch.degreeLevel.includes(degreeFilter as any)) {
        return false;
      }

      if (coverageFilter !== 'all' && !sch.coverageType.toLowerCase().includes(coverageFilter.toLowerCase())) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      return 0;
    });

    return result;
  }, [search, countryFilter, degreeFilter, coverageFilter, sortBy]);

  const totalItems = filteredAndSortedScholarships.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const currentItems = filteredAndSortedScholarships.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHelper
        title="International Scholarships & Tuition Fee Waivers 2026/27"
        description="Explore scholarships, merit awards, and university fee discounts in the UK, Finland, USA, Malaysia, and Europe for international students."
        canonicalPath="/scholarships"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Award className="w-3.5 h-3.5" />
            <span>Fund Your Education</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Scholarships & Financial Aid
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Maximize your chances of securing tuition fee discounts, early-bird incentives, and merit scholarships with professional counselor assistance.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Scholarships' }]}
        onNavigate={onNavigate}
      />

      {/* Filters & Sorting Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search scholarship name or country..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Country */}
            <div>
              <select
                value={countryFilter}
                onChange={(e) => handleFilterChange(setCountryFilter, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Countries</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.slug} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Degree Level */}
            <div>
              <select
                value={degreeFilter}
                onChange={(e) => handleFilterChange(setDegreeFilter, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Study Levels</option>
                <option value="Bachelor">Bachelor Degree</option>
                <option value="Master">Master Degree</option>
                <option value="PhD">PhD / Doctorate</option>
              </select>
            </div>

            {/* Sorting */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
              >
                <option value="featured">Sort: Featured</option>
                <option value="title-asc">Sort: Title (A - Z)</option>
                <option value="title-desc">Sort: Title (Z - A)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-4">
              {(search || countryFilter !== 'all' || degreeFilter !== 'all' || coverageFilter !== 'all') && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            <div className="text-slate-500">
              Showing <strong className="text-slate-800">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong>–
              <strong className="text-slate-800">{Math.min(currentPage * pageSize, totalItems)}</strong> of{' '}
              <strong className="text-slate-800">{totalItems}</strong> scholarships
            </div>
          </div>
        </div>
      </div>

      {/* Scholarship Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {totalItems === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
            <Award className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No scholarships match your filters</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Institutions across our global university network frequently announce new funding opportunities. Contact our team to check university-specific scholarships and fee reductions.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((sch) => (
              <div 
                key={sch.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg transition-all space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {sch.country}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{sch.coverageType}</span>
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {sch.title}
                  </h3>

                  <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-100 flex items-center justify-between">
                    <span className="text-xs text-emerald-800 font-medium">Award Value:</span>
                    <span className="text-base font-extrabold text-emerald-600 font-display">{sch.amount}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {sch.description}
                  </p>

                  <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span>Applicable for: {sch.degreeLevel.join(', ')}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>Deadline: {sch.deadline}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => onOpenConsultationModal(sch.country.toLowerCase())}
                    className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Check Eligibility & Apply</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === page
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/20'
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
