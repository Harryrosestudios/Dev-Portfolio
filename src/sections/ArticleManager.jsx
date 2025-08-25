import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { publications as staticPublications } from '../constants';

const ArticleManager = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/publications/auth');
      return;
    }
    
    fetchArticles();
  }, [navigate]);

  const fetchArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articles`);
      const data = await response.json();
      
      if (data.success && data.articles.length > 0) {
        // Merge dynamic articles with static ones
        const dynamicIds = data.articles.map(a => a.id);
        const filteredStatic = staticPublications.filter(a => !dynamicIds.includes(a.id));
        setArticles([...data.articles, ...filteredStatic]);
      } else {
        setArticles(staticPublications);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setArticles(staticPublications);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    setDeleting(articleId);
    const token = localStorage.getItem('authToken');

    try {
      const response = await fetch(`${API_URL}/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401) {
        localStorage.removeItem('authToken');
        navigate('/publications/auth');
        return;
      }

      if (response.ok) {
        setArticles(articles.filter(a => a.id !== articleId));
      }
    } catch (err) {
      console.error('Error deleting article:', err);
      alert('Failed to delete article');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (articleId) => {
    navigate(`/publications/editor/${articleId}`);
  };

  const handleNew = () => {
    navigate('/publications/editor');
  };

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
      <div className="relative">
        <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-5 mx-auto c-space">
              <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                Harry Rose
              </a>
              <button 
                onClick={() => navigate('/publications')} 
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>←</span> Back to Publications
              </button>
            </div>
          </div>
        </nav>
        
        <section className="c-space pt-32 pb-20">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-white">Article Manager</h1>
              <button
                onClick={handleNew}
                className="px-6 py-3 bg-white-500 text-black font-medium rounded-lg hover:bg-white-600 transition-all flex items-center gap-2"
              >
                <span className="text-xl">+</span>
                Add New Article
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="w-16 h-16 border-4 border-white-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-white-600 text-xl mb-6">No articles yet</p>
                <button
                  onClick={handleNew}
                  className="px-8 py-4 bg-white-500 text-black font-medium rounded-lg hover:bg-white-600 transition-all"
                >
                  Create Your First Article
                </button>
              </div>
            ) : (
              <div className="grid gap-6">
                {articles.map((article) => (
                  <div
                    key={article.id}
                    className="bg-black-300 rounded-lg p-6 border border-black-200 hover:border-white-500 transition-all"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {article.featured && (
                            <span className="text-yellow-500">⭐</span>
                          )}
                          <span className="px-3 py-1 bg-black-200 rounded-full text-white-500 text-sm">
                            {article.category || 'Uncategorized'}
                          </span>
                          <span className="text-white-500 text-sm">{article.date}</span>
                          <span className="text-white-500 text-sm">•</span>
                          <span className="text-white-500 text-sm">{article.readTime}</span>
                        </div>
                        <h2 className="text-xl font-semibold text-white mb-2">
                          {article.title}
                        </h2>
                        <p className="text-white-600 line-clamp-2">
                          {article.excerpt}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(article.id)}
                          className="px-4 py-2 bg-black-200 text-white rounded-lg hover:bg-black-100 transition-colors border border-white-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => navigate(`/publications/${article.slug}`)}
                          className="px-4 py-2 bg-black-200 text-white rounded-lg hover:bg-black-100 transition-colors border border-white-500"
                        >
                          View
                        </button>
                        {/* Only show delete for dynamic articles */}
                        {!staticPublications.find(a => a.id === article.id) && (
                          <button
                            onClick={() => handleDelete(article.id)}
                            disabled={deleting === article.id}
                            className={`px-4 py-2 rounded-lg transition-colors border ${
                              deleting === article.id
                                ? 'bg-gray-600 border-gray-600 cursor-not-allowed'
                                : 'bg-red-500/20 text-red-400 border-red-500 hover:bg-red-500/30'
                            }`}
                          >
                            {deleting === article.id ? '...' : 'Delete'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ArticleManager;
