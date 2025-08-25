import { useEffect } from 'react';

const Resume = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen relative bg-black-100">
      <div className="relative">
        <nav className="fixed top-0 left-0 right-0 z-[150] bg-black/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center py-5 mx-auto c-space">
              <a href="/" className="text-neutral-400 font-bold text-xl hover:text-white transition-colors">
                Harry Rose
              </a>
              <div className="flex items-center gap-4">
                <a 
                  href="https://resume.harryrosestudios.com" 
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
        
        <section className="c-space pt-32 pb-20">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-12 text-center">
              <h1 className="text-5xl font-bold text-white mb-4">Harry Rose</h1>
              <p className="text-xl text-white">Software Developer</p>
            </header>

            {/* Education */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Education</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">CS50 - Intro. To Computer Science</h3>
                      <p className="text-white-600">Harvard University • Cambridge, Massachusetts, Online</p>
                    </div>
                    <span className="text-white-500">2025</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Columbia+ - Machine Learning 1</h3>
                      <p className="text-white-600">Columbia University • New York City, Online</p>
                    </div>
                    <span className="text-white-500">2025</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Certification from Granite AI, and Machine Learning Keynotes</h3>
                      <p className="text-white-600">IBM • Online</p>
                    </div>
                    <span className="text-white-500">June 2025</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">.Net Software Development Bootcamp</h3>
                      <p className="text-white-600">Althaus • Online</p>
                    </div>
                    <span className="text-white-500">2025</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Javascript & CPP Courses</h3>
                      <p className="text-white-600">Codédex • Online</p>
                    </div>
                    <span className="text-white-500">2024 - 2025</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Work Experience */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Work Experience</h2>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Software Development Intern</h3>
                      <p className="text-white-600">JPMorgan Chase & Co. • Remote</p>
                    </div>
                    <span className="text-white-500">June 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-white space-y-1 mt-3">
                    <li>Developed a microservice using Java 17 and Spring Boot to handle financial transactions.</li>
                    <li>Implemented Kafka consumers to asynchronously process transaction messages.</li>
                    <li>Integrated H2 in-memory database with JPA for transaction validation and persistence.</li>
                    <li>Developed REST API endpoints for querying user balances using Spring MVC.</li>
                    <li>Integrated external Incentive API using Spring's RestTemplate to enhance transaction processing.</li>
                    <li>Utilised Maven for dependency management and VS Code for development and debugging.</li>
                    <li>Performed unit and integration testing using JUnit and embedded Kafka test utilities.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Cloud Engineer II - Volunteer</h3>
                      <p className="text-white-600">Library of Code • Remote</p>
                    </div>
                    <span className="text-white-500">Oct 2024 - April 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-white space-y-1 mt-3">
                    <li>Help user-base with issues related to Cloud Service offerings.</li>
                    <li>Provide Community support for code-related Queries.</li>
                    <li>Directly collaborate with partners and managers in developing Engineering projects.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Systems Administrator - Volunteer</h3>
                      <p className="text-white-600">Library of Code • Remote</p>
                    </div>
                    <span className="text-white-500">April 2025 - Present</span>
                  </div>
                  <ul className="list-disc list-inside text-white space-y-1 mt-3">
                    <li>Manage and maintain Google Workspace instance.</li>
                    <li>Maintain self-hosted services via Azure.</li>
                    <li>Interface with user-facing Docker instances, ensuring proper containerisation, and data security.</li>
                    <li>Manage user accounts and access for a shared Debian Server.</li>
                    <li>Integrate workflow with Jira.</li>
                    <li>Contribute to the further development of LOC Services, utilising Gitlab for Version Control and multi-dev operations.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Projects */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Projects</h2>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Aviation Remapper</h3>
                      <p className="text-white-600">Go, Python, FastAPI, TypeScript, React, Next.js, Reinforcement Learning</p>
                    </div>
                    <span className="text-white-500">June 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-white space-y-2 mt-3">
                    <li>Designed and implemented a real-time global flight route optimization platform integrating Go-based API clients, a Python multi-agent reinforcement learning (MARL) engine, and a modern TypeScript/React/Next.js frontend.</li>
                    <li>Developed modular Go clients to aggregate live aircraft, weather, geopolitical, and sustainability data, exposing a unified REST API for downstream integration. Chose Go as it is 4x more efficient than Python for http requests, but doesn't require manual memory management which may have taken too much time to fix for the Hackathon.</li>
                    <li>Built a custom MARL model treating each aircraft as an agent, simulating global airspace using real latitude/longitude coordinates and dynamic no-fly zones; implemented reward shaping and a bespoke neural network for cost-efficient, cooperative routing.</li>
                    <li>Architected a two-stage route optimization engine: a cost-calculation module (fuel, fees, delay penalties, passenger retention) and a Dijkstra-based pathfinder over an airport graph.</li>
                    <li>Integrated IBM Granite LLM to convert live news into actionable flight constraints and generate executive summaries from model outputs.</li>
                    <li>Developed an interactive frontend dashboard with TypeScript, React, and Next.js for scenario analysis, real-time route visualization, and user-driven constraint input.</li>
                    <li>Enabled seamless data flow between Go, Python, and frontend layers, supporting scenario planning, executive reporting, and operational decision support for airlines and dispatchers.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">SMTP Email API, W/ secure front-end dashboard</h3>
                      <p className="text-white-600">Express, Node.js, Nodemailer, HTTPS</p>
                    </div>
                    <span className="text-white-500">June 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-white space-y-2 mt-3">
                    <li>Developed a script to send emails based on details provided by Post requests.</li>
                    <li>Implemented secure key storage and hashing to ensure secure endpoints.</li>
                    <li>Used Emotion with Stylized-Components for a dynamic dashboard with data on API usage, logs, and endpoint test buttons.</li>
                    <li>Pull authorized emails from .env whitelist to disallow external access to the dashboard. Authenticate true user via a 6 digit verification code sent to the given email address.</li>
                    <li>Hosting via PM2 to ensure 24/7 access for other automated processes to email users based on account creation, membership expiry, partner account pro access, etc.</li>
                  </ul>
                </div>

                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">Monte Carlo European Options Pricing Simulator</h3>
                      <p className="text-white-600">C++</p>
                    </div>
                    <span className="text-white-500">July 2025</span>
                  </div>
                  <ul className="list-disc list-inside text-white space-y-2 mt-3">
                    <li>Developed a high-performance Monte Carlo simulation tool for pricing European call and put options using the Black-Scholes model.</li>
                    <li>Utilized efficient random number generation (Mersenne Twister) and precomputed constants to optimize simulation speed for 100,000+ price paths.</li>
                    <li>Implemented modular, clean architecture with reusable payoff functions and clear separation of concerns.</li>
                    <li>Demonstrated quantitative finance skills by modeling geometric Brownian motion and risk-neutral valuation.</li>
                    <li>Designed for easy parameterization and future extensibility (e.g., Greeks, exotic options).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Technical Skills */}
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Technical Skills</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Java', 'Go', 'C/C++', 'C#', 'SQL (SQL Server)', 'Cobol', 'JavaScript', 'HTML/CSS'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Frameworks</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Spring Boot', 'Next.js', 'Node.js', 'Express.js', 'Discord.js', 'React', 'Electron'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Developer Tools</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Git', 'Docker', 'PM2', 'Azure', 'VS Code', 'Visual Studio', 'Nano'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Libraries</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Nodemailer', 'DiscordGo', 'Emotion/Styled-Components'].map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-black-300 rounded-full text-white text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Resume;
