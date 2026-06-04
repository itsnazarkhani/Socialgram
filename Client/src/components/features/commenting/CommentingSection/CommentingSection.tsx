import type { CommentData } from "../../../../interfaces/commentInterfaces";
import CommentForm from "../CommentForm/CommentForm";
import CommentList from "../CommentList/CommentList";
import styles from "./CommentingSection.module.css";

type CommentingSectionProps = {
  comments: CommentData[];
  isLoading: boolean;
  isPosting: boolean;
  handleNavigateToUser: (userId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  handleCommentFormSubmit: (commentText: string) => void;
  children?: React.ReactNode;
};

const CommentingSection = ({
  comments,
  isLoading,
  isPosting,
  handleNavigateToUser,
  handleDeleteComment,
  handleCommentFormSubmit,
  children,
}: CommentingSectionProps) => {
  return (
    <div className={styles.container}>
      <CommentList
        comments={comments}
        isCommentsLoading={isLoading}
        onNavigateToUser={handleNavigateToUser}
        onDeleteComment={handleDeleteComment}
      />
      {children}
      <CommentForm
        isPostingAComment={isPosting}
        onSubmitComment={handleCommentFormSubmit}
      />
    </div>
  );
};

export default CommentingSection;
