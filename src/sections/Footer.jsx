const Footer = () => {
  // Get current year in British time
  const getCurrentYear = () => {
    const date = new Date();
    return date.toLocaleDateString('en-GB', { year: 'numeric', timeZone: 'Europe/London' });
  };

  return (
    <footer className="c-space pt-7 pb-3 border-t border-black-300 flex justify-between items-center flex-wrap gap-5">
      <div className="text-white-500 flex gap-2">
        <a href="/terms" className="hover:text-white transition-colors">Terms & Conditions</a>
        <p>|</p>
        <a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a>
      </div>

      <div className="flex gap-3">
        <a href="https://github.com/harryrosestudios/" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src="/assets/github.svg" alt="github" className="w-1/2 h-1/2" />
        </a>
        <a href="https://resume.harryrosestudios.com" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src="/assets/twitter.svg" alt="resume" className="w-1/2 h-1/2" />
        </a>
        <a href="https://linkedin.com/in/harryborose" target="_blank" rel="noopener noreferrer" className="social-icon">
          <img src="/assets/instagram.svg" alt="linkedin" className="w-1/2 h-1/2" />
        </a>
      </div>

      <p className="text-white-500">© {getCurrentYear()} Harry Rose. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
