import React, { useState } from 'react';
import { Upload, Plus, BarChart3, Users, DollarSign, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApps } from '../hooks/useApps';
import DeveloperApplicationForm from '../components/DeveloperApplicationForm';

const DeveloperPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'submit' | 'manage' | 'analytics'>('submit');
  const { apps: developerApps } = useApps({ 
    developerId: user?.id,
    status: undefined // Show all statuses for developer
  });

  const tabs = [
    { id: 'submit', label: 'Submit App', icon: Plus },
    { id: 'manage', label: 'Manage Apps', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  // Check if user is a developer or has applied
  const isDeveloper = user?.role === 'developer';
  const canSubmitApps = isDeveloper;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Developer Portal</h1>
          <p className="text-gray-600 mt-2">
            {isDeveloper 
              ? 'Submit and manage your books on Book-Case'
              : 'Apply to become an author and start publishing books'
            }
          </p>
        </div>

        {/* Developer Application Form for non-developers */}
        {!isDeveloper && (
          <DeveloperApplicationForm />
        )}

        {/* Tabs */}
        {isDeveloper && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'submit' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Submit Your App
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Fill out the form below to submit your book to Book-Case. 
                    Our review team will evaluate it within 3-5 business days.
                  </p>
                </div>

                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        App Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Enter your app name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Genre *
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option value="">Select a genre</option>
                        <option value="fiction">Fiction</option>
                        <option value="non-fiction">Non-Fiction</option>
                        <option value="mystery">Mystery</option>
                        <option value="romance">Romance</option>
                        <option value="science-fiction">Science Fiction</option>
                        <option value="fantasy">Fantasy</option>
                        <option value="biography">Biography</option>
                        <option value="history">History</option>
                        <option value="self-help">Self-Help</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Description *
                    </label>
                    <textarea
                      rows={4}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Describe your app's features and functionality..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Leave blank for free apps</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Version
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="1.0.0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      App Icon *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        <span className="font-medium text-green-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 2MB (512x512px recommended)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Screenshots *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        <span className="font-medium text-green-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 5MB each (3-5 screenshots recommended)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      APK File *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        <span className="font-medium text-green-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">APK file up to 100MB</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                    />
                    <label htmlFor="terms" className="ml-2 text-sm text-gray-900">
                      I agree to the{' '}
                      <a href="#" className="text-green-600 hover:text-green-500">
                        Developer Terms and Conditions
                      </a>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Save Draft
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Submit for Review
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'manage' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Your Books
                  </h2>
                  <button
                    onClick={() => setActiveTab('submit')}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Submit New Book</span>
                  </button>
                </div>

                <div className="space-y-4">
                  {developerApps.map((app) => (
                    <div key={app.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{app.name}</h3>
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                            app.status === 'Published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {app.status}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            Edit
                          </button>
                          <button className="text-gray-600 hover:text-gray-700 font-medium text-sm">
                            View
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{app.downloads}</p>
                          <p className="text-sm text-gray-600">Downloads</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{app.rating || '—'}</p>
                          <p className="text-sm text-gray-600">Rating</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{app.revenue}</p>
                          <p className="text-sm text-gray-600">Revenue</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">—</p>
                          <p className="text-sm text-gray-600">Reviews</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  Analytics Dashboard
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">15,234</p>
                        <p className="text-gray-600">Total Downloads</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-green-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">$245</p>
                        <p className="text-gray-600">Total Revenue</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-lg p-6">
                    <div className="flex items-center">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                      <div className="ml-4">
                        <p className="text-2xl font-bold text-gray-900">4.3</p>
                        <p className="text-gray-600">Avg Rating</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-100 rounded-lg p-8 text-center">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Detailed analytics dashboard coming soon. You'll be able to track downloads, 
                    revenue, user engagement, and more.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default DeveloperPage;