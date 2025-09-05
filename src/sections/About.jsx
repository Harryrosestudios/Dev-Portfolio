import { useState, useEffect } from 'react';
import Globe from 'react-globe.gl';

import Button from '../components/Button.jsx';
import { getAboutData } from '../services/aboutService.js';

const About = () => {
  const [hasCopied, setHasCopied] = useState(false);
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        const data = await getAboutData();
        setAboutData(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch about data:', err);
        setError('Failed to load about data');
        
        // Fallback to static data
        setAboutData({
          intro: {
            name: "Harry Rose",
            greeting: "Hi, I'm Harry Rose",
            description: "With 12 years of experience, I have honed my skills in both frontend and backend dev, creating dynamic and responsive websites."
          },
          techStack: {
            title: "Tech Stack",
            description: "I specialize in a variety of languages, frameworks, and tools that allow me to build robust and scalable applications"
          },
          location: {
            title: "I'm very flexible with time zone communications & locations",
            description: "I'm based in London, United Kingdom and open to remote work worldwide.",
            coordinates: { lat: 51.5074, lng: -0.1278, text: "London, United Kingdom" }
          },
          passion: {
            title: "My Passion for Coding",
            description: "I love solving problems and building things through code. Programming isn't just my profession—it's my passion. I enjoy exploring new technologies, and enhancing my skills."
          },
          contact: {
            email: "harry@harryrose.dev",
            contactText: "Contact me"
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  const handleCopy = () => {
    if (aboutData?.contact?.email) {
      navigator.clipboard.writeText(aboutData.contact.email);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <section className="c-space my-20" id="about">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  if (!aboutData) {
    return (
      <section className="c-space my-20" id="about">
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">Failed to load about section</p>
        </div>
      </section>
    );
  }

  return (
    <section className="c-space my-20" id="about">
      {error && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded mb-4">
          <p className="text-sm">⚠️ Using cached data. Content might not reflect recent updates.</p>
        </div>
      )}
      
      <div className="grid xl:grid-cols-3 xl:grid-rows-6 md:grid-cols-2 grid-cols-1 gap-5 h-full">
        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img src="/assets/grid1.png" alt="grid-1" className="w-full sm:h-[276px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">{aboutData.intro.greeting}</p>
              <p className="grid-subtext">{aboutData.intro.description}</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-3">
          <div className="grid-container">
            <img src="/assets/grid2.png" alt="grid-2" className="w-full sm:h-[276px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">{aboutData.techStack.title}</p>
              <p className="grid-subtext">{aboutData.techStack.description}</p>
            </div>
          </div>
        </div>

        <div className="col-span-1 xl:row-span-4">
          <div className="grid-container">
            <div className="rounded-3xl w-full sm:h-[326px] h-fit flex justify-center items-center">
              <Globe
                height={326}
                width={326}
                backgroundColor="rgba(0, 0, 0, 0)"
                backgroundImageOpacity={0.5}
                showAtmosphere
                showGraticules
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                labelsData={[{
                  lat: aboutData.location.coordinates.lat,
                  lng: aboutData.location.coordinates.lng,
                  text: aboutData.location.coordinates.text,
                  color: 'white',
                  size: 15
                }]}
              />
            </div>
            <div>
              <p className="grid-headtext">{aboutData.location.title}</p>
              <p className="grid-subtext">{aboutData.location.description}</p>
              <a href="/#contact" className="w-fit">
                <Button name="Contact Me" isBeam containerClass="w-full mt-10" />
              </a>
            </div>
          </div>
        </div>

        <div className="xl:col-span-2 xl:row-span-3">
          <div className="grid-container">
            <img src="/assets/grid3.png" alt="grid-3" className="w-full sm:h-[266px] h-fit object-contain" />

            <div>
              <p className="grid-headtext">{aboutData.passion.title}</p>
              <p className="grid-subtext">{aboutData.passion.description}</p>
            </div>
          </div>
        </div>

        <div className="xl:col-span-1 xl:row-span-2">
          <div className="grid-container">
            <img
              src="/assets/grid4.png"
              alt="grid-4"
              className="w-full md:h-[126px] sm:h-[276px] h-fit object-cover sm:object-top"
            />

            <div className="space-y-2">
              <p className="grid-subtext text-center">{aboutData.contact.contactText}</p>
              <div className="copy-container" onClick={handleCopy}>
                <img src={hasCopied ? 'assets/tick.svg' : 'assets/copy.svg'} alt="copy" />
                <p className="lg:text-2xl md:text-xl font-medium text-gray_gradient text-white">
                  {aboutData.contact.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
