import { useState, useEffect } from 'react';

const StaticBadgeSection = () => {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Only show on screens narrower than 1200px
  if (windowSize.width >= 1200) {
    return null;
  }

  const badges = [
    { 
      id: 1, 
      name: 'AWS Cloud Computing 101', 
      image: 'textures/aws-educate-CC101.png',
      verifyUrl: 'https://www.credly.com/badges/73e20c2b-8fc6-4ad7-883a-8e90661d629a'
    },
    { 
      id: 2, 
      name: 'AWS Cloud Computing 101', 
      image: 'textures/aws-educate-CC101.png',
      verifyUrl: 'https://www.credly.com/badges/73e20c2b-8fc6-4ad7-883a-8e90661d629a'
    },
    { 
      id: 3, 
      name: 'AWS Cloud Computing 101', 
      image: 'textures/aws-educate-CC101.png',
      verifyUrl: 'https://www.credly.com/badges/73e20c2b-8fc6-4ad7-883a-8e90661d629a'
    },
  ];

  const handleBadgeClick = (verifyUrl) => {
    window.open(verifyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold text-white mb-6 pb-2 border-b border-white-500">Badges</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {badges.map((badge) => (
          <div
            key={badge.id}
            className="bg-black-200 p-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={() => handleBadgeClick(badge.verifyUrl)}
          >
            <div className="w-24 h-28 mx-auto mb-3 bg-white rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
              <img
                src={badge.image}
                alt={badge.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to a colored rectangle if image fails to load
                  e.target.style.display = 'none';
                  e.target.parentElement.style.backgroundColor = '#FF9900';
                  e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-white text-xs font-bold">AWS</div>';
                }}
              />
            </div>
            <p className="text-white text-sm text-center font-medium group-hover:text-blue-300 transition-colors duration-300">
              {badge.name}
            </p>
            <p className="text-white-500 text-xs text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Click to verify
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StaticBadgeSection;
