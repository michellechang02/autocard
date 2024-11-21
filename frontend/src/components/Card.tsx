import React, { useState } from 'react';
import './Card.css';
import { Button } from '@nextui-org/react'
import { Trash, Edit } from 'react-feather'
import EditButton from './EditButton';


interface CardProps {
  question: string;
  answer: string;
  id: string;
  removeCard: (id: string) => void;
  editCard: (id: string, updatedData: { question: string; answer: string }) => void;
}

const Card: React.FC<CardProps> = ({ question, answer, id, removeCard, editCard }) => {
  const [flipped, setFlipped] = useState(false);

  

  return (
    <div
  className="flip-card w-[95vw] h-[95vh] cursor-pointer relative"
  style={{ marginTop: '5vw' }}
  onClick={() => setFlipped(!flipped)}
  key={id}
>
  <div
    className="absolute top-1 right-1 flex gap-2 z-10"
    style={{ position: 'absolute', zIndex: 1 }}
  >
    {/* New Button (e.g., Edit Button) */}
    <EditButton id={id} editCard={editCard} currentQuestion={question} currentAnswer={answer} />

    {/* Trash Button */}
    <Button
      variant="flat"
      color="danger"
      isIconOnly
      onClick={(e) => {
        e.stopPropagation(); // Prevents flipping the card
        removeCard(id); // Call the function to remove the card
      }}
    >
      <Trash />
    </Button>
  </div>

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
