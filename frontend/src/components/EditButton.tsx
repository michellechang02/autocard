import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  useDisclosure,
} from "@nextui-org/react";
import { Edit } from "react-feather";

interface EditCardButtonProps {
  id: string;
  currentQuestion: string;
  currentAnswer: string;
  editCard: (id: string, updatedData: { question: string; answer: string }) => void;
}

const EditCardButton: React.FC<EditCardButtonProps> = ({
  id,
  currentQuestion,
  currentAnswer,
  editCard,
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [updatedQuestion, setUpdatedQuestion] = useState(currentQuestion);
  const [updatedAnswer, setUpdatedAnswer] = useState(currentAnswer);

  const handleSave = async (onClose: () => void) => {
    await editCard(id, { question: updatedQuestion, answer: updatedAnswer });
    onClose(); // Close modal after saving
  };

  return (
    <>
      {/* Edit Button */}
      <Button
        variant="flat"
        color="warning"
        isIconOnly
        onPress={onOpen}
      >
        <Edit />
      </Button>

      {/* Edit Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit Card
              </ModalHeader>
              <ModalBody>
                {/* Question Input */}
                <Input
                  autoFocus
                  label="Question"
                  value={updatedQuestion}
                  onChange={(e) => setUpdatedQuestion(e.target.value)}
                  variant="bordered"
                />
                {/* Answer Input */}
                <Input
                  label="Answer"
                  value={updatedAnswer}
                  onChange={(e) => setUpdatedAnswer(e.target.value)}
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => handleSave(onClose)} // Pass a reference to handleSave
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditCardButton;
