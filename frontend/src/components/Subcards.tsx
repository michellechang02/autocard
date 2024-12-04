import React from 'react';
import { Button } from '@nextui-org/react';
import './Subcards.css'; // Import the CSS file
import axios from 'axios';
import { Plus } from 'react-feather';

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

const SubCard: React.FC<SubCardProps & { isSaved: boolean; handleSave: () => void }> = ({
  index,
  flipped,
  handleFlip,
  question,
  answer,
  isSaved,
  handleSave,
}) => {
  return (
    <div
      className={`flip-card cursor-pointer ${
        isSaved ? "opacity-50 pointer-events-none" : ""
      }`}
      style={{ height: "18vh", marginTop: "10px" }}
      onClick={() => handleFlip(index)}
    >
      <div
        className={`flip-card-inner transition-transform duration-700 ${
          flipped ? "transform rotate-y-180" : ""
        }`}
      >
        <div className="flip-card-front w-full h-full text-black p-4 flex flex-row items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden relative">
          {!isSaved && (
            <Button
              onClick={(e) => {
                e.stopPropagation(); // Prevents card flip on button click
                handleSave();
              }}
              isIconOnly
              color="warning"
              variant="flat"
              size="sm"
              className="mr-2"
            >
              <Plus />
            </Button>
          )}
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
  flipped: boolean[];
  saved: boolean[];
  setFlipped: React.Dispatch<React.SetStateAction<boolean[]>>;
  setSaved: React.Dispatch<React.SetStateAction<boolean[]>>;
}

const SubCards: React.FC<SubCardsProps> = ({ generatedQuestions, flipped, saved, setFlipped, setSaved }) => {

  const handleFlip = (index: number): void => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      // Update sessionStorage with the latest state
      sessionStorage.setItem("flipped", JSON.stringify(newFlipped));
      return newFlipped;
    });
  };
  
  const handleSave = async (index: number, question: string, answer: string) => {
    try {
      const id = Date.now().toString();
      await axios.post("http://127.0.0.1:8000/card", {
        id,
        question,
        answer,
      });
      setSaved((prev) => {
        const newSaved = [...prev];
        newSaved[index] = true;
        // Update sessionStorage with the latest state
        sessionStorage.setItem("saved", JSON.stringify(newSaved));
        return newSaved;
      });
      alert(`Flashcard saved: ${question}`);
    } catch (error) {
      console.error("Error in post request:", error);
      alert("Error in saving Flashcard. Please try again!");
    }
  };
  

  return (
    <div className="flex-1 grid grid-cols-1 gap-6 h-full">
      {generatedQuestions.map((questionData, index) => (
        <div key={index} className="h-1/5">
          <SubCard
            index={index}
            flipped={flipped[index]}
            handleFlip={handleFlip}
            question={questionData.question}
            answer={questionData.answer}
            isSaved={saved[index]}
            handleSave={() => handleSave(index, questionData.question, questionData.answer)}
          />
        </div>
      ))}
    </div>
  );
};

export default SubCards;