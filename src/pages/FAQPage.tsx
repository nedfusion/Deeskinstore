import React, { useState } from 'react';
import { ArrowLeft, ChevronDown, ChevronUp, Search, Mail, Phone, MapPin } from 'lucide-react';

interface FAQPageProps {
  onBack: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQPage: React.FC<FAQPageProps> = ({ onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Placeholder FAQ data - replace with your actual 14 questions
  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'What makes Dee Skin Store different from other skincare retailers?',
      answer: 'Dee Skin Store is led by a dedicated pharmacist with a Double Master\'s Degree in Cosmetic and Dermatological Sciences. We offer a curated selection of safe, effective, and handpicked skincare products backed by science, along with personalized skin health consultations.',
      category: 'About Us'
    },
    {
      id: '2',
      question: 'Do you offer skin consultations?',
      answer: 'Yes! We offer personalized skin health consultations to help you choose the right products for your specific skin type and concerns. Our expert pharmacist will guide you through your skincare journey.',
      category: 'Services'
    },
    {
      id: '3',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfers, card payments, and mobile money. Specific banking details and payment instructions will be provided during checkout.',
      category: 'Payment & Billing'
    },
    {
      id: '4',
      question: 'Do you ship nationwide in Nigeria?',
      answer: 'Yes, we ship across Nigeria from our base in Lagos. Shipping costs and delivery times vary depending on your location. Free shipping is available on orders over ₦15,000.',
      category: 'Shipping & Delivery'
    },
    {
      id: '5',
      question: 'How long does shipping take?',
      answer: 'Shipping times vary by location: Lagos (1-2 business days), other major cities (2-4 business days), remote areas (3-7 business days). You\'ll receive tracking information once your order ships.',
      category: 'Shipping & Delivery'
    },
    {
      id: '6',
      question: 'Are your products authentic?',
      answer: 'Absolutely! All our products are 100% authentic and sourced directly from authorized distributors and manufacturers. We guarantee the authenticity of every product we sell.',
      category: 'Products'
    },
    {
      id: '7',
      question: 'Can I return or exchange products?',
      answer: 'Yes, we have a comprehensive return policy. Please see our detailed Return Policy section below for complete terms and conditions.',
      category: 'Returns & Exchanges'
    },
    {
      id: '8',
      question: 'How do I track my order?',
      answer: 'Once your order ships, you\'ll receive a tracking number via email. You can use this to track your package through our shipping partner\'s website.',
      category: 'Orders & Tracking'
    },
    {
      id: '9',
      question: 'Do you offer gift cards?',
      answer: 'Yes! We offer digital gift cards that can be purchased and sent directly to the recipient via email. Gift cards never expire and can be used for any products on our website.',
      category: 'Gift Cards'
    },
    {
      id: '10',
      question: 'How do I create an account?',
      answer: 'You can create an account by clicking the user icon in the top navigation and selecting "Sign up". You\'ll need to provide your email, name, and create a password.',
      category: 'Account & Profile'
    },
    {
      id: '11',
      question: 'What if I have sensitive skin?',
      answer: 'We have a dedicated section for sensitive skin products and can provide personalized recommendations through our consultation service. Always patch test new products before full application.',
      category: 'Skin Concerns'
    },
    {
      id: '12',
      question: 'Do you offer bulk or wholesale pricing?',
      answer: 'For bulk orders or wholesale inquiries, please contact us at business@deeskinstore.com. We offer special pricing for qualified businesses and large orders.',
      category: 'Business & Wholesale'
    },
    {
      id: '13',
      question: 'How can I contact customer support?',
      answer: 'You can reach our customer support team via email at support@deeskinstore.com or call us at +2347079228195. We typically respond to emails within 24 hours.',
      category: 'Contact & Support'
    },
    {
      id: '14',
      question: 'Do you have a physical store location?',
      answer: 'We are primarily an online retailer based in Lagos, Nigeria. For in-person consultations or product pickups, please contact us to arrange an appointment.',
      category: 'Store Information'
    }
  ];

  const categories = ['all', ...Array.from(new Set(faqData.map(item => item.category)))];

  const filteredFAQs = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const groupedFAQs = categories.reduce((acc, category) => {
    if (category === 'all') return acc;
    acc[category] = filteredFAQs.filter(item => item.category === category);
    return acc;
  }, {} as Record<string, FAQItem[]>);

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
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Frequently Asked Questions</h1>
            <p className="text-xl text-gray-600">Find answers to common questions about Dee Skin Store</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search FAQs..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* FAQ Content */}
        {selectedCategory === 'all' ? (
          // Show grouped by category
          Object.entries(groupedFAQs).map(([category, items]) => (
            items.length > 0 && (
              <div key={category} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
                  {category}
                </h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                      <button
                        onClick={() => toggleExpanded(item.id)}
                        className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {item.question}
                        </h3>
                        {expandedItems.includes(item.id) ? (
                          <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {expandedItems.includes(item.id) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))
        ) : (
          // Show filtered results
          <div className="space-y-4">
            {filteredFAQs.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <button
                  onClick={() => toggleExpanded(item.id)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  {expandedItems.includes(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedItems.includes(item.id) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No FAQs found matching your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-[#0d0499] font-semibold hover:underline"
            >
              Clear search to see all FAQs
            </button>
          </div>
        )}

        {/* Return Policy Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
            Return Policy
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-4">
              <strong>Please replace this placeholder with your complete Return Policy content.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your return policy should include:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 mb-6">
              <li>Return timeframe (e.g., 30 days)</li>
              <li>Condition requirements for returns</li>
              <li>Items that cannot be returned</li>
              <li>Return process and instructions</li>
              <li>Refund processing times</li>
              <li>Who pays for return shipping</li>
              <li>Exchange policies</li>
              <li>Contact information for returns</li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 bg-[#0d0499] rounded-lg p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Still Have Questions?</h3>
          <p className="text-gray-200 mb-6">
            Can't find what you're looking for? Our customer support team is here to help!
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 mb-6">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              <a 
                href="mailto:support@deeskinstore.com" 
                className="hover:text-[#c6f2f4] transition-colors"
              >
                support@deeskinstore.com
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-2" />
              <a 
                href="tel:+2347079228195" 
                className="hover:text-[#c6f2f4] transition-colors"
              >
                +2347079228195
              </a>
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              <span>Lagos, Nigeria</span>
            </div>
          </div>
          <button
            onClick={() => window.location.href = 'mailto:support@deeskinstore.com'}
            className="bg-[#c6f2f4] text-[#0d0499] px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;