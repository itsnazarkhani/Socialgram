import Modal from "../../../ui/Modal/Modal";
import type { CommentData } from "../../../../interfaces/commentInterfaces";
import CommentingSection from "../CommentingSection/CommentingSection";

type CommentsModalProps = {
  comments: CommentData[];
  isLoading: boolean;
  isPosting: boolean;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setIsCommentsListOpen: (isOpen: boolean) => void;
  handleNavigateToUser: (userId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  handleCommentFormSubmit: (commentText: string) => void;
};

const CommentsModal = ({
  comments,
  isLoading,
  isPosting,
  isOpen,
  setIsOpen,
  setIsCommentsListOpen,
  handleNavigateToUser,
  handleDeleteComment,
  handleCommentFormSubmit,
}: CommentsModalProps) => {
  const commentsModalContent = (
    <CommentingSection
      comments={comments}
      handleCommentFormSubmit={handleCommentFormSubmit}
      handleDeleteComment={handleDeleteComment}
      handleNavigateToUser={handleNavigateToUser}
      isLoading={isLoading}
      isPosting={isPosting}
    />
  );

  return (
    <Modal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onClose={() => setIsCommentsListOpen(false)}
      title="نظرات"
    >
      {commentsModalContent}
    </Modal>
  );
};

export default CommentsModal;
