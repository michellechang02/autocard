import React, { useState, useEffect } from 'react';
import { Button } from '@nextui-org/react';
import { Plus } from 'react-feather';
import './Subcards.css'; // Import the CSS file

interface QuestionAnswer {
  question: string;
  answer: string;
}

interface SubCardProps {
  index: number;
  flipped: boolean;
  handleFlip: (index: number) => void;
  question: string;
  answer: string;
}

const SubCard: React.FC<SubCardProps> = ({ index, flipped, handleFlip, question, answer }) => {

  
  return (
    <div
      className="flip-card cursor-pointer" // Adjusted to 95% of viewport width and height
      style={{ height: '18vh', marginTop: '10px' }} // Set negative margin-top here
      onClick={() => handleFlip(index)}
    >
      <div
        className={`flip-card-inner transition-transform duration-700 ${
          flipped ? 'transform rotate-y-180' : ''
        }`}
      >
        <div className="flip-card-front w-full h-full text-black p-4 flex items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden">
          <p className="text-xl font-semibold">{question}</p>
        </div>
        <div className="flip-card-back p-4 flex items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden transform rotate-y-180 absolute inset-0">
          <p className="text-xl font-semibold">{answer}</p>
        </div>
      </div>
    </div>
  );
};

interface SubCardsProps {
  generatedQuestions: QuestionAnswer[];
}

const SubCards: React.FC<SubCardsProps> = ({ generatedQuestions }) => {
  const [flipped, setFlipped] = useState<boolean[]>(Array(generatedQuestions.length).fill(false));

  const handleFlip = (index: number): void => {
    console.log("FLIP:", index);
    setFlipped((prev) => {
      // Create a copy of the previous state to avoid mutating state directly
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index]; // Toggle the flipped state for the given index
      return newFlipped;
    });
  };


  return (
    <div className="flex-1 grid grid-cols-1 gap-6 h-full">
      {generatedQuestions.map((questionData, index) => (
        <div key={index} className="h-1/5"> {/* Dividing the height evenly for 5 cards */}
          <SubCard
            index={index}
            flipped={flipped[index]}
            handleFlip={handleFlip}
            question={questionData.question}
            answer={questionData.answer}
          />
        </div>
      ))}
    </div>
  );
};

export default SubCards;
