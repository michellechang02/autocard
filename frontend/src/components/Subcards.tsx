import React, { useState } from 'react';
import { Button } from '@nextui-org/react';
import './Subcards.css'; // Import the CSS file
import axios from 'axios';
import { Plus } from 'react-feather';
import Toast from './Toast';

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
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const handlePostRequest = async () => {
    try {
      const id = Date.now().toString();
      const response = await axios.post('http://127.0.0.1:8000/card', {
        id,
        question,
        answer,
      });
      console.log('Post request successful', response.data);

      alert('Flashcard saved: ' + question);

      // Show success toast
      setToastMessage('Post request successful!');
      setToastType('success');
      setShowToast(true);
    } catch (error) {
      console.error('Error in post request:', error);

      // Show error toast
      setToastMessage('Failed to make post request.');
      setToastType('error');
      setShowToast(true);
    }
  };

  return (
    <div
      className="flip-card cursor-pointer"
      style={{ height: '18vh', marginTop: '10px' }}
      onClick={() => handleFlip(index)}
    >
      <div
        className={`flip-card-inner transition-transform duration-700 ${
          flipped ? 'transform rotate-y-180' : ''
        }`}
      >
        <div className="flip-card-front w-full h-full text-black p-4 flex flex-row items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden relative">
          <Button
            onClick={(e) => {
              e.stopPropagation(); // Prevents card flip on button click
              handlePostRequest();
            }}
            isIconOnly
            color="warning"
            variant="flat"
            size="sm"
            className="mr-2"
          >
            <Plus />
          </Button>
          <p className="text-xl font-semibold">{question}</p>
        </div>
        <div className="flip-card-back p-4 flex items-center justify-center text-center rounded-lg shadow-md border-4 border-gray-300 backface-hidden transform rotate-y-180 absolute inset-0">
          <p className="text-xl font-semibold">{answer}</p>
        </div>
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

interface SubCardsProps {
  generatedQuestions: QuestionAnswer[];
}

const SubCards: React.FC<SubCardsProps> = ({ generatedQuestions }) => {
  const [flipped, setFlipped] = useState<boolean[]>(Array(generatedQuestions.length).fill(false));

  const handleFlip = (index: number): void => {
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
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
          />
        </div>
      ))}
    </div>
  );
};

export default SubCards;
