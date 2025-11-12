import { useEffect, useState } from 'react';
import BadgeBackground from '../components/BadgeBackground';
import StaticBadgeSection from '../components/StaticBadgeSection';
import { getResumeData } from '../services/resumeService.js';
import { getCertificates } from '../services/certificateService.js';

const Resume = () => {
  const [resumeData, setResumeData] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [showAllCertificates, setShowAllCertificates] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch both resume data and certificates
        const [resumeDataResult, certificatesResult] = await Promise.all([
          getResumeData(),
          getCertificates()
        ]);
        
        setResumeData(resumeDataResult);
        setCertificates(certificatesResult);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load data. Please try again later.');
        
        // Fallback to static data structure
        setResumeData({
          header: { name: "Harry Rose", title: "Software Developer", pdfUrl: "https://resume.harryrose.dev" },
          education: [],
          workExperience: [],
          projects: [],
          technicalSkills: { languages: [], frameworks: [], developerTools: [], libraries: [] }
        });
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Function to determine how many certificates fit in one line (based on screen size)
  const getCertificatesPerLine = () => {
    // Assuming roughly 220px per certificate image with margins
    // For different screen sizes
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width >= 1024) return 4; // lg screens
      if (width >= 768) return 3;  // md screens
      if (width >= 640) return 2;  // sm screens
      return 1; // xs screens
    }
    return 4; // default for SSR
  };

  const certificatesPerLine = getCertificatesPerLine();
  const shouldShowViewMore = certificates.length > certificatesPerLine;
  const displayedCertificates = shouldShowViewMore && !showAllCertificates 
    ? certificates.slice(0, certificatesPerLine) 
    : certificates;

  if (loading) {
    return (
      <div className="min-h-screen relative bg-black-100">
        <BadgeBackground />
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!resumeData) {
    return (
      <div className="min-h-screen relative bg-black-100">
        <BadgeBackground />
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <p className="text-red-500">Failed to load resume data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative bg-black-100">
      <BadgeBackground />
      
      <div className="relative z-10">
        <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-5 mx-auto c-space">
              <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                {resumeData.header.name}
              </a>
              <div className="flex items-center gap-4">
                <a 
                  href={resumeData.header.pdfUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>📄</span> View PDF
                </a>
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>←</span> Back to Portfolio
                </button>
              </div>
            </div>
          </div>
        </nav>
        
        {error && (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 mx-auto c-space mt-20">
            <p className="text-sm">⚠️ Using cached data. Some content might not reflect recent updates.</p>
          </div>
        )}
        
        <section className="c-space pt-32 pb-20">
          <div className="max-w-4xl mx-auto bg-black-200/30 backdrop-blur-sm rounded-lg p-6">
            <div className="max-w-3xl mx-auto">
              {/* Header */}
              <header className="mb-12 text-center">
                <h1 className="text-5xl font-bold text-white mb-4">{resumeData.header.name}</h1>
                <p className="text-xl text-white">{resumeData.header.title}</p>
              </header>

              {/* Education */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Education</h2>
                <div className="space-y-6">
                  {resumeData.education.map((edu) => (
                    <div key={edu.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{edu.degree}</h3>
                          <p className="text-white-600">{edu.institution} • {edu.location}</p>
                        </div>
                        <span className="text-white-500">{edu.year}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Work Experience */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Work Experience</h2>
                <div className="space-y-8">
                  {resumeData.workExperience.map((job) => (
                    <div key={job.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{job.position}</h3>
                          <p className="text-white-600">{job.company} • {job.location}</p>
                        </div>
                        <span className="text-white-500">{job.period}</span>
                      </div>
                      <ul className="list-disc list-inside text-white space-y-1 mt-3">
                        {job.responsibilities.map((responsibility, index) => (
                          <li key={index}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Projects</h2>
                <div className="space-y-8">
                  {resumeData.projects.map((project) => (
                    <div key={project.id}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-white">{project.name}</h3>
                          <p className="text-white-600">{project.technologies}</p>
                        </div>
                        <span className="text-white-500">{project.period}</span>
                      </div>
                      <ul className="list-disc list-inside text-white space-y-2 mt-3">
                        {project.description.map((desc, index) => (
                          <li key={index}>{desc}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Technical Skills */}
              <div className="mb-12">
                <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Technical Skills</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Languages</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.technicalSkills.languages.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Frameworks</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.technicalSkills.frameworks.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Developer Tools</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.technicalSkills.developerTools.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Libraries</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.technicalSkills.libraries.map((skill) => (
                        <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Certifications */}
              {certificates.length > 0 && (
                <div className="mb-12">
                  <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Certifications</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {displayedCertificates.map((cert) => (
                      <div key={cert.id} className="bg-black-300/50 rounded-lg p-4 hover:bg-black-300/70 transition-colors">
                        <div className="aspect-[4/3] mb-3 rounded overflow-hidden bg-white">
                          <img 
                            src={cert.imagePath} 
                            alt={cert.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm" style={{display: 'none'}}>
                            Certificate Image
                          </div>
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{cert.title}</h3>
                        <p className="text-white-600 text-xs mb-1">{cert.issuer}</p>
                        <p className="text-white-500 text-xs">{cert.date}</p>
                      </div>
                    ))}
                  </div>
                  
                  {shouldShowViewMore && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={() => setShowAllCertificates(!showAllCertificates)}
                        className="px-6 py-2 bg-black-300 hover:bg-black-200 text-white rounded-lg transition-colors"
                      >
                        {showAllCertificates ? 'Show Less' : `View More (${certificates.length - certificatesPerLine} more)`}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Static Badge Section - only shows at bottom on mobile/small screens */}
            <StaticBadgeSection />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resume;
