import React, { useState } from 'react';
import { Search, Star, Eye, Check, X, MessageSquare } from 'lucide-react';
import { OrderReview } from '../../types/admin';
import { useAdmin } from '../../context/AdminContext';

const ReviewManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<OrderReview | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const { hasPermission } = useAdmin();

  // Mock review data
  const [reviews, setReviews] = useState<OrderReview[]>([
    {
      id: '1',
      orderId: '12345',
      customerId: 'user1',
      productId: '1',
      rating: 5,
      comment: 'Amazing product! My skin has never looked better. The texture is perfect and it absorbs quickly without leaving any residue.',
      isVerified: true,
      isPublished: true,
      createdAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      orderId: '12346',
      customerId: 'user2',
      productId: '1',
      rating: 4,
      comment: 'Good product overall, but the packaging could be improved. The product itself works well for my sensitive skin.',
      isVerified: true,
      isPublished: false,
      createdAt: new Date('2024-01-14'),
    },
    {
      id: '3',
      orderId: '12347',
      customerId: 'user3',
      productId: '2',
      rating: 2,
      comment: 'Not what I expected. The product caused some irritation on my skin. Would not recommend for sensitive skin types.',
      isVerified: true,
      isPublished: false,
      createdAt: new Date('2024-01-13'),
    },
    {
      id: '4',
      orderId: '12348',
      customerId: 'user4',
      productId: '1',
      rating: 5,
      comment: 'Excellent quality and fast shipping. Will definitely order again!',
      isVerified: false,
      isPublished: false,
      createdAt: new Date('2024-01-12'),
    },
  ]);

  const statusOptions = [
    { value: 'all', label: 'All Reviews' },
    { value: 'published', label: 'Published' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'verified', label: 'Verified Only' },
    { value: 'unverified', label: 'Unverified' },
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         review.orderId.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    switch (statusFilter) {
      case 'published':
        matchesStatus = review.isPublished;
        break;
      case 'pending':
        matchesStatus = !review.isPublished;
        break;
      case 'verified':
        matchesStatus = review.isVerified;
        break;
      case 'unverified':
        matchesStatus = !review.isVerified;
        break;
    }
    
    return matchesSearch && matchesStatus;
  });

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const updateReviewStatus = (reviewId: string, field: 'isPublished' | 'isVerified', value: boolean) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, [field]: value } : review
    ));
  };

  const addAdminResponse = (reviewId: string, response: string) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, adminResponse: response } : review
    ));
    setAdminResponse('');
    setSelectedReview(null);
  };

  const getStatusBadge = (review: OrderReview) => {
    if (review.isPublished) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Published</span>;
    }
    return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
  };

  const getVerificationBadge = (review: OrderReview) => {
    if (review.isVerified) {
      return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Verified</span>;
    }
    return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Unverified</span>;
  };

  if (selectedReview) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setSelectedReview(null)}
              className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Review Details</h1>
              <p className="text-gray-600">Order #{selectedReview.orderId}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(selectedReview)}
            {getVerificationBadge(selectedReview)}
          </div>
        </div>

        {/* Review Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {renderStars(selectedReview.rating)}
                <span className="text-lg font-semibold text-gray-900">
                  {selectedReview.rating}/5 Stars
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {formatDate(selectedReview.createdAt)}
              </span>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Customer Review</h3>
              <p className="text-gray-700 leading-relaxed">{selectedReview.comment}</p>
            </div>

            {selectedReview.adminResponse && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin Response</h3>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-gray-700">{selectedReview.adminResponse}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Admin Actions */}
        {hasPermission('orders.reviews') && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Management</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Publication Status</span>
                  <button
                    onClick={() => updateReviewStatus(selectedReview.id, 'isPublished', !selectedReview.isPublished)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedReview.isPublished
                        ? 'bg-red-100 text-red-800 hover:bg-red-200'
                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                    }`}
                  >
                    {selectedReview.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Verification Status</span>
                  <button
                    onClick={() => updateReviewStatus(selectedReview.id, 'isVerified', !selectedReview.isVerified)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      selectedReview.isVerified
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {selectedReview.isVerified ? 'Mark Unverified' : 'Mark Verified'}
                  </button>
                </div>
              </div>
            </div>

            {/* Admin Response */}
            <div className="border-t pt-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                {selectedReview.adminResponse ? 'Update Admin Response' : 'Add Admin Response'}
              </h4>
              <div className="space-y-3">
                <textarea
                  value={adminResponse}
                  onChange={(e) => setAdminResponse(e.target.value)}
                  placeholder="Write a response to this review..."
                  rows={4}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499]"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => addAdminResponse(selectedReview.id, adminResponse)}
                    disabled={!adminResponse.trim()}
                    className="px-4 py-2 bg-[#0d0499] text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {selectedReview.adminResponse ? 'Update Response' : 'Add Response'}
                  </button>
                  <button
                    onClick={() => setAdminResponse('')}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Review Management</h1>
          <p className="text-gray-600">{filteredReviews.length} reviews found</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reviews by content or order ID..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499]"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499]"
            >
              {statusOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Review
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="max-w-xs">
                      <p className="text-sm text-gray-900 truncate">{review.comment}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getVerificationBadge(review)}
                        {review.adminResponse && (
                          <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            Responded
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-600">({review.rating})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    #{review.orderId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(review)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(review.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-[#0d0499] hover:text-[#c6f2f4] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {hasPermission('orders.reviews') && (
                        <>
                          <button
                            onClick={() => updateReviewStatus(review.id, 'isPublished', !review.isPublished)}
                            className={`transition-colors ${
                              review.isPublished
                                ? 'text-red-600 hover:text-red-800'
                                : 'text-green-600 hover:text-green-800'
                            }`}
                          >
                            {review.isPublished ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No reviews found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
            }}
            className="text-[#0d0499] font-semibold hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;