import React, { useEffect, useState } from 'react'
import { Link, Element } from 'react-scroll';
import homeBackground from '../assets/home-background.png'
import { ImageSlider } from '@/components'; 

const Home = () => {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const revealClass = (id) => 
    `transition-all duration-1000 transform ${
      visibleSections[id] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
    }`;

  return (
    <>
      {/* Navigation - Floating Indicator */}
      <nav className="fixed right-10 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <ul className="space-y-4">
          {['hero', 'section1', 'section2', 'section3'].map((sec) => (
            <li key={sec}>
              <Link to={sec} smooth={true} duration={500} spy={true} activeClass="!bg-primary-accent"
                className="block w-3 h-3 rounded-full bg-gray-300 cursor-pointer hover:scale-125 transition-all"
              />
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section - Matching Tournaments Header Layout */}
      <Element name="hero" className="col-start-2 col-span-10 min-h-[80vh] flex flex-col items-center justify-center text-center gap-6">
        <div className='text-primary-accent text-8xl lg:text-9xl font-outfit font-extrabold leading-none'>
          GOLF CLUB<br/><span className="text-secondary-accent">MANAGER</span>
        </div>
        <p className="text-xl text-secondary-accent font-roboto max-w-2xl">
          The official platform for HCMUT golfers to manage tournaments, 
          connect with alumni, and preserve club traditions.
        </p>
        <Link to="section1" smooth={true} className="mt-4 bg-primary-accent text-white px-10 py-4 rounded-full font-bold hover:opacity-90 transition-all cursor-pointer shadow-lg">
          Explore Features
        </Link>
      </Element>

      {/* Section 1: Features - Using your standard grid span */}
      <Element name="section1" className="col-start-2 col-span-10 py-20">
        <div id="section1" data-section className={revealClass('section1')}>
          <h2 className="text-primary-accent text-5xl font-outfit font-bold mb-12 text-center">
            Comprehensive Club Support
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Tournament Hub", desc: "Real-time updates, rosters, and request management for all club events." },
              { title: "Document Center", desc: "Access official bylaws, membership rules, and historical archives." },
              { title: "Community", desc: "Direct connectivity between current students and professional alumni." }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-bold text-primary-accent mb-4">{f.title}</h3>
                <p className="text-secondary-accent leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Element>

      {/* Section 2: History - Full width span with focused text */}
      <Element name="section2" className="col-start-2 col-span-10 py-20">
        <div id="section2" data-section className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${revealClass('section2')}`}>
          <div>
             <h2 className="text-primary-accent text-5xl font-outfit font-bold mb-6">Our Legacy</h2>
             <div className="space-y-4 text-secondary-accent font-roboto text-lg leading-relaxed">
                <p>Founded in 2018 by Professor ABC, our club represents the intersection of technology and tradition.</p>
                <p>We believe that digital innovation shouldn't replace golf's values—it should protect them. Our platform ensures that tournament integrity and member connections remain at the forefront of the sport.</p>
             </div>
          </div>
          <div className="rounded-[40px] overflow-hidden shadow-2xl">
            <img src={homeBackground} alt="Legacy" className="w-full h-full object-cover" />
          </div>
        </div>
      </Element>

      {/* Section 3: Achievements - Centered slider */}
      <Element name="section3" className="col-start-2 col-span-10 py-20 mb-20">
        <div id="section3" data-section className={`text-center ${revealClass('section3')}`}>
          <h2 className="text-primary-accent text-5xl font-outfit font-bold mb-10">Member Achievements</h2>
          <div className="max-w-5xl mx-auto">
            <ImageSlider />
          </div>
          <p className="mt-10 text-secondary-accent font-medium italic">
            Celebrating the growth and excellence of HCMUT golfers.
          </p>
        </div>
      </Element>
    </>
  )
}

export default Home;