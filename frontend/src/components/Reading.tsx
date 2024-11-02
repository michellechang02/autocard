import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button } from '@nextui-org/react';
import { Trash, Send, Plus } from 'react-feather'
import "./Reading.css"
import SubCards from './Subcards';

type Props = {};

const Reading = (props: Props) => {
  const [text, setText] = useState('');


  const deleteText = () => {
    setText('');
  }

  const [flipped, setFlipped] = useState(Array(5).fill(false));

  const handleFlip = (index: number) => {
    console.log(index)
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });
  };

  return (
    <div className="flex gap-4 p-4 min-h-screen h-screen">
      {/* Left Card for Large Text */}
      <Card className="flex-1 p-6 h-full flex flex-col" radius="none">
      <CardHeader className="flex flex-row justify-between items-center gap-4">
      <div className="flex gap-2">
          <Button color="warning" variant="flat" onClick={deleteText} isIconOnly>
            <Send />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button color="warning" variant="flat" onClick={deleteText} isIconOnly>
            <Trash />
          </Button>
        </div>
      </CardHeader>
        <CardBody>
        <textarea
          placeholder="Enter text..."
          className="flex-1 h-full w-full p-4 border border-gray-300 rounded-lg resize-none"
          value={text}
          onChange={e=>setText(e.target.value)}
        />
        </CardBody>
      </Card>

      {/* Right Card with 5 Flip Sub Cards */}
      {/* <div className="flex-1 grid grid-cols-1 gap-4 h-full">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="h-1/5 perspective-1000" style={{ perspective: '1000px' }}>
            <div
              className={`flip-card w-full h-full relative transition-transform duration-700 ${
                flipped[index] ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
              onClick={() => handleFlip(index)}
            >
              <div
                className="flip-card-front absolute w-full h-full bg-blue-200 flex items-center justify-center border-2 border-blue-500 rounded-md"
                style={{
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  transform: 'rotateY(0deg)',
                  width: '100%',
                  height: '100%',
                }}
              >
                <div className="flex flex-row items-center">
                  
                  <Button
                    onClick={(e) => e.stopPropagation()} // Prevent flipping when button is clicked
                    variant="flat"
                    isIconOnly
                    color="warning"
                  >
                    <Plus />
                  </Button>
                  <h2 className="text-center" style={{ marginLeft: '20px' }}>Question {index + 1}: What are some of the 
                  traits of these heuristic evaluations?</h2>
                </div>
              </div>

              <div
                className="flip-card-back absolute w-full h-full bg-blue-400 flex items-center justify-center border-2 border-blue-500 rounded-md"
                style={{
                  backfaceVisibility: 'hidden',
                  position: 'absolute',
                  transform: 'rotateY(180deg)',
                  width: '100%',
                  height: '100%',
                }}
              >
                <h2 className="text-center">Back {index + 1}</h2>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      <SubCards />
    </div>
  );
};

export default Reading;
