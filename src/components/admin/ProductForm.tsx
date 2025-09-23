import React, { useState } from 'react';
import { ArrowLeft, Save, X } from 'lucide-react';
import { Product } from '../../types';
import { ProductFormData } from '../../types/admin';

interface ProductFormProps {
  product?: Product | null;
  onSave: (productData: ProductFormData) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: product?.name || '',
    brand: product?.brand || '',
    description: product?.description || '',
    price: product?.price || 0,
    originalPrice: product?.originalPrice || undefined,
    sizes: product?.sizes || [''],
    categories: product?.categories || [''],
    skinConcerns: product?.skinConcerns || [''],
    skinTypes: product?.skinTypes || [''],
    ingredients: product?.ingredients || [''],
    picture: product?.picture || '',
    inStock: product?.inStock ?? true,
    isPopular: product?.isPopular || false,
    isNew: product?.isNew || false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayChange = (field: keyof ProductFormData, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: keyof ProductFormData) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), '']
    }));
  };

  const removeArrayItem = (field: keyof ProductFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.picture.trim()) newErrors.picture = 'Product image URL is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      sizes: formData.sizes.filter(s => s.trim()),
      categories: formData.categories.filter(c => c.trim()),
      skinConcerns: formData.skinConcerns.filter(sc => sc.trim()),
      skinTypes: formData.skinTypes.filter(st => st.trim()),
      ingredients: formData.ingredients.filter(i => i.trim()),
    };

    onSave(cleanedData);
  };

  const renderArrayField = (
    field: keyof ProductFormData,
    label: string,
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      {(formData[field] as string[]).map((item, index) => (
        <div key={index} className="flex items-center mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayChange(field, index, e.target.value)}
            placeholder={placeholder}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499]"
          />
          {(formData[field] as string[]).length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="ml-2 p-2 text-red-600 hover:text-red-800 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="text-sm text-[#0d0499] hover:text-[#c6f2f4] transition-colors"
      >
        + Add {label.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Basic Information */}
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
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand *
            </label>
            <input
              type="text"
              id="brand"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
                errors.brand ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter brand name"
            />
            {errors.brand && <p className="mt-1 text-sm text-red-600">{errors.brand}</p>}
          </div>
        </div>

        {/* Description */}
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

        {/* Pricing */}
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
            <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
              Original Price (₦) - Optional
            </label>
            <input
              type="number"
              id="originalPrice"
              name="originalPrice"
              value={formData.originalPrice || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499]"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Product Image */}
        <div>
          <label htmlFor="picture" className="block text-sm font-medium text-gray-700 mb-1">
            Product Image URL *
          </label>
          <input
            type="url"
            id="picture"
            name="picture"
            value={formData.picture}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499] ${
              errors.picture ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {errors.picture && <p className="mt-1 text-sm text-red-600">{errors.picture}</p>}
          {formData.picture && (
            <div className="mt-2">
              <img
                src={formData.picture}
                alt="Product preview"
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        {/* Array Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderArrayField('sizes', 'Sizes', 'e.g., 150ml')}
          {renderArrayField('categories', 'Categories', 'e.g., Cleansers')}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderArrayField('skinConcerns', 'Skin Concerns', 'e.g., Acne')}
          {renderArrayField('skinTypes', 'Skin Types', 'e.g., Oily')}
        </div>

        {renderArrayField('ingredients', 'Key Ingredients', 'e.g., Salicylic Acid')}

        {/* Status Checkboxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={formData.inStock}
              onChange={handleInputChange}
              className="mr-2 text-[#0d0499] focus:ring-[#0d0499]"
            />
            <span className="text-sm font-medium text-gray-700">In Stock</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleInputChange}
              className="mr-2 text-[#0d0499] focus:ring-[#0d0499]"
            />
            <span className="text-sm font-medium text-gray-700">Popular Product</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              name="isNew"
              checked={formData.isNew}
              onChange={handleInputChange}
              className="mr-2 text-[#0d0499] focus:ring-[#0d0499]"
            />
            <span className="text-sm font-medium text-gray-700">New Product</span>
          </label>
        </div>

        {/* Form Actions */}
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