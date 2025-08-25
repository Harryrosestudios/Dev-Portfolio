import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publications as staticPublications } from '../constants';

const Publications = () => {
  const [publications, setPublications] = useState(staticPublications);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPublications();
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch(`${API_URL}/api/articles`);
      const data = await response.json();
      
      if (data.success && data.articles.length > 0) {
        // Merge dynamic articles with static ones, preferring dynamic
        const dynamicIds = data.articles.map(a => a.id);
        const filteredStatic = staticPublications.filter(a => !dynamicIds.includes(a.id));
        setPublications([...data.articles, ...filteredStatic]);
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      // Fall back to static publications
    } finally {
      setLoading(false);
    }
  };

  const featuredArticles = publications.filter(article => article.featured);
  const regularArticles = publications.filter(article => !article.featured);

  return (
    <div className="min-h-screen relative bg-black-100">
      <div className="relative">
        <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-5 mx-auto c-space">
              <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                Harry Rose
              </a>
              <button 
                onClick={() => window.location.href = '/'} 
                className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <span>←</span> Back to Portfolio
              </button>
            </div>
          </div>
        </nav>
        
        <section className="c-space pt-32 pb-20">
          <div className="max-w-6xl mx-auto">
            <h1 className="head-text mb-4">Publications</h1>
            <p className="text-lg text-white mb-12">
              Thoughts and insights on software architecture, cloud computing, and emerging technologies
            </p>
            
            {/* Featured Articles */}
            {featuredArticles.length > 0 && (
              <div className="mb-16">
                <h2 className="text-2xl font-semibold text-white mb-8">Featured Articles</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {featuredArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/publications/${article.slug}`}
                      className="group block"
                    >
                      <article className="bg-black-200 rounded-lg p-6 border border-black-300 hover:border-white-500 transition-all duration-300 h-full">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="text-sm text-white-500">{article.date}</span>
                          <span className="text-white-500">•</span>
                          <span className="text-sm text-white-500">{article.readTime}</span>
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white-600 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-white-600 mb-4">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm px-3 py-1 bg-black-300 rounded-full text-white-500">
                            {article.category}
                          </span>
                          <span className="text-white-500 group-hover:text-white transition-colors">
                            Read more →
                          </span>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Regular Articles */}
            <div>
              <h2 className="text-2xl font-semibold text-white mb-8">All Articles</h2>
              <div className="space-y-6">
                {regularArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/publications/${article.slug}`}
                    className="group block"
                  >
                    <article className="bg-black-200 rounded-lg p-6 border border-black-300 hover:border-white-500 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm text-white-500">{article.date}</span>
                            <span className="text-white-500">•</span>
                            <span className="text-sm text-white-500">{article.readTime}</span>
                          </div>
                          <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-white-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-white-600 mb-4">
                            {article.excerpt}
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm px-3 py-1 bg-black-300 rounded-full text-white-500">
                            {article.category}
                          </span>
                          <span className="text-white-500 group-hover:text-white transition-colors">
                            Read →
                          </span>
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            </div>

            {/* Add to Publications Button */}
            <div className="mt-16 text-center">
              <button
                onClick={() => navigate('/publications/auth')}
                className="relative px-8 py-2 bg-black-300 text-white font-medium rounded-lg hover:bg-black-200 transition-all transform hover:scale-105 border border-white-500"
                style={{
                  boxShadow: `0 ${Math.sin(scrollY * 0.005) * 8}px 25px rgba(255, 182, 193, 0.15)`,
                  transition: 'box-shadow 0.3s ease',
                }}
              >
                ✍️ Add to Publications
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Publications;
