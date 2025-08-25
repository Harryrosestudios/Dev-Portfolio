import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { publications as staticPublications } from '../constants';
import '../styles/article.css';

const Article = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchArticle();
  }, [slug]);

  const fetchArticle = async () => {
    try {
      // Try to fetch from dynamic articles first
      const response = await fetch(`${API_URL}/api/articles`);
      const data = await response.json();
      
      let currentArticle = null;
      let allArticles = staticPublications;
      
      if (data.success && data.articles.length > 0) {
        // Merge dynamic with static
        const dynamicIds = data.articles.map(a => a.id);
        const filteredStatic = staticPublications.filter(a => !dynamicIds.includes(a.id));
        allArticles = [...data.articles, ...filteredStatic];
        
        currentArticle = data.articles.find(a => a.slug === slug);
      }
      
      if (!currentArticle) {
        currentArticle = staticPublications.find(a => a.slug === slug);
      }
      
      // Clean up the content by trimming whitespace
      if (currentArticle && currentArticle.content) {
        currentArticle = {
          ...currentArticle,
          content: currentArticle.content.trim()
        };
        console.log('Article content:', currentArticle.content); // Debug log
      }
      
      setArticle(currentArticle);
      
      // Set related articles
      if (currentArticle) {
        const related = allArticles
          .filter(a => a.id !== currentArticle.id && a.category === currentArticle.category)
          .slice(0, 2);
        
        if (related.length < 2) {
          const additional = allArticles
            .filter(a => a.id !== currentArticle.id && !related.includes(a))
            .slice(0, 2 - related.length);
          related.push(...additional);
        }
        
        setRelatedArticles(related);
      }
    } catch (err) {
      console.error('Error fetching article:', err);
      // Fall back to static articles
      const staticArticle = staticPublications.find(a => a.slug === slug);
      setArticle(staticArticle);
      
      if (staticArticle) {
        const related = staticPublications
          .filter(a => a.id !== staticArticle.id)
          .slice(0, 2);
        setRelatedArticles(related);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative bg-black-100 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-white-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen relative bg-black-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Article Not Found</h1>
          <p className="text-white-600 mb-8">The article you're looking for doesn't exist.</p>
          <button 
            onClick={() => navigate('/publications')}
            className="px-6 py-3 bg-white-500 text-black rounded-lg hover:bg-white-600 transition-colors"
          >
            Back to Publications
          </button>
        </div>
      </div>
    );
  }

  // Structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": article.title,
    "description": article.excerpt,
    "datePublished": article.date,
    "author": {
      "@type": "Person",
      "name": "Harry Rose",
      "url": "https://harryrosestudios.com"
    },
    "publisher": {
      "@type": "Person",
      "name": "Harry Rose"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://harryrosestudios.com/publications/${article.slug}`
    }
  };

  return (
    <>
      <Helmet>
        <title>{article.title} - Harry Rose</title>
        <meta name="description" content={article.excerpt} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://harryrosestudios.com/publications/${article.slug}`} />
        <meta property="article:author" content="Harry Rose" />
        <meta property="article:published_time" content={article.date} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.excerpt} />
        <link rel="canonical" href={`https://harryrosestudios.com/publications/${article.slug}`} />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>

      <div className="min-h-screen relative" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="relative">
          <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex justify-between items-center py-5 mx-auto c-space">
                <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                  Harry Rose
                </a>
                <Link 
                  to="/publications" 
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>←</span> Back to Publications
                </Link>
              </div>
            </div>
          </nav>
          
          <article className="px-4 md:px-8 lg:px-12 pt-32 pb-20">
            <div className="max-w-4xl mx-auto">
              {/* Article Header */}
              <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-sm px-3 py-1 bg-black-300 rounded-full text-white-500">
                    {article.category}
                  </span>
                  <span className="text-white-500">{article.date}</span>
                  <span className="text-white-500">•</span>
                  <span className="text-white-500">{article.readTime}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  {article.title}
                </h1>
                <p className="text-xl text-white-600 leading-relaxed">
                  {article.excerpt}
                </p>
              </header>
              
              {/* Article Content */}
              <div 
                className="article-content mt-8"
                dangerouslySetInnerHTML={{ __html: article.content || '' }}
              />
              <style jsx>{`
                .article-content {
                  color: #e5e5e5;
                }
                .article-content h1 {
                  font-size: 2rem;
                  font-weight: bold;
                  color: #ffffff;
                  margin-top: 2rem;
                  margin-bottom: 1rem;
                }
                .article-content h2 {
                  font-size: 1.75rem;
                  font-weight: bold;
                  color: #ffffff;
                  margin-top: 1.5rem;
                  margin-bottom: 0.75rem;
                }
                .article-content h3 {
                  font-size: 1.5rem;
                  font-weight: bold;
                  color: #ffffff;
                  margin-top: 1rem;
                  margin-bottom: 0.5rem;
                }
                .article-content h4 {
                  font-size: 1.25rem;
                  font-weight: bold;
                  color: #ffffff;
                  margin-top: 0.75rem;
                  margin-bottom: 0.5rem;
                }
                .article-content p {
                  color: #d1d5db;
                  margin-bottom: 1rem;
                  line-height: 1.75;
                  font-size: 1.125rem;
                }
                .article-content strong, .article-content b {
                  color: #ffffff;
                  font-weight: bold;
                }
                .article-content em, .article-content i {
                  color: #d1d5db;
                  font-style: italic;
                }
                .article-content ul, .article-content ol {
                  color: #d1d5db;
                  margin-bottom: 1rem;
                  padding-left: 1.5rem;
                }
                .article-content li {
                  color: #d1d5db;
                  margin-bottom: 0.5rem;
                }
                .article-content a {
                  color: #60a5fa;
                  text-decoration: underline;
                }
                .article-content a:hover {
                  color: #93bbfc;
                }
                .article-content blockquote {
                  border-left: 4px solid #4b5563;
                  padding-left: 1rem;
                  color: #9ca3af;
                  font-style: italic;
                  margin: 1.5rem 0;
                }
                .article-content pre {
                  background: #1f2937;
                  padding: 1rem;
                  border-radius: 0.5rem;
                  overflow-x: auto;
                  margin: 1.5rem 0;
                  color: #e5e7eb;
                }
                .article-content code {
                  background: #1f2937;
                  padding: 0.25rem 0.5rem;
                  border-radius: 0.25rem;
                  color: #e5e7eb;
                  font-family: monospace;
                  font-size: 0.875rem;
                }
                .article-content pre code {
                  background: transparent;
                  padding: 0;
                  color: #e5e7eb;
                }
                .article-content img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 0.5rem;
                  margin: 1.5rem 0;
                }
                .article-content hr {
                  border-top: 1px solid #4b5563;
                  margin: 2rem 0;
                }
                .article-content table {
                  color: #d1d5db;
                  width: 100%;
                  margin: 1.5rem 0;
                }
                .article-content th {
                  color: #ffffff;
                  font-weight: bold;
                  padding: 0.5rem;
                  border-bottom: 1px solid #4b5563;
                }
                .article-content td {
                  color: #d1d5db;
                  padding: 0.5rem;
                  border-bottom: 1px solid #374151;
                }
                @media (max-width: 768px) {
                  .article-content h1 { font-size: 1.75rem; }
                  .article-content h2 { font-size: 1.5rem; }
                  .article-content h3 { font-size: 1.25rem; }
                  .article-content p { font-size: 1rem; }
                }
              `}</style>
              
              {/* Article Footer */}
              <footer className="mt-12 pt-8 border-t border-black-300">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <p className="text-white-600 mb-2">Written by</p>
                    <p className="text-white font-semibold">Harry Rose</p>
                  </div>
                  <Link 
                    to="/publications"
                    className="px-6 py-3 bg-white-500 text-black rounded-lg hover:bg-white-600 transition-colors"
                  >
                    View More Articles
                  </Link>
                </div>
              </footer>
              
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-16">
                  <h2 className="text-2xl font-semibold text-white mb-6">More Articles</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {relatedArticles.map((relatedArticle) => (
                      <Link
                        key={relatedArticle.id}
                        to={`/publications/${relatedArticle.slug}`}
                        className="group block"
                      >
                        <article className="bg-black-200 rounded-lg p-6 border border-black-300 hover:border-white-500 transition-all duration-300">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-sm text-white-500">{relatedArticle.date}</span>
                            <span className="text-white-500">•</span>
                            <span className="text-sm text-white-500">{relatedArticle.readTime}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white-600 transition-colors">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-white-600 text-sm">
                            {relatedArticle.excerpt}
                          </p>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>
      </div>
    </>
  );
};

export default Article;
