import React, { useState } from 'react';
import {
  Award,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
} from 'lucide-react';
import { SCHOLARSHIPS as initialScholarships } from '../data/mockData';
import { Scholarship } from '../types';

export const AdminScholarships: React.FC = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>(initialScholarships);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Scholarship | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCountry, setFormCountry] = useState('United Kingdom');
  const [formAward, setFormAward] = useState('');
  const [formCoverage, setFormCoverage] = useState<'Full Tuition' | 'Partial Tuition' | 'Living Allowance' | 'Travel Grant'>('Partial Tuition');
  const [formCriteria, setFormCriteria] = useState('');
  const [formDeadline, setFormDeadline] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDegrees, setFormDegrees] = useState<string>('Bachelor, Master');

  const filteredItems = scholarships.filter((s) => {
    if (selectedCountry !== 'all' && s.country.toLowerCase() !== selectedCountry.toLowerCase()) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCountry('United Kingdom');
    setFormAward('Up to £5,000');
    setFormCoverage('Partial Tuition');
    setFormCriteria('Minimum CGPA 3.3/4.0 and IELTS 6.5');
    setFormDeadline('May 31, 2027');
    setFormDescription('');
    setFormDegrees('Bachelor, Master');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Scholarship) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCountry(item.country);
    setFormAward(item.amount);
    setFormCoverage(item.coverageType);
    setFormCriteria(item.criteria);
    setFormDeadline(item.deadline);
    setFormDescription(item.description);
    setFormDegrees(item.degreeLevel.join(', '));
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this scholarship entry?')) {
      setScholarships((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const degreeLevels = formDegrees
      .split(',')
      .map((d) => d.trim())
      .filter((d): d is 'Bachelor' | 'Master' | 'PhD' => ['Bachelor', 'Master', 'PhD'].includes(d));

    if (editingItem) {
      setScholarships((prev) =>
        prev.map((s) =>
          s.id === editingItem.id
            ? {
                ...s,
                title: formTitle,
                country: formCountry,
                amount: formAward,
                coverageType: formCoverage,
                criteria: formCriteria,
                deadline: formDeadline,
                description: formDescription,
                degreeLevel: degreeLevels.length > 0 ? degreeLevels : ['Bachelor', 'Master'],
              }
            : s
        )
      );
    } else {
      const newItem: Scholarship = {
        id: `sch-${Date.now()}`,
        title: formTitle,
        country: formCountry,
        amount: formAward,
        coverageType: formCoverage,
        criteria: formCriteria,
        deadline: formDeadline,
        description: formDescription,
        degreeLevel: degreeLevels.length > 0 ? degreeLevels : ['Bachelor', 'Master'],
      };
      setScholarships((prev) => [newItem, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-800/60 p-6 rounded-2xl border border-slate-700/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Scholarships Directory</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage international grant programs, university tuition reductions, and embassy scholarships.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Scholarship</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="p-3 bg-slate-900 border border-slate-700/60 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search scholarships by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-hidden focus:border-emerald-500"
          />
        </div>

        <div>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-hidden focus:border-emerald-500"
          >
            <option value="all">All Countries</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Finland">Finland</option>
            <option value="United States">United States</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Malta">Malta</option>
            <option value="Greece">Greece</option>
            <option value="Cyprus">Cyprus</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((sch) => (
          <div
            key={sch.id}
            className="bg-slate-800/70 border border-slate-700/60 hover:border-slate-600 rounded-2xl p-5 flex flex-col justify-between transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  {sch.country}
                </span>
                <span className="text-xs text-slate-400 font-mono">{sch.coverageType}</span>
              </div>

              <h3 className="font-bold text-white text-base leading-snug">{sch.title}</h3>
              <p className="text-xs text-slate-400 line-clamp-2">{sch.description}</p>

              <div className="pt-2 border-t border-slate-700/60 space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Award Value:</span>
                  <span className="font-bold text-emerald-400">{sch.amount}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Deadline:</span>
                  <span className="font-mono text-slate-300">{sch.deadline}</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-500">Degree Levels:</span>
                  <span className="text-slate-300 font-medium">{sch.degreeLevel.join(', ')}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-slate-700/60">
              <button
                onClick={() => handleOpenEdit(sch)}
                className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(sch.id)}
                className="p-1.5 rounded-lg bg-slate-700/60 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors cursor-pointer"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-base">
                {editingItem ? 'Edit Scholarship Listing' : 'Create Scholarship Entry'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Scholarship Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. British Council Women in STEM Scholarship"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Country</label>
                  <select
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Finland">Finland</option>
                    <option value="United States">United States</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Malta">Malta</option>
                    <option value="Greece">Greece</option>
                    <option value="Cyprus">Cyprus</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Award Amount</label>
                  <input
                    type="text"
                    required
                    value={formAward}
                    onChange={(e) => setFormAward(e.target.value)}
                    placeholder="e.g. £10,000 / 50% Tuition"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Coverage Type</label>
                  <select
                    value={formCoverage}
                    onChange={(e) => setFormCoverage(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  >
                    <option value="Partial Tuition">Partial Tuition</option>
                    <option value="Full Tuition">Full Tuition</option>
                    <option value="Living Allowance">Living Allowance</option>
                    <option value="Travel Grant">Travel Grant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Application Deadline</label>
                  <input
                    type="text"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    placeholder="e.g. May 31, 2027"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Degree Levels (comma separated)</label>
                <input
                  type="text"
                  value={formDegrees}
                  onChange={(e) => setFormDegrees(e.target.value)}
                  placeholder="Bachelor, Master, PhD"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Eligibility Criteria</label>
                <input
                  type="text"
                  value={formCriteria}
                  onChange={(e) => setFormCriteria(e.target.value)}
                  placeholder="CGPA 3.3+, IELTS 6.5+, STEM field"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Overview Description</label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                  placeholder="Summary of scholarship benefits and selection process..."
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
