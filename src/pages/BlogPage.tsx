import React, { useState } from 'react';
import { ArrowLeft, Search, Calendar, User, ArrowRight, Clock } from 'lucide-react';
import { blogPosts } from '../data/blog';
import { BlogPost } from '../types';

interface BlogPageProps {
  onBack: () => void;
}

const BlogPage: React.FC<BlogPageProps> = ({ onBack }) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'Education', 'Ingredients', 'Routines', 'Tips'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (selectedPost) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <button
              onClick={() => setSelectedPost(null)}
              className="flex items-center text-gray-600 hover:text-[#0d0499] transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Blog
            </button>
          </div>
        </div>

        {/* Blog Post */}
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Featured Image */}
            <img
              src={selectedPost.featuredImage}
              alt={selectedPost.title}
              className="w-full h-64 md:h-96 object-cover"
            />
            
            <div className="p-8">
              {/* Meta */}
              <div className="flex items-center text-sm text-gray-600 mb-4">
                <User className="h-4 w-4 mr-1" />
                <span className="mr-4">{selectedPost.author}</span>
                <Calendar className="h-4 w-4 mr-1" />
                <span className="mr-4">{formatDate(selectedPost.publishedAt)}</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>5 min read</span>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {selectedPost.title}
              </h1>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-[#c6f2f4] text-[#0d0499] text-sm rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Content */}
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-600 mb-6">{selectedPost.excerpt}</p>
                
                {/* Mock content - in a real app this would be rendered from the content field */}
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  <p>
                    Building an effective skincare routine doesn't have to be complicated. With the right knowledge 
                    and products, you can achieve healthy, glowing skin that looks and feels its best.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Understanding Your Skin</h2>
                  <p>
                    The first step in creating any skincare routine is understanding your unique skin type and concerns. 
                    This knowledge will guide you in selecting products that work harmoniously with your skin rather than against it.
                  </p>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">The Basic Steps</h3>
                  <ol className="list-decimal list-inside space-y-2 ml-4">
                    <li>Cleansing - Remove dirt, oil, and impurities</li>
                    <li>Toning - Balance your skin's pH levels</li>
                    <li>Treatment - Address specific skin concerns</li>
                    <li>Moisturizing - Hydrate and protect your skin</li>
                    <li>Sun Protection - Shield from harmful UV rays</li>
                  </ol>
                  
                  <p>
                    Remember, consistency is key when it comes to skincare. It typically takes 4-6 weeks to see 
                    noticeable results from a new routine, so be patient and give your products time to work.
                  </p>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Product Selection Tips</h2>
                  <p>
                    When selecting products, always read ingredient lists and choose formulations that are 
                    appropriate for your skin type. If you're unsure, consider booking a consultation with 
                    one of our skincare experts who can provide personalized recommendations.
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-12 p-6 bg-[#c6f2f4] rounded-lg">
                <h3 className="text-lg font-semibold text-[#0d0499] mb-2">
                  Need Personalized Skincare Advice?
                </h3>
                <p className="text-[#0d0499] mb-4">
                  Book a consultation with our skincare experts to get a routine tailored specifically for your skin.
                </p>
                <button className="bg-[#0d0499] text-white px-6 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors">
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-[#0d0499] transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Skincare Blog</h1>
            <p className="text-gray-600 mt-2">Expert tips and advice for healthy, glowing skin</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#c6f2f4] focus:border-[#0d0499]"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center text-xs text-gray-600 mb-3">
                  <span className="bg-[#c6f2f4] text-[#0d0499] px-2 py-1 rounded-full mr-2">
                    {post.category}
                  </span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {post.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-1" />
                    <span>{post.author}</span>
                  </div>
                  
                  <button className="text-[#0d0499] hover:text-[#c6f2f4] transition-colors flex items-center text-sm font-medium">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No articles found matching your search.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-[#0d0499] font-semibold hover:underline"
            >
              Clear filters to see all articles
            </button>
          </div>
        )}

        {/* Newsletter CTA */}
        <div className="mt-16 bg-[#0d0499] rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest skincare tips, product reviews, 
            and exclusive content delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 text-gray-900 rounded-l-lg sm:rounded-r-none rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#c6f2f4]"
            />
            <button className="bg-[#c6f2f4] text-[#0d0499] px-6 py-3 rounded-r-lg sm:rounded-l-none rounded-l-lg hover:bg-opacity-90 transition-colors font-semibold">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;