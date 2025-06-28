import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useApps } from '../hooks/useApps';
import { Download, Star, Users, TrendingUp, Package, DollarSign } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { apps: userApps } = useApps({ 
    developerId: user?.role === 'developer' ? user.id : undefined 
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-8">Please log in to access your dashboard.</p>
          <a href="/login" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const userStats = user.role === 'developer' 
    ? [
        { icon: Package, label: 'Published Apps', value: userApps.filter(app => app.status === 'published').length.toString() },
        { icon: Download, label: 'Total Downloads', value: userApps.reduce((sum, app) => sum + (app.download_count || 0), 0).toString() },
        { icon: Star, label: 'Average Rating', value: userApps.length > 0 ? (userApps.reduce((sum, app) => sum + (app.rating_average || 0), 0) / userApps.length).toFixed(1) : '0.0' },
        { icon: DollarSign, label: 'Revenue', value: '$0' }
      ]
    : [
        { icon: Download, label: 'Apps Downloaded', value: '12' },
        { icon: Star, label: 'Reviews Given', value: '8' },
        { icon: Users, label: 'Following', value: '5' },
        { icon: TrendingUp, label: 'Wishlist', value: '3' }
      ];

  const recentApps = [
    {
      name: 'EcoCash Mobile',
      icon: 'https://images.pexels.com/photos/4386373/pexels-photo-4386373.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastUsed: '2 hours ago',
      status: 'Installed'
    },
    {
      name: 'Zimbabwe Weather',
      icon: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastUsed: '1 day ago',
      status: 'Update Available'
    },
    {
      name: 'ZimNews',
      icon: 'https://images.pexels.com/photos/97050/pexels-photo-97050.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&fit=crop',
      lastUsed: '3 days ago',
      status: 'Installed'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.full_name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'developer' 
              ? 'Manage your apps, analytics, and developer settings'
              : 'Manage your apps, reviews, and account settings'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {userStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="bg-green-100 p-3 rounded-lg">
                  <stat.icon className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Apps */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">My Apps</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {recentApps.map((app, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <img
                          src={app.icon}
                          alt={app.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">{app.name}</p>
                          <p className="text-sm text-gray-500">Last used {app.lastUsed}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          app.status === 'Update Available'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {app.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-4 text-green-600 hover:text-green-700 font-medium text-sm">
                  View All Apps →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Info</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{user.full_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Account Type</p>
                  <p className="font-medium capitalize">{user.role}</p>
                </div>
                {user.role === 'developer' && user.developer_name && (
                  <div>
                    <p className="text-sm text-gray-600">Developer Name</p>
                    <p className="font-medium">{user.developer_name}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium">{new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="w-full mt-4 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors">
                Edit Profile
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <a href="/apps" className="block w-full text-left bg-green-50 text-green-700 py-3 px-4 rounded-lg hover:bg-green-100 transition-colors">
                  Browse New Apps
                </a>
                <a href="/apps" className="block w-full text-left bg-blue-50 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-100 transition-colors">
                  Update Apps
                </a>
                <button className="w-full text-left bg-purple-50 text-purple-700 py-3 px-4 rounded-lg hover:bg-purple-100 transition-colors">
                  View Reviews
                </button>
                {user.role === 'developer' && (
                  <a href="/developer" className="block w-full text-left bg-orange-50 text-orange-700 py-3 px-4 rounded-lg hover:bg-orange-100 transition-colors">
                    Submit New App
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;