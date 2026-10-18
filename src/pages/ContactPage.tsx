import React, { useState, useRef } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, HelpCircle, Loader2, ShieldCheck } from 'lucide-react';

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

interface SubmissionSuccess {
  confirmationId: string;
  timestamp: string;
  status: 'delivered' | 'test_accepted';
  message: string;
}

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'product_suggestion',
    message: ''
  });
  const [honeypot, setHoneypot] = useState('');
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<SubmissionSuccess | null>(null);

  // Bot-detection: Record timestamp when form was rendered
  const formStartTimeRef = useRef<number>(Date.now());

  const validate = (): FormErrors => {
    const errors: FormErrors = {};
    const trimmedName = formData.name.trim();
    if (!trimmedName || trimmedName.length < 2) {
      errors.name = 'Full name is required (minimum 2 characters).';
    } else if (trimmedName.length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }

    const trimmedEmail = formData.email.trim();
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@example.com).';
    } else if (trimmedEmail.length > 100) {
      errors.email = 'Email address cannot exceed 100 characters.';
    }

    if (!formData.subject) {
      errors.subject = 'Please select an inquiry topic.';
    }

    const trimmedMessage = formData.message.trim();
    if (!trimmedMessage || trimmedMessage.length < 10) {
      errors.message = 'Please provide details in your message (minimum 10 characters).';
    } else if (trimmedMessage.length > 3000) {
      errors.message = 'Message cannot exceed 3,000 characters.';
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setServerErrorMessage(null);
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subject: formData.subject,
          message: formData.message.trim(),
          website: honeypot, // Honeypot trap for automated bots
          formStartTime: formStartTimeRef.current
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        if (data.details) {
          setFormErrors(data.details);
        }
        setServerErrorMessage(
          data.error || 'Unable to submit your message at this time. Please try again later.'
        );
        setIsSubmitting(false);
        return;
      }

      setSuccessData({
        confirmationId: data.confirmationId || `GTF-${Date.now().toString(36).toUpperCase()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        status: data.status || 'delivered',
        message: data.message || 'Your enquiry has been received.'
      });
      setFormData({ name: '', email: '', subject: 'product_suggestion', message: '' });
      setHoneypot('');
    } catch (err: any) {
      console.error('[Contact Form Error]', err);
      setServerErrorMessage(
        'Network error communicating with the server. Please check your internet connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setSuccessData(null);
    setServerErrorMessage(null);
    setFormErrors({});
    formStartTimeRef.current = Date.now();
  };

  const faqs = [
    {
      q: 'Is Google Tool Finder affiliated with Google LLC?',
      a: 'No. Google Tool Finder is a completely independent informational guide. We have no corporate affiliation, endorsement, or sponsorship from Google LLC or Alphabet Inc.'
    },
    {
      q: 'How often is the pricing and offer data updated?',
      a: 'Our research team audits product changes monthly. Every product and offer entry includes a clear "Last Verified Date" stamp so you know the freshness of the data.'
    },
    {
      q: 'Can I submit an eligible Google offer or correction for India?',
      a: 'Yes! Please use the contact form on this page with the subject "Offer Correction or Suggestion", and provide a link to the official Google documentation.'
    },
    {
      q: 'Are any of the tutorials generated using AI without verification?',
      a: 'No. All tutorials are crafted by experienced technical writers with real-world verification of every setting, DNS configuration, and UI step.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
          <Mail className="w-3.5 h-3.5" />
          <span>Feedback & Inquiries</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Get in Touch with Our Editorial Team
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Found an outdated price? Have a Google tool you'd like us to profile? Send us your suggestions.
        </p>
      </div>

      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Contact Form (7 cols) */}
        <div className="md:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          {successData ? (
            <div className="text-center py-10 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">
                  {successData.status === 'delivered' ? 'Message Delivered' : 'Enquiry Accepted (Test Mode)'}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Reference: <span className="font-bold text-slate-700">{successData.confirmationId}</span>
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 max-w-md mx-auto leading-relaxed text-left space-y-2">
                <p>
                  {successData.status === 'delivered'
                    ? 'Thank you for contacting Google Tool Finder. Your message has been routed directly to our editorial inbox. Our team reviews all suggestions within 24–48 hours.'
                    : 'Your enquiry passed all client and server validation checks and was confirmed in safe test mode. Live email dispatch will activate once live email provider credentials are added to the environment.'}
                </p>
                <div className="text-[11px] text-slate-400 border-t border-slate-200/70 pt-2 flex items-center justify-between">
                  <span>Timestamp:</span>
                  <span className="font-mono">{new Date(successData.timestamp).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate aria-label="Editorial feedback submission form">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Editorial Feedback Form</span>
                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Secure Submission</span>
                </span>
              </div>

              {/* Server-level error message */}
              {serverErrorMessage && (
                <div role="alert" aria-live="assertive" className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-semibold">Unable to process enquiry</p>
                    <p className="text-[11px] text-rose-700 leading-snug">{serverErrorMessage}</p>
                  </div>
                </div>
              )}

              {/* Honeypot field (hidden from real users, traps bots) */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="website">Website (Leave blank)</label>
                <input
                  id="website"
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Name Field */}
              <div>
                <label htmlFor="contact-name" className="text-xs font-bold text-slate-700 block mb-1">
                  Your Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(formErrors.name)}
                  aria-describedby={formErrors.name ? "contact-name-error" : undefined}
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (formErrors.name) setFormErrors({ ...formErrors, name: undefined });
                  }}
                  placeholder="e.g. Rahul Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.name 
                      ? 'bg-rose-50/50 border border-rose-300 focus:ring-rose-500' 
                      : 'bg-slate-50 border border-slate-200 focus:ring-blue-500 focus:bg-white'
                  } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {formErrors.name && (
                  <p id="contact-name-error" role="alert" className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="contact-email" className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  disabled={isSubmitting}
                  aria-invalid={Boolean(formErrors.email)}
                  aria-describedby={formErrors.email ? "contact-email-error" : undefined}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (formErrors.email) setFormErrors({ ...formErrors, email: undefined });
                  }}
                  placeholder="e.g. rahul@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.email 
                      ? 'bg-rose-50/50 border border-rose-300 focus:ring-rose-500' 
                      : 'bg-slate-50 border border-slate-200 focus:ring-blue-500 focus:bg-white'
                  } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {formErrors.email && (
                  <p id="contact-email-error" role="alert" className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.email}</p>
                )}
              </div>

              {/* Inquiry Topic */}
              <div>
                <label htmlFor="contact-subject" className="text-xs font-bold text-slate-700 block mb-1">
                  Inquiry Topic <span className="text-rose-500">*</span>
                </label>
                <select
                  id="contact-subject"
                  disabled={isSubmitting}
                  aria-invalid={Boolean(formErrors.subject)}
                  aria-describedby={formErrors.subject ? "contact-subject-error" : undefined}
                  value={formData.subject}
                  onChange={(e) => {
                    setFormData({ ...formData, subject: e.target.value });
                    if (formErrors.subject) setFormErrors({ ...formErrors, subject: undefined });
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 transition-all ${
                    formErrors.subject 
                      ? 'bg-rose-50/50 border border-rose-300 focus:ring-rose-500' 
                      : 'bg-slate-50 border border-slate-200 focus:ring-blue-500 focus:bg-white'
                  } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <option value="product_suggestion">Suggest a Google Product to Add</option>
                  <option value="offer_correction">Report Pricing or Offer Correction</option>
                  <option value="scam_report">Report a Suspicious / Fake Promo Link</option>
                  <option value="partnership">Affiliate / Partnership Inquiry</option>
                  <option value="general">General Editorial Feedback</option>
                </select>
                {formErrors.subject && (
                  <p id="contact-subject-error" role="alert" className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.subject}</p>
                )}
              </div>

              {/* Message Details */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="contact-message" className="text-xs font-bold text-slate-700">
                    Your Message or Correction Details <span className="text-rose-500">*</span>
                  </label>
                  <span className={`text-[10px] font-mono ${formData.message.length > 3000 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                    {formData.message.length} / 3000
                  </span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  disabled={isSubmitting}
                  aria-invalid={Boolean(formErrors.message)}
                  aria-describedby={formErrors.message ? "contact-message-error" : undefined}
                  value={formData.message}
                  onChange={(e) => {
                    setFormData({ ...formData, message: e.target.value });
                    if (formErrors.message) setFormErrors({ ...formErrors, message: undefined });
                  }}
                  placeholder="Please describe your suggestion, question, or correction (include official links where possible)..."
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all resize-y ${
                    formErrors.message 
                      ? 'bg-rose-50/50 border border-rose-300 focus:ring-rose-500' 
                      : 'bg-slate-50 border border-slate-200 focus:ring-blue-500 focus:bg-white'
                  } ${isSubmitting ? 'opacity-60 cursor-not-allowed' : ''}`}
                />
                {formErrors.message && (
                  <p id="contact-message-error" role="alert" className="text-[11px] text-rose-600 mt-1 font-medium">{formErrors.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold shadow-xs transition-all ${
                  isSubmitting 
                    ? 'bg-blue-400 text-white cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer hover:shadow-md'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Validating & Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send Message to Editorial Team</span>
                  </>
                )}
              </button>

              <p className="text-[10px] text-center text-slate-400 leading-snug">
                Your email address will solely be used to reply to your inquiry. We never share or sell contact details.
              </p>
            </form>
          )}
        </div>

        {/* FAQ & Support Info (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>Frequently Asked Questions</span>
            </h3>

            <div className="space-y-4 divide-y divide-slate-200">
              {faqs.map((faq, idx) => (
                <div key={idx} className="pt-3 first:pt-0 space-y-1">
                  <p className="text-xs font-bold text-slate-900">{faq.q}</p>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Need Official Google Support?</strong> If you have billing issues or password recovery needs for your personal account, please contact <a href="https://support.google.com" target="_blank" rel="noopener noreferrer nofollow" className="underline font-bold">Google Support</a> directly.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

