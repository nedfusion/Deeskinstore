import React from 'react';
import { ArrowLeft, Award, Users, Heart, MapPin, Mail, GraduationCap } from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">About Us</h1>
            <p className="text-xl text-gray-600">Your trusted partner in skincare excellence</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#c6f2f4] to-[#0d0499] rounded-2xl p-8 md:p-12 text-white mb-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Feel Confident, Comfortable, and Radiant
            </h2>
            <p className="text-xl text-gray-100 leading-relaxed max-w-3xl mx-auto">
              At Dee Skin Store, our mission is simple yet powerful - to help you feel confident, 
              comfortable, and radiant in your skin.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 mb-12">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              We understand that your skin is a reflection of your unique beauty and individuality. 
              That's why we're here to provide you with a curated selection of safe, effective, 
              and handpicked skincare products that cater to your specific needs and concerns.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Based in the vibrant city of Lagos, Nigeria, with shipping available across the country, 
              Dee Skin Store is more than just an online skincare retailer. We're a community of 
              skincare enthusiasts, led by a dedicated pharmacist with a Double Master's Degree in 
              Cosmetic and Dermatological Sciences. With a strong background in pharmaceuticals and 
              cosmetics, as well as a deep passion for skincare, we bring you a carefully selected 
              range of products that are not only transformative but also backed by science.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              We believe that skincare is not one-size-fits-all, and that's why we can offer a 
              personalized approach to your skincare journey through a skin health consultation. 
              Our goal is to empower you with the knowledge and products you need to unlock your 
              skin's full potential, ensuring it's as vibrant and healthy as you are.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Every product you find at Dee Skin Store has been meticulously chosen and we are 
              committed to delivering skincare solutions that work and can make a real difference 
              in your daily routine.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Whether you're dealing with specific skin concerns or simply looking for a better 
              way to pamper yourself, we're here to guide you. We believe that your skin deserves 
              the best, and that's exactly what we aim to provide – the best of skincare for the 
              beautiful you.
            </p>

            <div className="bg-[#c6f2f4] rounded-lg p-6 my-8">
              <p className="text-[#0d0499] font-semibold text-lg text-center">
                Welcome to Dee Skin Store! We're excited to embark on this skincare journey with 
                you and help you experience the confidence and comfort you deserve.
              </p>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-[#0d0499]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Expert Leadership</h3>
            <p className="text-gray-600 text-sm">
              Led by a pharmacist with Double Master's in Cosmetic & Dermatological Sciences
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-[#0d0499]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Curated Selection</h3>
            <p className="text-gray-600 text-sm">
              Handpicked, safe, and effective products backed by science
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-[#0d0499]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Personalized Care</h3>
            <p className="text-gray-600 text-sm">
              Skin health consultations for your unique skincare journey
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="bg-[#c6f2f4] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-[#0d0499]" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Community Focus</h3>
            <p className="text-gray-600 text-sm">
              A community of skincare enthusiasts supporting your goals
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h3>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-[#0d0499] mr-2" />
              <span className="text-gray-700">Lagos, Nigeria</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-[#0d0499] mr-2" />
              <a 
                href="mailto:support@deeskinstore.com" 
                className="text-[#0d0499] hover:text-[#c6f2f4] transition-colors"
              >
                support@deeskinstore.com
              </a>
            </div>
          </div>
          
          <div className="mt-8">
            <button
              onClick={() => window.location.href = 'mailto:support@deeskinstore.com'}
              className="bg-[#0d0499] text-white px-8 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Contact Us Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;