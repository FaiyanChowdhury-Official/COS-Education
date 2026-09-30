import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  UserCheck,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Archive,
  Edit3,
  X,
  ExternalLink,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { useAdminAuth } from './AdminAuthContext';

export interface Student {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string | null;
  passportNumber: string | null;
  academicHistory: any;
  englishScores: any;
  targetCountry: string | null;
  targetUniversity: string | null;
  targetProgram: string | null;
  targetIntake: string | null;
  assignedCounsellorId: number | null;
  status: string;
  communicationNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

export const AdminStudents: React.FC = () => {
  const { getAuthHeaders, user } = useAdminAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [counsellors, setCounsellors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCountry, setSelectedCountry] = useState('all');

  // Detail Modal State
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'documents' | 'notes'>('overview');
  const [studentApps, setStudentApps] = useState<any[]>([]);
  const [studentDocs, setStudentDocs] = useState<any[]>([]);
  const [loadingStudentDetails, setLoadingStudentDetails] = useState(false);

  // New Student Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formDob, setFormDob] = useState('2001-05-14');
  const [formPassport, setFormPassport] = useState('');
  const [formCountry, setFormCountry] = useState('United Kingdom');
  const [formUni, setFormUni] = useState('University of Hertfordshire');
  const [formProg, setFormProg] = useState('MSc Computer Science');
  const [formIntake, setFormIntake] = useState('January 2027');
  const [formDegree, setFormDegree] = useState('BSc in CSE');
  const [formInstitution, setFormInstitution] = useState('Leading University, Sylhet');
  const [formCgpa, setFormCgpa] = useState('3.42 / 4.00');
  const [formYear, setFormYear] = useState('2025');
  const [formTestType, setFormTestType] = useState('IELTS Academic');
  const [formOverallScore, setFormOverallScore] = useState('6.5');
  const [formCounsellorId, setFormCounsellorId] = useState('');
  const [formNotes, setFormNotes] = useState('');

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/students', { headers: getAuthHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
      const teamRes = await fetch('/api/admin/team', { headers: getAuthHeaders() });
      if (teamRes.ok) {
        const team = await teamRes.json();
        setCounsellors(team);
      }
    } catch (err) {
      console.error('Error loading students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [user]);

  const handleOpenStudentDetail = async (student: Student) => {
    setActiveStudent(student);
    setActiveTab('overview');
    setLoadingStudentDetails(true);
    try {
      // Fetch applications and documents for this student
      const [appsRes, docsRes] = await Promise.all([
        fetch('/api/admin/applications', { headers: getAuthHeaders() }),
        fetch('/api/admin/documents', { headers: getAuthHeaders() }),
      ]);
      if (appsRes.ok) {
        const allApps = await appsRes.json();
        setStudentApps(allApps.filter((a: any) => a.studentId === student.id));
      }
      if (docsRes.ok) {
        const allDocs = await docsRes.json();
        setStudentDocs(allDocs.filter((d: any) => d.studentId === student.id));
      }
    } catch (e) {
      console.error('Error fetching student apps/docs:', e);
    } finally {
      setLoadingStudentDetails(false);
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newStudentPayload = {
        fullName: formName,
        email: formEmail,
        phone: formPhone,
        dateOfBirth: formDob,
        passportNumber: formPassport || null,
        academicHistory: {
          highestDegree: formDegree,
          institution: formInstitution,
          passingYear: formYear,
          cgpa: formCgpa,
        },
        englishScores: {
          test: formTestType,
          overall: formOverallScore,
          subscores: 'Listening 6.5, Reading 6.5, Writing 6.0, Speaking 6.5',
        },
        targetCountry: formCountry,
        targetUniversity: formUni,
        targetProgram: formProg,
        targetIntake: formIntake,
        assignedCounsellorId: formCounsellorId ? Number(formCounsellorId) : null,
        status: 'Active',
        communicationNotes: formNotes || null,
      };

      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newStudentPayload),
      });

      if (res.ok) {
        const created = await res.json();
        setStudents((prev) => [created, ...prev]);
        setIsAddModalOpen(false);
        // Reset form
        setFormName('');
        setFormEmail('');
        setFormPhone('');
        setFormPassport('');
        setFormNotes('');
      }
    } catch (err) {
      console.error('Error creating student:', err);
    }
  };

  const handleToggleArchive = async (student: Student) => {
    const nextStatus = student.status === 'Archived' ? 'Active' : 'Archived';
    try {
      const res = await fetch(`/api/admin/students/${student.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setStudents((prev) => prev.map((s) => (s.id === student.id ? updated : s)));
        if (activeStudent?.id === student.id) {
          setActiveStudent(updated);
        }
      }
    } catch (err) {
      console.error('Error archiving student:', err);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    if (selectedCountry !== 'all' && s.targetCountry !== selectedCountry) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = s.fullName.toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      const matchPhone = s.phone.includes(q);
      const matchUni = s.targetUniversity ? s.targetUniversity.toLowerCase().includes(q) : false;
      return matchName || matchEmail || matchPhone || matchUni;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Active Students Directory</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-semibold">
              {filteredStudents.length} Registered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Complete academic histories, verified credentials, visa filings, and student caseloads.
          </p>
        </div>

        <button
          id="admin-students-add-btn"
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Student</span>
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search students by name, email, target university..."
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
            <option value="all">All Target Countries</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Finland">Finland</option>
            <option value="United States">United States</option>
            <option value="Malaysia">Malaysia</option>
            <option value="Malta">Malta</option>
          </select>
        </div>

        <div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Student Statuses</option>
            <option value="Active">Active</option>
            <option value="Enrolled">Enrolled</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Student</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Target Country & University</th>
                <th className="px-4 py-3">Academic Qualification</th>
                <th className="px-4 py-3">English Score</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    onClick={() => handleOpenStudentDetail(student)}
                    className="hover:bg-slate-900/60 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="group-hover:text-emerald-400 transition-colors flex items-center gap-2">
                        <span>{student.fullName}</span>
                        {student.passportNumber && (
                          <span className="text-[10px] text-slate-400 font-normal">({student.passportNumber})</span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        Registered {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>{student.phone}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{student.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div className="font-medium text-slate-200">{student.targetCountry}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {student.targetUniversity || 'Pending selection'}
                      </div>
                      <div className="text-[10px] text-emerald-400">{student.targetIntake}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div>{student.academicHistory?.highestDegree || 'Bachelor'}</div>
                      <div className="text-[11px] text-slate-400">CGPA: {student.academicHistory?.cgpa || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      <div className="font-semibold text-white">{student.englishScores?.overall || 'IELTS 6.5'}</div>
                      <div className="text-[10px] text-slate-400">{student.englishScores?.test || 'IELTS Academic'}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        student.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : student.status === 'Archived'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleOpenStudentDetail(student)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-emerald-400 font-medium text-xs transition-colors"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STUDENT PROFILE DETAIL MODAL */}
      {activeStudent && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{activeStudent.fullName}</h2>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      ID #{activeStudent.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeStudent.email} • {activeStudent.phone} • DOB: {activeStudent.dateOfBirth || 'N/A'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveStudent(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-slate-800 mt-4 gap-2">
                {(['overview', 'applications', 'documents', 'notes'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-2 text-xs font-semibold capitalize border-b-2 transition-colors ${
                      activeTab === tab
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="py-4 text-xs">
                {activeTab === 'overview' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Academic Background */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Academic Record</div>
                        <div className="text-slate-300">Degree: <span className="text-white font-semibold">{activeStudent.academicHistory?.highestDegree || 'Bachelor'}</span></div>
                        <div className="text-slate-300">Institution: <span className="text-white font-semibold">{activeStudent.academicHistory?.institution || 'N/A'}</span></div>
                        <div className="text-slate-300">CGPA / Result: <span className="text-white font-semibold">{activeStudent.academicHistory?.cgpa || 'N/A'}</span></div>
                        <div className="text-slate-300">Passing Year: <span className="text-white font-semibold">{activeStudent.academicHistory?.passingYear || 'N/A'}</span></div>
                      </div>

                      {/* Language & Target */}
                      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Language & Study Targets</div>
                        <div className="text-slate-300">English Test: <span className="text-white font-semibold">{activeStudent.englishScores?.test || 'IELTS'}</span></div>
                        <div className="text-slate-300">Overall Score: <span className="text-emerald-400 font-bold">{activeStudent.englishScores?.overall || '6.5'}</span></div>
                        <div className="text-slate-300">Target Destination: <span className="text-white font-semibold">{activeStudent.targetCountry}</span></div>
                        <div className="text-slate-300">Target University: <span className="text-white font-semibold">{activeStudent.targetUniversity}</span></div>
                        <div className="text-slate-300">Target Intake: <span className="text-white font-semibold">{activeStudent.targetIntake}</span></div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Counsellor & Passport</div>
                      <div className="grid grid-cols-2 gap-2 text-slate-300">
                        <div>Passport: <span className="text-white font-mono">{activeStudent.passportNumber || 'Pending Submission'}</span></div>
                        <div>Status: <span className="text-white font-semibold">{activeStudent.status}</span></div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'applications' && (
                  <div className="space-y-3">
                    {studentApps.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">No active university applications recorded yet.</div>
                    ) : (
                      studentApps.map((app) => (
                        <div key={app.id} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-white text-sm">{app.universityName}</span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              {app.status}
                            </span>
                          </div>
                          <div className="text-slate-300">{app.programName} ({app.country})</div>
                          <div className="text-[11px] text-slate-500">Intake: {app.intake} • Applied: {app.applicationDate}</div>
                          {app.notes && <div className="text-[11px] text-amber-300/90 pt-1">Notes: {app.notes}</div>}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-3">
                    {studentDocs.length === 0 ? (
                      <div className="text-center py-8 text-slate-500">No documents uploaded for this student.</div>
                    ) : (
                      studentDocs.map((doc) => (
                        <div key={doc.id} className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-white">{doc.title}</div>
                            <div className="text-[11px] text-slate-400">{doc.category} • Uploaded {new Date(doc.createdAt).toLocaleDateString()}</div>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            doc.status === 'Verified'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : doc.status === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {doc.status}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Counsellor Interaction Log</div>
                    <div className="text-slate-300 whitespace-pre-wrap">
                      {activeStudent.communicationNotes || 'No notes logged yet.'}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleToggleArchive(activeStudent)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>{activeStudent.status === 'Archived' ? 'Unarchive Student' : 'Archive Student'}</span>
              </button>
              <button
                onClick={() => setActiveStudent(null)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REGISTER STUDENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white">Register Student Record</h3>
                <p className="text-xs text-slate-400">Add an enrolled or applying student with full academic files.</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4 mt-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Shakil Anwar"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Passport Number</label>
                  <input
                    type="text"
                    placeholder="e.g. BD0987123"
                    value={formPassport}
                    onChange={(e) => setFormPassport(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gmail.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+880 1712 111222"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Country</label>
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
                  <label className="block text-slate-300 font-medium mb-1">Target University</label>
                  <input
                    type="text"
                    placeholder="e.g. Coventry University"
                    value={formUni}
                    onChange={(e) => setFormUni(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Program</label>
                  <input
                    type="text"
                    placeholder="e.g. MBA Global Business"
                    value={formProg}
                    onChange={(e) => setFormProg(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Target Intake</label>
                  <input
                    type="text"
                    value={formIntake}
                    onChange={(e) => setFormIntake(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Previous Highest Degree</label>
                  <input
                    type="text"
                    value={formDegree}
                    onChange={(e) => setFormDegree(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">CGPA</label>
                  <input
                    type="text"
                    value={formCgpa}
                    onChange={(e) => setFormCgpa(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">English Test & Overall Score</label>
                  <input
                    type="text"
                    placeholder="IELTS 6.5 (R:6.5, W:6.0, S:6.5, L:6.5)"
                    value={formOverallScore}
                    onChange={(e) => setFormOverallScore(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Assigned Counsellor</label>
                  <select
                    value={formCounsellorId}
                    onChange={(e) => setFormCounsellorId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="">Select Counsellor</option>
                    {counsellors.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg shadow-md shadow-emerald-500/20"
                >
                  Save Student Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
