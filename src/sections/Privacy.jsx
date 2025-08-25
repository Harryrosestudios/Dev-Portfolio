import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LegalBackground from '../components/LegalBackground';

const Privacy = () => {
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
            <h2 className="head-text mb-8">Privacy Policy</h2>
            
            <div className="bg-black-200 rounded-lg p-8 space-y-6 text-white-600 backdrop-blur-sm bg-opacity-90">
          <div>
            <h3 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h3>
            <p className="text-base leading-relaxed mb-3">
              When you use the contact form on this website, we collect:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Your name</li>
              <li>Your email address</li>
              <li>Any message content you provide</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">2. How We Use Your Information</h3>
            <p className="text-base leading-relaxed">
              The information collected through the contact form is used solely for the purpose of responding 
              to your inquiries and communicating with you about potential projects or opportunities. We do not 
              sell, trade, or otherwise transfer your personal information to third parties.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">3. Data Security</h3>
            <p className="text-base leading-relaxed">
              We implement appropriate security measures to protect your personal information. Contact form 
              submissions are processed through EmailJS, which uses industry-standard encryption to protect 
              data in transit. However, no method of electronic transmission or storage is 100% secure, and 
              we cannot guarantee absolute security.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">4. Cookies</h3>
            <p className="text-base leading-relaxed">
              This website does not use cookies to collect personal information. The website may use localStorage 
              for improving user experience (such as remembering form state), but this data remains on your device 
              and is not transmitted to our servers.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">5. Third-Party Services</h3>
            <p className="text-base leading-relaxed">
              This website uses EmailJS for processing contact form submissions. By using the contact form, 
              you acknowledge that your information will be processed through their service. Please refer to 
              EmailJS's privacy policy for more information about their data handling practices.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">6. Your Rights</h3>
            <p className="text-base leading-relaxed">
              Under GDPR and UK data protection laws, you have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-1 mt-3">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
              <li>Request restriction of processing</li>
              <li>Data portability</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">7. Contact Information</h3>
            <p className="text-base leading-relaxed">
              If you have any questions about this Privacy Policy or wish to exercise your rights regarding 
              your personal data, please contact me at{' '}
              <a href="mailto:harry@harryrose.dev" className="text-white hover:underline">
                harry@harryrose.dev
              </a>
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-white mb-3">8. Changes to This Policy</h3>
            <p className="text-base leading-relaxed">
              We reserve the right to update this Privacy Policy at any time. Any changes will be posted on 
              this page with an updated revision date.
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

export default Privacy;
