import React, {useState} from 'react';
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
    <div className="card-container" onClick={() => handleFlip(index)}>
      <div className={`card-inner ${flipped ? 'flipped' : ''}`}>
        {/* Front of the Sub Card */}
        <div className="card-front card-side">
          <div className="flex flex-row items-center p-4">
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
            <h2 className="text-center font-semibold ml-2">
              {question}
            </h2>
          </div>
        </div>

        {/* Back of the Sub Card */}
        <div className="card-back card-side">
          <h2 className="text-center font-semibold p-4">{answer}</h2>
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
    setFlipped((prev) =>
      prev.map((flippedState, i) => (i === index ? !flippedState : flippedState))
    );
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
