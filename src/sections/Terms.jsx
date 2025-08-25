import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LegalBackground from '../components/LegalBackground';

const Terms = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
            <h2 className="head-text mb-8">Terms & Conditions</h2>
            
            <div className="bg-black-200 rounded-lg p-8 space-y-6 text-white-600 backdrop-blur-sm bg-opacity-90">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h3>
            <p className="text-base leading-relaxed">
              By accessing and using this portfolio website, you accept and agree to be bound by the terms 
              and provision of this agreement.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">2. Use License</h3>
            <p className="text-base leading-relaxed">
              Permission is granted to temporarily view the materials (information or software) on Harry Rose's 
              portfolio website for personal, non-commercial transitory viewing only. This is the grant of a 
              license, not a transfer of title.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">3. Disclaimer</h3>
            <p className="text-base leading-relaxed">
              The materials on this website are provided on an 'as is' basis. Harry Rose makes no warranties, 
              expressed or implied, and hereby disclaims and negates all other warranties including, without 
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, 
              or non-infringement of intellectual property or other violation of rights.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">4. Limitations</h3>
            <p className="text-base leading-relaxed">
              In no event shall Harry Rose or his suppliers be liable for any damages (including, without limitation, 
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability 
              to use the materials on this website, even if Harry Rose or an authorized representative has been notified 
              orally or in writing of the possibility of such damage.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h3>
            <p className="text-base leading-relaxed">
              All content, including but not limited to text, graphics, logos, images, and software, is the property 
              of Harry Rose and is protected by international copyright laws. Unauthorized use of any materials on 
              this website may violate copyright, trademark, and other laws.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">6. Contact Information</h3>
            <p className="text-base leading-relaxed">
              If you have any questions about these Terms & Conditions, please contact me at{' '}
              <a href="mailto:harry@harryrose.dev" className="text-white hover:underline">
                harry@harryrose.dev
              </a>
            </p>
          </div>

          <div className="pt-4 border-t border-black-300">
            <p className="text-sm text-white-500">
              Last updated: {new Date().toLocaleDateString('en-GB', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                timeZone: 'Europe/London'
              })}
            </p>
          </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Terms;
