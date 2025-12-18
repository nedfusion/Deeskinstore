import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Eye, Filter } from 'lucide-react';
import { Product } from '../../types';
import { useAdmin } from '../../context/AdminContext';
import ProductForm from '../../components/admin/ProductForm';
import { productsService } from '../../services/products';

const ProductManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAdmin();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsService.getAllAdmin();
      setProductList(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', ...Array.from(new Set(productList.map(p => p.category)))];

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN'
    }).format(price);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await productsService.delete(productId);
        await loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleSaveProduct = async (productData: any) => {
    try {
      if (editingProduct) {
        await productsService.update(editingProduct.id, {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.picture,
          category: productData.categories[0],
          stock: 50,
        });
      } else {
        await productsService.create({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          image: productData.picture,
          category: productData.categories[0],
          stock: 50,
        });
      }
      setShowForm(false);
      setEditingProduct(null);
      await loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  if (showForm) {
    return (
      <ProductForm
        product={editingProduct}
        onSave={handleSaveProduct}
        onCancel={() => {
          setShowForm(false);
          setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>
        {hasPermission('products.create') && (
          <button
            onClick={handleAddProduct}
            className="bg-[#0d0499] text-white px-4 py-2 rounded-lg font-semibold hover:bg-opacity-90 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Product
          </button>
        )}
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
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499]"
            />
          </div>
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-[#0d0499] focus:border-[#0d0499]"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0d0499]"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      Various
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(product.price)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.stock > 0
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2">
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                        {hasPermission('products.edit') && (
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="text-[#0d0499] hover:text-[#c6f2f4] transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        {hasPermission('products.delete') && (
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No products found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
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

export default ProductManagement;