import styles from "./CommentList.module.css";
import React from "react";
import type { CommentData } from "../../../../interfaces/commentInterfaces";
import CommentItem from "../CommentListItem/CommentListItem";

type CommentListProps = {
  comments: CommentData[];
  isCommentsLoading: boolean;
  extraClassNames?: string;
  onNavigateToUser: (userId: string) => void;
  onDeleteComment: (commentId: string) => void;
};

const CommentList: React.FC<CommentListProps> = ({
  comments,
  isCommentsLoading,
  extraClassNames,
  onNavigateToUser,
  onDeleteComment,
}) => {
  return (
    <div className={`${styles.list} ${extraClassNames}`}>
      {isCommentsLoading ? (
        <p className={styles.messageInTheMiddle}>نظرات درحال بارگیری است...</p>
      ) : comments.length === 0 ? (
        <p className={styles.messageInTheMiddle}>هیچ نظری وجود ندارد.</p>
      ) : (
        comments.map((com) => (
          <CommentItem
            key={com.id}
            comment={com}
            onNavigateToUser={onNavigateToUser}
            onDeleteComment={onDeleteComment}
          />
        ))
      )}
    </div>
  );
};

export default CommentList;
