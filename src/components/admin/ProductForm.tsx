import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';

interface ProductFormProps {
  product?: any | null;
  onSave: (productData: any) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    image: '',
    category: '',
    stock: 50,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        image: product.image || '',
        category: product.category || '',
        stock: product.stock || 50,
      });
    }
  }, [product]);

  const categories = [
    'Cleansers',
    'Moisturizers',
    'Serums',
    'Sunscreens',
    'Toners',
    'Masks',
    'Eye Care',
    'Lip Care',
    'Body Care',
    'Treatments',
    'Tools & Accessories',
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.image.trim()) newErrors.image = 'Product image URL is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.stock < 0) newErrors.stock = 'Stock cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    onSave(formData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <button
            onClick={onCancel}
            className="mr-4 p-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {product ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">
              {product ? 'Update product information' : 'Create a new product listing'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
                errors.category ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Enter product description"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
              Price (₦) *
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0.00"
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity *
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              min="0"
              step="1"
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
                errors.stock ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="0"
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Product Image URL *
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
              errors.image ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
          <p className="mt-1 text-sm text-gray-500">
            Use high-quality product images. Recommended size: 800x800px
          </p>
          {formData.image && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Image Preview:</p>
              <img
                src={formData.image}
                alt="Product preview"
                className="w-48 h-48 object-cover rounded-lg border border-gray-200"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-[#0d0499] text-white rounded-lg hover:bg-opacity-90 transition-colors flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            {product ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
