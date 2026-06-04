import React, { useState } from 'react';
import './CommentStyles.css'; 

interface CommentFormProps {
    isPostingAComment: boolean;
    onSubmitComment: (commentText: string, params?: any) => void;
    extraClassNames?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({ isPostingAComment, onSubmitComment, extraClassNames }) => {
    const [comment, setComment] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (comment.trim()) {
            onSubmitComment(comment);
            setComment('');
        }
    };

    const isSubmitDisabled = isPostingAComment || !comment.trim();

    return (
        <form className={`comment-form ${extraClassNames}`} onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="نظر دهید."
                value={comment}
                onChange={handleInputChange}
                aria-label="نظر شما"
            />
            <button
                type="submit"
                disabled={isSubmitDisabled}>
                {isPostingAComment ? "..." : "ارسال"}
            </button>
        </form>
    );
};

export default CommentForm;
