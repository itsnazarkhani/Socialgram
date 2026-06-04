import React from "react";
import styles from "./CommentListItem.module.css";
import BlobAvatar from "../../../ui/Image/BlobAvatar";
import type { CommentData } from "../../../../interfaces/commentInterfaces";
import { FaTrash } from "react-icons/fa6";

type CommentItemProps = {
  comment: CommentData;
  onNavigateToUser: (userId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onNavigateToUser,
  onDeleteComment,
}) => {
  return (
    <div className={styles.item} key={comment.id}>
      <header className={styles.header}>
        <div className={styles.userInfo}>
          <BlobAvatar
            blob={comment.avatarBlob}
            handleClick={() => onNavigateToUser(comment.userId)}
            isBigAvatar={false}
          />

          <p
            className={styles.username}
            onClick={() => onNavigateToUser(comment.userId)}
          >
            {comment.userName}
          </p>
        </div>

        {comment.isYours && (
          <button
            className={styles.deleteBtn}
            onClick={() => onDeleteComment(comment.id)}
          >
            <FaTrash />
          </button>
        )}
      </header>

      <main className={styles.textContainer}>
        <p className={styles.text}>{comment.text}</p>
      </main>
    </div>
  );
};

export default CommentItem;
