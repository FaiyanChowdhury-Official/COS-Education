import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Edit3,
  Trash2,
  Star,
  ExternalLink,
  MapPin,
  Award,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface UniversityItem {
  id: number;
  slug: string;
  name: string;
  country: string;
  countrySlug: string;
  city: string;
  logo: string | null;
  coverImage: string | null;
  ranking: string | null;
  type: string;
  tuitionRange: string | null;
  applicationFee: string | null;
  scholarshipsAvailable: string | null;
  englishRequirements: string | null;
  intakes: string[];
  programsCount: number;
  overview: string | null;
  entryRequirements: string | null;
  applicationDeadline: string | null;
  website: string | null;
  featured: boolean;
  keyHighlights: string[];
}

export const AdminUniversities: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [universities, setUniversities] = useState<UniversityItem[]>([]);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUni, setEditingUni] = useState<UniversityItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formCountry, setFormCountry] = useState('United Kingdom');
  const [formCity, setFormCity] = useState('');
  const [formRanking, setFormRanking] = useState('');
  const [formType, setFormType] = useState('Public');
  const [formTuition, setFormTuition] = useState('');
  const [formAppFee, setFormAppFee] = useState('Free');
  const [formScholarships, setFormScholarships] = useState('');
  const [formEnglish, setFormEnglish] = useState('IELTS 6.0');
  const [formIntakes, setFormIntakes] = useState('September, January');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formWebsite, setFormWebsite] = useState('');
  const [formOverview, setFormOverview] = useState('');
  const [formHighlights, setFormHighlights] = useState('');

  const fetchUniversities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/universities', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUniversities(data);
      }
      const destRes = await fetch('/api/admin/destinations', { headers: getAuthHeaders() });
      if (destRes.ok) setDestinations(await destRes.json());
    } catch (e) {
      console.error('Error fetching universities:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [user]);

  const handleOpenAdd = () => {
    setEditingUni(null);
    setFormName('');
    setFormSlug('');
    setFormCountry('United Kingdom');
    setFormCity('');
    setFormRanking('');
    setFormType('Public');
    setFormTuition('£14,000 – £16,500 / year');
    setFormAppFee('Free');
    setFormScholarships('Up to £3,000 International Merit Bursary');
    setFormEnglish('IELTS 6.0 (or MOI waiver)');
    setFormIntakes('September, January');
    setFormFeatured(false);
    setFormWebsite('');
    setFormOverview('');
    setFormHighlights('Top-tier employability, High visa approval rate');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (uni: UniversityItem) => {
    setEditingUni(uni);
    setFormName(uni.name);
    setFormSlug(uni.slug);
    setFormCountry(uni.country);
    setFormCity(uni.city);
    setFormRanking(uni.ranking || '');
    setFormType(uni.type);
    setFormTuition(uni.tuitionRange || '');
    setFormAppFee(uni.applicationFee || '');
    setFormScholarships(uni.scholarshipsAvailable || '');
    setFormEnglish(uni.englishRequirements || '');
    setFormIntakes((uni.intakes || []).join(', '));
    setFormFeatured(uni.featured);
    setFormWebsite(uni.website || '');
    setFormOverview(uni.overview || '');
    setFormHighlights((uni.keyHighlights || []).join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this university?')) return;
    try {
      const res = await fetch(`/api/admin/universities/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setUniversities((prev) => prev.filter((u) => u.id !== id));
      }
    } catch (e) {
      console.error('Error deleting university:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formName,
      slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      country: formCountry,
      countrySlug: formCountry.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      city: formCity,
      ranking: formRanking || null,
      type: formType,
      tuitionRange: formTuition,
      applicationFee: formAppFee,
      scholarshipsAvailable: formScholarships,
      englishRequirements: formEnglish,
      intakes: formIntakes.split(',').map((s) => s.trim()).filter(Boolean),
      programsCount: editingUni ? editingUni.programsCount : 15,
      overview: formOverview,
      website: formWebsite || null,
      featured: formFeatured,
      keyHighlights: formHighlights.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (editingUni) {
        const res = await fetch(`/api/admin/universities/${editingUni.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setUniversities((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/admin/universities', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setUniversities((prev) => [created, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (e) {
      console.error('Error saving university:', e);
    }
  };

  const filteredUnis = universities.filter((u) => {
    if (selectedCountry !== 'all' && u.country !== selectedCountry) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">University Network Catalog</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredUnis.length} Universities
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global university network institutions, entry requirements, tuition brackets, and scholarship provisions.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add University</span>
          </button>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search university name, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Destination Countries</option>
            {destinations.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Universities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUnis.map((uni) => (
          <div
            key={uni.id}
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-base">{uni.name}</span>
                  {uni.featured && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-300" />
                      <span>Featured</span>
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{uni.city}, {uni.country}</span>
                  <span>•</span>
                  <span>{uni.type}</span>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(uni)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(uni.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>Tuition: <span className="text-white font-medium">{uni.tuitionRange}</span></div>
              <div>App Fee: <span className="text-emerald-400 font-medium">{uni.applicationFee}</span></div>
              <div className="col-span-2 text-slate-400">
                English: <span className="text-slate-200">{uni.englishRequirements}</span>
              </div>
              <div className="col-span-2 text-slate-400 truncate">
                Scholarships: <span className="text-amber-300">{uni.scholarshipsAvailable}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-500">
                Intakes: {(uni.intakes || []).join(', ')}
              </span>
              {uni.website && (
                <a
                  href={uni.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>Official Site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingUni ? 'Edit University Details' : 'Add University to Network'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">University Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Country *</label>
                  <select
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Finland">Finland</option>
                    <option value="United States">United States</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Malta">Malta</option>
                    <option value="Cyprus">Cyprus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">City / Campus</label>
                  <input
                    type="text"
                    required
                    value={formCity}
                    onChange={(e) => setFormCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tuition Range</label>
                  <input
                    type="text"
                    value={formTuition}
                    onChange={(e) => setFormTuition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Application Fee</label>
                  <input
                    type="text"
                    value={formAppFee}
                    onChange={(e) => setFormAppFee(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">English Requirements</label>
                  <input
                    type="text"
                    value={formEnglish}
                    onChange={(e) => setFormEnglish(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Intakes (comma separated)</label>
                  <input
                    type="text"
                    value={formIntakes}
                    onChange={(e) => setFormIntakes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Scholarships Available</label>
                  <input
                    type="text"
                    value={formScholarships}
                    onChange={(e) => setFormScholarships(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Website URL</label>
                  <input
                    type="text"
                    value={formWebsite}
                    onChange={(e) => setFormWebsite(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Overview Description</label>
                  <textarea
                    rows={2}
                    value={formOverview}
                    onChange={(e) => setFormOverview(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  ></textarea>
                </div>

                <div className="col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="uni-featured"
                    checked={formFeatured}
                    onChange={(e) => setFormFeatured(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-800 text-emerald-500"
                  />
                  <label htmlFor="uni-featured" className="text-slate-300 font-medium">
                    Mark as Featured University on Public Homepage
                  </label>
                </div>
              </div>

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
                  {editingUni ? 'Save Changes' : 'Create University'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
