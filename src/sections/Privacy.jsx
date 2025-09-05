import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LegalBackground from '../components/LegalBackground';
import { getPrivacyPolicy } from '../services/legalService.js';

const Privacy = () => {
  const [privacyData, setPrivacyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchPrivacyData = async () => {
      try {
        setLoading(true);
        const data = await getPrivacyPolicy();
        setPrivacyData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch privacy data:', err);
        setError('Failed to load privacy data');
        
        // Fallback to basic static content
        setPrivacyData({
          title: "Privacy Policy",
          lastUpdated: "September 5, 2025",
          content: [
            {
              section: "Information We Collect",
              text: "We may collect information you provide directly to us, such as when you contact us through our website forms or email."
            },
            {
              section: "Contact Us",
              text: "If you have any questions about this Privacy Policy, please contact us at harry@harryrose.dev"
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPrivacyData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen relative bg-black-100">
        <LegalBackground />
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black-100">
      <LegalBackground />
      
      <div className="relative z-10">
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
          <div className="max-w-4xl mx-auto">
            <h2 className="head-text mb-2">{privacyData?.title || 'Privacy Policy'}</h2>
            <p className="text-white-600 mb-8">Last updated: {privacyData?.lastUpdated || 'Unknown'}</p>
            
            {error && (
              <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded mb-6">
                <p className="text-sm">⚠️ Using cached data. Content might not reflect recent updates.</p>
              </div>
            )}
            
            <div className="bg-black-200 rounded-lg p-8 space-y-6 text-white-600 backdrop-blur-sm bg-opacity-90">
              {privacyData?.content?.map((section, index) => (
                <div key={index}>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {index + 1}. {section.section}
                  </h3>
                  <p className="text-base leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom buttons */}
            <div className="mt-12 text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/terms" 
                  className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Terms of Service
                </Link>
                <a 
                  href="/" 
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Portfolio
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Privacy;
