import React, { useState } from 'react';
import { ArrowLeft, Gift, Mail, CreditCard, CheckCircle } from 'lucide-react';

interface GiftCardPageProps {
  onBack: () => void;
}

const GiftCardPage: React.FC<GiftCardPageProps> = ({ onBack }) => {
  const [selectedAmount, setSelectedAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [recipientInfo, setRecipientInfo] = useState({
    recipientName: '',
    recipientEmail: '',
    message: '',
    deliveryDate: '',
    senderName: '',
    senderEmail: '',
  });
  const [currentStep, setCurrentStep] = useState(1);

  const giftAmounts = [25, 50, 75, 100, 150, 200];

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setRecipientInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3); // Show success
  };

  const getSelectedAmount = () => {
    return customAmount ? parseInt(customAmount) : selectedAmount;
  };

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
          <div className="flex items-center">
            <Gift className="h-8 w-8 text-[#0d0499] mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gift Cards</h1>
              <p className="text-gray-600 mt-1">Give the gift of beautiful skin</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep < 3 && (
          <div className="mb-8">
            <div className="flex items-center">
              {[1, 2].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    stepNum <= currentStep ? 'bg-[#0d0499] text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum < currentStep ? <CheckCircle className="h-5 w-5" /> : stepNum}
                  </div>
                  {stepNum < 2 && (
                    <div className={`w-16 h-1 mx-4 ${stepNum < currentStep ? 'bg-[#0d0499]' : 'bg-gray-200'}`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600 max-w-32">
              <span>Choose Amount</span>
              <span>Recipient Details</span>
            </div>
          </div>
        )}

        {/* Step 1: Choose Amount */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Gift Card Amount</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                {giftAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => {
                      setSelectedAmount(amount);
                      setCustomAmount('');
                    }}
                    className={`p-4 border-2 rounded-lg font-semibold transition-colors ${
                      selectedAmount === amount && !customAmount
                        ? 'border-[#0d0499] bg-[#c6f2f4] text-[#0d0499]'
                        : 'border-gray-200 hover:border-[#c6f2f4] text-gray-700'
                    }`}
                  >
                    {formatPrice(amount)}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter custom amount
                </label>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(0);
                  }}
                  placeholder="Enter amount"
                  min="10"
                  max="1000"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                />
                <p className="text-xs text-gray-500 mt-1">Minimum: ₦1,000, Maximum: ₦100,000</p>
              </div>

              <button
                onClick={() => setCurrentStep(2)}
                disabled={!getSelectedAmount() || getSelectedAmount() < 10}
                className="w-full bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Gift Card Preview</h3>
              
              {/* Gift Card Design */}
              <div className="relative bg-gradient-to-br from-[#c6f2f4] to-[#0d0499] rounded-2xl p-6 text-white mb-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-2xl font-bold">DeeSkinStore</h4>
                    <Gift className="h-8 w-8" />
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-lg opacity-90">Gift Card</p>
                    <p className="text-3xl font-bold">{formatPrice(getSelectedAmount())}</p>
                  </div>
                  
                  <div className="text-sm opacity-75">
                    <p>Valid for all products</p>
                    <p>No expiry date</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-sm">
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Never expires</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Can be used for all products</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Delivered instantly via email</span>
                </div>
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <span>Can be scheduled for future delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Recipient Details */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recipient Information</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    id="recipientName"
                    name="recipientName"
                    value={recipientInfo.recipientName}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email *
                  </label>
                  <input
                    type="email"
                    id="recipientEmail"
                    name="recipientEmail"
                    value={recipientInfo.recipientEmail}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Personal Message (Optional)
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={recipientInfo.message}
                  onChange={handleInputChange}
                  rows={4}
                  maxLength={500}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                  placeholder="Write a personal message to make this gift extra special..."
                />
                <p className="text-xs text-gray-500 mt-1">{recipientInfo.message.length}/500 characters</p>
              </div>

              <div>
                <label htmlFor="deliveryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date (Optional)
                </label>
                <input
                  type="date"
                  id="deliveryDate"
                  name="deliveryDate"
                  value={recipientInfo.deliveryDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="block w-full max-w-xs px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty to deliver immediately</p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="senderName"
                      name="senderName"
                      value={recipientInfo.senderName}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="senderEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      id="senderEmail"
                      name="senderEmail"
                      value={recipientInfo.senderEmail}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                <div className="flex justify-between items-center mb-2">
                  <span>Gift Card Value</span>
                  <span className="font-semibold">{formatPrice(getSelectedAmount())}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span>Processing Fee</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-[#0d0499]">{formatPrice(getSelectedAmount())}</span>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="border border-[#0d0499] text-[#0d0499] px-6 py-3 rounded-lg font-semibold hover:bg-[#0d0499] hover:text-white transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center justify-center"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Purchase Gift Card
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3: Success */}
        {currentStep === 3 && (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gift Card Purchased!</h2>
            <p className="text-gray-600 mb-6">
              Your gift card has been successfully purchased and {recipientInfo.deliveryDate ? 'scheduled for delivery' : 'sent'} to {recipientInfo.recipientEmail}.
            </p>

            <div className="bg-[#c6f2f4] rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-[#0d0499] mb-2">What happens next?</h3>
              <ul className="text-sm text-[#0d0499] space-y-1 text-left max-w-md mx-auto">
                <li>• You'll receive a confirmation email with the purchase details</li>
                <li>• The recipient will receive their gift card via email</li>
                <li>• The gift card can be used immediately on our website</li>
                <li>• No expiry date - it's valid forever!</li>
              </ul>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => {
                  setCurrentStep(1);
                  setRecipientInfo({
                    recipientName: '',
                    recipientEmail: '',
                    message: '',
                    deliveryDate: '',
                    senderName: '',
                    senderEmail: '',
                  });
                  setSelectedAmount(50);
                  setCustomAmount('');
                }}
                className="border border-[#0d0499] text-[#0d0499] px-6 py-3 rounded-lg font-semibold hover:bg-[#0d0499] hover:text-white transition-colors"
              >
                Buy Another Gift Card
              </button>
              <button
                onClick={onBack}
                className="bg-[#0d0499] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftCardPage;