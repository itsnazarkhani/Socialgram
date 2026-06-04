import React, { useState } from "react";
import styles from "./CommentForm.module.css";
import { IoSend } from "react-icons/io5";

type CommentFormProps = {
  isPostingAComment: boolean;
  onSubmitComment: (commentText: string, params?: any) => void;
  extraClassNames?: string;
};

const CommentForm: React.FC<CommentFormProps> = ({
  isPostingAComment,
  onSubmitComment,
  extraClassNames,
}) => {
  const [comment, setComment] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      onSubmitComment(comment);
      setComment("");
    }
  };

  const isSubmitDisabled = isPostingAComment || !comment.trim();

  return (
    <form
      className={`${styles.form} ${extraClassNames}`}
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className={styles.input}
        placeholder="نظر دهید."
        value={comment}
        onChange={handleInputChange}
        aria-label="نظر شما"
      />
      <button
        className={`${styles.sendBtn} ${comment ? styles.activeBtn : ""}`}
        type="submit"
        disabled={isSubmitDisabled}
      >
        {isPostingAComment ? "..." : <IoSend />}
      </button>
    </form>
  );
};

export default CommentForm;
