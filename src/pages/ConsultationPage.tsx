import React, { useState } from 'react';
import { ArrowLeft, Calendar, Clock, Video, MapPin, CheckCircle, Star } from 'lucide-react';

interface ConsultationPageProps {
  onBack: () => void;
}

const ConsultationPage: React.FC<ConsultationPageProps> = ({ onBack }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    consultationType: 'virtual',
    date: '',
    time: '',
    skinConcerns: [] as string[],
    currentRoutine: '',
    goals: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });

  const skinConcerns = [
    'Acne', 'Dark Spots', 'Fine Lines', 'Dryness', 'Oily Skin', 'Sensitive Skin',
    'Uneven Tone', 'Large Pores', 'Blackheads', 'Dullness', 'Rosacea', 'Melasma'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'skinConcerns') {
        setFormData(prev => ({
          ...prev,
          skinConcerns: checked
            ? [...prev.skinConcerns, value]
            : prev.skinConcerns.filter(concern => concern !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(4); // Show success message
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-[#0d0499] transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Book a Skincare Consultation</h1>
          <p className="text-gray-600 mt-2">Get personalized skincare advice from our experts</p>
        </div>
      </div>

      {step < 4 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= step ? 'bg-[#0d0499] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum < step ? <CheckCircle className="h-5 w-5" /> : stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-16 h-1 mx-4 ${stepNum < step ? 'bg-[#0d0499]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Consultation Type</span>
              <span>Skin Assessment</span>
              <span>Personal Info</span>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Step 1: Consultation Type & Scheduling */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Consultation</h2>
            
            {/* Consultation Type */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Consultation Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.consultationType === 'virtual'
                    ? 'border-[#0d0499] bg-[#c6f2f4]'
                    : 'border-gray-200 hover:border-[#c6f2f4]'
                }`}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="virtual"
                    checked={formData.consultationType === 'virtual'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <Video className="h-6 w-6 text-[#0d0499] mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Virtual Consultation</h4>
                      <p className="text-sm text-gray-600">30-minute video call with our expert</p>
                      <p className="text-sm font-medium text-[#0d0499]">₦8,000</p>
                    </div>
                  </div>
                </label>

                <label className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                  formData.consultationType === 'in-person'
                    ? 'border-[#0d0499] bg-[#c6f2f4]'
                    : 'border-gray-200 hover:border-[#c6f2f4]'
                }`}>
                  <input
                    type="radio"
                    name="consultationType"
                    value="in-person"
                    checked={formData.consultationType === 'in-person'}
                    onChange={handleInputChange}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <MapPin className="h-6 w-6 text-[#0d0499] mr-3" />
                    <div>
                      <h4 className="font-semibold text-gray-900">In-Person Consultation</h4>
                      <p className="text-sm text-gray-600">45-minute session at our clinic</p>
                      <p className="text-sm font-medium text-[#0d0499]">₦12,000</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Date Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Date</h3>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                required
              />
            </div>

            {/* Time Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Select Time</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.map((time) => (
                  <label key={time} className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-colors ${
                    formData.time === time
                      ? 'border-[#0d0499] bg-[#c6f2f4] text-[#0d0499]'
                      : 'border-gray-200 hover:border-[#c6f2f4]'
                  }`}>
                    <input
                      type="radio"
                      name="time"
                      value={time}
                      checked={formData.time === time}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="font-medium">{time}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={nextStep}
              disabled={!formData.date || !formData.time}
              className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Skin Assessment */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Tell Us About Your Skin</h2>

            {/* Skin Concerns */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">What are your main skin concerns?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {skinConcerns.map((concern) => (
                  <label key={concern} className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-colors ${
                    formData.skinConcerns.includes(concern)
                      ? 'border-[#0d0499] bg-[#c6f2f4] text-[#0d0499]'
                      : 'border-gray-200 hover:border-[#c6f2f4]'
                  }`}>
                    <input
                      type="checkbox"
                      name="skinConcerns"
                      value={concern}
                      checked={formData.skinConcerns.includes(concern)}
                      onChange={handleInputChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{concern}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Current Routine */}
            <div className="mb-8">
              <label htmlFor="currentRoutine" className="block text-lg font-semibold mb-4">
                Describe your current skincare routine
              </label>
              <textarea
                id="currentRoutine"
                name="currentRoutine"
                value={formData.currentRoutine}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                placeholder="Tell us about the products you currently use and how often..."
                required
              />
            </div>

            {/* Goals */}
            <div className="mb-8">
              <label htmlFor="goals" className="block text-lg font-semibold mb-4">
                What are your skincare goals?
              </label>
              <textarea
                id="goals"
                name="goals"
                value={formData.goals}
                onChange={handleInputChange}
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                placeholder="What would you like to achieve with your skincare routine?"
                required
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={prevStep}
                className="border border-[#0d0499] text-[#0d0499] px-6 py-3 rounded-lg font-semibold hover:bg-[#0d0499] hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={nextStep}
                disabled={formData.skinConcerns.length === 0 || !formData.currentRoutine || !formData.goals}
                className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Personal Information */}
        {step === 3 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                    required
                  />
                </div>
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                  required
                />
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
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                  required
                />
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-6 mt-8">
                <h3 className="text-lg font-semibold mb-4">Consultation Summary</h3>
                <div className="space-y-2 text-sm">
                  <p><strong>Type:</strong> {formData.consultationType === 'virtual' ? 'Virtual' : 'In-Person'}</p>
                  <p><strong>Date:</strong> {formData.date}</p>
                  <p><strong>Time:</strong> {formData.time}</p>
                  <p><strong>Price:</strong> {formData.consultationType === 'virtual' ? '₦8,000' : '₦12,000'}</p>
                  <p><strong>Skin Concerns:</strong> {formData.skinConcerns.join(', ')}</p>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="border border-[#0d0499] text-[#0d0499] px-6 py-3 rounded-lg font-semibold hover:bg-[#0d0499] hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
                >
                  Book Consultation
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultation Booked!</h2>
            <p className="text-gray-600 mb-6">
              Your skincare consultation has been successfully scheduled. We'll send you a confirmation email with all the details.
            </p>
            
            <div className="bg-[#c6f2f4] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[#0d0499] mb-2">What's Next?</h3>
              <ul className="text-sm text-[#0d0499] space-y-1 text-left max-w-md mx-auto">
                <li>• Check your email for confirmation and preparation instructions</li>
                <li>• If virtual, test your video connection before the session</li>
                <li>• Prepare any questions about your skincare routine</li>
                <li>• Have your current products ready for review</li>
              </ul>
            </div>

            <button
              onClick={onBack}
              className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        )}
      </div>

      {/* Expert Info Section */}
      {step < 4 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Meet Your Skincare Expert</h3>
            <div className="flex items-center space-x-6">
              <img
                src="https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=150"
                alt="Dr. Sarah Johnson"
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h4 className="text-lg font-semibold text-gray-900">Dr. Sarah Johnson</h4>
                <p className="text-gray-600 mb-2">Certified Dermatologist & Skincare Specialist</p>
                <div className="flex items-center">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">4.9 (127 reviews)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationPage;