export const navLinks = [
  {
    id: 1,
    name: 'Home',
    href: '#home',
  },
  {
    id: 2,
    name: 'About',
    href: '#about',
  },
  {
    id: 3,
    name: 'Work',
    href: '#work',
  },
  {
    id: 4,
    name: 'Resume',
    href: '/resume',
  },
  {
    id: 5,
    name: 'Publications',
    href: '/publications',
  },
  {
    id: 6,
    name: 'Contact',
    href: '#contact',
  },
];

export const clientReviews = [
  {
    id: 1,
    name: 'Emily Johnson',
    position: 'Marketing Director at GreenLeaf',
    img: 'assets/review1.webp',
    review:
      'Working with Harry was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
  },
  {
    id: 2,
    name: 'Mark Rogers',
    position: 'Founder of TechGear Shop',
    img: 'assets/review2.webp',
    review:
      'Harry\'s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He\'s a true professional! Fantastic work.',
  },
  {
    id: 3,
    name: 'John Dohsas',
    position: 'Project Manager at UrbanTech ',
    img: 'assets/review3.webp',
    review:
      'I can\'t say enough good things about Harry. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
  },
  {
    id: 4,
    name: 'Ether Smith',
    position: 'CEO of BrightStar Enterprises',
    img: 'assets/review4.webp',
    review:
      'Harry was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
  },
];

export const myProjects = [
  {
    title: 'Lakitu - Mario Kart World MMR System',
    desc: 'Lakitu is a cutting-edge matchmaking rating system serving 50,000+ active users in the Mario Kart World Discord community. This open-source platform features an advanced machine learning anti-cheat system that ensures fair competitive play across the global player base.',
    subdesc:
      'Built with JavaScript for accessibility, PostgreSQL for robust data management, and Redis for high-performance caching, Lakitu exemplifies community-driven development with contributions from developers worldwide.',
    href: 'https://www.youtube.com/watch?v=zfAb95tJvZQ',
    texture: '/textures/project/project1.mp4',
    logo: '/assets/project-logo1.png',
    logoStyle: {
      backgroundColor: '#2A1816',
      border: '0.2px solid #36201D',
      boxShadow: '0px 0px 60px 0px #AA3C304D',
    },
    spotlight: '/assets/spotlight1.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'IBM Aviation Rerouter - AI Flight Optimisation',
    desc: 'A real-time global flight route optimisation platform that leverages multi-agent reinforcement learning to revolutionise aviation routing. This system integrates live aircraft data, weather patterns, and geopolitical constraints to save the aviation industry an estimated $40-50 million annually.',
    subdesc:
      'Architected with Go for 4x HTTP efficiency, Python MARL engine for intelligent routing, FastAPI backend, and React/Next.js frontend. Features IBM Granite LLM integration for converting news into flight constraints.',
    href: 'https://www.youtube.com/watch?v=y5vE8y_f_OM',
    texture: '/textures/project/project2.mp4',
    logo: '/assets/project-logo2.png',
    logoStyle: {
      backgroundColor: '#13202F',
      border: '0.2px solid #17293E',
      boxShadow: '0px 0px 60px 0px #2F6DB54D',
    },
    spotlight: '/assets/spotlight2.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'QualifAI - AI-Powered ATS & CV Optimiser',
    desc: 'An intelligent application tracking system that uses LLMs to analyse job listings against CVs, highlighting compatibility and helping applicants understand requirements. It empowers job seekers to personalise their applications and put their best foot forward for dream positions.',
    subdesc:
      'Built with React, TypeScript, and Tailwind CSS for a seamless UI, Zustand for state management, and deployed on Vercel with Puter.js integration. Fun fact: QualifAI may have helped personalise the CV you received from me!',
    href: 'https://www.youtube.com/watch?v=lEflo_sc82g',
    texture: '/textures/project/project3.mp4',
    logo: '/assets/project-logo3.png',
    logoStyle: {
      backgroundColor: '#60f5a1',
      background:
        'linear-gradient(0deg, #60F5A150, #60F5A150), linear-gradient(180deg, rgba(255, 255, 255, 0.9) 0%, rgba(208, 213, 221, 0.8) 100%)',
      border: '0.2px solid rgba(208, 213, 221, 1)',
      boxShadow: '0px 0px 60px 0px rgba(35, 131, 96, 0.3)',
    },
    spotlight: '/assets/spotlight3.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'YouTube Mini Player Restorer - Chrome Extension',
    desc: 'A lightweight Chrome extension that restores YouTube\'s removed mini player button, maintaining the beloved picture-in-picture functionality. With a 5-star rating on the Chrome Web Store and growing active users, it solves a real problem for the YouTube community.',
    subdesc:
      'Purposefully simple and performant at just 1.3MB, built with vanilla JavaScript, HTML, and CSS. Seamlessly integrates with YouTube\'s design language whilst preserving the original keyboard shortcut functionality.',
    href: 'https://www.youtube.com/watch?v=PuOVqP_cjkE',
    texture: '/textures/project/project4.mp4',
    logo: '/assets/project-logo4.png',
    logoStyle: {
      backgroundColor: '#0E1F38',
      border: '0.2px solid #0E2D58',
      boxShadow: '0px 0px 60px 0px #2F67B64D',
    },
    spotlight: '/assets/spotlight4.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
  {
    title: 'AI Book Genre Classifier - Smart Library Organiser',
    desc: 'A C++ application that combines barcode scanning with Meta\'s BART-large-mnli model to automatically classify and organise book collections. Created to solve the real-world problem of organising hundreds of books for a DIY built-in bookcase installation.',
    subdesc:
      'Integrates with NETUM barcode scanners, OpenLibrary API for metadata, and Hugging Face for AI classification. Features dynamic genre learning, author-based alphabetical sorting, and handles both ISBN-10 and ISBN-13 formats.',
    href: 'https://www.youtube.com/watch?v=Ahwoks_dawU',
    texture: '/textures/project/project5.mp4',
    logo: '/assets/project-logo5.png',
    logoStyle: {
      backgroundColor: '#1C1A43',
      border: '0.2px solid #252262',
      boxShadow: '0px 0px 60px 0px #635BFF4D',
    },
    spotlight: '/assets/spotlight5.png',
    tags: [
      {
        id: 1,
        name: 'React.js',
        path: '/assets/react.svg',
      },
      {
        id: 2,
        name: 'TailwindCSS',
        path: 'assets/tailwindcss.png',
      },
      {
        id: 3,
        name: 'TypeScript',
        path: '/assets/typescript.png',
      },
      {
        id: 4,
        name: 'Framer Motion',
        path: '/assets/framer.png',
      },
    ],
  },
];

export const calculateSizes = (isSmall, isMobile, isTablet) => {
  return {
    deskScale: isSmall ? 0.05 : isMobile ? 0.06 : 0.065,
    deskPosition: isMobile ? [0.5, -4.5, 0] : [0.25, -5.5, 0],
    cubePosition: isSmall ? [4, -5, 0] : isMobile ? [5, -5, 0] : isTablet ? [5, -5, 0] : [9, -5.5, 0],
    reactLogoPosition: isSmall ? [3, 4, 0] : isMobile ? [5, 4, 0] : isTablet ? [5, 4, 0] : [12, 3, 0],
    ringPosition: isSmall ? [-5, 7, 0] : isMobile ? [-10, 10, 0] : isTablet ? [-12, 10, 0] : [-24, 10, 0],
    targetPosition: isSmall ? [-5, -10, -10] : isMobile ? [-9, -10, -10] : isTablet ? [-11, -7, -10] : [-13, -13, -10],
  };
};

export const workExperiences = [
  {
    id: 1,
    name: 'JPMorgan Chase & Co.',
    pos: 'Software Development Intern',
    duration: 'June 2025',
    title: "Developed microservices using Java 17 and Spring Boot for financial transactions. Implemented Kafka consumers, integrated H2 database with JPA, and developed REST APIs for user balance queries.",
    icon: '/assets/jpmorgan.svg',
    animation: 'victory',
  },
  {
    id: 2,
    name: 'Library of Code',
    pos: 'Systems Administrator - Volunteer',
    duration: 'April 2025 - Present',
    title: "Managing Google Workspace instance, maintaining Azure self-hosted services, and managing Docker instances. Responsible for Debian server user management and contributing to LOC Services development using GitLab.",
    icon: '/assets/cloud.svg',
    animation: 'clapping',
  },
  {
    id: 3,
    name: 'Library of Code',
    pos: 'Cloud Engineer II - Volunteer',
    duration: 'Oct 2024 - April 2025',
    title: "Provided community support for Cloud Service offerings and code-related queries. Collaborated directly with partners and managers in developing engineering projects.",
    icon: '/assets/cloud.svg',
    animation: 'salute',
  },
];

export const publications = [];
