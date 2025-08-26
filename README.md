<div align="center">
  <h1>🚀 Harry Rose - 3D Developer Portfolio</h1>
  <p>A modern, interactive 3D portfolio website showcasing development skills and experience</p>

  <div>
    <img src="https://img.shields.io/badge/-React_JS-black?style=for-the-badge&logoColor=white&logo=react&color=61DAFB" alt="react.js" />
    <img src="https://img.shields.io/badge/-Three_JS-black?style=for-the-badge&logoColor=white&logo=threedotjs&color=000000" alt="three.js" />
    <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
    <img src="https://img.shields.io/badge/-Vite-black?style=for-the-badge&logoColor=white&logo=vite&color=646CFF" alt="vite" />
    <img src="https://img.shields.io/badge/-GSAP-black?style=for-the-badge&logoColor=white&logo=greensock&color=88CE02" alt="gsap" />
  </div>
</div>

## 📋 Table of Contents

1. ✨ [Features](#features)
2. 🛠️ [Tech Stack](#tech-stack)
3. 📁 [Project Structure](#project-structure)
4. 🚀 [Getting Started](#getting-started)
5. 📧 [Email Configuration](#email-configuration)
6. 🎨 [Customization](#customization)
7. 🚀 [Deployment](#deployment)
8. 📞 [Contact](#contact)

## ✨ Features

A modern, interactive 3D portfolio website built with React, Three.js, and cutting-edge web technologies to create an immersive user experience.

### Core Features
- **3D Interactive Environment**: Immersive 3D scene with animated objects and camera controls
- **Responsive Design**: Fully responsive across all devices and screen sizes
- **Smooth Animations**: GSAP-powered animations and transitions
- **Interactive Globe**: Real-time 3D globe showing location and availability
- **Dynamic Contact System**: EmailJS integration for direct contact functionality
- **Publication System**: Full-featured blog/publication management with rich text editor
- **Resume Integration**: Dedicated resume page with downloadable PDF
- **Client Reviews**: Interactive testimonials carousel

### Advanced Features
- **3D Models & Animations**: Custom 3D models with Leva controls for development
- **Real-time Email**: Contact form with real-time email delivery
- **Publication Management**: Admin panel for creating and managing blog posts
- **Rich Text Editor**: Quill-based editor with markdown support
- **Authentication System**: Secure admin authentication for publication management
- **SEO Optimized**: React Helmet integration for dynamic meta tags
- **Performance Optimized**: Lazy loading and optimized 3D assets

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks and functional components
- **Three.js 0.167.1** - Core 3D graphics library
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Useful helpers for React Three Fiber
- **React Router DOM** - Client-side routing with multiple pages
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional-grade animation library

### 3D & Animation
- **React Globe.gl** - Interactive 3D globe component
- **Leva** - GUI controls for 3D development
- **Maath** - Math utilities for 3D graphics

### Build & Development  
- **Vite** - Next-generation frontend build tool
- **ESLint** - Code linting and quality assurance
- **PostCSS & Autoprefixer** - CSS processing

### Backend & Services
- **Express.js** - Backend server for publications
- **EmailJS** - Email service integration
- **Nodemailer** - Server-side email handling
- **CORS** - Cross-origin resource sharing

### Content Management
- **React Quill** - Rich text editor
- **Markdown-it** - Markdown processing
- **React Markdown** - Markdown rendering

## 📁 Project Structure

```
threejs-portfolio/
├── public/
│   ├── assets/           # Static assets (images, icons, models)
│   └── textures/         # 3D textures and materials
├── src/
│   ├── components/       # Reusable React components
│   │   ├── 3D components # Three.js 3D objects
│   │   └── UI components # User interface elements
│   ├── sections/         # Main page sections
│   │   ├── Hero.jsx      # Landing section with 3D scene
│   │   ├── About.jsx     # About section with globe
│   │   ├── Projects.jsx  # Project showcase
│   │   ├── Contact.jsx   # Contact form
│   │   └── ...          # Other sections
│   ├── constants/        # Configuration and data
│   ├── hooks/           # Custom React hooks
│   └── utils/           # Utility functions
├── server/              # Express.js backend
└── server-controller/   # Server configuration
```

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Harryrosestudios/Dev-Portfolio.git
cd Dev-Portfolio
```

**Installation**

```bash
npm install
```

**Environment Setup**

Create a `.env` file in the root directory:

```env
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

**Start development server**

```bash
npm run dev
```

**Start backend server** (if using publication features)

```bash
cd server-controller
npm install
npm start
```

The application will be available at `http://localhost:5173`


📧 ## Email Configuration

The contact form uses EmailJS for email delivery. To set up:

1. Create an account at [EmailJS](https://emailjs.com)
2. Create an email service
3. Create an email template
4. Get your service ID, template ID, and public key
5. Add them to your `.env` file

## 🎨 Customization

### Personalizing Content

1. **Update personal information** in `src/constants/index.js`:
   - Navigation links
   - Project details
   - Work experience
   - Client reviews

2. **Replace assets** in `public/assets/`:
   - Profile images
   - Project screenshots
   - Company logos
   - Icons

3. **Modify 3D scene** in `src/sections/Hero.jsx`:
   - Adjust camera positions
   - Modify lighting
   - Change 3D model scaling

### Styling

The project uses Tailwind CSS with custom configurations in `tailwind.config.js`:
- Custom color palette
- Extended font families
- Custom background images

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` folder.

### Deployment Options

- **Vercel**: Automatic deployment with Git integration
- **Netlify**: Drag-and-drop deployment or Git integration
- **GitHub Pages**: Static hosting for the built files
- **Custom Server**: Deploy to any web server

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note**: 3D features require WebGL support.

## 📞 Contact

Harry Rose - [harry@harryrose.dev](mailto:harry@harryrose.dev)

Project Link: [https://github.com/Harryrosestudios/Dev-Portfolio](https://github.com/Harryrosestudios/Dev-Portfolio)

## 🙏 Acknowledgments

- Three.js community for excellent 3D web technologies
- React Three Fiber team for the amazing React integration
- Tailwind CSS for the utility-first CSS framework
- GSAP for professional animations
- All open source contributors who made this possible

---

Made with ❤️ by Harry Rose
