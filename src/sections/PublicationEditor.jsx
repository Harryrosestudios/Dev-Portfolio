import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const PublicationEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [article, setArticle] = useState({
    title: '',
    excerpt: '',
    category: '',
    featured: false,
    content: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'],
      ['clean']
    ],
    clipboard: {
      matchVisual: false
    }
  }), []);

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'blockquote', 'code-block',
    'list', 'bullet', 'indent',
    'align',
    'link', 'image', 'video'
  ];

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/publications/auth');
      return;
    }

    // Load article if editing
    if (id) {
      loadArticle(id);
    }
  }, [id, navigate]);

  const loadArticle = async (articleId) => {
    try {
      // First try to load from API
      const response = await fetch(`${API_URL}/api/articles`);
      const data = await response.json();
      
      if (data.success && data.articles) {
        const foundArticle = data.articles.find(a => a.id === parseInt(articleId));
        if (foundArticle) {
          console.log('Loading article from API:', foundArticle);
          setArticle({
            title: foundArticle.title || '',
            excerpt: foundArticle.excerpt || '',
            category: foundArticle.category || '',
            featured: foundArticle.featured || false,
            content: foundArticle.content || ''
          });
          return;
        }
      }
      
      // Fall back to static publications
      const { publications } = await import('../constants');
      const staticArticle = publications.find(a => a.id === parseInt(articleId));
      if (staticArticle) {
        console.log('Loading article from constants:', staticArticle);
        // Convert markdown to HTML if needed (for old articles)
        let content = staticArticle.content || '';
        // Clean up the content if it has markdown formatting
        content = content.trim();
        
        setArticle({
          title: staticArticle.title || '',
          excerpt: staticArticle.excerpt || '',
          category: staticArticle.category || '',
          featured: staticArticle.featured || false,
          content: content
        });
      } else {
        setError('Article not found');
      }
    } catch (err) {
      console.error('Error loading article:', err);
      setError('Failed to load article');
    }
  };

  const calculateReadTime = (html) => {
    const text = html.replace(/<[^>]*>/g, ''); // Strip HTML tags
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleSave = async () => {
    if (!article.title || !article.content) {
      setError('Title and content are required');
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('authToken');

    try {
      const articleData = {
        ...article,
        readTime: calculateReadTime(article.content),
        id: id ? parseInt(id) : undefined
      };

      const response = await fetch(`${API_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleData)
      });

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/publications/auth');
        return;
      }

      if (data.success) {
        setSuccess('Article saved successfully!');
        setTimeout(() => {
          navigate('/publications/manage');
        }, 1500);
      } else {
        setError(data.message || 'Failed to save article');
      }
    } catch (err) {
      console.error('Error saving article:', err);
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleContentChange = (content) => {
    setArticle({ ...article, content });
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <style jsx global>{`
        .quill {
          background: rgba(20, 20, 20, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          color: #e5e5e5;
        }
        .ql-toolbar {
          background: rgba(30, 30, 30, 0.9);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 8px 8px 0 0;
        }
        .ql-toolbar .ql-stroke {
          fill: none;
          stroke: #999;
        }
        .ql-toolbar .ql-fill {
          fill: #999;
          stroke: none;
        }
        .ql-toolbar .ql-stroke.ql-fill {
          fill: #999;
        }
        .ql-toolbar button:hover .ql-stroke,
        .ql-toolbar button.ql-active .ql-stroke {
          stroke: #fff;
        }
        .ql-toolbar button:hover .ql-fill,
        .ql-toolbar button.ql-active .ql-fill {
          fill: #fff;
        }
        .ql-toolbar .ql-picker {
          color: #999;
        }
        .ql-toolbar .ql-picker-label:hover,
        .ql-toolbar .ql-picker-label.ql-active {
          color: #fff;
        }
        .ql-toolbar .ql-picker-options {
          background: #1a1a1a;
          border: 1px solid #333;
        }
        .ql-toolbar .ql-picker-item:hover {
          color: #fff;
          background: #333;
        }
        .ql-container {
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-top: none !important;
          border-radius: 0 0 8px 8px;
          font-size: 16px;
        }
        .ql-editor {
          min-height: 400px;
          color: #e5e5e5;
        }
        .ql-editor.ql-blank::before {
          color: #666;
          font-style: normal;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3,
        .ql-editor h4, .ql-editor h5, .ql-editor h6 {
          color: #fff;
        }
        .ql-editor blockquote {
          border-left: 4px solid #666;
          padding-left: 16px;
          color: #999;
        }
        .ql-editor pre {
          background: #1a1a1a;
          color: #e5e5e5;
          border-radius: 4px;
        }
        .ql-editor a {
          color: #4a9eff;
        }
      `}</style>

      <div className="relative">
        <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-5 mx-auto c-space">
              <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                Harry Rose
              </a>
              <button 
                onClick={() => navigate('/publications/manage')} 
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>←</span> Back to Manager
              </button>
            </div>
          </div>
        </nav>
        
        <section className="c-space pt-32 pb-20">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-8">
              {id ? 'Edit Article' : 'New Article'}
            </h1>

            {error && (
              <div className="mb-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="mb-4 p-4 bg-green-500/20 border border-green-500 rounded-lg">
                <p className="text-green-400">{success}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-white mb-2">Title *</label>
                <input
                  type="text"
                  value={article.title}
                  onChange={(e) => setArticle({...article, title: e.target.value})}
                  className="w-full px-4 py-3 bg-black-300 text-white rounded-lg border border-white-500 focus:outline-none focus:border-white-600"
                  placeholder="Article title..."
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-white mb-2">Excerpt</label>
                <textarea
                  value={article.excerpt}
                  onChange={(e) => setArticle({...article, excerpt: e.target.value})}
                  className="w-full px-4 py-3 bg-black-300 text-white rounded-lg border border-white-500 focus:outline-none focus:border-white-600"
                  placeholder="Brief description..."
                  rows="3"
                />
              </div>

              {/* Category and Featured */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Category</label>
                  <input
                    type="text"
                    value={article.category}
                    onChange={(e) => setArticle({...article, category: e.target.value})}
                    className="w-full px-4 py-3 bg-black-300 text-white rounded-lg border border-white-500 focus:outline-none focus:border-white-600"
                    placeholder="Technology, Design, etc."
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Featured</label>
                  <button
                    onClick={() => setArticle({...article, featured: !article.featured})}
                    className={`w-full py-3 rounded-lg border transition-colors ${
                      article.featured 
                        ? 'bg-white-500 text-black border-white-500' 
                        : 'bg-black-300 text-white border-white-500 hover:bg-black-200'
                    }`}
                  >
                    {article.featured ? '⭐ Featured' : 'Not Featured'}
                  </button>
                </div>
              </div>

              {/* Rich Text Editor */}
              <div>
                <label className="block text-white mb-2">Content *</label>
                <div className="bg-black-300 rounded-lg">
                  <ReactQuill
                    theme="snow"
                    value={article.content}
                    onChange={handleContentChange}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your article content here..."
                  />
                </div>
                <p className="text-white-500 text-sm mt-2">
                  Use the toolbar above to format your text. You can add headings, bold/italic text, lists, links, images, and more.
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <button
                onClick={() => navigate('/publications/manage')}
                className="px-6 py-3 bg-black-300 text-white rounded-lg hover:bg-black-200 transition-colors border border-white-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-8 py-3 rounded-lg font-medium transition-all ${
                  saving 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-white-500 hover:bg-white-600 text-black'
                }`}
              >
                {saving ? 'Publishing...' : 'Publish Article'}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PublicationEditor;
