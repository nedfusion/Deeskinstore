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
      question: 'What is Dee Skin Store?',
      answer: 'Dee Skin Store is your one-stop online personal care store dedicated to providing you with authentic, high-quality skincare products to help you achieve healthier, more radiant skin. We offer a wide range of products from the Americas, Europe and Asia and are consistently improving our offerings. We also offer virtual skincare consultations with a professional to provide you with tailored skincare recommendations for your skin concerns.',
      category: 'About Us'
    },
    {
      id: '2',
      question: 'How do I place an order?',
      answer: 'To place an order, simply browse our website, www.deeskinstore.com, select the products you want, add them to your cart, and proceed to checkout. Follow the on-screen instructions to complete your purchase. If you have issues doing this, kindly send a DM via Instagram to @deeskinstore or email payment@deeskinstore.com',
      category: 'Orders & Checkout'
    },
    {
      id: '3',
      question: 'What payment methods do you accept?',
      answer: 'Our secure online checkout platform is Paystack. This is the faster way to get your order fulfilled because we don\'t need to confirm payments manually. If you decide to pay with a direct bank transfer, kindly select the \'Bank Transfer\' option at checkout and we will manually confirm your order. After this stage, kindly do the transfer only to: Bank account: 6500489174, Bank name: Providus Bank, Account name: Uba Favour Chidinma. After transfer, send an email to payment@deeskinstore.com with Email subject: Order Number and Email body: Order number, Account name (from where payment was made) and attach your receipt of payment. Please be wary of any fraudulent/scam accounts as these are our only accepted payment methods currently.',
      category: 'Payment & Billing'
    },
    {
      id: '4',
      question: 'What is your shipping policy?',
      answer: 'We offer standard shipping options with trusted logistics companies across Nigeria. Shipping times and costs may vary depending on your location and are stated on the checkout page so you can select which one you prefer.',
      category: 'Shipping & Delivery'
    },
    {
      id: '5',
      question: 'Where do you currently ship to?',
      answer: 'We currently offer shipping across Nigeria. During checkout, you can select your state and location, and shipping options and costs will be displayed accordingly.',
      category: 'Shipping & Delivery'
    },
    {
      id: '6',
      question: 'What is your return policy?',
      answer: 'In the rare event that you receive a damaged or defective product, please contact our customer support team via email at orders@deeskinstore.com within 24 hours of receiving your order. We will work with you to resolve the issue promptly. Please check our Return Policy page for more detailed information.',
      category: 'Returns & Exchanges'
    },
    {
      id: '7',
      question: 'Can I get personalized skincare recommendations?',
      answer: 'Absolutely! We offer skincare consultations with our pharmacist and cosmetic scientist to help you discover products tailored to your skin type and concerns. It\'s a great way to find products that are right for you. Book a session here.',
      category: 'Services'
    },
    {
      id: '8',
      question: 'What if my package arrives damaged or with missing items?',
      answer: 'If your order arrives damaged or with missing items, please contact our customer support team via orders@deeskinstore.com within 24 hours of receiving the package, and we will assist you in resolving the issue.',
      category: 'Orders & Tracking'
    },
    {
      id: '9',
      question: 'Do you offer skincare tips and advice?',
      answer: 'Yes, we provide valuable skincare tips and advice through our blog, Instagram and newsletter. You can also book a consultation here for tailored recommendations.',
      category: 'Services'
    },
    {
      id: '10',
      question: 'Can I stockpile orders?',
      answer: 'Yes, you can stockpile orders in our warehouse for a period up to 28 days after placing your order. Ensure to select the \'Stockpile\' option at checkout and leave your contact details. Any time after this period will require a holding charge of 1000 Naira per week.',
      category: 'Orders & Checkout'
    },
    {
      id: '11',
      question: 'How can I contact your customer support?',
      answer: 'You can contact our customer support team through the Contact Us page on our website, via email at support@deeskinstore.com, or via Instagram DM @deeskinstore. We are here to assist you with any questions or concerns.',
      category: 'Contact & Support'
    },
    {
      id: '12',
      question: 'Are there any promotions or discounts available?',
      answer: 'We periodically have special promotions and discounts. Be sure to subscribe to our newsletter, check the website from time to time, and follow us on social media to stay updated on the latest deals and offers.',
      category: 'Promotions & Discounts'
    },
    {
      id: '13',
      question: 'Are the ingredients in your products safe for all skin types?',
      answer: 'We offer authentic products suitable for various skin types, including sensitive skin. You can find descriptions of each product on our website. Kindly bear in mind that different people react differently to products, so kindly do some research ahead of time to minimize this risk.',
      category: 'Products & Safety'
    },
    {
      id: '14',
      question: 'How can I stay informed about new product releases?',
      answer: 'To stay updated on our new product releases and skincare trends, subscribe to our newsletter and follow us on social media (@deeskinstore on all platforms.) We regularly share exciting updates and product launches.',
      category: 'Updates & News'
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
            <p className="text-gray-700 leading-relaxed mb-6">
              At Dee Skin Store, we prioritize transparency and clear communication at all times. Please read the following carefully, as we do not accept returns on any products or orders unless explicitly mentioned otherwise due to certain legal or regulatory requirements. By making a purchase on our website, you agree to abide by this policy.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Overall Return Policy</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We do not offer returns, refunds, or exchanges for any products purchased from our store, except in cases where they are defective or damaged on or before delivery.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Product Descriptions</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We make every effort to provide accurate product descriptions, images, and information to help you make an informed purchase decision. In addition, we advise that you do your research or get personalized recommendations.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Damaged or Defective Products</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              In the rare event that you receive a damaged or defective product, please contact our customer support team via email at <a href="mailto:orders@deeskinstore.com" className="text-[#0d0499] hover:underline">orders@deeskinstore.com</a> within 24 hours of receiving your order. We will work with you to resolve the issue promptly.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Order Cancellation</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Once an order is placed and confirmed, it cannot be cancelled or modified. Please review your order carefully before completing the purchase.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lost or Stolen Packages</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We are not responsible for lost or stolen packages once they have been marked as delivered by the shipping carrier. Please ensure that your shipping address is accurate and secure.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Refused Deliveries</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Refusing a delivery does not constitute a valid return. If you refuse delivery of an order, you will still be responsible for the original shipping charges and any return shipping fees incurred.
            </p>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Legal Rights</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              This return policy does not affect any legal rights you may have under applicable consumer protection laws.
            </p>
            
            <p className="text-gray-700 leading-relaxed mb-4">
              While we strive to provide high-quality products and excellent customer service, our return policy is in place to maintain the integrity and hygiene of our products. We appreciate your understanding and support in this matter.
            </p>
            
            <p className="text-gray-700 leading-relaxed">
              Dee Skin Store reserves the right to update or modify this return policy, at any time without prior notice. Please check our website for the most up-to-date policy information.
            </p>
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