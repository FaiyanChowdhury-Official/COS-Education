import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  Edit3,
  Trash2,
  Building,
  GraduationCap,
  Clock,
  Award,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface ProgramItem {
  id: number;
  slug: string;
  name: string;
  universityId: number | null;
  universityName: string;
  universitySlug: string;
  country: string;
  countrySlug: string;
  degree: string;
  discipline: string;
  duration: string;
  tuition: string;
  intakes: string[];
  englishRequirement: string;
  entryRequirements: string;
  scholarshipAvailable: boolean;
  scholarshipDetails: string | null;
  overview: string | null;
  careerOutcomes: string[];
  applicationDeadline: string | null;
}

export const AdminPrograms: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState<ProgramItem | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formUniName, setFormUniName] = useState('University of Hertfordshire');
  const [formCountry, setFormCountry] = useState('United Kingdom');
  const [formDegree, setFormDegree] = useState('Master');
  const [formDiscipline, setFormDiscipline] = useState('Computer Science & AI');
  const [formDuration, setFormDuration] = useState('1 Year Full-Time');
  const [formTuition, setFormTuition] = useState('£16,500 / year');
  const [formIntakes, setFormIntakes] = useState('September, January');
  const [formEnglish, setFormEnglish] = useState('IELTS 6.0 (min 5.5)');
  const [formEntry, setFormEntry] = useState('Bachelor degree with CGPA 2.60+');
  const [formScholarshipAvail, setFormScholarshipAvail] = useState(true);
  const [formScholarshipDetails, setFormScholarshipDetails] = useState('£2,000 – £4,000 Early Bird & Merit');
  const [formOverview, setFormOverview] = useState('');

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/programs', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setPrograms(data);
      }
      const uniRes = await fetch('/api/admin/universities', { headers: getAuthHeaders() });
      if (uniRes.ok) setUniversities(await uniRes.json());
    } catch (e) {
      console.error('Error loading programs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, [user]);

  const handleOpenAdd = () => {
    setEditingProg(null);
    setFormName('');
    setFormUniName(universities[0]?.name || 'University of Hertfordshire');
    setFormCountry(universities[0]?.country || 'United Kingdom');
    setFormDegree('Master');
    setFormDiscipline('Computer Science & AI');
    setFormDuration('1 Year Full-Time');
    setFormTuition('£16,500 / year');
    setFormIntakes('September, January');
    setFormEnglish('IELTS 6.0 (min 5.5)');
    setFormEntry('Bachelor degree with CGPA 2.60+');
    setFormScholarshipAvail(true);
    setFormScholarshipDetails('£2,000 – £4,000 Early Bird & Merit');
    setFormOverview('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prog: ProgramItem) => {
    setEditingProg(prog);
    setFormName(prog.name);
    setFormUniName(prog.universityName);
    setFormCountry(prog.country);
    setFormDegree(prog.degree);
    setFormDiscipline(prog.discipline);
    setFormDuration(prog.duration);
    setFormTuition(prog.tuition);
    setFormIntakes((prog.intakes || []).join(', '));
    setFormEnglish(prog.englishRequirement);
    setFormEntry(prog.entryRequirements);
    setFormScholarshipAvail(prog.scholarshipAvailable);
    setFormScholarshipDetails(prog.scholarshipDetails || '');
    setFormOverview(prog.overview || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this degree program?')) return;
    try {
      const res = await fetch(`/api/admin/programs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        setPrograms((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (e) {
      console.error('Error deleting program:', e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUni = universities.find((u) => u.name === formUniName);

    const payload = {
      name: formName,
      slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      universityId: matchedUni?.id || null,
      universityName: formUniName,
      universitySlug: matchedUni?.slug || formUniName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      country: formCountry,
      countrySlug: formCountry.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      degree: formDegree,
      discipline: formDiscipline,
      duration: formDuration,
      tuition: formTuition,
      intakes: formIntakes.split(',').map((s) => s.trim()).filter(Boolean),
      englishRequirement: formEnglish,
      entryRequirements: formEntry,
      scholarshipAvailable: formScholarshipAvail,
      scholarshipDetails: formScholarshipDetails,
      overview: formOverview,
      careerOutcomes: ['Software Engineer', 'Systems Architect', 'Tech Lead'],
    };

    try {
      if (editingProg) {
        const res = await fetch(`/api/admin/programs/${editingProg.id}`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const updated = await res.json();
          setPrograms((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
          setIsModalOpen(false);
        }
      } else {
        const res = await fetch('/api/admin/programs', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const created = await res.json();
          setPrograms((prev) => [created, ...prev]);
          setIsModalOpen(false);
        }
      }
    } catch (e) {
      console.error('Error saving program:', e);
    }
  };

  const filteredProgs = programs.filter((p) => {
    if (selectedDegree !== 'all' && p.degree !== selectedDegree) return false;
    if (selectedCountry !== 'all' && p.country !== selectedCountry) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.universityName.toLowerCase().includes(q) ||
        p.discipline.toLowerCase().includes(q)
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
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Academic Degree Programs</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredProgs.length} Programs
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Undergraduate, Postgraduate, and PhD courses linked with global university network entry criteria.
          </p>
        </div>

        {user.role === 'admin' && (
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Program</span>
          </button>
        )}
      </div>

      {/* Filters Toolbar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search degree, university, discipline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedDegree}
            onChange={(e) => setSelectedDegree(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Degree Levels</option>
            <option value="Bachelor">Bachelor</option>
            <option value="Master">Master</option>
            <option value="PhD">PhD / Doctorate</option>
          </select>
        </div>

        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Countries</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Finland">Finland</option>
            <option value="United States">United States</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Malta">Malta</option>
          </select>
        </div>
      </div>

      {/* Programs List */}
      <div className="space-y-3">
        {filteredProgs.map((prog) => (
          <div
            key={prog.id}
            className="p-4 bg-slate-950 border border-slate-800 rounded-xl hover:border-slate-700 transition-all shadow-sm space-y-2"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{prog.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                    {prog.degree}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    {prog.discipline}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {prog.universityName} • {prog.country} • Duration: {prog.duration}
                </div>
              </div>

              {user.role === 'admin' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(prog)}
                    className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(prog.id)}
                    className="p-1.5 text-rose-400 hover:text-rose-300 rounded hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
              <div>Tuition: <span className="text-white font-medium">{prog.tuition}</span></div>
              <div>English: <span className="text-slate-300">{prog.englishRequirement}</span></div>
              <div>Intakes: <span className="text-emerald-400">{(prog.intakes || []).join(', ')}</span></div>
              <div className="sm:col-span-3 text-slate-400 pt-1 border-t border-slate-800/60">
                Entry Criteria: <span className="text-slate-200">{prog.entryRequirements}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD / EDIT PROGRAM MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingProg ? 'Edit Program Details' : 'Add Degree Program'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 mt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Program Title *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">University *</label>
                  <select
                    value={formUniName}
                    onChange={(e) => {
                      setFormUniName(e.target.value);
                      const m = universities.find((u) => u.name === e.target.value);
                      if (m) setFormCountry(m.country);
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    {universities.map((u) => (
                      <option key={u.id} value={u.name}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Country</label>
                  <input
                    type="text"
                    readOnly
                    value={formCountry}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Degree Level</label>
                  <select
                    value={formDegree}
                    onChange={(e) => setFormDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Bachelor">Bachelor</option>
                    <option value="Master">Master</option>
                    <option value="PhD">PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Discipline</label>
                  <input
                    type="text"
                    value={formDiscipline}
                    onChange={(e) => setFormDiscipline(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tuition Fee</label>
                  <input
                    type="text"
                    value={formTuition}
                    onChange={(e) => setFormTuition(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Duration</label>
                  <input
                    type="text"
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">English Requirement</label>
                  <input
                    type="text"
                    value={formEnglish}
                    onChange={(e) => setFormEnglish(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Intakes</label>
                  <input
                    type="text"
                    value={formIntakes}
                    onChange={(e) => setFormIntakes(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Entry Criteria</label>
                  <input
                    type="text"
                    value={formEntry}
                    onChange={(e) => setFormEntry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Scholarship Details</label>
                  <input
                    type="text"
                    value={formScholarshipDetails}
                    onChange={(e) => setFormScholarshipDetails(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
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
                  {editingProg ? 'Save Changes' : 'Create Program'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
