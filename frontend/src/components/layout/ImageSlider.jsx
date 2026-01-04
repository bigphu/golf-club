import React, { useState } from 'react';
import first from '../../assets/giai-ky-thuat-ahm06575.jpg';
import sec from '../../assets/lmao.jpg';
import third from '../../assets/lmao2.jpg';

const ImageSlider = () => {
  const slides = [
    { imgPath: first, title: 'Annual Tournament 2024' },
    { imgPath: sec, title: 'Alumni Reunion' },
    { imgPath: third, title: 'Technology & Sports Gala' }
  ];

  const [currIdx, setCurrIdx] = useState(0);

  const move = (step) => {
    setCurrIdx((prev) => (prev + step + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full">
      {/* Slider Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[40px] shadow-2xl bg-black">
        {/* Background Image with Blur for cinematic feel */}
        <div 
          className="absolute inset-0 bg-cover bg-center scale-110 blur-xl opacity-30 transition-all duration-700"
          style={{ backgroundImage: `url(${slides[currIdx].imgPath})` }}
        />
        
        {/* Main Image */}
        <div 
          className="absolute inset-0 bg-contain bg-no-repeat bg-center transition-all duration-700 transform hover:scale-105"
          style={{ backgroundImage: `url(${slides[currIdx].imgPath})` }}
        />

        {/* Overlay Title */}
        <div className="absolute bottom-10 left-10 z-10">
          <h3 className="text-white text-3xl font-outfit font-bold drop-shadow-lg">
            {slides[currIdx].title}
          </h3>
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-6">
          <button onClick={() => move(-1)} className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-txt-primary transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => move(1)} className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white hover:text-txt-primary transition-all">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>

      {/* Modern Indicators */}
      <div className="flex justify-center gap-3 mt-8">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrIdx(idx)}
            className={`h-1.5 transition-all duration-300 rounded-full ${
              currIdx === idx ? 'w-12 bg-txt-accent' : 'w-4 bg-gray-300 hover:bg-gray-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;