// components/SubCards.tsx

import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import { Plus } from 'react-feather';

interface SubCardProps {
  index: number;
  flipped: boolean;
  handleFlip: (index: number) => void;
}

const SubCard: React.FC<SubCardProps> = ({ index, flipped, handleFlip }) => {
  return (
    <div className="h-1/5 perspective-1000" style={{ perspective: '1000px' }}>
      <div
        className={`flip-card w-full h-full relative transition-transform duration-700 ${
          flipped ? 'rotate-y-180' : ''
        } hover:scale-105`}
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
        onClick={() => handleFlip(index)}
      >
        {/* Front of the Sub Card */}
        <div
          className="flip-card-front absolute w-full h-full bg-blue-500 dark:bg-blue-800 flex items-center justify-center border-2 border-blue-700 dark:border-blue-900 rounded-xl shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(0deg)',
          }}
        >
          <div className="flex flex-row items-center p-4">
            {/* Icon Button */}
            <Button
              onClick={(e) => e.stopPropagation()} // Prevent flipping when button is clicked
              variant="flat"
              isIconOnly
              color="warning"
              className="mr-4"
              aria-label={`Add Question ${index + 1}`}
            >
              <Plus className="text-yellow-500" />
            </Button>
            {/* Question Text */}
            <h2 className="text-center font-semibold ml-2">
              Question {index + 1}: What are some of the traits of these heuristic evaluations?
            </h2>
          </div>
        </div>

        {/* Back of the Sub Card */}
        <div
          className="flip-card-back absolute w-full h-full bg-blue-700 dark:bg-blue-900 flex items-center justify-center border-2 border-blue-800 dark:border-blue-1000 rounded-xl shadow-xl"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h2 className="text-center font-semibold">Back {index + 1}</h2>
        </div>
      </div>
    </div>
  );
};

const SubCards: React.FC = () => {
  // Initialize state to manage flipped cards
  const [flipped, setFlipped] = useState<boolean[]>(Array(5).fill(false));

  // Handler to flip a specific card
  const handleFlip = (index: number): void => {
    setFlipped((prev) =>
      prev.map((flippedState, i) => (i === index ? !flippedState : flippedState))
    );
  };

  return (
    <div className="flex-1 grid grid-cols-1 gap-6 h-full">
      {Array.from({ length: 5 }).map((_, index) => (
        <SubCard key={index} index={index} flipped={flipped[index]} handleFlip={handleFlip} />
      ))}
    </div>
  );
};

export default SubCards;
