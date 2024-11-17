import React, { useState } from 'react';
import './Card.css';
import { Button } from '@nextui-org/react'
import { Trash } from 'react-feather'


interface CardProps {
  question: string;
  answer: string;
  id: string;
  removeCard: (id: string) => void;
}

const Card: React.FC<CardProps> = ({ question, answer, id, removeCard }) => {
  const [flipped, setFlipped] = useState(false);

  

  return (
    <div
  className="flip-card w-[95vw] h-[95vh] cursor-pointer relative"
  style={{ marginTop: '5vw' }}
  onClick={() => setFlipped(!flipped)}
  key={id}
>
  <Button
    variant="flat"
    color="danger"
    isIconOnly
    style={{
      position: 'absolute',
      top: '1rem',
      right: '1rem',
      zIndex: 1,
    }}
    onClick={(e) => {
      e.stopPropagation(); // Prevents flipping the card when clicking the remove button
      removeCard(id); // Call the function to remove the card
    }}
  >
    <Trash />
  </Button>

  <div
    className={`flip-card-inner w-full h-full transition-transform duration-700 ${
      flipped ? 'rotate-y-180' : ''
    }`}
  >
    <div className="flip-card-front w-full h-full bg-white text-black p-4 flex items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden">
      <p className="text-4xl font-semibold">{question}</p>
    </div>
    <div className="flip-card-back w-full h-full bg-blue-500 p-4 flex items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden transform rotate-y-180 absolute inset-0">
      <p className="text-4xl font-semibold">{answer}</p>
    </div>
  </div>
</div>

  );
};

export default Card;
