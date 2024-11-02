import React, { useState } from 'react';
import Card from './Card';
import { Button } from '@nextui-org/react'
import { ArrowLeftCircle, ArrowRightCircle } from 'react-feather';

const data = [
  { question: 'What is love?', answer: 'Twice!' },
  { question: 'Who is your favorite superhero?', answer: 'Spider-Man!' },
  { question: 'What is the meaning of life?', answer: '42' },
  // Add more question-answer pairs as needed
];

const AllCards: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? data.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Carousel Container */}
      <div className="overflow-hidden w-full flex justify-center mb-8">
        {/* Carousel */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
            width: `${data.length * 100}%`,
          }}
        >
          {data.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-full flex items-center justify-center"
              style={{ minWidth: '100vw' }} // Ensure each card takes full width
            >
              <Card question={item.question} answer={item.answer} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between"> 
        <Button
          variant="flat"
          color="warning"
          onClick={handlePrev}
          isIconOnly
        >
          <ArrowLeftCircle />
        </Button>
        <Button
         variant="flat"
         color="warning"
          onClick={handleNext}
          isIconOnly
        >
         <ArrowRightCircle />
        </Button>
      </div>
    </div>
  );
};

export default AllCards;
