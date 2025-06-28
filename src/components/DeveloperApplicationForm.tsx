import React, { useState } from 'react';
import { Plus, X, ExternalLink } from 'lucide-react';
import { useDeveloperApplications } from '../hooks/useDeveloperApplications';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/useToast';

const DeveloperApplicationForm: React.FC = () => {
  const { user } = useAuth();
  const { submitApplication, hasApplication, getLatestApplication } = useDeveloperApplications(user?.id);
  const { success, error: showError } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    developer_name: '',
    developer_website: '',
    developer_bio: '',
    portfolio_links: [''],
    experience_years: '',
    motivation: ''
  });

  const existingApplication = getLatestApplication();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      
      const portfolioLinks = formData.portfolio_links.filter(link => link.trim() !== '');
      
      await submitApplication({
        developer_name: formData.developer_name,
        developer_website: formData.developer_website || undefined,
        developer_bio: formData.developer_bio,
        portfolio_links: portfolioLinks.length > 0 ? portfolioLinks : undefined,
        experience_years: formData.experience_years ? parseInt(formData.experience_years) : undefined,
        motivation: formData.motivation
      });
      
      success('Developer application submitted successfully!', 'We will review your application within 3-5 business days.');
    } catch (err) {
      showError('Failed to submit application', err instanceof Error ? err.message : undefined);
    } finally {
      setSubmitting(false);
    }
  };

  const addPortfolioLink = () => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: [...prev.portfolio_links, '']
    }));
  };

  const removePortfolioLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.filter((_, i) => i !== index)
    }));
  };

  const updatePortfolioLink = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      portfolio_links: prev.portfolio_links.map((link, i) => i === index ? value : link)
    }));
  };

  if (hasApplication()) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Developer Application Status</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-blue-900">Application Submitted</h3>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              existingApplication?.status === 'approved' 
                ? 'bg-green-100 text-green-800'
                : existingApplication?.status === 'rejected'
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {existingApplication?.status === 'approved' ? 'Approved' :
               existingApplication?.status === 'rejected' ? 'Rejected' : 'Under Review'}
            </span>
          </div>
          
          <p className="text-blue-700 mb-2">
            Your developer application has been submitted and is currently under review.
          </p>
          
          <p className="text-sm text-blue-600">
            Submitted on {existingApplication ? new Date(existingApplication.created_at).toLocaleDateString() : 'Unknown'}
          </p>
          
          {existingApplication?.notes && (
            <div className="mt-4 p-3 bg-white rounded border">
              <h4 className="font-medium text-gray-900 mb-1">Review Notes:</h4>
              <p className="text-gray-700 text-sm">{existingApplication.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Apply to Become a Developer
        </h2>
        <p className="text-gray-600">
          Join our community of developers and start publishing your apps on ZimbabweApps.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Developer Name *
            </label>
            <input
              type="text"
              required
              value={formData.developer_name}
              onChange={(e) => setFormData(prev => ({ ...prev, developer_name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Your developer name or company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.developer_website}
              onChange={(e) => setFormData(prev => ({ ...prev, developer_website: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Developer Bio *
          </label>
          <textarea
            rows={4}
            required
            value={formData.developer_bio}
            onChange={(e) => setFormData(prev => ({ ...prev, developer_bio: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Tell us about yourself, your background, and your development experience..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Portfolio Links
          </label>
          <div className="space-y-2">
            {formData.portfolio_links.map((link, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="url"
                  value={link}
                  onChange={(e) => updatePortfolioLink(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://github.com/yourusername/project"
                />
                {formData.portfolio_links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePortfolioLink(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPortfolioLink}
              className="flex items-center space-x-2 text-green-600 hover:text-green-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add Portfolio Link</span>
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Join our community of authors and start publishing your books on Book-Case.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Years of Experience
          </label>
          <select
            value={formData.experience_years}
            onChange={(e) => setFormData(prev => ({ ...prev, experience_years: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="">Select experience level</option>
            <option value="0">Less than 1 year</option>
            <option value="1">1-2 years</option>
            <option value="3">3-5 years</option>
            <option value="6">6-10 years</option>
            <option value="11">More than 10 years</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Why do you want to become an author on Book-Case? *
          </label>
          <textarea
            rows={4}
            required
            value={formData.motivation}
            onChange={(e) => setFormData(prev => ({ ...prev, motivation: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="Share your motivation and what you hope to achieve..."
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• We'll review your application within 3-5 business days</li>
            <li>• You'll receive an email notification about the decision</li>
            <li>• If approved, you'll gain access to the developer portal</li>
            <li>• You can then start submitting apps for review</li>
          </ul>
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
            disabled={submitting}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeveloperApplicationForm;