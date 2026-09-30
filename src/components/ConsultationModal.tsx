import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  GraduationCap, 
  CheckCircle2, 
  ArrowRight,
  MapPin,
  Video,
  FileCheck
} from 'lucide-react';
import { COMPANY_INFO, DESTINATIONS } from '../data/mockData';
import { ConsultationBooking } from '../types';
import { getMarketingAttribution } from '../utils/marketingAttribution';

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDestination?: string;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({
  isOpen,
  onClose,
  defaultDestination = '',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    destination: defaultDestination || 'uk',
    degree: 'Master',
    intake: 'September 2026',
    preferredDate: '',
    preferredTime: '11:00 AM',
    mode: 'In-person (Sylhet Office)' as 'In-person (Sylhet Office)' | 'Online (Google Meet / Zoom)',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedBooking, setSubmittedBooking] = useState<ConsultationBooking | null>(null);

  useEffect(() => {
    if (defaultDestination) {
      setFormData(prev => ({ ...prev, destination: defaultDestination }));
    }
  }, [defaultDestination]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const ref = `COS-${Math.floor(100000 + Math.random() * 900000)}`;
    const destinationObj = DESTINATIONS.find((d) => d.slug === formData.destination || d.name === formData.destination);
    const countryName = destinationObj ? destinationObj.name : formData.destination;

    const newBooking: ConsultationBooking = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      appointmentRef: ref,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      destination: countryName,
      degree: formData.degree,
      intake: formData.intake,
      preferredDate: formData.preferredDate || new Date(Date.now() + 86400000).toISOString().split('T')[0],
      preferredTime: formData.preferredTime,
      mode: formData.mode,
      message: formData.message,
      status: 'Pending Confirmation'
    };

    // Capture marketing attribution & UTM parameters
    const attribution = getMarketingAttribution();

    try {
      // 1. Post to Leads CRM API
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          country: countryName,
          program: formData.degree,
          intake: formData.intake,
          source: 'Website Consultation Form',
          leadSourceCategory: attribution.leadSourceCategory,
          utmSource: attribution.utmSource,
          utmMedium: attribution.utmMedium,
          utmCampaign: attribution.utmCampaign,
          utmContent: attribution.utmContent,
          utmTerm: attribution.utmTerm,
          notes: `Consultation Requested: ${formData.mode} on ${newBooking.preferredDate} at ${formData.preferredTime}. Student message: "${formData.message || 'No additional note'}"`,
        }),
      });

      // 2. Post to Appointments API
      await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: formData.name,
          studentEmail: formData.email,
          studentPhone: formData.phone,
          country: countryName,
          preferredDate: newBooking.preferredDate,
          preferredTime: formData.preferredTime,
          mode: formData.mode,
          notes: formData.message || 'Website booked consultation',
        }),
      });
    } catch (apiErr) {
      console.warn('API sync warning:', apiErr);
    }

    // Store in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('cos_consultations') || '[]');
      localStorage.setItem('cos_consultations', JSON.stringify([newBooking, ...existing]));
    } catch (err) {
      console.warn('Could not write to localStorage', err);
    }

    setIsSubmitting(false);
    setSubmittedBooking(newBooking);
  };

  const handleReset = () => {
    setSubmittedBooking(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div>
            <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Free 1-on-1 Guidance</span>
            <h3 className="text-lg font-bold text-slate-900 font-display">Book a Free Study Abroad Consultation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto">
          {submittedBooking ? (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900 font-display">Consultation Requested!</h4>
                <p className="text-sm text-slate-600 mt-1 max-w-sm mx-auto">
                  Thank you, <span className="font-semibold text-slate-800">{submittedBooking.name}</span>. Your appointment request has been scheduled.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-slate-200/80 pb-2">
                  <span className="text-slate-500">Booking Reference:</span>
                  <span className="font-mono font-bold text-blue-600">{submittedBooking.appointmentRef}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Mode:</span>
                  <span className="font-semibold text-slate-800">{submittedBooking.mode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Target Destination:</span>
                  <span className="font-semibold text-slate-800 capitalize">{submittedBooking.destination.toUpperCase()} ({submittedBooking.intake})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Time:</span>
                  <span className="font-semibold text-slate-800">{submittedBooking.preferredDate} at {submittedBooking.preferredTime}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => {
                    const text = encodeURIComponent(`Hello COS Education! I booked consultation ${submittedBooking.appointmentRef} for ${submittedBooking.name}. Looking forward to our session.`);
                    window.open(`https://wa.me/${COMPANY_INFO.whatsappFormatted}?text=${text}`, '_blank');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700 flex items-center justify-center gap-2"
                >
                  <span>Confirm Instantly on WhatsApp</span>
                </button>
                <button
                  onClick={handleReset}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Phone / WhatsApp *</label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +880 1700-000000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. student@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Preferred Country</label>
                  <select
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    {DESTINATIONS.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.flag} {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Degree Level</label>
                  <select
                    value={formData.degree}
                    onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="Bachelor">Undergraduate / Bachelor</option>
                    <option value="Master">Postgraduate / Master</option>
                    <option value="Diploma">Diploma / Foundation</option>
                    <option value="PhD">Doctorate / PhD</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Target Intake</label>
                  <select
                    value={formData.intake}
                    onChange={(e) => setFormData({ ...formData, intake: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="September 2026">Autumn / Sept 2026</option>
                    <option value="January 2027">Spring / Jan 2027</option>
                    <option value="May 2027">Summer / May 2027</option>
                    <option value="Autumn 2027">Autumn / Sept 2027</option>
                  </select>
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block font-medium text-slate-700 mb-1">Consultation Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'In-person (Sylhet Office)' })}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                      formData.mode === 'In-person (Sylhet Office)'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>In-person (Sylhet Office)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, mode: 'Online (Google Meet / Zoom)' })}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-colors ${
                      formData.mode === 'Online (Google Meet / Zoom)'
                        ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Video className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>Online Video Call</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.preferredDate}
                    onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Preferred Time Slot</label>
                  <select
                    value={formData.preferredTime}
                    onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 bg-white focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="11:00 AM">11:00 AM – Morning</option>
                    <option value="01:00 PM">01:00 PM – Early Afternoon</option>
                    <option value="03:30 PM">03:30 PM – Afternoon</option>
                    <option value="05:30 PM">05:30 PM – Evening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Questions or Academic Notes (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Share your current CGPA, IELTS score, or specific university in mind..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-blue-500"
                ></textarea>
              </div>

              <p className="text-[11px] text-slate-500 leading-normal">
                🔒 Your consultation is 100% free and confidential. Our certified counselors will review your profile before the session.
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Appointment Slot...</span>
                ) : (
                  <>
                    <span>Confirm Free Consultation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
