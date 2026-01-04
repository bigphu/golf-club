import React, { useEffect, useState } from 'react'
import { Link, Element } from 'react-scroll';
import homeBackground from '../assets/home-background.png'
import { ImageSlider } from '@/components'; // Import component

const Home = () => {
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => ({
              ...prev,
              [entry.target.id]: true
            }));
          }
        });
      },
      { threshold: 0.2 }
    );

    const sections = document.querySelectorAll('[data-section]');
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-20 left-10 z-50 bg-white/80 backdrop-blur-sm p-4 rounded-lg">
        <ul className="space-y-2">
          <li>
            <Link 
              to="section1" 
              smooth={true} 
              duration={500}
              className="cursor-pointer hover:text-txt-accent transition-colors"
            >
            </Link>
          </li>
          <li>
            <Link 
              to="section2" 
              smooth={true} 
              duration={500}
              className="cursor-pointer hover:text-txt-accent transition-colors"
            >

            </Link>
          </li>
          <li>
            <Link 
              to="section3" 
              smooth={true} 
              duration={500}
              className="cursor-pointer hover:text-txt-accent transition-colors"
            >

            </Link>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <div className="grid grid-cols-12 min-h-screen items-center gap-8 px-8 relative">
        {/* Text Content - Left Side */}
        <div className='col-start-1 col-span-5 flex flex-col items-start justify-center gap-4 z-10'>
          <div className='text-txt-primary text-8xl font-outfit font-extrabold'>
            GOLF<br/>
            CLUB<br/>
            MANAGER
          </div>
        </div>

        {/* Image - Right Side */}
          <div className='col-start-30 col-span-30 flex flex-col items-start justify-center'>
              <img className='bg-cover w-full h-full' src={homeBackground} alt="Golf Club Home">
              </img>
          </div>
      </div>

      {/* Section 1 */}
      <Element name="section1">
        <div 
          id="section1"
          data-section
          className={`grid grid-cols-12 min-h-screen items-center gap-8 px-8 transition-all duration-1000 ${
            visibleSections.section1 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='col-start-2 col-span-10 lg:col-start-3 lg:col-span-40'>
            <h2 className='text-txt-primary text-4xl lg:text-5xl font-outfit font-bold mb-6'>
              This website provides you: 
            </h2>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              Manage tournaments, view official club documents, and connect with other members seamlessly. 
              Our platform provides everything you need to run a successful golf club.
            </p>
          </div>

        </div>
      </Element>

      {/* Section 2 */}
      <Element name="section2">
        <div 
          id="section2"
          data-section
          className={`grid grid-cols-12 min-h-screen items-center gap-8 px-8 transition-all duration-1000 ${
            visibleSections.section2 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='col-start-2 col-span-10 lg:col-start-3 lg:col-span-40'>
            <h2 className='text-txt-primary text-4xl lg:text-5xl font-outfit font-bold mb-6'>
              Our History
            </h2>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              In the spring of 2018, Professor ABC from the Faculty of Computer Science and Engineering stood at the intersection of two passions that had defined his life—the precision of technology and the timeless elegance of golf. As an avid golfer and pioneering computer scientist, he recognized an opportunity that few others could see: the chance to revolutionize golf club management through innovative technology. 
            </p>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              What began as casual weekend rounds with fellow faculty members soon evolved into something far more ambitious. Professor ABC envisioned a golf club that would break from tradition—not by abandoning it, but by enhancing it. He dreamed of a community where cutting-edge digital systems would seamlessly blend with the sport's centuries-old values of integrity, respect, and camaraderie.
            </p>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              With unwavering determination and support from the university community, Professor ABC established our golf club with a clear mission: to create a space where technology serves tradition, where data analytics meets the perfect swing, and where members can focus on what truly matters—the love of the game.
            </p>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              With unwavering determination and support from the university community, Professor ABC established our golf club with a clear mission: to create a space where technology serves tradition, where data analytics meets the perfect swing, and where members can focus on what truly matters—the love of the game.
            </p>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              From our first tournament managed entirely through a custom digital platform, to our innovative member connectivity system that fostered friendships beyond the fairways, we proved that embracing modern technology doesn't diminish golf's heritage—it elevates it.
            </p>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              Today, our club stands as a testament to Professor ABC's vision: a thriving community where every member benefits from the perfect marriage of tradition and innovation, where tournament management is effortless, club documents are always accessible, and connections between members flourish both on and off the course.
            </p>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              This is more than a golf club. This is the future of the sport, rooted in its finest traditions.
            </p>
            
          </div>
        </div>
      </Element>



      {/* Section 3*/}
      <Element name="section3">
        <div 
          id="section3"
          data-section
          className={`grid grid-cols-12 min-h-screen items-center gap-8 px-8 transition-all duration-1000 ${
            visibleSections.section3
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-10'
          }`}
        >
          <div className='col-start-2 col-span-10 lg:col-start-3 lg:col-span-40'>
            <h2 className='text-txt-primary text-4xl lg:text-5xl font-outfit font-bold mb-6'>
              Our achievement
            </h2>
          </div>
          <div className='col-start-2 col-span-10 lg:col-start-10 lg:col-span-40'>
            <ImageSlider />
          </div>
          <div className='col-start-2 col-span-10 lg:col-start-20 lg:col-span-40'>
            <p className='text-txt-accent font-roboto font-medium text-base lg:text-lg leading-relaxed'>
              These achievements proof for our growth and reunion of HCMUT students and alumni.
            </p>
          </div>
        </div>
      </Element>
    </div>
  )
}

export default Home