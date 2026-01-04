// Tạo file mới: ImageSlider.jsx
import React, { useState } from 'react';
import first from '../../assets/giai-ky-thuat-ahm06575.jpg';
import sec from '../../assets/lmao.jpg';
import third from '../../assets/lmao2.jpg';

const ImageSlider = () => {
  const slides = [
    { imgPath: first, title: 'Slide1' },
    { imgPath: sec, title: 'Slide2' },
    { imgPath: third, title: 'Slide3' }
  ];

  const [currIdx, setCurrIdx] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currIdx === 0;
    const newIdx = isFirstSlide ? slides.length - 1 : currIdx - 1;
    setCurrIdx(newIdx);
  };

  const goToNext = () => {
    const isLastSlide = currIdx === slides.length - 1;
    const newIdx = isLastSlide ? 0 : currIdx + 1;
    setCurrIdx(newIdx);
  };

  const goToSlide = (slideIdx) => {
    setCurrIdx(slideIdx);
  };

  return (
    <div className="w-full max-w-8xl mx-auto h-150">
      {/* Slider Container */}
      <div className="relative w-full h-full overflow-hidden rounded-lg">
        {/* Current Image */}
        <div 
          className="w-full h-full bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${slides[currIdx].imgPath})` }}
        />

        {/* Left Arrow */}
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 transition-all"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {slides.map((slide, slideIdx) => (
          <button
            key={slideIdx}
            onClick={() => goToSlide(slideIdx)}
            className={`w-3 h-3 rounded-full transition-all ${
              currIdx === slideIdx 
                ? 'bg-txt-primary w-8' 
                : 'bg-gray-400 hover:bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;