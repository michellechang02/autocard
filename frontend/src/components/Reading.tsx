import { useState, useRef } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Trash, Send, PlusCircle } from 'react-feather';
import './Reading.css';
import SubCards from './Subcards';
import axios from 'axios';

interface QuestionAnswer {
  question: string;
  answer: string;
}

async function generateQuestions(text: string): Promise<QuestionAnswer[]> {
  try {
    const response = await axios.post<{ question: string; answer: string }[]>('http://127.0.0.1:8000/generate-questions', {
      text: text,
      numQuestions: 5,
    });
    return response.data || [];
    
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}

const Reading: React.FC = () => {
  const [text, setText] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionAnswer[]>([]);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerateQuestions = async () => {
    setLoading(true);
    const visibleText = textAreaRef.current ? textAreaRef.current.value : '';
    const questions_answers = await generateQuestions(visibleText);
    console.log(questions_answers);
    setGeneratedQuestions(questions_answers);
    setLoading(false);
  };

  const handleSubmit = () => {
    if (textAreaRef.current) {
      setIsSubmitted(true);
      setText(textAreaRef.current.value);
    }
  };

  const deleteText = () => {
    setText('');
    setIsSubmitted(false);
    setGeneratedQuestions([]);
  };

  return (
    <div className="flex gap-4 p-4 min-h-screen h-screen">
      {/* Left Card for Large Text */}
      <Card className="flex-1 p-6 h-full flex flex-col overflow-hidden" radius="none">
        <div className="flex flex-col gap-2 mb-4">
          {!isSubmitted ? (
            <Button color="warning" variant="flat" onClick={handleSubmit} fullWidth>
              <Send className="mr-2" /> Submit
            </Button>
          ) : (
            <>
              <Button color="warning" variant="flat" onClick={deleteText} fullWidth>
                <Trash className="mr-2" /> Delete
              </Button>
              <Button color="success" variant="flat" onClick={handleGenerateQuestions} fullWidth disabled={loading}>
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-current animate-spin rounded-full"></div>
                    <span className="ml-2">Generating...</span>
                  </div>
                ) : (
                  <>
                    <PlusCircle className="mr-2" /> Generate Questions
                  </>
                )}
              </Button>
            </>
          )}
        </div>
        <CardBody className="flex-1 overflow-auto border border-gray-300 rounded-lg p-4">
          {isSubmitted ? (
            <div
              className="h-full w-full overflow-y-auto"
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            >
              {text}
            </div>
          ) : (
            <textarea
              ref={textAreaRef}
              placeholder="Enter text..."
              className="flex-1 h-full w-full p-4 border border-gray-300 rounded-lg resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          )}
        </CardBody>
      </Card>

      <SubCards generatedQuestions={generatedQuestions} />
    </div>
  );
};

export default Reading;
