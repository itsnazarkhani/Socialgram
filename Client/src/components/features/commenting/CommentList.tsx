import React from "react";
import type { Comment } from "../../../interfaces/commentInterfaces";
import "./CommentStyles.css";
import CommentItem from "./CommentItem";
interface CommentListProps {
  comments: Comment[];
  isCommentsLoading: boolean;
  extraClassNames?: string;
  onNavigateToUser: (userId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  isCommentsLoading,
  extraClassNames,
  onNavigateToUser,
  onDeleteComment,
}) => {
  if (comments.length === 0) {
    return (
      <p className={`no-comments ${extraClassNames}`}>هیچ نظری وجود ندارد.</p>
    );
  }

  if (isCommentsLoading) {
    return (
      <p className={`comments-loading ${extraClassNames}`}>
        نظرات درحال بارگیری است...
      </p>
    );
  }

  return (
    <div className={`comments-list ${extraClassNames}`}>
      {comments.map((com) => (
        <CommentItem
          key={com.id}
          comment={com}
          onNavigateToUser={onNavigateToUser}
          onDeleteComment={onDeleteComment}
        />
      ))}
    </div>
  );
};

export default CommentList;
