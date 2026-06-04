import React from "react";
import "./CommentStyles.css";
import BlobAvatar from "../../ui/Image/BlobAvatar";
import type { Comment } from "../../../interfaces/commentInterfaces";
import { FaTrash } from "react-icons/fa6";

interface CommentItemProps {
  comment: Comment;
  onNavigateToUser: (userId: string) => void;
  onDeleteComment: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onNavigateToUser,
  onDeleteComment,
}) => {
  return (
    <div className="comment-item" key={comment.id}>
      <header className="comment-user-info-container">
        <BlobAvatar
          blob={comment.avatarBlob}
          handleClick={() => onNavigateToUser(comment.userId)}
          isBigAvatar={false}
        />
        <p className="comment-item-username">{comment.userName}</p>
        {comment.isYours && (
          <button
            className="delete-comment-btn"
            onClick={() => onDeleteComment(comment.id)}
          >
            <FaTrash />
          </button>
        )}
      </header>

      <main className="comment-text-container">
        <p className="comment-text">{comment.text}</p>
      </main>
    </div>
  );
};

export default CommentItem;
