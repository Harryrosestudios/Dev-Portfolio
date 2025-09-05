import { useState, useEffect } from 'react';
import { getClientReviews } from '../services/clientsService.js';

const Clients = () => {
  const [clientReviews, setClientReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClientReviews = async () => {
      try {
        setLoading(true);
        const reviews = await getClientReviews();
        setClientReviews(reviews);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch client reviews:', err);
        setError('Failed to load client reviews');
        
        // Fallback to static data
        setClientReviews([
          {
            id: 1,
            name: 'Emily Johnson',
            position: 'Marketing Director at GreenLeaf',
            img: 'assets/review1.webp',
            review: 'Working with Harry was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.',
          },
          {
            id: 2,
            name: 'Mark Rogers',
            position: 'Founder of TechGear Shop',
            img: 'assets/review2.webp',
            review: 'Harry\'s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He\'s a true professional! Fantastic work.',
          },
          {
            id: 3,
            name: 'John Dohsas',
            position: 'Project Manager at UrbanTech',
            img: 'assets/review3.webp',
            review: 'I can\'t say enough good things about Harry. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.',
          },
          {
            id: 4,
            name: 'Ether Smith',
            position: 'CEO of BrightStar Enterprises',
            img: 'assets/review4.webp',
            review: 'Harry was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend backend dev are top-notch.',
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientReviews();
  }, []);

  if (loading) {
    return (
      <section className="c-space my-20">
        <h3 className="head-text">Hear from My Clients</h3>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="c-space my-20">
      <h3 className="head-text">Hear from My Clients</h3>

      {error && (
        <div className="bg-yellow-900 border border-yellow-700 text-yellow-200 px-4 py-3 rounded mb-4">
          <p className="text-sm">⚠️ Using cached data. Reviews might not reflect recent updates.</p>
        </div>
      )}

      <div className="client-container">
        {clientReviews.map((item) => (
          <div key={`review-${item.id}`} className="client-review">
            <div>
              <p className="text-white-800 font-light">{item.review}</p>

              <div className="client-content">
                <div className="flex gap-3">
                  <img src={item.img} alt="reviewer" className="w-12 h-12 rounded-full" />
                  <div className="flex flex-col">
                    <p className="font-semibold text-white-800">{item.name}</p>
                    <p className="text-white-500 md:text-base text-sm font-light">{item.position}</p>
                  </div>
                </div>

                <div className="flex self-end items-center gap-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <img key={index} src="/assets/star.webp" alt="star" className="w-5 h-5" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Clients;
