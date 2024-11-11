import React, { useState } from 'react';
import './Card.css'; // Ensure this file contains the necessary flip styles
import axios from 'axios'
import { Button } from '@nextui-org/react'

interface CardProps {
  question: string;
  answer: string;
}

const Card: React.FC<CardProps> = ({ question, answer }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="flip-card w-[95vw] h-[95vh] cursor-pointer" // Adjusted to 95% of viewport width and height
      style={{ marginTop: '5vw' }} // Set negative margin-top here
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`flip-card-inner w-full h-full transition-transform duration-700 ${
          flipped ? 'transform rotate-y-180' : ''
        }`}
      >
        <div className="flip-card-front w-full h-full bg-white text-black p-4 flex items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden">
          <p className="text-4xl font-semibold">{question}</p> {/* Increased text size */}
        </div>
        <div className="flip-card-back w-full h-full bg-blue-500 p-4 flex items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden transform rotate-y-180 absolute inset-0">
          <p className="text-4xl font-semibold">{answer}</p> {/* Increased text size */}
        </div>
      </div>
    </div>
  );
};

export default Card;
