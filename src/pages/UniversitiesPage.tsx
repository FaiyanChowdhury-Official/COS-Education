import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  MapPin, 
  Award, 
  DollarSign, 
  ArrowRight, 
  SlidersHorizontal, 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RotateCcw
} from 'lucide-react';
import { UNIVERSITIES, DESTINATIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface UniversitiesPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const UniversitiesPage: React.FC<UniversitiesPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [intakeFilter, setIntakeFilter] = useState('all');
  const [scholarshipFilter, setScholarshipFilter] = useState(false);
  const [sortBy, setSortBy] = useState<'ranking' | 'name-asc' | 'name-desc' | 'tuition-asc' | 'tuition-desc'>('ranking');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Reset pagination on filter change
  const handleFilterChange = (setter: (v: any) => void, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCountryFilter('all');
    setTypeFilter('all');
    setIntakeFilter('all');
    setScholarshipFilter(false);
    setSortBy('ranking');
    setCurrentPage(1);
  };

  const filteredAndSortedUniversities = useMemo(() => {
    const result = UNIVERSITIES.filter((uni) => {
      // Text search
      const matchesSearch = 
        uni.name.toLowerCase().includes(search.toLowerCase()) ||
        uni.city.toLowerCase().includes(search.toLowerCase()) ||
        uni.country.toLowerCase().includes(search.toLowerCase()) ||
        uni.ranking.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      // Country filter
      if (countryFilter !== 'all' && uni.countrySlug !== countryFilter) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && uni.type !== typeFilter) {
        return false;
      }

      // Intake filter
      if (intakeFilter !== 'all' && !uni.intakes.some(i => i.toLowerCase().includes(intakeFilter.toLowerCase()))) {
        return false;
      }

      // Scholarship filter
      if (scholarshipFilter && (!uni.scholarshipsAvailable || uni.scholarshipsAvailable.toLowerCase().includes('none'))) {
        return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'ranking') {
        const getRankNum = (r: string) => {
          const match = r.match(/\d+/);
          return match ? parseInt(match[0], 10) : 9999;
        };
        return getRankNum(a.ranking) - getRankNum(b.ranking);
      }
      if (sortBy === 'tuition-asc' || sortBy === 'tuition-desc') {
        const getTuitionNum = (t: string) => {
          const match = t.replace(/,/g, '').match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        const diff = getTuitionNum(a.tuitionRange) - getTuitionNum(b.tuitionRange);
        return sortBy === 'tuition-asc' ? diff : -diff;
      }
      return 0;
    });

    return result;
  }, [search, countryFilter, typeFilter, intakeFilter, scholarshipFilter, sortBy]);

  // Pagination calculation
  const totalItems = filteredAndSortedUniversities.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const currentItems = filteredAndSortedUniversities.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHelper
        title="Global Universities Directory | UK, Finland, USA, Malaysia & Europe"
        description="Search accredited universities with low tuition fees, high world rankings, generous international scholarships, and fast admission turnaround."
        canonicalPath="/universities"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Building2 className="w-3.5 h-3.5" />
            <span>Growing Global University Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            University Directory
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Our growing global university network enables us to provide students with diverse opportunities across multiple study destinations, academic disciplines, and levels of study.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Universities' }]}
        onNavigate={onNavigate}
      />

      {/* Comprehensive Filter & Sort Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, city, ranking..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Country Filter */}
            <div>
              <select
                value={countryFilter}
                onChange={(e) => handleFilterChange(setCountryFilter, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Destinations</option>
                {DESTINATIONS.map((d) => (
                  <option key={d.slug} value={d.slug}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <select
                value={typeFilter}
                onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Institution Types</option>
                <option value="Public">Public Universities</option>
                <option value="Private">Private Universities</option>
              </select>
            </div>

            {/* Intake Filter */}
            <div>
              <select
                value={intakeFilter}
                onChange={(e) => handleFilterChange(setIntakeFilter, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Target Intakes</option>
                <option value="September">September / Fall</option>
                <option value="January">January / Winter</option>
                <option value="May">May / Summer</option>
                <option value="October">October Intake</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 font-medium focus:outline-hidden focus:border-blue-500"
              >
                <option value="ranking">Sort: Top World Ranking</option>
                <option value="name-asc">Sort: Name (A - Z)</option>
                <option value="name-desc">Sort: Name (Z - A)</option>
                <option value="tuition-asc">Sort: Tuition (Low to High)</option>
                <option value="tuition-desc">Sort: Tuition (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Secondary Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={scholarshipFilter}
                  onChange={(e) => handleFilterChange(setScholarshipFilter, e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Scholarships & Fee Waivers Only</span>
              </label>

              {(search || countryFilter !== 'all' || typeFilter !== 'all' || intakeFilter !== 'all' || scholarshipFilter) && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-slate-500 hover:text-rose-600 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>

            {/* Results counter */}
            <div className="text-slate-500">
              Showing <strong className="text-slate-800">{totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong>–
              <strong className="text-slate-800">{Math.min(currentPage * pageSize, totalItems)}</strong> of{' '}
              <strong className="text-slate-800">{totalItems}</strong> global universities
            </div>
          </div>
        </div>
      </div>

      {/* University Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {totalItems === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
            <Building2 className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No universities match your search criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your destination, intake, or keyword filters to explore more institutions.
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
            {currentItems.map((uni) => (
              <div 
                key={uni.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Header with Ranking Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={uni.coverImage}
                    alt={uni.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full text-xs font-bold text-blue-900 shadow-sm flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-blue-600" />
                    <span>{uni.ranking}</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-bold text-base leading-snug drop-shadow-xs">{uni.name}</h3>
                    <p className="text-xs text-slate-200 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-red-400" />
                      <span>{uni.city}, {uni.country}</span>
                    </p>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mb-2">
                      <span>{uni.city}</span>
                      <span>•</span>
                      <span className="capitalize">{uni.type} Institution</span>
                    </p>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {uni.overview}
                    </p>
                  </div>

                  {/* Details snapshot */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tuition Range:</span>
                      <span className="font-semibold text-slate-900">{uni.tuitionRange.split('(')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Intakes:</span>
                      <span className="font-semibold text-slate-800">{uni.intakes.join(', ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scholarships:</span>
                      <span className="font-semibold text-emerald-600">{uni.scholarshipsAvailable.split(' ')[0]} {uni.scholarshipsAvailable.split(' ')[1] || 'Available'}</span>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => onNavigate('universities', uni.slug)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-600 text-xs font-semibold transition-colors cursor-pointer text-center"
                    >
                      View University
                    </button>

                    <button
                      onClick={() => onOpenConsultationModal(uni.countrySlug)}
                      className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                    >
                      Apply Free
                    </button>
                  </div>
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
