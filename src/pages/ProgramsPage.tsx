import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  MapPin, 
  GraduationCap, 
  Clock, 
  DollarSign, 
  Award, 
  ArrowRight,
  Filter,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PROGRAMS, DESTINATIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface ProgramsPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState('all');
  const [degree, setDegree] = useState('all');
  const [discipline, setDiscipline] = useState('all');
  const [scholarshipOnly, setScholarshipOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'tuition-asc' | 'tuition-desc' | 'name-asc' | 'name-desc'>('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleFilterChange = (setter: (v: any) => void, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearch('');
    setCountry('all');
    setDegree('all');
    setDiscipline('all');
    setScholarshipOnly(false);
    setSortBy('featured');
    setCurrentPage(1);
  };

  // Filter and sort logic
  const filteredAndSortedPrograms = useMemo(() => {
    const result = PROGRAMS.filter((prog) => {
      const matchesSearch = 
        prog.name.toLowerCase().includes(search.toLowerCase()) ||
        prog.universityName.toLowerCase().includes(search.toLowerCase()) ||
        prog.discipline.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (country !== 'all' && prog.countrySlug !== country) {
        return false;
      }

      if (degree !== 'all' && prog.degree !== degree) {
        return false;
      }

      if (discipline !== 'all' && !prog.discipline.toLowerCase().includes(discipline.toLowerCase())) {
        return false;
      }

      if (scholarshipOnly && !prog.scholarshipAvailable) {
        return false;
      }

      return true;
    });

    result.sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'tuition-asc' || sortBy === 'tuition-desc') {
        const getTuitionNum = (t: string) => {
          const match = t.replace(/,/g, '').match(/\d+/);
          return match ? parseInt(match[0], 10) : 0;
        };
        const diff = getTuitionNum(a.tuition) - getTuitionNum(b.tuition);
        return sortBy === 'tuition-asc' ? diff : -diff;
      }
      return 0; // featured default order
    });

    return result;
  }, [search, country, degree, discipline, scholarshipOnly, sortBy]);

  const totalItems = filteredAndSortedPrograms.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const currentItems = filteredAndSortedPrograms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <SEOHelper
        title="Find Degree Programs | Bachelor's, Master's & PhD Worldwide"
        description="Search hundreds of undergraduate and postgraduate courses in Computer Science, Business, AI, Engineering, and Healthcare with tuition, entry criteria, and scholarship details."
        canonicalPath="/programs"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Curated Academic Finder</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Program Finder
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Discover degrees aligning with your academic qualifications, budget, and long-term career outcomes across global universities.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Programs' }]}
        onNavigate={onNavigate}
      />

      {/* Comprehensive Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search program by name, topic, or university..."
                value={search}
                onChange={(e) => handleFilterChange(setSearch, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Destination */}
            <div>
              <select
                value={country}
                onChange={(e) => handleFilterChange(setCountry, e.target.value)}
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

            {/* Degree Level */}
            <div>
              <select
                value={degree}
                onChange={(e) => handleFilterChange(setDegree, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Degree Levels</option>
                <option value="Bachelor">Bachelor Degree</option>
                <option value="Master">Master Degree</option>
                <option value="PhD">PhD / Doctorate</option>
                <option value="Foundation">Foundation Year</option>
              </select>
            </div>

            {/* Discipline */}
            <div>
              <select
                value={discipline}
                onChange={(e) => handleFilterChange(setDiscipline, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-hidden focus:border-blue-500"
              >
                <option value="all">All Disciplines</option>
                <option value="Computer Science">Computer Science & IT</option>
                <option value="Business">Business & Management</option>
                <option value="Engineering">Engineering</option>
                <option value="Data Science">Data & Artificial Intelligence</option>
                <option value="Health">Healthcare & Life Sciences</option>
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
                <option value="tuition-asc">Sort: Tuition (Low to High)</option>
                <option value="tuition-desc">Sort: Tuition (High to Low)</option>
                <option value="name-asc">Sort: Name (A - Z)</option>
                <option value="name-desc">Sort: Name (Z - A)</option>
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={scholarshipOnly}
                  onChange={(e) => handleFilterChange(setScholarshipOnly, e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Scholarships Available Only</span>
              </label>

              {(search || country !== 'all' || degree !== 'all' || discipline !== 'all' || scholarshipOnly) && (
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
              <strong className="text-slate-800">{totalItems}</strong> academic programs
            </div>
          </div>
        </div>
      </div>

      {/* Program Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {totalItems === 0 ? (
          <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-4">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800">No programs match your search criteria</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your discipline, degree level, or destination to discover alternative academic options.
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
            {currentItems.map((prog) => (
              <div 
                key={prog.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100 flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      <span>{prog.degree}</span>
                    </span>
                    <span className="text-xs font-semibold text-slate-500">{prog.country}</span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {prog.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{prog.universityName}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {prog.overview}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>{prog.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{prog.tuition}</span>
                    </div>
                  </div>

                  {prog.scholarshipAvailable && (
                    <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                      <Award className="w-3.5 h-3.5 shrink-0" />
                      <span className="font-medium truncate">{prog.scholarshipDetails || 'Merit Scholarship Available'}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                  <button
                    onClick={() => onNavigate('programs', prog.slug)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200 transition-colors cursor-pointer text-center"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => onOpenConsultationModal(prog.countrySlug)}
                    className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                  >
                    Apply Now
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
