import { useState, useRef, useEffect } from 'react';
import { Card, CardBody, Button } from '@nextui-org/react';
import { Trash, Send, PenTool, Crop } from 'react-feather';
import Subcards from './Subcards.tsx';
import axios from 'axios';

interface QuestionAnswer {
  question: string;
  answer: string;
}

async function generateQuestions(text: string): Promise<QuestionAnswer[]> {
  try {
    const response = await axios.post<{ question: string; answer: string }[]>(
      'https://autocard-backend.vercel.app/generate-questions',
      {
        text: text,
        numQuestions: 5,
      },
      {
        headers: {
          'Content-Type': 'application/json', // Add the Content-Type header
        },
      }
    );
    return response.data || [];
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}

const Reading: React.FC = () => {
  const [text, setText] = useState(() => sessionStorage.getItem('inputText') || ''); // Initialize from sessionStorage
  const [isSubmitted, setIsSubmitted] = useState(() => Boolean(sessionStorage.getItem('inputText')));
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("Capturing...");
  const [loadingHighlight, setLoadingHighlight] = useState(false);
  const [loadingHighlightedText, setLoadingHighlightedText] = useState("Flashcarding...");
  const [generatedQuestions, setGeneratedQuestions] = useState<QuestionAnswer[]>(() => {
    const storedQuestions = sessionStorage.getItem("generatedQuestions");
    return storedQuestions ? JSON.parse(storedQuestions) : [];
  });
  const displayTextRef = useRef<HTMLDivElement | null>(null);
  const inputTextRef = useRef<HTMLTextAreaElement | null>(null);
  const [highlightedText, setHighlightedText] = useState<string>(() => {
    return sessionStorage.getItem("highlightedText") || "";
  });


  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoadingText("Flashcarding...");
      }, 2000);

      // Clear timeout if loading state changes
      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (loadingHighlight) {
      const timer = setTimeout(() => {
        setLoadingText("Flashcarding...");
      }, 2000);

      // Clear timeout if loading state changes
      return () => clearTimeout(timer);
    }
  }, [loadingHighlight]);

  const captureVisibleText = () => {
    if (displayTextRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = displayTextRef.current;

      // Get the starting and ending point of the visible text
      const visibleStart = Math.floor((scrollTop / scrollHeight) * text.length);
      const visibleEnd = Math.floor(((scrollTop + clientHeight) / scrollHeight) * text.length);

      // Capture the visible portion of the text
      return text.substring(visibleStart, visibleEnd);
    }
    return "";
  };

  const handleGenerateQuestions = async () => {
    setLoading(true);
    setLoadingText("Capturing...");
    let visible_text = captureVisibleText();
    const questions_answers = await generateQuestions(visible_text);
    setHighlightedText(visible_text);
    sessionStorage.setItem("highlightedText", visible_text);
    setGeneratedQuestions(questions_answers);
    sessionStorage.setItem("generatedQuestions", JSON.stringify(questions_answers));
    
    // reset the loading text & loading status
    setLoadingText("Capturing...");
    setLoading(false);
  };

  const handleSubmit = () => {
    if (inputTextRef.current) {
      setIsSubmitted(true);
      setText(inputTextRef.current.value);
      sessionStorage.setItem('inputText', inputTextRef.current.value);
    }
  };

  const deleteText = () => {
    setText('');
    setIsSubmitted(false);
    setGeneratedQuestions([]);
    sessionStorage.removeItem('generatedQuestions');
    sessionStorage.removeItem('inputText');
    sessionStorage.removeItem('highlightedText');
  };


  function highlightText(text: string, highlightedText: string): JSX.Element[] {
    if (!highlightedText || !text.includes(highlightedText)) {
      // If no highlightedText or it doesn't exist in text, return the entire text as-is
      return [<span key="full-text">{text}</span>];
    }
  
    const segments: JSX.Element[] = [];
    let currentIndex = 0;
  
    // Find all occurrences of highlightedText and create segments
    while (currentIndex < text.length) {
      const startIndex = text.indexOf(highlightedText, currentIndex);
  
      if (startIndex === -1) {
        // No more occurrences, push the remaining text
        segments.push(<span key={`text-${currentIndex}`}>{text.slice(currentIndex)}</span>);
        break;
      }
  
      // Push text before the highlighted text
      if (startIndex > currentIndex) {
        segments.push(
          <span key={`text-${currentIndex}`}>{text.slice(currentIndex, startIndex)}</span>
        );
      }
  
      // Push the highlighted text
      segments.push(
        <span
          key={`highlight-${startIndex}`}
          style={{ backgroundColor: "#FDEDD3" }}
        >
          {text.slice(startIndex, startIndex + highlightedText.length)}
        </span>
      );
  
      // Update currentIndex to continue searching after the highlighted text
      currentIndex = startIndex + highlightedText.length;
    }
  
    return segments;
  }


  const captureUserHighlightedText = (): string | null => {
    // Get the current selection
    const selection = window.getSelection();
  
    if (!selection || selection.toString().trim() === "") {
      alert("No text is highlighted by the user.");
      return null;
    }
  
    // Return the highlighted text
    return selection.toString().trim();
  };

  const handleUserHighlightedText = async (): Promise<void> => {
    setLoadingHighlight(true);
    setLoadingHighlightedText("Flashcarding...");
    let user_highlighted_text = captureUserHighlightedText();
    if (!user_highlighted_text) {
      setLoadingHighlightedText("No text is highlighted by the user.");
      setLoadingHighlight(false);
      return;
    }
    const questions_answers = await generateQuestions(user_highlighted_text);
    setHighlightedText(user_highlighted_text);
    sessionStorage.setItem('highlightedText', user_highlighted_text);
    setGeneratedQuestions(questions_answers);
    sessionStorage.setItem('generatedQuestions', JSON.stringify(questions_answers));
      
    // reset the loading text & loading status
    setLoadingHighlightedText("Capturing...");
    setLoadingHighlight(false);
  };
  


  return (
    <div className="flex gap-4 p-4 min-h-screen h-screen">
      {/* Left Card for Large Text */}
      <Card className="flex-1 p-6 h-full flex flex-col overflow-hidden" radius="none">
      
      <div className={`flex ${!isSubmitted ? "flex-col" : "flex-row"} gap-4 mb-6`}>
  {!isSubmitted ? (
    <Button
      color="warning"
      variant="flat"
      onClick={handleSubmit}
      className="w-full flex items-center justify-center px-2 py-1 text-sm font-medium rounded-md shadow-sm hover:bg-orange-400 hover:text-white transition"
    >
      <Send className="mr-1 text-lg" />
      Submit
    </Button>
  ) : (
    <>
      <Button
        color="warning"
        variant="flat"
        onClick={deleteText}
        className="flex-grow flex items-center justify-center px-2 py-1 text-sm font-medium rounded-md shadow-sm hover:bg-red-500 hover:text-white transition"
      >
        <Trash className="mr-1 text-lg" />
        Delete
      </Button>
      <Button
        color="warning"
        variant="flat"
        onClick={handleGenerateQuestions}
        disabled={loading}
        className={`flex-grow flex items-center justify-center px-2 py-1 text-sm font-medium rounded-md shadow-sm ${
          loading
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "hover:bg-green-500 hover:text-white transition"
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-current animate-spin rounded-full"></div>
            <span className="ml-1 text-xs">{loadingText}</span>
          </div>
        ) : (
          <>
            <Crop className="mr-1 text-lg" />
            Capture Screen
          </>
        )}
      </Button>
      <Button
        color="warning"
        variant="flat"
        onClick={handleUserHighlightedText}
        disabled={loadingHighlight}
        className={`flex-grow flex items-center justify-center px-2 py-1 text-sm font-medium rounded-md shadow-sm ${
          loadingHighlight
            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
            : "hover:bg-blue-500 hover:text-white transition"
        }`}
      >
        {loadingHighlight ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-t-2 border-t-transparent border-current animate-spin rounded-full"></div>
            <span className="ml-1 text-xs">{loadingHighlightedText}</span>
          </div>
        ) : (
          <>
            <PenTool className="mr-1 text-lg" />
            Highlight Text
          </>
        )}
      </Button>
    </>
  )}
</div>


        <CardBody className="flex-1 overflow-auto border border-gray-300 rounded-lg p-4">
        {isSubmitted ? (
        <div
          ref={displayTextRef}
          className="h-full w-full overflow-y-auto"
          style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
        >
          {highlightText(text, highlightedText)}
        </div>
      ) : (
        <textarea
          ref={inputTextRef}
          placeholder="Enter text..."
          className="flex-1 h-full w-full p-4 border border-gray-300 rounded-lg resize-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      
        </CardBody>
      </Card>

      <Subcards generatedQuestions={generatedQuestions} />
    </div>
  );
};

export default Reading;
