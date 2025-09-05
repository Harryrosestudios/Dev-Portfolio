import { useState, useEffect } from 'react';
import { getResumeData, updateResumeData } from '../services/resumeService.js';

const ResumeAdmin = () => {
  const [resumeData, setResumeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState('header');

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      setLoading(true);
      const data = await getResumeData();
      setResumeData(data);
    } catch (error) {
      console.error('Failed to fetch resume data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateResumeData(resumeData);
      alert('Resume data updated successfully!');
    } catch (error) {
      console.error('Failed to update resume data:', error);
      alert('Failed to update resume data. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    setResumeData(prev => {
      const newData = { ...prev };
      
      if (section === 'header') {
        newData.header[field] = value;
      } else if (section === 'technicalSkills') {
        newData.technicalSkills[field] = value.split(',').map(item => item.trim());
      } else if (index !== null) {
        newData[section][index][field] = value;
      }
      
      return newData;
    });
  };

  const addItem = (section) => {
    const newItem = section === 'education' 
      ? { id: Date.now().toString(), degree: '', institution: '', location: '', year: '' }
      : section === 'workExperience'
      ? { id: Date.now().toString(), position: '', company: '', location: '', period: '', responsibilities: [] }
      : section === 'projects'
      ? { id: Date.now().toString(), name: '', technologies: '', period: '', description: [] }
      : {};

    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeItem = (section, index) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  if (!resumeData) {
    return <div className="flex justify-center items-center h-64">Failed to load resume data</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Resume Management</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['header', 'education', 'workExperience', 'projects', 'technicalSkills'].map((section) => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={`px-4 py-2 rounded-lg ${
              activeSection === section
                ? 'bg-blue-600 text-white'
                : 'bg-gray-600 text-gray-300 hover:bg-gray-700'
            }`}
          >
            {section.charAt(0).toUpperCase() + section.slice(1).replace(/([A-Z])/g, ' $1')}
          </button>
        ))}
      </div>

      {/* Header Section */}
      {activeSection === 'header' && (
        <div className="bg-black-200 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Header Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                type="text"
                value={resumeData.header.name}
                onChange={(e) => handleInputChange('header', 'name', e.target.value)}
                className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-white mb-2">Title</label>
              <input
                type="text"
                value={resumeData.header.title}
                onChange={(e) => handleInputChange('header', 'title', e.target.value)}
                className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-white mb-2">PDF URL</label>
              <input
                type="url"
                value={resumeData.header.pdfUrl}
                onChange={(e) => handleInputChange('header', 'pdfUrl', e.target.value)}
                className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* Education Section */}
      {activeSection === 'education' && (
        <div className="bg-black-200 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">Education</h2>
            <button
              onClick={() => addItem('education')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Add Education
            </button>
          </div>
          
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="border border-gray-600 p-4 rounded mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Degree</label>
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                    className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Institution</label>
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                    className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Location</label>
                  <input
                    type="text"
                    value={edu.location}
                    onChange={(e) => handleInputChange('education', 'location', e.target.value, index)}
                    className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Year</label>
                  <input
                    type="text"
                    value={edu.year}
                    onChange={(e) => handleInputChange('education', 'year', e.target.value, index)}
                    className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
                  />
                </div>
              </div>
              <button
                onClick={() => removeItem('education', index)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Technical Skills Section */}
      {activeSection === 'technicalSkills' && (
        <div className="bg-black-200 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Technical Skills</h2>
          <p className="text-gray-400 mb-4">Enter skills separated by commas</p>
          
          <div className="space-y-4">
            {Object.entries(resumeData.technicalSkills).map(([category, skills]) => (
              <div key={category}>
                <label className="block text-white mb-2 capitalize">
                  {category.replace(/([A-Z])/g, ' $1')}
                </label>
                <textarea
                  value={Array.isArray(skills) ? skills.join(', ') : ''}
                  onChange={(e) => handleInputChange('technicalSkills', category, e.target.value)}
                  className="w-full p-3 rounded bg-black-300 text-white border border-gray-600"
                  rows={3}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Note */}
      <div className="mt-8 p-4 bg-blue-900 border border-blue-700 rounded-lg">
        <p className="text-blue-200 text-sm">
          💡 Changes will be reflected immediately on your resume page after saving. 
          No rebuild required!
        </p>
      </div>
    </div>
  );
};

export default ResumeAdmin;
