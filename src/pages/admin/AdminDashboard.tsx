import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  Star,
  TrendingUp,
  DollarSign,
  Eye,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import UserManagement from './UserManagement';
import ReviewManagement from './ReviewManagement';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { state, logout, hasPermission } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navigation = [
    { id: 'overview', name: 'Overview', icon: BarChart3, permission: null },
    { id: 'products', name: 'Products', icon: Package, permission: 'products.view' },
    { id: 'orders', name: 'Orders', icon: ShoppingCart, permission: 'orders.view' },
    { id: 'reviews', name: 'Reviews', icon: Star, permission: 'orders.reviews' },
    { id: 'users', name: 'Admin Users', icon: Users, permission: 'users.view' },
  ].filter(item => !item.permission || hasPermission(item.permission));

  const stats = [
    { name: 'Total Revenue', value: '₦2,847,500', change: '+12.5%', icon: DollarSign, color: 'text-green-600' },
    { name: 'Total Orders', value: '1,247', change: '+8.2%', icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'Total Products', value: '156', change: '+3.1%', icon: Package, color: 'text-purple-600' },
    { name: 'Active Users', value: '8,429', change: '+15.3%', icon: Users, color: 'text-orange-600' },
  ];

  const recentOrders = [
    { id: '#12345', customer: 'Jane Doe', amount: '₦15,400', status: 'completed', date: '2024-01-15' },
    { id: '#12346', customer: 'John Smith', amount: '₦8,200', status: 'processing', date: '2024-01-15' },
    { id: '#12347', customer: 'Sarah Johnson', amount: '₦22,100', status: 'shipped', date: '2024-01-14' },
    { id: '#12348', customer: 'Mike Wilson', amount: '₦12,800', status: 'pending', date: '2024-01-14' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'reviews':
        return <ReviewManagement />;
      case 'users':
        return <UserManagement />;
      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <div className="flex items-center">
                        <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                        <span className={`ml-2 text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
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
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.customer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-[#0d0499] hover:text-[#c6f2f4] transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-[#0d0499]">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#0d0499] text-white'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </button>
            ))}
          </div>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-[#0d0499] rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-medium">
                {state.currentAdmin?.firstName?.[0]}{state.currentAdmin?.lastName?.[0]}
              </span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">
                {state.currentAdmin?.firstName} {state.currentAdmin?.lastName}
              </p>
              <p className="text-xs text-gray-500 capitalize">{state.currentAdmin?.role.replace('_', ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 transition-colors"
          >
            <LogOut className="mr-3 h-4 w-4" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold text-gray-900 capitalize">
                {activeTab === 'overview' ? 'Dashboard Overview' : activeTab}
              </h2>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;