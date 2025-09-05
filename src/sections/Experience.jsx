import { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import Developer from '../components/Developer.jsx';
import CanvasLoader from '../components/Loading.jsx';
import { getWorkExperiences } from '../services/experienceService.js';

const WorkExperience = () => {
  const [animationName, setAnimationName] = useState('idle');
  const [workExperiences, setWorkExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWorkExperiences = async () => {
      try {
        setLoading(true);
        const experiences = await getWorkExperiences();
        setWorkExperiences(experiences);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch work experiences:', err);
        setError('Failed to load work experiences');
        
        // Fallback to static data
        setWorkExperiences([
          {
            id: 1,
            name: 'JPMorgan Chase & Co.',
            pos: 'Software Development Intern',
            duration: 'June 2025',
            title: 'Developed microservices using Java 17 and Spring Boot for financial transactions. Implemented Kafka consumers, integrated H2 database with JPA, and developed REST APIs for user balance queries.',
            icon: '/assets/jpmorgan.svg',
            animation: 'victory',
          },
          {
            id: 2,
            name: 'Library of Code',
            pos: 'Systems Administrator - Volunteer',
            duration: 'April 2025 - Present',
            title: 'Managing Google Workspace instance, maintaining Azure self-hosted services, and managing Docker instances. Responsible for Debian server user management and contributing to LOC Services development using GitLab.',
            icon: '/assets/cloud.svg',
            animation: 'clapping',
          },
          {
            id: 3,
            name: 'Library of Code',
            pos: 'Cloud Engineer II - Volunteer',
            duration: 'Oct 2024 - April 2025',
            title: 'Provided community support for Cloud Service offerings and code-related queries. Collaborated directly with partners and managers in developing engineering projects.',
            icon: '/assets/cloud.svg',
            animation: 'salute',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkExperiences();
  }, []);

  if (loading) {
    return (
      <section className="c-space my-20" id="work">
        <div className="w-full text-white-600">
          <p className="head-text">My Work Experience</p>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="c-space my-20" id="work">
      <div className="w-full text-white-600">
        <p className="head-text">My Work Experience</p>

        {error && (
          <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded mb-4">
            <p className="text-sm">⚠️ Using cached data. Work experience might not reflect recent updates.</p>
          </div>
        )}

        <div className="work-container">
          <div className="work-canvas">
            <Canvas>
              <ambientLight intensity={7} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <directionalLight position={[10, 10, 10]} intensity={1} />
              <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 2} />

              <Suspense fallback={<CanvasLoader />}>
                <Developer position-y={-3} scale={3} animationName={animationName} />
              </Suspense>
            </Canvas>
          </div>

          <div className="work-content">
            <div className="sm:py-10 py-5 sm:px-5 px-2.5">
              {workExperiences.map((item, index) => (
                <div
                  key={item.id || index}
                  onClick={() => setAnimationName(item.animation?.toLowerCase() || 'idle')}
                  onPointerOver={() => setAnimationName(item.animation?.toLowerCase() || 'idle')}
                  onPointerOut={() => setAnimationName('idle')}
                  className="work-content_container group">
                  <div className="flex flex-col h-full justify-start items-center py-2">
                    <div className="work-content_logo">
                      <img className="w-full h-full" src={item.icon} alt="" />
                    </div>

                    <div className="work-content_bar" />
                  </div>

                  <div className="sm:p-5 px-2.5 py-5">
                    <p className="font-bold text-white-800">{item.name}</p>
                    <p className="text-sm mb-5">
                      {item.pos} -- <span>{item.duration}</span>
                    </p>
                    <p className="group-hover:text-white transition-all ease-in-out duration-500">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkExperience;
