import CommentForm from "../../../../components/features/commenting/CommentForm";
import CommentList from "../../../../components/features/commenting/CommentList";
import Modal from "../../../../components/ui/Modal/Modal";
import type { Comment } from "../../../../interfaces/commentInterfaces";
import styles from "./CommentsModal.module.css";

type CommentsModalProps = {
  comments: Comment[];
  isLoading: boolean;
  isPosting: boolean;
  isOpen: boolean;
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
  setIsCommentsListOpen,
  handleNavigateToUser,
  handleDeleteComment,
  handleCommentFormSubmit,
}: CommentsModalProps) => {
  const commentsModalContent = (
    <div className={styles.listContainer}>
      <CommentList
        comments={comments}
        isCommentsLoading={isLoading}
        onNavigateToUser={handleNavigateToUser}
        onDeleteComment={handleDeleteComment}
      />
      <CommentForm
        isPostingAComment={isPosting}
        onSubmitComment={handleCommentFormSubmit}
        extraClassNames={styles.commentForm}
      />
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => setIsCommentsListOpen(false)}
      title="نظرات"
    >
      {isOpen && !comments.length && !isLoading && <p>خطا در بارگیری نظرات.</p>}
      {isOpen && comments.length === 0 && !isLoading && (
        <p>هیچ نظری وجود ندارد.</p>
      )}
      {isLoading ? <p>نظرات درحال بارگیری است...</p> : commentsModalContent}
    </Modal>
  );
};

export default CommentsModal;
