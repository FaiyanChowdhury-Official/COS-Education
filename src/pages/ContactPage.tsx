import React, { useState } from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ArrowRight,
  MessageCircle,
  Building2,
  Calendar
} from 'lucide-react';
import { COMPANY_INFO, DESTINATIONS } from '../data/mockData';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { SEOHelper } from '../components/SEOHelper';

interface ContactPageProps {
  onNavigate: (route: string, param?: string) => void;
  onOpenConsultationModal: (dest?: string) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({
  onNavigate,
  onOpenConsultationModal,
}) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    destination: 'uk',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <SEOHelper
        title="Contact COS Education | Sylhet Office & Online Support"
        description="Get in touch with COS Education at Chowhatta Point, Sylhet. Call +880 1572 231717 or visit our office for free study abroad counseling."
        canonicalPath="/contact"
      />

      {/* Header Banner */}
      <div className="bg-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-500/30">
            <Phone className="w-3.5 h-3.5" />
            <span>We're Here to Help</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display">
            Contact COS Education
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Have questions regarding admissions, scholarships, or visa eligibility? Speak with our certified education counselors in Sylhet today.
          </p>
        </div>
      </div>

      <Breadcrumbs
        items={[{ label: 'Contact Us' }]}
        onNavigate={onNavigate}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Office Location */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Sylhet Headquarters</span>
                <h3 className="text-xl font-bold text-slate-900 font-display mt-1">
                  Visit Our Office
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  Walk-ins welcome Saturday through Thursday. Free parking available.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">Physical Address:</strong>
                    <span>{COMPANY_INFO.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">Phone Hotline:</strong>
                    <a href={`tel:${COMPANY_INFO.phone}`} className="hover:text-blue-600 font-medium">{COMPANY_INFO.phone}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">Official Email:</strong>
                    <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-blue-600 font-medium">{COMPANY_INFO.email}</a>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-slate-900 font-semibold mb-0.5">Operating Hours:</strong>
                    <p>{COMPANY_INFO.hours}</p>
                    <p className="text-slate-500 text-[11px] mt-0.5">Friday: Closed (Online appointments available on request)</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappFormatted}?text=Hello%20COS%20Education,%20I%20would%20like%20to%20inquire%20about%20study%20abroad.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/20"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat Directly on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Map Representation Box */}
            <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-red-400" />
                <h4 className="font-bold text-sm">Directions to Manru Shopping City</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Located right at Chowhatta Point main road. Take Lift-03 to Floor-04. Our reception desk will greet you immediately.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onOpenConsultationModal()}
                  className="text-xs font-semibold text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Book appointment slot before arriving →</span>
                </button>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
              <div className="mb-6">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Quick Inquiry</span>
                <h2 className="text-2xl font-bold text-slate-900 font-display mt-1">
                  Send Us a Message
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in the details below and one of our advisors will respond within 24 business hours.
                </p>
              </div>

              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 font-display">Inquiry Sent Successfully!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you for contacting COS Education. Our student support desk has received your request and will follow up shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Sajjad Hossain"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Phone / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+880 1700-000000"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="yourname@gmail.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-700 mb-1">Target Country</label>
                      <select
                        value={form.destination}
                        onChange={(e) => setForm({ ...form, destination: e.target.value })}
                        className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-hidden focus:border-blue-500 text-xs"
                      >
                        {DESTINATIONS.map((d) => (
                          <option key={d.slug} value={d.slug}>
                            {d.flag} {d.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Subject</label>
                    <input
                      type="text"
                      placeholder="e.g. Master's in UK with IELTS 6.0 inquiry"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Your Question or Profile Summary *</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Provide details about your academic background, recent IELTS score, or preferred university..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-slate-800 focus:outline-hidden focus:border-blue-500 text-xs"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
