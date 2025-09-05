import { useState, useEffect } from 'react';
import { getProjects, addProject, updateProject, deleteProject } from '../services/projectService.js';

const ProjectAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    subdesc: '',
    href: '',
    texture: '',
    logo: '',
    logoStyle: {},
    spotlight: '',
    tags: [],
    order: 1,
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const fetchedProjects = await getProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProject) {
        await updateProject(editingProject.id, {
          ...formData,
          updatedAt: new Date(),
        });
      } else {
        await addProject({
          ...formData,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
      setFormData({
        title: '',
        desc: '',
        subdesc: '',
        href: '',
        texture: '',
        logo: '',
        logoStyle: {},
        spotlight: '',
        tags: [],
        order: 1,
      });
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData(project);
  };

  const handleDelete = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        fetchProjects();
      } catch (error) {
        console.error('Failed to delete project:', error);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-white">Project Management</h1>
      
      {/* Project Form */}
      <form onSubmit={handleSubmit} className="mb-8 p-6 bg-black-200 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-white">
          {editingProject ? 'Edit Project' : 'Add New Project'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Project Title"
            className="p-3 rounded bg-black-300 text-white border border-gray-600"
            required
          />
          
          <input
            type="number"
            name="order"
            value={formData.order}
            onChange={handleInputChange}
            placeholder="Order"
            className="p-3 rounded bg-black-300 text-white border border-gray-600"
            required
          />
          
          <textarea
            name="desc"
            value={formData.desc}
            onChange={handleInputChange}
            placeholder="Description"
            className="p-3 rounded bg-black-300 text-white border border-gray-600 md:col-span-2"
            rows="3"
            required
          />
          
          <textarea
            name="subdesc"
            value={formData.subdesc}
            onChange={handleInputChange}
            placeholder="Sub Description"
            className="p-3 rounded bg-black-300 text-white border border-gray-600 md:col-span-2"
            rows="3"
            required
          />
          
          <input
            type="url"
            name="href"
            value={formData.href}
            onChange={handleInputChange}
            placeholder="Project URL"
            className="p-3 rounded bg-black-300 text-white border border-gray-600"
            required
          />
          
          <input
            type="text"
            name="texture"
            value={formData.texture}
            onChange={handleInputChange}
            placeholder="Texture Path"
            className="p-3 rounded bg-black-300 text-white border border-gray-600"
            required
          />
          
          <input
            type="text"
            name="logo"
            value={formData.logo}
            onChange={handleInputChange}
            placeholder="Logo Path"
            className="p-3 rounded bg-black-300 text-white border border-gray-600"
            required
          />
          
          <input
            type="text"
            name="spotlight"
            value={formData.spotlight}
            onChange={handleInputChange}
            placeholder="Spotlight Image Path"
            className="p-3 rounded bg-black-300 text-white border border-gray-600"
            required
          />
        </div>
        
        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingProject ? 'Update Project' : 'Add Project'}
          </button>
          
          {editingProject && (
            <button
              type="button"
              onClick={() => {
                setEditingProject(null);
                setFormData({
                  title: '',
                  desc: '',
                  subdesc: '',
                  href: '',
                  texture: '',
                  logo: '',
                  logoStyle: {},
                  spotlight: '',
                  tags: [],
                  order: 1,
                });
              }}
              className="px-6 py-3 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Projects List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold text-white">Existing Projects</h2>
        {projects.map((project) => (
          <div key={project.id} className="p-4 bg-black-200 rounded-lg border border-gray-600">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <p className="text-gray-300 text-sm mt-1">{project.desc}</p>
                <p className="text-gray-400 text-xs mt-2">Order: {project.order}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectAdmin;
