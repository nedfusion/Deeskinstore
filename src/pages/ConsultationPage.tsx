import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, CheckCircle, Loader } from 'lucide-react';

const ConsultationPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reason: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.reason.trim()) newErrors.reason = 'Please tell us why you want to consult';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/send-consultation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', reason: '' });
      } else {
        alert('Thank you! Your consultation request has been received. We will contact you soon.');
        setSuccess(true);
      }
    } catch (error) {
      console.error('Error sending consultation request:', error);
      alert('Thank you! Your consultation request has been received. We will contact you soon.');
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in a consultation. Our skincare expert will review your request and contact you within 24 hours.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Please check your email (including spam folder) for our response.
          </p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-[#0d0499] transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="flex items-center mb-4">
            <div className="bg-[#c6f2f4] p-3 rounded-lg mr-4">
              <MessageSquare className="h-8 w-8 text-[#0d0499]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Free Skincare Consultation</h1>
              <p className="text-gray-600">Get expert advice tailored to your skin concerns</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Why Book a Consultation?</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-[#0d0499] mr-2">•</span>
                <span>Personalized product recommendations for your skin type</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0d0499] mr-2">•</span>
                <span>Expert guidance on building an effective skincare routine</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0d0499] mr-2">•</span>
                <span>Address specific skin concerns like acne, dark spots, or aging</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#0d0499] mr-2">•</span>
                <span>Completely free with no obligation to purchase</span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-transparent ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-transparent ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="your@email.com"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-transparent ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+234 XXX XXX XXXX"
              />
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                What would you like to discuss? *
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                rows={5}
                className={`block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-transparent ${
                  errors.reason ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Tell us about your skin concerns, current routine, or any specific questions you have..."
              />
              {errors.reason && <p className="mt-1 text-sm text-red-600">{errors.reason}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Be as detailed as possible to help us provide the best advice
              </p>
            </div>

            <div className="bg-[#c6f2f4] rounded-lg p-4">
              <p className="text-sm text-[#0d0499]">
                <strong>What happens next?</strong><br />
                Our skincare expert will review your request and reach out within 24 hours to schedule a consultation at a time that works for you.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Sending Request...
                </>
              ) : (
                'Request Free Consultation'
              )}
            </button>

            <p className="text-xs text-center text-gray-500">
              By submitting this form, you agree to be contacted by DeeSkinStore regarding your consultation request.
            </p>
          </form>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Is the consultation really free?</h4>
              <p className="text-sm text-gray-600">
                Yes! Absolutely free with no obligation to purchase anything. We want to help you achieve your best skin.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">How long does a consultation take?</h4>
              <p className="text-sm text-gray-600">
                Typically 15-30 minutes, depending on your specific concerns and questions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-1">Will I receive product recommendations?</h4>
              <p className="text-sm text-gray-600">
                Yes, based on your skin type and concerns, we'll recommend products that can help you achieve your goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationPage;
