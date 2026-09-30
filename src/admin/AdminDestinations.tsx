import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  Plus,
  Edit3,
  Trash2,
  Clock,
  Briefcase,
  Wallet,
  CheckCircle2,
  X,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface DestinationItem {
  id: number;
  slug: string;
  name: string;
  flag: string | null;
  heroImage: string | null;
  overview: string | null;
  costOfLiving: string | null;
  postStudyWork: string | null;
  visaProcessingTime: string | null;
  intakes: string[];
  averageTuition: string | null;
  englishRequirement: string | null;
  popularUniversities: string[];
  keyBenefits: string[];
  featured: boolean;
  published: boolean;
}

export const AdminDestinations: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [destinations, setDestinations] = useState<DestinationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<DestinationItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formFlag, setFormFlag] = useState('🇬🇧');
  const [formCost, setFormCost] = useState('£9,207 – £12,006 / year');
  const [formPsw, setFormPsw] = useState('2 Years (Graduate Route)');
  const [formVisaTime, setFormVisaTime] = useState('3 – 4 Weeks');
  const [formIntakes, setFormIntakes] = useState('September, January');
  const [formTuition, setFormTuition] = useState('£12,000 – £20,000 / year');
  const [formEnglish, setFormEnglish] = useState('IELTS 6.0 – 6.5 (MOI accepted)');
  const [formUniversities, setFormUniversities] = useState('University of Hertfordshire, Leeds Beckett');
  const [formBenefits, setFormBenefits] = useState('2-year Graduate Route, 20 hrs/week part-time work, Dependents allowed for Master Research');
  const [formOverview, setFormOverview] = useState('');
  const [formFeatured, setFormFeatured] = useState(false);

  const fetchDestinations = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/destinations', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setDestinations(data);
      }
    } catch (e) {
      console.error('Error fetching destinations:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinations();
  }, [user]);

  const handleOpenAdd = () => {
    setEditingDest(null);
    setFormName('');
    setFormSlug('');
    setFormFlag('🇬🇧');
    setFormCost('£9,207 – £12,006 / year');
    setFormPsw('2 Years (Graduate Route)');
    setFormVisaTime('3 – 4 Weeks');
    setFormIntakes('September, January');
    setFormTuition('£12,000 – £20,000 / year');
    setFormEnglish('IELTS 6.0 – 6.5');
    setFormUniversities('University of Hertfordshire');
    setFormBenefits('Global recognition, 20 hrs part-time work');
    setFormOverview('');
    setFormFeatured(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dest: DestinationItem) => {
    setEditingDest(dest);
    setFormName(dest.name);
    setFormSlug(dest.slug);
    setFormFlag(dest.flag || '🌍');
    setFormCost(dest.costOfLiving || '');
    setFormPsw(dest.postStudyWork || '');
    setFormVisaTime(dest.visaProcessingTime || '');
    setFormIntakes((dest.intakes || []).join(', '));
    setFormTuition(dest.averageTuition || '');
    setFormEnglish(dest.englishRequirement || '');
    setFormUniversities((dest.popularUniversities || []).join(', '));
    setFormBenefits((dest.keyBenefits || []).join(', '));
    setFormOverview(dest.overview || '');
    setFormFeatured(dest.featured);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this study destination?')) return;
    try {
      const res = await fetch(`/api/admin/destinations/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setDestinations((prev) => prev.filter((d) => d.id !== id));
      }
    } catch (e) {
      console.error('Error deleting destination:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: formName,
      slug: formSlug || formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      flag: formFlag,
      costOfLiving: formCost,
      postStudyWork: formPsw,
      visaProcessingTime: formVisaTime,
      intakes: formIntakes.split(',').map((s) => s.trim()).filter(Boolean),
      averageTuition: formTuition,
      englishRequirement: formEnglish,
      popularUniversities: formUniversities.split(',').map((s) => s.trim()).filter(Boolean),
      keyBenefits: formBenefits.split(',').map((s) => s.trim()).filter(Boolean),
      overview: formOverview,
      featured: formFeatured,
      published: true,
    };

    try {
      if (editingDest) {
        const res = await fetch(`/api/admin/destinations/${editingDest.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setDestinations((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/admin/destinations', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setDestinations((prev) => [created, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (e) {
      console.error('Error saving destination:', e);
    }
  };

  const filteredDests = destinations.filter((d) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return d.name.toLowerCase().includes(q) || d.postStudyWork?.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Study Destinations CMS</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredDests.length} Destinations
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global destination guides: living expenses, PSW post-study work rights, visa timelines, and popular partner unis.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Destination</span>
          </button>
        )}
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDests.map((dest) => (
          <div
            key={dest.id}
            className="p-5 bg-slate-950 border border-slate-800 rounded-2xl hover:border-slate-700 transition-all shadow-md space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{dest.flag || '🌍'}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">{dest.name}</span>
                    {dest.featured && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    PSW: <span className="text-slate-200">{dest.postStudyWork}</span>
                  </div>
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(dest)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              <div>Living Cost: <span className="text-white font-medium">{dest.costOfLiving}</span></div>
              <div>Visa Timeline: <span className="text-emerald-400 font-medium">{dest.visaProcessingTime}</span></div>
              <div>Avg Tuition: <span className="text-slate-200">{dest.averageTuition}</span></div>
              <div>Intakes: <span className="text-slate-200">{(dest.intakes || []).join(', ')}</span></div>
            </div>

            <div className="text-xs text-slate-400">
              <span className="font-semibold text-slate-300">Partner Campuses: </span>
              {(dest.popularUniversities || []).join(' • ')}
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT DESTINATION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingDest ? 'Edit Destination' : 'Add Study Destination'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Country Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Country Flag Emoji</label>
                  <input
                    type="text"
                    value={formFlag}
                    onChange={(e) => setFormFlag(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Post-Study Work (PSW)</label>
                  <input
                    type="text"
                    value={formPsw}
                    onChange={(e) => setFormPsw(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Visa Processing Time</label>
                  <input
                    type="text"
                    value={formVisaTime}
                    onChange={(e) => setFormVisaTime(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cost of Living</label>
                  <input
                    type="text"
                    value={formCost}
                    onChange={(e) => setFormCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Average Tuition</label>
                  <input
                    type="text"
                    value={formTuition}
                    onChange={(e) => setFormTuition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Intakes</label>
                  <input
                    type="text"
                    value={formIntakes}
                    onChange={(e) => setFormIntakes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Popular Universities (comma separated)</label>
                  <input
                    type="text"
                    value={formUniversities}
                    onChange={(e) => setFormUniversities(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Key Benefits (comma separated)</label>
                  <input
                    type="text"
                    value={formBenefits}
                    onChange={(e) => setFormBenefits(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Overview Guide</label>
                  <textarea
                    rows={2}
                    value={formOverview}
                    onChange={(e) => setFormOverview(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  ></textarea>
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
                  {editingDest ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
