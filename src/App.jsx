import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Footer from './sections/Footer.jsx';
import Navbar from './sections/Navbar.jsx';
import Contact from './sections/Contact.jsx';
import Clients from './sections/Clients.jsx';
import Projects from './sections/Projects.jsx';
import WorkExperience from './sections/Experience.jsx';
import Terms from './sections/Terms.jsx';
import Privacy from './sections/Privacy.jsx';
import Publications from './sections/Publications.jsx';
import Article from './sections/Article.jsx';
import Resume from './sections/Resume.jsx';
import PublicationAuth from './sections/PublicationAuth.jsx';
import PublicationEditor from './sections/PublicationEditor.jsx';
import ArticleManager from './sections/ArticleManager.jsx';

const Portfolio = () => {
  return (
    <main className="max-w-7xl mx-auto relative">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Clients />
      <WorkExperience />
      <Contact />
      <Footer />
    </main>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/publications/auth" element={<PublicationAuth />} />
        <Route path="/publications/manage" element={<ArticleManager />} />
        <Route path="/publications/editor" element={<PublicationEditor />} />
        <Route path="/publications/editor/:id" element={<PublicationEditor />} />
        <Route path="/publications/:slug" element={<Article />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
};

export default App;
